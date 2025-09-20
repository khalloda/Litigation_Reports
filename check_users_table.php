<?php
// Check if users table exists
require_once __DIR__ . '/backend/public/config/config.php';
require_once __DIR__ . '/backend/public/config/database.php';

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();

    echo "=== Checking for USERS table ===\n";

    // Check if users table exists
    $stmt = $pdo->prepare("SHOW TABLES LIKE 'users'");
    $stmt->execute();
    $result = $stmt->fetch();

    if ($result) {
        echo "USERS table exists!\n";

        echo "\n=== USERS TABLE STRUCTURE ===\n";
        $stmt = $pdo->prepare("DESCRIBE users");
        $stmt->execute();
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($columns as $column) {
            echo $column['Field'] . " (" . $column['Type'] . ")\n";
        }
    } else {
        echo "USERS table does NOT exist!\n";

        echo "\n=== All available tables ===\n";
        $stmt = $pdo->prepare("SHOW TABLES");
        $stmt->execute();
        $tables = $stmt->fetchAll(PDO::FETCH_NUM);

        foreach ($tables as $table) {
            echo $table[0] . "\n";
        }
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>