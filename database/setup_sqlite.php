<?php
/**
 * SQLite Database Setup Script
 * 
 * Creates a SQLite database for development and testing purposes.
 */

echo "Litigation Management System - SQLite Database Setup\n";
echo "====================================================\n\n";

$dbPath = __DIR__ . '/litigation.db';

try {
    // Create SQLite database
    $pdo = new PDO("sqlite:{$dbPath}");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✓ SQLite database created at: {$dbPath}\n";
    
    // Create users table
    $createUsersTable = "
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'staff',
        status VARCHAR(50) DEFAULT 'active',
        remember_token VARCHAR(100) NULL,
        password_reset_token VARCHAR(100) NULL,
        password_reset_expires DATETIME NULL,
        last_login_at DATETIME NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL
    )
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
    
    echo "\n✓ SQLite database setup completed successfully!\n";
    echo "\nNext steps:\n";
    echo "1. Start the PHP server: php start-server.php\n";
    echo "2. Test the API: http://localhost:8000/api/health\n";
    echo "3. Test login: POST http://localhost:8000/api/auth/login\n";
    
} catch (PDOException $e) {
    echo "✗ Database error: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    exit(1);
}
