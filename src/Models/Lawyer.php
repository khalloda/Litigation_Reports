<?php
/**
 * Lawyer Model
 *
 * Handles lawyer data operations.
 */

class Lawyer {
    private static $table = 'lawyers';

    /**
     * Get all lawyers with pagination and filtering
     */
    public static function getAll($page = 1, $limit = 20, $filters = []) {
        global $pdo;

        $offset = ($page - 1) * $limit;
        $where = ['is_active = 1'];
        $params = [];

        // Apply filters
        if (!empty($filters['search'])) {
            $where[] = "(lawyer_name_ar LIKE ? OR lawyer_name_en LIKE ? OR lawyer_email LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        if (isset($filters['is_active']) && $filters['is_active'] !== '') {
            $where[0] = 'is_active = ?';
            array_unshift($params, $filters['is_active']);
        }

        $whereClause = implode(' AND ', $where);

        // Get total count
        $countSql = "SELECT COUNT(*) FROM " . self::$table . " WHERE " . $whereClause;
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($params);
        $total = $countStmt->fetchColumn();

        // Get data
        $sql = "SELECT * FROM " . self::$table . " WHERE " . $whereClause . " ORDER BY lawyer_name_ar ASC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $lawyers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format data
        foreach ($lawyers as &$lawyer) {
            $lawyer = self::formatLawyer($lawyer);
        }

        // Calculate pagination
        $totalPages = ceil($total / $limit);

        return [
            'data' => $lawyers,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => $totalPages,
                'has_next' => $page < $totalPages,
                'has_prev' => $page > 1
            ]
        ];
    }

    /**
     * Find lawyer by ID
     */
    public static function findById($id) {
        global $pdo;

        $sql = "SELECT * FROM " . self::$table . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $lawyer = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($lawyer) {
            return self::formatLawyer($lawyer);
        }

        return null;
    }

    /**
     * Create new lawyer
     */
    public static function create($data) {
        global $pdo;

        $sql = "INSERT INTO " . self::$table . " (lawyer_name_ar, lawyer_name_en, lawyer_email, is_active) VALUES (?, ?, ?, ?)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['lawyer_name_ar'],
            $data['lawyer_name_en'] ?? '',
            $data['lawyer_email'] ?? '',
            $data['is_active'] ?? 1
        ]);

        return $pdo->lastInsertId();
    }

    /**
     * Update lawyer
     */
    public static function update($id, $data) {
        global $pdo;

        $fields = [];
        $params = [];

        if (isset($data['lawyer_name_ar'])) {
            $fields[] = 'lawyer_name_ar = ?';
            $params[] = $data['lawyer_name_ar'];
        }

        if (isset($data['lawyer_name_en'])) {
            $fields[] = 'lawyer_name_en = ?';
            $params[] = $data['lawyer_name_en'];
        }

        if (isset($data['lawyer_email'])) {
            $fields[] = 'lawyer_email = ?';
            $params[] = $data['lawyer_email'];
        }

        if (isset($data['is_active'])) {
            $fields[] = 'is_active = ?';
            $params[] = $data['is_active'];
        }

        $fields[] = 'updated_at = NOW()';
        $params[] = $id;

        $sql = "UPDATE " . self::$table . " SET " . implode(', ', $fields) . " WHERE id = ?";

        $stmt = $pdo->prepare($sql);
        return $stmt->execute($params);
    }

    /**
     * Delete lawyer (soft delete)
     */
    public static function delete($id) {
        global $pdo;

        $sql = "UPDATE " . self::$table . " SET is_active = 0, updated_at = NOW() WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([$id]);
    }

    /**
     * Get active lawyers for dropdowns
     */
    public static function getActiveLawyers() {
        global $pdo;

        $sql = "SELECT id, lawyer_name_ar, lawyer_name_en FROM " . self::$table . " WHERE is_active = 1 ORDER BY lawyer_name_ar ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Search lawyers
     */
    public static function search($searchTerm, $page = 1, $limit = 20) {
        return self::getAll($page, $limit, ['search' => $searchTerm]);
    }

    /**
     * Get lawyer statistics
     */
    public static function getStats() {
        global $pdo;

        $stats = [];

        // Total lawyers
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM " . self::$table . " WHERE is_active = 1");
        $stmt->execute();
        $stats['total'] = $stmt->fetchColumn();

        // Active lawyers
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM " . self::$table . " WHERE is_active = 1");
        $stmt->execute();
        $stats['active'] = $stmt->fetchColumn();

        // Inactive lawyers
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM " . self::$table . " WHERE is_active = 0");
        $stmt->execute();
        $stats['inactive'] = $stmt->fetchColumn();

        return $stats;
    }

    /**
     * Format lawyer data
     */
    private static function formatLawyer($lawyer) {
        return [
            'id' => (int) $lawyer['id'],
            'lawyer_name_ar' => $lawyer['lawyer_name_ar'] ?? '',
            'lawyer_name_en' => $lawyer['lawyer_name_en'] ?? '',
            'lawyer_email' => $lawyer['lawyer_email'] ?? '',
            'is_active' => (bool) $lawyer['is_active'],
            'created_at' => $lawyer['created_at'],
            'updated_at' => $lawyer['updated_at']
        ];
    }
}