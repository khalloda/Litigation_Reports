<?php
/**
 * Debug Cases List
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/src/Models/Case.php';

try {
    echo "Debugging cases list...\n";
    
    // Test CaseModel::getAll directly
    $result = CaseModel::getAll(1, 10, []);
    
    echo "Result: " . json_encode($result, JSON_PRETTY_PRINT) . "\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
?>
