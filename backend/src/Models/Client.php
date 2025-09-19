<?php
/**
 * Client Model
 * 
 * Handles client data operations for litigation management.
 */

class Client {
    private static $table = 'clients';
    
    public static function findById($id) {
        $db = Database::getInstance();
        $client = $db->fetch("SELECT * FROM " . self::$table . " WHERE id = :id", ['id' => $id]);

        if ($client) {
            // Add logo URL if logo exists
            if (!empty($client['logo'])) {
                $client['logo_url'] = '/uploads/logos/' . $client['logo'];
            }

            // Get related cases count
            $casesCount = $db->fetch("SELECT COUNT(*) as count FROM cases WHERE client_id = :client_id", ['client_id' => $id]);
            $client['cases_count'] = $casesCount['count'];

            // Get recent cases
            $recentCases = $db->fetchAll("SELECT id, matter_ar, matter_en, matter_status, created_at FROM cases WHERE client_id = :client_id ORDER BY created_at DESC LIMIT 5", ['client_id' => $id]);
            $client['recent_cases'] = $recentCases;
        }

        return $client;
    }
    
    public static function getAll($page = 1, $limit = DEFAULT_PAGE_SIZE, $filters = []) {
        $db = Database::getInstance();
        
        $whereClause = '1=1';
        $params = [];
        
        // Apply filters
        if (!empty($filters['status'])) {
            $whereClause .= ' AND status = :status';
            $params['status'] = $filters['status'];
        }
        
        if (!empty($filters['type'])) {
            $whereClause .= ' AND client_type = :type';
            $params['type'] = $filters['type'];
        }
        
        if (!empty($filters['cash_pro_bono'])) {
            $whereClause .= ' AND cash_pro_bono = :cash_pro_bono';
            $params['cash_pro_bono'] = $filters['cash_pro_bono'];
        }
        
        if (!empty($filters['search'])) {
            $whereClause .= ' AND (client_name_ar LIKE :search OR client_name_en LIKE :search OR contact_lawyer LIKE :search)';
            $params['search'] = '%' . $filters['search'] . '%';
        }
        
        $sql = "SELECT c.*,
                       (SELECT COUNT(*) FROM cases WHERE client_id = c.id) as cases_count,
                       (SELECT MAX(created_at) FROM cases WHERE client_id = c.id) as last_case_date
                FROM " . self::$table . " c
                WHERE {$whereClause}
                ORDER BY c.created_at DESC";

        $result = $db->paginate($sql, $params, $page, $limit);

        // Add logo URLs to all clients
        if (!empty($result['data'])) {
            foreach ($result['data'] as &$client) {
                if (!empty($client['logo'])) {
                    $client['logo_url'] = '/uploads/logos/' . $client['logo'];
                }
            }
        }

        return $result;
    }
    
    public static function create($data) {
        $db = Database::getInstance();
        
        // Set default values
        $data['created_at'] = date('Y-m-d H:i:s');
        $data['updated_at'] = date('Y-m-d H:i:s');
        
        // Set default status if not provided
        if (empty($data['status'])) {
            $data['status'] = 'active';
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
        
        // Check if client has cases
        $casesCount = $db->fetch("SELECT COUNT(*) as count FROM cases WHERE client_id = :client_id", ['client_id' => $id]);
        if ($casesCount['count'] > 0) {
            throw new Exception('Cannot delete client with existing cases');
        }
        
        return $db->delete(self::$table, 'id = :id', ['id' => $id]);
    }
    
    public static function getStats() {
        $db = Database::getInstance();
        
        $stats = [];
        
        // Total clients
        $result = $db->fetch("SELECT COUNT(*) as total FROM " . self::$table);
        $stats['total'] = $result['total'];
        
        // Clients by status
        $statuses = $db->fetchAll("SELECT status, COUNT(*) as count FROM " . self::$table . " GROUP BY status");
        $stats['by_status'] = [];
        foreach ($statuses as $status) {
            $stats['by_status'][$status['status']] = $status['count'];
        }
        
        // Clients by type
        $types = $db->fetchAll("SELECT client_type, COUNT(*) as count FROM " . self::$table . " GROUP BY client_type");
        $stats['by_type'] = [];
        foreach ($types as $type) {
            $stats['by_type'][$type['client_type']] = $type['count'];
        }
        
        // Clients by cash/pro bono
        $cashTypes = $db->fetchAll("SELECT cash_pro_bono, COUNT(*) as count FROM " . self::$table . " GROUP BY cash_pro_bono");
        $stats['by_cash_pro_bono'] = [];
        foreach ($cashTypes as $cashType) {
            $stats['by_cash_pro_bono'][$cashType['cash_pro_bono']] = $cashType['count'];
        }
        
        // Recent clients (last 30 days)
        $result = $db->fetch("SELECT COUNT(*) as count FROM " . self::$table . " WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
        $stats['recent'] = $result['count'];
        
        // Clients with most cases
        $topClients = $db->fetchAll("
            SELECT c.id, c.client_name_ar, c.client_name_en, COUNT(cs.id) as cases_count 
            FROM " . self::$table . " c 
            LEFT JOIN cases cs ON c.id = cs.client_id 
            GROUP BY c.id 
            ORDER BY cases_count DESC 
            LIMIT 10
        ");
        $stats['top_clients'] = $topClients;
        
        return $stats;
    }
    
    public static function search($searchTerm, $page = 1, $limit = DEFAULT_PAGE_SIZE) {
        $db = Database::getInstance();

        $sql = "SELECT c.*,
                       (SELECT COUNT(*) FROM cases WHERE client_id = c.id) as cases_count
                FROM " . self::$table . " c
                WHERE c.client_name_ar LIKE :search
                   OR c.client_name_en LIKE :search
                   OR c.contact_lawyer LIKE :search
                ORDER BY c.created_at DESC";

        $result = $db->paginate($sql, ['search' => '%' . $searchTerm . '%'], $page, $limit);

        // Add logo URLs to all clients
        if (!empty($result['data'])) {
            foreach ($result['data'] as &$client) {
                if (!empty($client['logo'])) {
                    $client['logo_url'] = '/uploads/logos/' . $client['logo'];
                }
            }
        }

        return $result;
    }
    
    public static function getByLawyer($lawyerName, $page = 1, $limit = DEFAULT_PAGE_SIZE) {
        $db = Database::getInstance();

        $sql = "SELECT c.*,
                       (SELECT COUNT(*) FROM cases WHERE client_id = c.id) as cases_count
                FROM " . self::$table . " c
                WHERE c.contact_lawyer LIKE :lawyer
                ORDER BY c.created_at DESC";

        $result = $db->paginate($sql, ['lawyer' => '%' . $lawyerName . '%'], $page, $limit);

        // Add logo URLs to all clients
        if (!empty($result['data'])) {
            foreach ($result['data'] as &$client) {
                if (!empty($client['logo'])) {
                    $client['logo_url'] = '/uploads/logos/' . $client['logo'];
                }
            }
        }

        return $result;
    }
    
    public static function getActiveClients($page = 1, $limit = DEFAULT_PAGE_SIZE) {
        $db = Database::getInstance();

        $sql = "SELECT c.*,
                       (SELECT COUNT(*) FROM cases WHERE client_id = c.id) as cases_count
                FROM " . self::$table . " c
                WHERE c.status = 'active'
                ORDER BY c.client_name_ar ASC";

        $result = $db->paginate($sql, [], $page, $limit);

        // Add logo URLs to all clients
        if (!empty($result['data'])) {
            foreach ($result['data'] as &$client) {
                if (!empty($client['logo'])) {
                    $client['logo_url'] = '/uploads/logos/' . $client['logo'];
                }
            }
        }

        return $result;
    }
    
    public static function getStatusOptions() {
        return [
            'active' => 'نشط',
            'disabled' => 'معطل',
            'inactive' => 'غير نشط'
        ];
    }
    
    public static function getTypeOptions() {
        return [
            'individual' => 'فرد',
            'company' => 'شركة'
        ];
    }
    
    public static function getCashProBonoOptions() {
        return [
            'cash' => 'نقدي',
            'probono' => 'مجاني'
        ];
    }
    
    public static function getClientsForSelect() {
        $db = Database::getInstance();
        
        $clients = $db->fetchAll("
            SELECT id, client_name_ar, client_name_en, client_type, status 
            FROM " . self::$table . " 
            WHERE status = 'active' 
            ORDER BY client_name_ar ASC
        ");
        
        $options = [];
        foreach ($clients as $client) {
            $options[] = [
                'value' => $client['id'],
                'label' => $client['client_name_ar'] . ($client['client_name_en'] ? ' (' . $client['client_name_en'] . ')' : ''),
                'type' => $client['client_type']
            ];
        }
        
        return $options;
    }
}
