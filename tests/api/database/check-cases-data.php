<?php
/**
 * Check Cases Data in Database
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

try {
    echo "Checking cases data in database...\n";
    
    $db = Database::getInstance();
    
    // Check if cases table exists and get its structure
    $casesExists = $db->fetch("SHOW TABLES LIKE 'cases'");
    if ($casesExists) {
        echo "✅ Cases table exists\n";
        echo "Cases table structure:\n";
        $structure = $db->getTableStructure('cases');
        foreach ($structure as $column) {
            echo "  - {$column['Field']} ({$column['Type']}) - {$column['Null']} - {$column['Key']}\n";
        }
        
        // Get sample data
        echo "\nSample cases data:\n";
        $cases = $db->fetchAll("SELECT * FROM cases LIMIT 5");
        foreach ($cases as $case) {
            echo "  Case: " . json_encode($case, JSON_UNESCAPED_UNICODE) . "\n";
        }
        
        // Get total count
        $count = $db->fetch("SELECT COUNT(*) as total FROM cases");
        echo "\nTotal cases: {$count['total']}\n";
        
    } else {
        echo "❌ Cases table does not exist\n";
    }
    
    // Check related tables
    echo "\nChecking related tables:\n";
    $relatedTables = ['clients', 'lawyers', 'hearings', 'invoices'];
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
