<?php
/**
 * Test Admin User in Database
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/src/Core/Auth.php';
require_once __DIR__ . '/src/Models/User.php';

try {
    echo "Testing admin user in database...\n";
    
    // Get database connection
    $db = Database::getInstance();
    
    // Check if admin user exists
    $user = User::findByEmail('admin@litigation.com');
    
    if ($user) {
        echo "✅ Admin user found:\n";
        echo "  - ID: {$user['id']}\n";
        echo "  - Name: " . ($user['name'] ?? 'NULL') . "\n";
        echo "  - Email: {$user['email']}\n";
        echo "  - Role: {$user['role']}\n";
        echo "  - Status: {$user['status']}\n";
        echo "  - Password hash: " . substr($user['password'], 0, 20) . "...\n";
        
        // Test password verification
        $password = 'admin123';
        $isValid = Auth::verifyPassword($password, $user['password']);
        echo "  - Password 'admin123' valid: " . ($isValid ? 'YES' : 'NO') . "\n";
        
        if (!$isValid) {
            echo "❌ Password verification failed!\n";
            echo "Let's try to update the password...\n";
            
            // Update password
            $hashedPassword = Auth::hashPassword($password);
            $db->update('users', ['password_hash' => $hashedPassword], 'id = :id', ['id' => $user['id']]);
            
            echo "✅ Password updated. Testing again...\n";
            $isValid = Auth::verifyPassword($password, $hashedPassword);
            echo "  - Password 'admin123' valid after update: " . ($isValid ? 'YES' : 'NO') . "\n";
        }
        
    } else {
        echo "❌ Admin user not found!\n";
        echo "Creating admin user...\n";
        
        $adminData = [
            'name' => 'Super Admin',
            'email' => 'admin@litigation.com',
            'password' => 'admin123',
            'role' => 'super_admin',
            'status' => 'active'
        ];
        
        $userId = User::create($adminData);
        echo "✅ Admin user created with ID: {$userId}\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
?>
