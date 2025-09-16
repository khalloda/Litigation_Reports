<?php
/**
 * Hearing Model
 * 
 * Handles hearing data operations for litigation management.
 */

class Hearing {
    private static $table = 'hearings';
    
    public static function findById($id) {
        $db = Database::getInstance();
        $hearing = $db->fetch("SELECT * FROM " . self::$table . " WHERE id = :id", ['id' => $id]);
        
        if ($hearing) {
            // Get related case information
            $case = $db->fetch("SELECT c.*, cl.client_name_ar, cl.client_name_en 
                               FROM cases c 
                               LEFT JOIN clients cl ON c.client_id = cl.id 
                               WHERE c.id = :case_id", ['case_id' => $hearing['case_id']]);
            $hearing['case'] = $case;
        }
        
        return $hearing;
    }
    
    public static function getAll($page = 1, $limit = DEFAULT_PAGE_SIZE, $filters = []) {
        $db = Database::getInstance();
        
        $whereClause = '1=1';
        $params = [];
        
        // Apply filters
        if (!empty($filters['case_id'])) {
            $whereClause .= ' AND h.case_id = :case_id';
            $params['case_id'] = $filters['case_id'];
        }
        
        if (!empty($filters['hearing_result'])) {
            $whereClause .= ' AND h.hearing_result = :hearing_result';
            $params['hearing_result'] = $filters['hearing_result'];
        }
        
        if (!empty($filters['hearing_type'])) {
            $whereClause .= ' AND h.hearing_type = :hearing_type';
            $params['hearing_type'] = $filters['hearing_type'];
        }
        
        if (!empty($filters['date_from'])) {
            $whereClause .= ' AND h.hearing_date >= :date_from';
            $params['date_from'] = $filters['date_from'];
        }
        
        if (!empty($filters['date_to'])) {
            $whereClause .= ' AND h.hearing_date <= :date_to';
            $params['date_to'] = $filters['date_to'];
        }
        
        if (!empty($filters['search'])) {
            $whereClause .= ' AND (h.hearing_decision LIKE :search OR h.court_notes LIKE :search OR h.lawyer_notes LIKE :search)';
            $params['search'] = '%' . $filters['search'] . '%';
        }
        
        $sql = "SELECT h.*, c.matter_ar, c.matter_en, c.matter_id, cl.client_name_ar, cl.client_name_en 
                FROM " . self::$table . " h 
                LEFT JOIN cases c ON h.case_id = c.id 
                LEFT JOIN clients cl ON c.client_id = cl.id 
                WHERE {$whereClause} 
                ORDER BY h.hearing_date DESC";
        
        return $db->paginate($sql, $params, $page, $limit);
    }
    
    public static function create($data) {
        $db = Database::getInstance();
        
        // Set default values
        $data['created_at'] = date('Y-m-d H:i:s');
        $data['updated_at'] = date('Y-m-d H:i:s');
        
        return $db->insert(self::$table, $data);
    }
    
    public static function update($id, $data) {
        $db = Database::getInstance();
        
        $data['updated_at'] = date('Y-m-d H:i:s');
        
        return $db->update(self::$table, $data, 'id = :id', ['id' => $id]);
    }
    
    public static function delete($id) {
        $db = Database::getInstance();
        return $db->delete(self::$table, 'id = :id', ['id' => $id]);
    }
    
    public static function getStats() {
        $db = Database::getInstance();
        
        $stats = [];
        
        // Total hearings
        $result = $db->fetch("SELECT COUNT(*) as total FROM " . self::$table);
        $stats['total'] = $result['total'];
        
        // Hearings by result
        $results = $db->fetchAll("SELECT hearing_result, COUNT(*) as count FROM " . self::$table . " GROUP BY hearing_result");
        $stats['by_result'] = [];
        foreach ($results as $result) {
            $stats['by_result'][$result['hearing_result']] = $result['count'];
        }
        
        // Hearings by type
        $types = $db->fetchAll("SELECT hearing_type, COUNT(*) as count FROM " . self::$table . " GROUP BY hearing_type");
        $stats['by_type'] = [];
        foreach ($types as $type) {
            $stats['by_type'][$type['hearing_type']] = $type['count'];
        }
        
        // Upcoming hearings (next 30 days)
        $result = $db->fetch("SELECT COUNT(*) as count FROM " . self::$table . " WHERE hearing_date >= CURDATE() AND hearing_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)");
        $stats['upcoming'] = $result['count'];
        
        // Recent hearings (last 30 days)
        $result = $db->fetch("SELECT COUNT(*) as count FROM " . self::$table . " WHERE hearing_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND hearing_date < CURDATE()");
        $stats['recent'] = $result['count'];
        
        // Hearings by month (last 12 months)
        $monthly = $db->fetchAll("
            SELECT DATE_FORMAT(hearing_date, '%Y-%m') as month, COUNT(*) as count 
            FROM " . self::$table . " 
            WHERE hearing_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) 
            GROUP BY DATE_FORMAT(hearing_date, '%Y-%m') 
            ORDER BY month DESC
        ");
        $stats['monthly'] = $monthly;
        
        return $stats;
    }
    
    public static function getByCase($caseId, $page = 1, $limit = DEFAULT_PAGE_SIZE) {
        $db = Database::getInstance();
        
        $sql = "SELECT h.*, c.matter_ar, c.matter_en, c.matter_id, cl.client_name_ar, cl.client_name_en 
                FROM " . self::$table . " h 
                LEFT JOIN cases c ON h.case_id = c.id 
                LEFT JOIN clients cl ON c.client_id = cl.id 
                WHERE h.case_id = :case_id 
                ORDER BY h.hearing_date DESC";
        
        return $db->paginate($sql, ['case_id' => $caseId], $page, $limit);
    }
    
    public static function getUpcoming($page = 1, $limit = DEFAULT_PAGE_SIZE) {
        $db = Database::getInstance();
        
        $sql = "SELECT h.*, c.matter_ar, c.matter_en, c.matter_id, cl.client_name_ar, cl.client_name_en 
                FROM " . self::$table . " h 
                LEFT JOIN cases c ON h.case_id = c.id 
                LEFT JOIN clients cl ON c.client_id = cl.id 
                WHERE h.hearing_date >= CURDATE() 
                ORDER BY h.hearing_date ASC";
        
        return $db->paginate($sql, [], $page, $limit);
    }
    
    public static function getByDateRange($startDate, $endDate, $page = 1, $limit = DEFAULT_PAGE_SIZE) {
        $db = Database::getInstance();
        
        $sql = "SELECT h.*, c.matter_ar, c.matter_en, c.matter_id, cl.client_name_ar, cl.client_name_en 
                FROM " . self::$table . " h 
                LEFT JOIN cases c ON h.case_id = c.id 
                LEFT JOIN clients cl ON c.client_id = cl.id 
                WHERE h.hearing_date BETWEEN :start_date AND :end_date 
                ORDER BY h.hearing_date ASC";
        
        return $db->paginate($sql, ['start_date' => $startDate, 'end_date' => $endDate], $page, $limit);
    }
    
    public static function search($searchTerm, $page = 1, $limit = DEFAULT_PAGE_SIZE) {
        $db = Database::getInstance();
        
        $sql = "SELECT h.*, c.matter_ar, c.matter_en, c.matter_id, cl.client_name_ar, cl.client_name_en 
                FROM " . self::$table . " h 
                LEFT JOIN cases c ON h.case_id = c.id 
                LEFT JOIN clients cl ON c.client_id = cl.id 
                WHERE h.hearing_decision LIKE :search 
                   OR h.court_notes LIKE :search 
                   OR h.lawyer_notes LIKE :search 
                   OR h.expert_notes LIKE :search
                   OR c.matter_ar LIKE :search 
                   OR c.matter_en LIKE :search 
                   OR cl.client_name_ar LIKE :search 
                   OR cl.client_name_en LIKE :search 
                ORDER BY h.hearing_date DESC";
        
        return $db->paginate($sql, ['search' => '%' . $searchTerm . '%'], $page, $limit);
    }
    
    public static function getResultOptions() {
        return [
            'won' => 'فاز',
            'lost' => 'خسر',
            'postponed' => 'مؤجل',
            'pending' => 'معلق'
        ];
    }
    
    public static function getTypeOptions() {
        return [
            'initial' => 'جلسة أولى',
            'procedural' => 'جلسة إجرائية',
            'evidence' => 'جلسة إثبات',
            'witness' => 'جلسة شهود',
            'expert' => 'جلسة خبراء',
            'final' => 'جلسة نهائية',
            'appeal' => 'جلسة استئناف',
            'execution' => 'جلسة تنفيذ'
        ];
    }
    
    public static function getDurationOptions() {
        return [
            '30min' => '30 دقيقة',
            '1hour' => 'ساعة واحدة',
            '2hours' => 'ساعتان',
            '3hours' => '3 ساعات',
            '4hours' => '4 ساعات',
            'fullday' => 'يوم كامل'
        ];
    }
}
