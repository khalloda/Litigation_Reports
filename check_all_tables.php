<?php
// Check all table structures
require_once __DIR__ . '/backend/public/config/config.php';
require_once __DIR__ . '/backend/public/config/database.php';

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();

    $tables = ['clients', 'cases', 'hearings', 'invoices', 'lawyers'];

    foreach ($tables as $table) {
        echo "\n=== $table TABLE STRUCTURE ===\n";
        $stmt = $pdo->prepare("DESCRIBE $table");
        $stmt->execute();
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($columns as $column) {
            echo $column['Field'] . " (" . $column['Type'] . ")\n";
        }

        echo "\n=== $table SAMPLE DATA ===\n";
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM $table");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "Total records: " . $result['count'] . "\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>