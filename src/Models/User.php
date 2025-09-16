<?php
/**
 * User Model
 * 
 * Handles user data operations and authentication.
 */

class User {
    private static $table = 'users';
    
    public static function findById($id) {
        $db = Database::getInstance();
        return $db->fetch("SELECT * FROM " . self::$table . " WHERE id = :id", ['id' => $id]);
    }
    
    public static function findByEmail($email) {
        $db = Database::getInstance();
        return $db->fetch("SELECT * FROM " . self::$table . " WHERE email = :email", ['email' => $email]);
    }
    
    public static function findByPasswordResetToken($token) {
        $db = Database::getInstance();
        return $db->fetch("SELECT * FROM " . self::$table . " WHERE password_reset_token = :token", ['token' => $token]);
    }
    
    public static function create($data) {
        $db = Database::getInstance();
        
        // Hash password if provided
        if (isset($data['password'])) {
            $data['password'] = Auth::hashPassword($data['password']);
        }
        
        // Set default values
        $data['status'] = $data['status'] ?? 'active';
        $data['role'] = $data['role'] ?? 'staff';
        $data['created_at'] = date('Y-m-d H:i:s');
        $data['updated_at'] = date('Y-m-d H:i:s');
        
        return $db->insert(self::$table, $data);
    }
    
    public static function update($id, $data) {
        $db = Database::getInstance();
        
        // Hash password if provided
        if (isset($data['password'])) {
            $data['password'] = Auth::hashPassword($data['password']);
        }
        
        $data['updated_at'] = date('Y-m-d H:i:s');
        
        return $db->update(self::$table, $data, 'id = :id', ['id' => $id]);
    }
    
    public static function delete($id) {
        $db = Database::getInstance();
        return $db->delete(self::$table, 'id = :id', ['id' => $id]);
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
        
        if (!empty($filters['role'])) {
            $whereClause .= ' AND role = :role';
            $params['role'] = $filters['role'];
        }
        
        if (!empty($filters['search'])) {
            $whereClause .= ' AND (name LIKE :search OR email LIKE :search)';
            $params['search'] = '%' . $filters['search'] . '%';
        }
        
        $sql = "SELECT id, name, email, role, status, created_at, updated_at, last_login_at FROM " . self::$table . " WHERE {$whereClause} ORDER BY created_at DESC";
        
        return $db->paginate($sql, $params, $page, $limit);
    }
    
    public static function updateLastLogin($id) {
        $db = Database::getInstance();
        return $db->update(self::$table, ['last_login_at' => date('Y-m-d H:i:s')], 'id = :id', ['id' => $id]);
    }
    
    public static function setPasswordResetToken($email, $token) {
        $db = Database::getInstance();
        $expires = date('Y-m-d H:i:s', time() + 3600); // 1 hour
        
        return $db->update(
            self::$table, 
            [
                'password_reset_token' => $token,
                'password_reset_expires' => $expires
            ], 
            'email = :email', 
            ['email' => $email]
        );
    }
    
    public static function clearPasswordResetToken($id) {
        $db = Database::getInstance();
        return $db->update(
            self::$table, 
            [
                'password_reset_token' => null,
                'password_reset_expires' => null
            ], 
            'id = :id', 
            ['id' => $id]
        );
    }
    
    public static function changePassword($id, $newPassword) {
        $db = Database::getInstance();
        $hashedPassword = Auth::hashPassword($newPassword);
        
        return $db->update(
            self::$table, 
            [
                'password' => $hashedPassword,
                'password_reset_token' => null,
                'password_reset_expires' => null
            ], 
            'id = :id', 
            ['id' => $id]
        );
    }
    
    public static function getStats() {
        $db = Database::getInstance();
        
        $stats = [];
        
        // Total users
        $result = $db->fetch("SELECT COUNT(*) as total FROM " . self::$table);
        $stats['total'] = $result['total'];
        
        // Users by role
        $roles = $db->fetchAll("SELECT role, COUNT(*) as count FROM " . self::$table . " GROUP BY role");
        $stats['by_role'] = [];
        foreach ($roles as $role) {
            $stats['by_role'][$role['role']] = $role['count'];
        }
        
        // Users by status
        $statuses = $db->fetchAll("SELECT status, COUNT(*) as count FROM " . self::$table . " GROUP BY status");
        $stats['by_status'] = [];
        foreach ($statuses as $status) {
            $stats['by_status'][$status['status']] = $status['count'];
        }
        
        // Recent logins (last 30 days)
        $result = $db->fetch("SELECT COUNT(*) as count FROM " . self::$table . " WHERE last_login_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
        $stats['recent_logins'] = $result['count'];
        
        return $stats;
    }
    
    public static function createTable() {
        $db = Database::getInstance();
        
        $sql = "CREATE TABLE IF NOT EXISTS " . self::$table . " (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('super_admin', 'admin', 'lawyer', 'staff') DEFAULT 'staff',
            status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
            remember_token VARCHAR(100) NULL,
            password_reset_token VARCHAR(100) NULL,
            password_reset_expires DATETIME NULL,
            last_login_at DATETIME NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            INDEX idx_email (email),
            INDEX idx_role (role),
            INDEX idx_status (status),
            INDEX idx_password_reset_token (password_reset_token)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        return $db->execute($sql);
    }
    
    public static function createDefaultUsers() {
        $db = Database::getInstance();
        
        // Check if users already exist
        $result = $db->fetch("SELECT COUNT(*) as count FROM " . self::$table);
        if ($result['count'] > 0) {
            return; // Users already exist
        }
        
        // Create default super admin
        $adminData = [
            'name' => 'Super Admin',
            'email' => 'admin@litigation.com',
            'password' => 'admin123',
            'role' => 'super_admin',
            'status' => 'active'
        ];
        
        self::create($adminData);
        
        // Create default lawyer
        $lawyerData = [
            'name' => 'ناجي رمضان',
            'email' => 'lawyer@litigation.com',
            'password' => 'lawyer123',
            'role' => 'lawyer',
            'status' => 'active'
        ];
        
        self::create($lawyerData);
        
        // Create default staff
        $staffData = [
            'name' => 'Staff User',
            'email' => 'staff@litigation.com',
            'password' => 'staff123',
            'role' => 'staff',
            'status' => 'active'
        ];
        
        self::create($staffData);
    }
}
