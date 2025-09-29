<?php
/**
 * Lawyer Association Helper Functions
 * Functions to manage lawyer relationships with hearings, clients, and cases
 */

/**
 * Add lawyers to a hearing
 */
function addHearingLawyers($db, $hearingId, $lawyerIds) {
    if (empty($lawyerIds) || !is_array($lawyerIds)) {
        return true; // No lawyers to add
    }

    try {
        foreach ($lawyerIds as $lawyerId) {
            if (is_numeric($lawyerId)) {
                $db->execute(
                    "INSERT IGNORE INTO hearing_lawyers (hearing_id, lawyer_id) VALUES (?, ?)",
                    [$hearingId, (int)$lawyerId]
                );
            }
        }
        return true;
    } catch (Exception $e) {
        error_log("Error adding hearing lawyers: " . $e->getMessage());
        return false;
    }
}

/**
 * Remove all lawyers from a hearing
 */
function removeHearingLawyers($db, $hearingId) {
    try {
        $db->execute("DELETE FROM hearing_lawyers WHERE hearing_id = ?", [$hearingId]);
        return true;
    } catch (Exception $e) {
        error_log("Error removing hearing lawyers: " . $e->getMessage());
        return false;
    }
}

/**
 * Get lawyers for a hearing
 */
function getHearingLawyers($db, $hearingId) {
    try {
        return $db->fetchAll(
            "SELECT l.* FROM lawyers l
             JOIN hearing_lawyers hl ON l.id = hl.lawyer_id
             WHERE hl.hearing_id = ? AND l.is_active = 1
             ORDER BY l.lawyer_name_ar",
            [$hearingId]
        );
    } catch (Exception $e) {
        error_log("Error getting hearing lawyers: " . $e->getMessage());
        return [];
    }
}

/**
 * Add lawyers to a client
 */
function addClientLawyers($db, $clientId, $lawyerIds, $primaryLawyerId = null) {
    if (empty($lawyerIds) || !is_array($lawyerIds)) {
        return true; // No lawyers to add
    }

    try {
        foreach ($lawyerIds as $lawyerId) {
            if (is_numeric($lawyerId)) {
                $isPrimary = ($primaryLawyerId && $lawyerId == $primaryLawyerId) ? 1 : 0;
                $db->execute(
                    "INSERT IGNORE INTO client_lawyers (client_id, lawyer_id, is_primary) VALUES (?, ?, ?)",
                    [$clientId, (int)$lawyerId, $isPrimary]
                );
            }
        }
        return true;
    } catch (Exception $e) {
        error_log("Error adding client lawyers: " . $e->getMessage());
        return false;
    }
}

/**
 * Remove all lawyers from a client
 */
function removeClientLawyers($db, $clientId) {
    try {
        $db->execute("DELETE FROM client_lawyers WHERE client_id = ?", [$clientId]);
        return true;
    } catch (Exception $e) {
        error_log("Error removing client lawyers: " . $e->getMessage());
        return false;
    }
}

/**
 * Get lawyers for a client
 */
function getClientLawyers($db, $clientId) {
    try {
        return $db->fetchAll(
            "SELECT l.*, cl.is_primary FROM lawyers l
             JOIN client_lawyers cl ON l.id = cl.lawyer_id
             WHERE cl.client_id = ? AND l.is_active = 1
             ORDER BY cl.is_primary DESC, l.lawyer_name_ar",
            [$clientId]
        );
    } catch (Exception $e) {
        error_log("Error getting client lawyers: " . $e->getMessage());
        return [];
    }
}

/**
 * Add lawyers to a case
 */
function addCaseLawyers($db, $caseId, $lawyerData) {
    if (empty($lawyerData) || !is_array($lawyerData)) {
        return true; // No lawyers to add
    }

    try {
        foreach ($lawyerData as $lawyer) {
            $lawyerId = is_array($lawyer) ? $lawyer['id'] : $lawyer;
            $role = is_array($lawyer) ? ($lawyer['role'] ?? 'primary') : 'primary';

            if (is_numeric($lawyerId)) {
                $db->execute(
                    "INSERT IGNORE INTO case_lawyers (case_id, lawyer_id, role) VALUES (?, ?, ?)",
                    [$caseId, (int)$lawyerId, $role]
                );
            }
        }
        return true;
    } catch (Exception $e) {
        error_log("Error adding case lawyers: " . $e->getMessage());
        return false;
    }
}

/**
 * Remove all lawyers from a case
 */
function removeCaseLawyers($db, $caseId) {
    try {
        $db->execute("DELETE FROM case_lawyers WHERE case_id = ?", [$caseId]);
        return true;
    } catch (Exception $e) {
        error_log("Error removing case lawyers: " . $e->getMessage());
        return false;
    }
}

/**
 * Get lawyers for a case
 */
function getCaseLawyers($db, $caseId) {
    try {
        return $db->fetchAll(
            "SELECT l.*, cl.role FROM lawyers l
             JOIN case_lawyers cl ON l.id = cl.lawyer_id
             WHERE cl.case_id = ? AND l.is_active = 1
             ORDER BY
                FIELD(cl.role, 'primary', 'secondary', 'consultant'),
                l.lawyer_name_ar",
            [$caseId]
        );
    } catch (Exception $e) {
        error_log("Error getting case lawyers: " . $e->getMessage());
        return [];
    }
}

/**
 * Format lawyers for API response
 */
function formatLawyersForResponse($lawyers, $currentLanguage = 'ar') {
    if (empty($lawyers)) {
        return [];
    }

    return array_map(function($lawyer) use ($currentLanguage) {
        return [
            'id' => (int)$lawyer['id'],
            'name_ar' => $lawyer['lawyer_name_ar'],
            'name_en' => $lawyer['lawyer_name_en'],
            'email' => $lawyer['lawyer_email'],
            'display_name' => $currentLanguage === 'ar'
                ? $lawyer['lawyer_name_ar']
                : ($lawyer['lawyer_name_en'] ?: $lawyer['lawyer_name_ar']),
            'is_primary' => isset($lawyer['is_primary']) ? (bool)$lawyer['is_primary'] : false,
            'role' => $lawyer['role'] ?? null
        ];
    }, $lawyers);
}

/**
 * Enhanced function to get hearings with lawyer data
 */
function getHearingsWithLawyers($db, $whereClause, $params, $page = 1, $limit = 10) {
    $sql = "SELECT h.*, c.matter_ar, c.matter_en, c.matter_id,
                   cl.client_name_ar, cl.client_name_en
            FROM hearings h
            LEFT JOIN cases c ON h.case_id = c.id
            LEFT JOIN clients cl ON c.client_id = cl.id
            WHERE {$whereClause}
            ORDER BY h.hearing_date DESC";

    $result = $db->paginate($sql, $params, $page, $limit);

    // Add lawyer data to each hearing
    if (!empty($result['data'])) {
        foreach ($result['data'] as &$hearing) {
            $hearing['lawyers'] = formatLawyersForResponse(
                getHearingLawyers($db, $hearing['id'])
            );
        }
    }

    return $result;
}

/**
 * Enhanced function to get clients with lawyer data
 */
function getClientsWithLawyers($db, $whereClause, $params, $page = 1, $limit = 10) {
    $sql = "SELECT * FROM clients WHERE {$whereClause} ORDER BY client_name_ar";

    $result = $db->paginate($sql, $params, $page, $limit);

    // Add lawyer data to each client
    if (!empty($result['data'])) {
        foreach ($result['data'] as &$client) {
            $client['lawyers'] = formatLawyersForResponse(
                getClientLawyers($db, $client['id'])
            );
        }
    }

    return $result;
}

/**
 * Enhanced function to get cases with lawyer data
 */
function getCasesWithLawyers($db, $whereClause, $params, $page = 1, $limit = 10) {
    $sql = "SELECT c.*, cl.client_name_ar, cl.client_name_en
            FROM cases c
            LEFT JOIN clients cl ON c.client_id = cl.id
            WHERE {$whereClause}
            ORDER BY c.created_at DESC";

    $result = $db->paginate($sql, $params, $page, $limit);

    // Add lawyer data to each case
    if (!empty($result['data'])) {
        foreach ($result['data'] as &$case) {
            $case['lawyers'] = formatLawyersForResponse(
                getCaseLawyers($db, $case['id'])
            );
        }
    }

    return $result;
}

/**
 * Get single hearing with lawyers
 */
function getSingleHearingWithLawyers($db, $hearingId) {
    $hearing = $db->fetch(
        "SELECT h.*, c.matter_ar, c.matter_en, c.matter_id,
                cl.client_name_ar, cl.client_name_en
         FROM hearings h
         LEFT JOIN cases c ON h.case_id = c.id
         LEFT JOIN clients cl ON c.client_id = cl.id
         WHERE h.id = ?",
        [$hearingId]
    );

    if ($hearing) {
        $hearing['lawyers'] = formatLawyersForResponse(
            getHearingLawyers($db, $hearingId)
        );
    }

    return $hearing;
}

/**
 * Get single client with lawyers
 */
function getSingleClientWithLawyers($db, $clientId) {
    $client = $db->fetch("SELECT * FROM clients WHERE id = ?", [$clientId]);

    if ($client) {
        $client['lawyers'] = formatLawyersForResponse(
            getClientLawyers($db, $clientId)
        );
    }

    return $client;
}

/**
 * Get single case with lawyers
 */
function getSingleCaseWithLawyers($db, $caseId) {
    $case = $db->fetch(
        "SELECT c.*, cl.client_name_ar, cl.client_name_en
         FROM cases c
         LEFT JOIN clients cl ON c.client_id = cl.id
         WHERE c.id = ?",
        [$caseId]
    );

    if ($case) {
        $case['lawyers'] = formatLawyersForResponse(
            getCaseLawyers($db, $caseId)
        );
    }

    return $case;
}
?>