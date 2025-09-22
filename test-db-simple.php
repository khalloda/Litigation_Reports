<?php
require_once 'apps/api/src/core/Database.php';
echo "Testing database connection...\n";
try {
    $db = Database::getInstance();
    echo "Database connection successful!\n";
    echo "Connected to: " . Database::DB_NAME . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
