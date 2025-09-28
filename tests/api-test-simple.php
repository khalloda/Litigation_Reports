<?php
// Simple API test script
require_once __DIR__ . '/../backend/api/_bootstrap.php';
require_once __DIR__ . '/../backend/api/db.php';

echo "Testing Database Class...\n\n";

try {
    $db = Database::getInstance();
    echo "✅ Database instance created successfully\n";

    // Test a simple query
    $clients = $db->fetchAll("SELECT id, client_name_ar, client_name_en FROM clients LIMIT 3");
    echo "✅ Query executed successfully\n";
    echo "Found " . count($clients) . " clients:\n";

    foreach ($clients as $client) {
        echo "  - ID: {$client['id']}, Name AR: {$client['client_name_ar']}, Name EN: {$client['client_name_en']}\n";
    }

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\nDone.\n";
?>