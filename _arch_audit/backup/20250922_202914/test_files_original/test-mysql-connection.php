<?php
/**
 * Test MySQL Connection
 * Simple script to test if the MySQL database connection works
 */

// Include configuration
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

try {
    echo "Testing MySQL connection...\n";
    
    // Test database connection
    $db = Database::getInstance();
    echo "✅ Database connection successful!\n";
    
    // Test basic query
    $result = $db->fetch("SELECT COUNT(*) as total FROM users");
    echo "✅ Users table query successful: {$result['total']} users found\n";
    
    // Test user authentication
    $user = $db->fetch("SELECT * FROM users WHERE email = :email", ['email' => 'admin@litigation.com']);
    if ($user) {
        echo "✅ Admin user found: {$user['name']} ({$user['role']})\n";
    } else {
        echo "❌ Admin user not found\n";
    }
    
    // Test clients table
    $clients = $db->fetch("SELECT COUNT(*) as total FROM clients");
    echo "✅ Clients table query successful: {$clients['total']} clients found\n";
    
    // Test lawyers table
    $lawyers = $db->fetch("SELECT COUNT(*) as total FROM lawyers");
    echo "✅ Lawyers table query successful: {$lawyers['total']} lawyers found\n";
    
    echo "\n🎉 All MySQL tests passed! Database is ready for use.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
