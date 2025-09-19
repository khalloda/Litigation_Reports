<?php
// Check table structure
require_once __DIR__ . '/backend/public/config/config.php';
require_once __DIR__ . '/backend/public/config/database.php';

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();

    echo "=== CLIENTS TABLE STRUCTURE ===\n";
    $stmt = $pdo->prepare("DESCRIBE clients");
    $stmt->execute();
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($columns as $column) {
        echo $column['Field'] . " (" . $column['Type'] . ")\n";
    }

    echo "\n=== SAMPLE CLIENTS DATA ===\n";
    $stmt = $pdo->prepare("SELECT * FROM clients LIMIT 3");
    $stmt->execute();
    $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($clients as $client) {
        echo "ID: " . $client['id'] . " - Name: " . ($client['client_name_ar'] ?? 'N/A') . "\n";
    }

    echo "\n=== TOTAL CLIENTS COUNT ===\n";
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM clients");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Total clients: " . $result['count'] . "\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>