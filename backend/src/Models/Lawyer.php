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
        $db = Database::getInstance();

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
        $countSql = "SELECT COUNT(*) as count FROM " . self::$table . " WHERE " . $whereClause;
        $total = $db->fetch($countSql, $params)['count'];

        // Get data
        $sql = "SELECT * FROM " . self::$table . " WHERE " . $whereClause . " ORDER BY lawyer_name_ar ASC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $lawyers = $db->fetchAll($sql, $params);

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
        $db = Database::getInstance();

        $sql = "SELECT * FROM " . self::$table . " WHERE id = ?";
        $lawyer = $db->fetch($sql, [$id]);

        if ($lawyer) {
            return self::formatLawyer($lawyer);
        }

        return null;
    }

    /**
     * Create new lawyer
     */
    public static function create($data) {
        $db = Database::getInstance();

        $sql = "INSERT INTO " . self::$table . " (lawyer_name_ar, lawyer_name_en, lawyer_email, is_active) VALUES (?, ?, ?, ?)";

        $db->query($sql, [
            $data['lawyer_name_ar'],
            $data['lawyer_name_en'] ?? '',
            $data['lawyer_email'] ?? '',
            $data['is_active'] ?? 1
        ]);

        return $db->lastInsertId();
    }

    /**
     * Update lawyer
     */
    public static function update($id, $data) {
        $db = Database::getInstance();

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

        $db->query($sql, $params);
        return true;
    }

    /**
     * Delete lawyer (soft delete)
     */
    public static function delete($id) {
        $db = Database::getInstance();

        $sql = "UPDATE " . self::$table . " SET is_active = 0, updated_at = NOW() WHERE id = ?";
        $db->query($sql, [$id]);
        return true;
    }

    /**
     * Get active lawyers for dropdowns
     */
    public static function getActiveLawyers() {
        $db = Database::getInstance();

        $sql = "SELECT id, lawyer_name_ar, lawyer_name_en FROM " . self::$table . " WHERE is_active = 1 ORDER BY lawyer_name_ar ASC";
        return $db->fetchAll($sql);
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
        $db = Database::getInstance();

        $stats = [];

        // Total lawyers
        $stats['total'] = $db->fetch("SELECT COUNT(*) as count FROM " . self::$table . " WHERE is_active = 1")['count'];

        // Active lawyers
        $stats['active'] = $db->fetch("SELECT COUNT(*) as count FROM " . self::$table . " WHERE is_active = 1")['count'];

        // Inactive lawyers
        $stats['inactive'] = $db->fetch("SELECT COUNT(*) as count FROM " . self::$table . " WHERE is_active = 0")['count'];

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