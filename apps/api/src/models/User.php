<?php

/**
 * User Model
 *
 * Handles user data operations and authentication.
 */

// Import required classes
require_once __DIR__ . '/../core/Database.php';

// Model Constants
if (!defined('DEFAULT_PAGE_SIZE')) {
    define('DEFAULT_PAGE_SIZE', 20);
}
if (!defined('MAX_PAGE_SIZE')) {
    define('MAX_PAGE_SIZE', 100);
}
if (!defined('MIN_PAGE_SIZE')) {
    define('MIN_PAGE_SIZE', 5);
}

class User
{
    private static $table = 'users';

    public static function findById($id)
    {
        $db = Database::getInstance();
        $user = $db->fetch("SELECT * FROM " . self::$table . " WHERE id = ?", [$id]);

        if ($user) {
            // Map database columns to expected format
            $user['name'] = $user['full_name_en'] ?: $user['full_name_ar'] ?: $user['username'];
            $user['password'] = $user['password_hash'];
            $user['status'] = $user['is_active'] ? 'active' : 'inactive';
        }

        return $user;
    }

    public static function findByEmail($email)
    {
        $db = Database::getInstance();
        $user = $db->fetch("SELECT * FROM " . self::$table . " WHERE email = ?", [$email]);

        if ($user) {
            // Map database columns to expected format
            $user['name'] = $user['full_name_en'] ?: $user['full_name_ar'] ?: $user['username'];
            $user['password'] = $user['password_hash'];
            $user['status'] = $user['is_active'] ? 'active' : 'inactive';
        }

        return $user;
    }

    public static function findByPasswordResetToken($token)
    {
        $db = Database::getInstance();
        return $db->fetch("SELECT * FROM " . self::$table . " WHERE password_reset_token = ?", [$token]);
    }

    public static function create($data)
    {
        $db = Database::getInstance();

        // Map API format to database columns
        $dbData = [];

        if (isset($data['name'])) {
            $dbData['full_name_en'] = $data['name'];
            $dbData['full_name_ar'] = $data['name']; // Default both to same value
        }

        if (isset($data['email'])) {
            $dbData['email'] = $data['email'];
            $dbData['username'] = explode('@', $data['email'])[0]; // Use email prefix as username
        }

        if (isset($data['password'])) {
            $dbData['password_hash'] = Auth::hashPassword($data['password']);
        }

        if (isset($data['role'])) {
            $dbData['role'] = $data['role'];
        } else {
            $dbData['role'] = 'staff';
        }

        if (isset($data['status'])) {
            $dbData['is_active'] = $data['status'] === 'active' ? 1 : 0;
        } else {
            $dbData['is_active'] = 1;
        }

        $dbData['created_at'] = date('Y-m-d H:i:s');
        $dbData['updated_at'] = date('Y-m-d H:i:s');

        // Build SQL query
        $columns = implode(', ', array_keys($dbData));
        $placeholders = implode(', ', array_fill(0, count($dbData), '?'));

        $sql = "INSERT INTO " . self::$table . " ($columns) VALUES ($placeholders)";
        $params = array_values($dbData);

        $success = $db->execute($sql, $params);
        return $success ? $db->lastInsertId() : false;
    }

    public static function update($id, $data)
    {
        $db = Database::getInstance();

        // Map API format to database columns
        $dbData = [];

        if (isset($data['name'])) {
            $dbData['full_name_en'] = $data['name'];
            $dbData['full_name_ar'] = $data['name']; // Default both to same value
        }

        if (isset($data['email'])) {
            $dbData['email'] = $data['email'];
            $dbData['username'] = explode('@', $data['email'])[0]; // Use email prefix as username
        }

        if (isset($data['password'])) {
            $dbData['password_hash'] = Auth::hashPassword($data['password']);
        }

        if (isset($data['role'])) {
            $dbData['role'] = $data['role'];
        }

        if (isset($data['status'])) {
            $dbData['is_active'] = $data['status'] === 'active' ? 1 : 0;
        }

        $dbData['updated_at'] = date('Y-m-d H:i:s');

        // Build SQL query
        $setParts = [];
        $params = [];

        foreach ($dbData as $column => $value) {
            $setParts[] = "$column = ?";
            $params[] = $value;
        }

        $params[] = $id; // Add ID for WHERE clause

        $setClause = implode(', ', $setParts);
        $sql = "UPDATE " . self::$table . " SET $setClause WHERE id = ?";

        return $db->execute($sql, $params);
    }

    public static function delete($id)
    {
        $db = Database::getInstance();
        return $db->execute("DELETE FROM " . self::$table . " WHERE id = ?", [$id]);
    }

    public static function getAll($page = 1, $limit = DEFAULT_PAGE_SIZE, $filters = [])
    {
        $db = Database::getInstance();

        $whereClause = '1=1';
        $params = [];

        // Apply filters
        if (!empty($filters['status'])) {
            if ($filters['status'] === 'active') {
                $whereClause .= ' AND is_active = 1';
            } else {
                $whereClause .= ' AND is_active = 0';
            }
        }

        if (!empty($filters['role'])) {
            $whereClause .= ' AND role = ?';
            $params[] = $filters['role'];
        }

        if (!empty($filters['search'])) {
            $search = '%' . $filters['search'] . '%';
            $whereClause .= ' AND (full_name_en LIKE ? OR full_name_ar LIKE ? OR email LIKE ? OR username LIKE ?)';
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
        }

        // Calculate offset
        $offset = ($page - 1) * $limit;

        // Get total count
        $countSql = "SELECT COUNT(*) as total FROM " . self::$table . " WHERE {$whereClause}";
        $totalResult = $db->fetch($countSql, $params);
        $total = $totalResult ? $totalResult['total'] : 0;

        // Main query with pagination
        $sql = "SELECT
                    id,
                    COALESCE(full_name_en, full_name_ar, username) as name,
                    email,
                    role,
                    CASE WHEN is_active = 1 THEN 'active' ELSE 'inactive' END as status,
                    created_at,
                    updated_at,
                    last_login
                FROM " . self::$table . "
                WHERE {$whereClause}
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?";

        $params[] = $limit;
        $params[] = $offset;

        $data = $db->fetchAll($sql, $params);

        return [
            'data' => $data,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => ceil($total / $limit),
                'has_next' => $page < ceil($total / $limit),
                'has_prev' => $page > 1
            ]
        ];
    }

    public static function updateLastLogin($id)
    {
        $db = Database::getInstance();
        return $db->execute("UPDATE " . self::$table . " SET last_login = ? WHERE id = ?", [date('Y-m-d H:i:s'), $id]);
    }

    public static function setPasswordResetToken($email, $token)
    {
        $db = Database::getInstance();
        $expires = date('Y-m-d H:i:s', time() + 3600); // 1 hour

        return $db->execute(
            "UPDATE " . self::$table . " SET password_reset_token = ?, password_reset_expires = ? WHERE email = ?",
            [$token, $expires, $email]
        );
    }

    public static function clearPasswordResetToken($id)
    {
        $db = Database::getInstance();
        return $db->execute(
            "UPDATE " . self::$table . " SET password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?",
            [$id]
        );
    }

    public static function changePassword($id, $newPassword)
    {
        $db = Database::getInstance();
        $hashedPassword = Auth::hashPassword($newPassword);

        return $db->execute(
            "UPDATE " . self::$table . " SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?",
            [$hashedPassword, $id]
        );
    }

    public static function getStats()
    {
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
        $statuses = $db->fetchAll("SELECT is_active, COUNT(*) as count FROM " . self::$table . " GROUP BY is_active");
        $stats['by_status'] = [];
        foreach ($statuses as $status) {
            $statusName = $status['is_active'] ? 'active' : 'inactive';
            $stats['by_status'][$statusName] = $status['count'];
        }

        // Recent logins (last 30 days)
        $result = $db->fetch("SELECT COUNT(*) as count FROM " . self::$table . " WHERE last_login_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
        $stats['recent_logins'] = $result['count'];

        return $stats;
    }

    public static function createTable()
    {
        $db = Database::getInstance();

        $sql = "CREATE TABLE IF NOT EXISTS " . self::$table . " (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name_en VARCHAR(255) NULL,
            full_name_ar VARCHAR(255) NULL,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('super_admin', 'admin', 'lawyer', 'staff') DEFAULT 'staff',
            is_active TINYINT(1) DEFAULT 1,
            password_reset_token VARCHAR(100) NULL,
            password_reset_expires DATETIME NULL,
            last_login_at DATETIME NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            INDEX idx_email (email),
            INDEX idx_role (role),
            INDEX idx_is_active (is_active),
            INDEX idx_password_reset_token (password_reset_token)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

        return $db->execute($sql);
    }

    public static function createDefaultUsers()
    {
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
