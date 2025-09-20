<?php
// Check hearings table structure
require_once __DIR__ . '/backend/public/config/config.php';
require_once __DIR__ . '/backend/public/config/database.php';

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();

    echo "=== HEARINGS TABLE STRUCTURE ===\n";
    $stmt = $pdo->prepare("DESCRIBE hearings");
    $stmt->execute();
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($columns as $column) {
        echo $column['Field'] . " (" . $column['Type'] . ")\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>