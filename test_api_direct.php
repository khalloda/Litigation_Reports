<?php
// Test API endpoint directly
require_once __DIR__ . '/backend/public/config/config.php';
require_once __DIR__ . '/backend/public/config/database.php';

try {
    // Test database connection
    $db = Database::getInstance();
    $pdo = $db->getConnection();

    echo "Database connection: SUCCESS\n";

    // Test a simple query
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM clients WHERE is_active = 1");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo "Clients count query: " . $result['count'] . " clients found\n";

    echo "Database tests completed successfully!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>