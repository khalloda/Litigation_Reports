<?php
/**
 * Case Model
 * 
 * Handles case data operations for litigation management.
 */

class CaseModel {
    private static $table = 'cases';
    
    public static function findById($id) {
        $db = Database::getInstance();
        $case = $db->fetch("SELECT * FROM " . self::$table . " WHERE id = :id", ['id' => $id]);
        
        if ($case) {
            // Get related client information
            $client = $db->fetch("SELECT * FROM clients WHERE id = :client_id", ['client_id' => $case['client_id']]);
            $case['client'] = $client;
            
            // Get related lawyer information
            if ($case['lawyer_a']) {
                $lawyerA = $db->fetch("SELECT * FROM lawyers WHERE name = :name", ['name' => $case['lawyer_a']]);
                $case['lawyer_a_info'] = $lawyerA;
            }
            if ($case['lawyer_b']) {
                $lawyerB = $db->fetch("SELECT * FROM lawyers WHERE name = :name", ['name' => $case['lawyer_b']]);
                $case['lawyer_b_info'] = $lawyerB;
            }
        }
        
        return $case;
    }
    
    public static function getAll($page = 1, $limit = DEFAULT_PAGE_SIZE, $filters = []) {
        $db = Database::getInstance();
        
        $whereClause = '1=1';
        $params = [];
        
        // Apply filters
        if (!empty($filters['status'])) {
            $whereClause .= ' AND matter_status = :status';
            $params['status'] = $filters['status'];
        }
        
        if (!empty($filters['client_id'])) {
            $whereClause .= ' AND client_id = :client_id';
            $params['client_id'] = $filters['client_id'];
        }
        
        if (!empty($filters['lawyer'])) {
            $whereClause .= ' AND (lawyer_a LIKE :lawyer OR lawyer_b LIKE :lawyer)';
            $params['lawyer'] = '%' . $filters['lawyer'] . '%';
        }
        
        if (!empty($filters['category'])) {
            $whereClause .= ' AND matter_category = :category';
            $params['category'] = $filters['category'];
        }
        
        if (!empty($filters['search'])) {
            $whereClause .= ' AND (matter_ar LIKE :search OR matter_en LIKE :search OR matter_subject LIKE :search)';
            $params['search'] = '%' . $filters['search'] . '%';
        }
        
        $sql = "SELECT c.*, cl.client_name_ar, cl.client_name_en 
                FROM " . self::$table . " c 
                LEFT JOIN clients cl ON c.client_id = cl.id 
                WHERE {$whereClause} 
                ORDER BY c.created_at DESC";
        
        return $db->paginate($sql, $params, $page, $limit);
    }
    
    public static function create($data) {
        $db = Database::getInstance();
        
        // Set default values
        $data['created_at'] = date('Y-m-d H:i:s');
        $data['updated_at'] = date('Y-m-d H:i:s');
        
        // Generate matter_id if not provided
        if (empty($data['matter_id'])) {
            $data['matter_id'] = self::generateMatterId();
        }
        
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
        
        // Total cases
        $result = $db->fetch("SELECT COUNT(*) as total FROM " . self::$table);
        $stats['total'] = $result['total'];
        
        // Cases by status
        $statuses = $db->fetchAll("SELECT matter_status, COUNT(*) as count FROM " . self::$table . " GROUP BY matter_status");
        $stats['by_status'] = [];
        foreach ($statuses as $status) {
            $stats['by_status'][$status['matter_status']] = $status['count'];
        }
        
        // Cases by category
        $categories = $db->fetchAll("SELECT matter_category, COUNT(*) as count FROM " . self::$table . " GROUP BY matter_category");
        $stats['by_category'] = [];
        foreach ($categories as $category) {
            $stats['by_category'][$category['matter_category']] = $category['count'];
        }
        
        // Cases by court
        $courts = $db->fetchAll("SELECT matter_court, COUNT(*) as count FROM " . self::$table . " GROUP BY matter_court");
        $stats['by_court'] = [];
        foreach ($courts as $court) {
            $stats['by_court'][$court['matter_court']] = $court['count'];
        }
        
        // Recent cases (last 30 days)
        $result = $db->fetch("SELECT COUNT(*) as count FROM " . self::$table . " WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
        $stats['recent'] = $result['count'];
        
        return $stats;
    }
    
    public static function getByClient($clientId, $page = 1, $limit = DEFAULT_PAGE_SIZE) {
        $db = Database::getInstance();
        
        $sql = "SELECT c.*, cl.client_name_ar, cl.client_name_en 
                FROM " . self::$table . " c 
                LEFT JOIN clients cl ON c.client_id = cl.id 
                WHERE c.client_id = :client_id 
                ORDER BY c.created_at DESC";
        
        return $db->paginate($sql, ['client_id' => $clientId], $page, $limit);
    }
    
    public static function getByLawyer($lawyerName, $page = 1, $limit = DEFAULT_PAGE_SIZE) {
        $db = Database::getInstance();
        
        $sql = "SELECT c.*, cl.client_name_ar, cl.client_name_en 
                FROM " . self::$table . " c 
                LEFT JOIN clients cl ON c.client_id = cl.id 
                WHERE c.lawyer_a LIKE :lawyer OR c.lawyer_b LIKE :lawyer 
                ORDER BY c.created_at DESC";
        
        return $db->paginate($sql, ['lawyer' => '%' . $lawyerName . '%'], $page, $limit);
    }
    
    public static function search($searchTerm, $page = 1, $limit = DEFAULT_PAGE_SIZE) {
        $db = Database::getInstance();
        
        $sql = "SELECT c.*, cl.client_name_ar, cl.client_name_en 
                FROM " . self::$table . " c 
                LEFT JOIN clients cl ON c.client_id = cl.id 
                WHERE c.matter_ar LIKE :search 
                   OR c.matter_en LIKE :search 
                   OR c.matter_subject LIKE :search 
                   OR c.matter_id LIKE :search
                   OR cl.client_name_ar LIKE :search 
                   OR cl.client_name_en LIKE :search 
                ORDER BY c.created_at DESC";
        
        return $db->paginate($sql, ['search' => '%' . $searchTerm . '%'], $page, $limit);
    }
    
    private static function generateMatterId() {
        $db = Database::getInstance();
        
        // Get current year
        $year = date('Y');
        
        // Get next sequence number for this year
        $result = $db->fetch("SELECT COUNT(*) as count FROM " . self::$table . " WHERE matter_id LIKE :pattern", 
                           ['pattern' => $year . '%']);
        
        $nextNumber = $result['count'] + 1;
        
        return $year . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
    
    public static function getStatusOptions() {
        return [
            'active' => 'نشط',
            'pending' => 'معلق',
            'completed' => 'مكتمل',
            'cancelled' => 'ملغي',
            'on_hold' => 'متوقف',
            'appealed' => 'مستأنف'
        ];
    }
    
    public static function getCategoryOptions() {
        return [
            'civil' => 'مدني',
            'commercial' => 'تجاري',
            'criminal' => 'جنائي',
            'administrative' => 'إداري',
            'labor' => 'عمل',
            'family' => 'أحوال شخصية',
            'real_estate' => 'عقاري',
            'intellectual_property' => 'ملكية فكرية'
        ];
    }
    
    public static function getImportanceOptions() {
        return [
            'low' => 'منخفض',
            'medium' => 'متوسط',
            'high' => 'عالي',
            'critical' => 'حرج'
        ];
    }
}
