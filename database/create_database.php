<?php
/**
 * Database Creation Script
 * 
 * Creates the litigation database and sets up basic configuration.
 */

echo "Litigation Management System - Database Setup\n";
echo "=============================================\n\n";

// Database configuration
$host = 'localhost';
$port = '3306';
$username = 'root';
$password = '';
$database = 'litigation_db';

echo "Database Configuration:\n";
echo "- Host: {$host}\n";
echo "- Port: {$port}\n";
echo "- Username: {$username}\n";
echo "- Database: {$database}\n\n";

try {
    // Connect to MySQL server (without database)
    $dsn = "mysql:host={$host};port={$port};charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    echo "✓ Connected to MySQL server successfully\n";
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✓ Database '{$database}' created successfully\n";
    
    // Use the database
    $pdo->exec("USE `{$database}`");
    echo "✓ Using database '{$database}'\n";
    
    // Create users table
    $createUsersTable = "
    CREATE TABLE IF NOT EXISTS `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) UNIQUE NOT NULL,
        `password` VARCHAR(255) NOT NULL,
        `role` ENUM('super_admin', 'admin', 'lawyer', 'staff') DEFAULT 'staff',
        `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        `remember_token` VARCHAR(100) NULL,
        `password_reset_token` VARCHAR(100) NULL,
        `password_reset_expires` DATETIME NULL,
        `last_login_at` DATETIME NULL,
        `created_at` DATETIME NOT NULL,
        `updated_at` DATETIME NOT NULL,
        INDEX `idx_email` (`email`),
        INDEX `idx_role` (`role`),
        INDEX `idx_status` (`status`),
        INDEX `idx_password_reset_token` (`password_reset_token`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ";
    
    $pdo->exec($createUsersTable);
    echo "✓ Users table created successfully\n";
    
    // Check if users already exist
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch();
    
    if ($result['count'] == 0) {
        // Create default users
        $defaultUsers = [
            [
                'name' => 'Super Admin',
                'email' => 'admin@litigation.com',
                'password' => password_hash('admin123', PASSWORD_BCRYPT),
                'role' => 'super_admin',
                'status' => 'active',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'ناجي رمضان',
                'email' => 'lawyer@litigation.com',
                'password' => password_hash('lawyer123', PASSWORD_BCRYPT),
                'role' => 'lawyer',
                'status' => 'active',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Staff User',
                'email' => 'staff@litigation.com',
                'password' => password_hash('staff123', PASSWORD_BCRYPT),
                'role' => 'staff',
                'status' => 'active',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ];
        
        $insertStmt = $pdo->prepare("
            INSERT INTO users (name, email, password, role, status, created_at, updated_at) 
            VALUES (:name, :email, :password, :role, :status, :created_at, :updated_at)
        ");
        
        foreach ($defaultUsers as $user) {
            $insertStmt->execute($user);
        }
        
        echo "✓ Default users created successfully\n";
    } else {
        echo "✓ Users already exist, skipping default user creation\n";
    }
    
    echo "\nDefault users:\n";
    echo "- Super Admin: admin@litigation.com / admin123\n";
    echo "- Lawyer: lawyer@litigation.com / lawyer123\n";
    echo "- Staff: staff@litigation.com / staff123\n";
    
    echo "\n✓ Database setup completed successfully!\n";
    echo "\nNext steps:\n";
    echo "1. Start the PHP server: php start-server.php\n";
    echo "2. Test the API: http://localhost:8000/api/health\n";
    echo "3. Test login: POST http://localhost:8000/api/auth/login\n";
    
} catch (PDOException $e) {
    echo "✗ Database error: " . $e->getMessage() . "\n";
    echo "\nTroubleshooting:\n";
    echo "1. Make sure MySQL is running\n";
    echo "2. Check your database credentials\n";
    echo "3. Make sure the user has CREATE DATABASE privileges\n";
    exit(1);
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    exit(1);
}
