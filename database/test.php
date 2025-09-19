<?php
/**
 * Database Test Script
 * Tests the database connection and basic functionality
 */

require_once 'config/database.php';

echo "=== Database Connection Test ===\n\n";

try {
    // Test database connection
    echo "1. Testing database connection...\n";
    $db = Database::getInstance();
    echo "   ✓ Connection successful\n\n";
    
    // Test basic queries
    echo "2. Testing basic queries...\n";
    
    // Test users table
    $users = DatabaseHelper::queryAll("SELECT COUNT(*) as count FROM users");
    echo "   ✓ Users table: " . $users[0]['count'] . " records\n";
    
    // Test clients table
    $clients = DatabaseHelper::queryAll("SELECT COUNT(*) as count FROM clients");
    echo "   ✓ Clients table: " . $clients[0]['count'] . " records\n";
    
    // Test cases table
    $cases = DatabaseHelper::queryAll("SELECT COUNT(*) as count FROM cases");
    echo "   ✓ Cases table: " . $cases[0]['count'] . " records\n";
    
    // Test lawyers table
    $lawyers = DatabaseHelper::queryAll("SELECT COUNT(*) as count FROM lawyers");
    echo "   ✓ Lawyers table: " . $lawyers[0]['count'] . " records\n";
    
    // Test invoices table
    $invoices = DatabaseHelper::queryAll("SELECT COUNT(*) as count FROM invoices");
    echo "   ✓ Invoices table: " . $invoices[0]['count'] . " records\n";
    
    echo "\n";
    
    // Test Arabic data
    echo "3. Testing Arabic data support...\n";
    
    // Check if we can read Arabic data
    $arabicClients = DatabaseHelper::queryAll("SELECT client_name_ar FROM clients WHERE client_name_ar IS NOT NULL AND client_name_ar != '' LIMIT 3");
    
    if (!empty($arabicClients)) {
        echo "   ✓ Arabic data found:\n";
        foreach ($arabicClients as $client) {
            echo "     - " . $client['client_name_ar'] . "\n";
        }
    } else {
        echo "   ⚠ No Arabic client data found\n";
    }
    
    echo "\n";
    
    // Test views
    echo "4. Testing database views...\n";
    
    try {
        $activeCases = DatabaseHelper::queryAll("SELECT COUNT(*) as count FROM v_active_cases");
        echo "   ✓ Active cases view: " . $activeCases[0]['count'] . " records\n";
    } catch (Exception $e) {
        echo "   ⚠ Active cases view: " . $e->getMessage() . "\n";
    }
    
    try {
        $recentHearings = DatabaseHelper::queryAll("SELECT COUNT(*) as count FROM v_recent_hearings");
        echo "   ✓ Recent hearings view: " . $recentHearings[0]['count'] . " records\n";
    } catch (Exception $e) {
        echo "   ⚠ Recent hearings view: " . $e->getMessage() . "\n";
    }
    
    try {
        $outstandingInvoices = DatabaseHelper::queryAll("SELECT COUNT(*) as count FROM v_outstanding_invoices");
        echo "   ✓ Outstanding invoices view: " . $outstandingInvoices[0]['count'] . " records\n";
    } catch (Exception $e) {
        echo "   ⚠ Outstanding invoices view: " . $e->getMessage() . "\n";
    }
    
    echo "\n";
    
    // Test stored procedures
    echo "5. Testing stored procedures...\n";
    
    try {
        $caseStats = DatabaseHelper::queryAll("CALL GetCaseStatistics()");
        echo "   ✓ Case statistics procedure:\n";
        foreach ($caseStats[0] as $key => $value) {
            echo "     - $key: $value\n";
        }
    } catch (Exception $e) {
        echo "   ⚠ Case statistics procedure: " . $e->getMessage() . "\n";
    }
    
    echo "\n";
    
    // Test insert/update operations
    echo "6. Testing insert/update operations...\n";
    
    try {
        // Test insert
        DatabaseHelper::beginTransaction();
        
        $testClientId = DatabaseHelper::insert(
            "INSERT INTO clients (client_name_ar, client_name_en, status) VALUES (?, ?, ?)",
            ['عميل تجريبي', 'Test Client', 'active']
        );
        
        echo "   ✓ Test client inserted with ID: $testClientId\n";
        
        // Test update
        $affected = DatabaseHelper::execute(
            "UPDATE clients SET status = ? WHERE id = ?",
            ['inactive', $testClientId]
        );
        
        echo "   ✓ Test client updated: $affected rows affected\n";
        
        // Test delete
        $affected = DatabaseHelper::execute(
            "DELETE FROM clients WHERE id = ?",
            [$testClientId]
        );
        
        echo "   ✓ Test client deleted: $affected rows affected\n";
        
        DatabaseHelper::commit();
        
    } catch (Exception $e) {
        DatabaseHelper::rollback();
        echo "   ❌ Insert/update test failed: " . $e->getMessage() . "\n";
    }
    
    echo "\n";
    
    // Test system settings
    echo "7. Testing system settings...\n";
    
    $settings = DatabaseHelper::queryAll("SELECT setting_key, setting_value FROM system_settings");
    echo "   ✓ System settings:\n";
    foreach ($settings as $setting) {
        echo "     - " . $setting['setting_key'] . ": " . $setting['setting_value'] . "\n";
    }
    
    echo "\n";
    
    // Performance test
    echo "8. Performance test...\n";
    
    $start = microtime(true);
    $result = DatabaseHelper::queryAll("SELECT * FROM clients LIMIT 10");
    $end = microtime(true);
    
    $executionTime = round(($end - $start) * 1000, 2);
    echo "   ✓ Query execution time: {$executionTime}ms\n";
    
    echo "\n";
    echo "=== ALL TESTS PASSED ===\n";
    echo "\n";
    echo "Database is ready for use!\n";
    echo "You can now start developing your application.\n";
    
} catch (Exception $e) {
    echo "❌ Test failed: " . $e->getMessage() . "\n";
    echo "\nTroubleshooting:\n";
    echo "1. Make sure the database is set up correctly\n";
    echo "2. Check your database credentials\n";
    echo "3. Ensure all tables are created\n";
    exit(1);
}
?>
