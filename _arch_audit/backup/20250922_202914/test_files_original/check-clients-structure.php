<?php
/**
 * Check Clients Table Structure
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

try {
    echo "Checking clients table structure...\n";
    
    $db = Database::getInstance();
    
    // Get clients table structure
    $structure = $db->getTableStructure('clients');
    echo "Clients table structure:\n";
    foreach ($structure as $column) {
        echo "  - {$column['Field']} ({$column['Type']}) - {$column['Null']} - {$column['Key']}\n";
    }
    
    // Get sample data
    echo "\nSample clients data:\n";
    $clients = $db->fetchAll("SELECT * FROM clients LIMIT 3");
    foreach ($clients as $client) {
        echo "  Client: " . json_encode($client, JSON_UNESCAPED_UNICODE) . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
