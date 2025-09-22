<?php
/**
 * Check Cases IDs
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

try {
    echo "Checking cases IDs...\n";
    
    $db = Database::getInstance();
    
    // Get all cases with their IDs
    $cases = $db->fetchAll("SELECT id, matter_id, matter_ar, matter_en FROM cases ORDER BY id LIMIT 10");
    
    echo "Available cases:\n";
    foreach ($cases as $case) {
        echo "  ID: {$case['id']}, Matter ID: {$case['matter_id']}, Matter: {$case['matter_ar']}\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
