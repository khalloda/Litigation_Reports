<?php
/**
 * Check Hearings Data in Database
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

try {
    echo "Checking hearings data in database...\n";
    
    $db = Database::getInstance();
    
    // Check if hearings table exists and get its structure
    $hearingsExists = $db->fetch("SHOW TABLES LIKE 'hearings'");
    if ($hearingsExists) {
        echo "✅ Hearings table exists\n";
        echo "Hearings table structure:\n";
        $structure = $db->getTableStructure('hearings');
        foreach ($structure as $column) {
            echo "  - {$column['Field']} ({$column['Type']}) - {$column['Null']} - {$column['Key']}\n";
        }
        
        // Get sample data
        echo "\nSample hearings data:\n";
        $hearings = $db->fetchAll("SELECT * FROM hearings LIMIT 5");
        foreach ($hearings as $hearing) {
            echo "  Hearing: " . json_encode($hearing, JSON_UNESCAPED_UNICODE) . "\n";
        }
        
        // Get total count
        $count = $db->fetch("SELECT COUNT(*) as total FROM hearings");
        echo "\nTotal hearings: {$count['total']}\n";
        
    } else {
        echo "❌ Hearings table does not exist\n";
    }
    
    // Check related tables
    echo "\nChecking related tables:\n";
    $relatedTables = ['cases', 'clients', 'lawyers'];
    foreach ($relatedTables as $table) {
        $exists = $db->fetch("SHOW TABLES LIKE '{$table}'");
        if ($exists) {
            $count = $db->fetch("SELECT COUNT(*) as total FROM {$table}");
            echo "  - {$table}: {$count['total']} records\n";
        } else {
            echo "  - {$table}: NOT EXISTS\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
