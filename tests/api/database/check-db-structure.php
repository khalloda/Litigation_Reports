<?php
/**
 * Check Database Structure
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

try {
    echo "Checking database structure...\n";
    
    $db = Database::getInstance();
    
    // Check if users table exists and get its structure
    $usersExists = $db->fetch("SHOW TABLES LIKE 'users'");
    if ($usersExists) {
        echo "✅ Users table exists\n";
        echo "Users table structure:\n";
        $structure = $db->getTableStructure('users');
        foreach ($structure as $column) {
            echo "  - {$column['Field']} ({$column['Type']}) - {$column['Null']} - {$column['Key']}\n";
        }
        
        // Get sample data
        echo "\nSample users data:\n";
        $users = $db->fetchAll("SELECT * FROM users LIMIT 3");
        foreach ($users as $user) {
            echo "  User: " . json_encode($user) . "\n";
        }
        
    } else {
        echo "❌ Users table does not exist\n";
    }
    
    // Check other tables
    echo "\nAll tables in database:\n";
    $tables = $db->fetchAll("SHOW TABLES");
    foreach ($tables as $table) {
        $tableName = array_values($table)[0];
        echo "  - {$tableName}\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
