<?php
require_once 'config/config.php';
require_once 'config/database.php';

try {
    $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query('SELECT id, client_name_en, client_name_ar, logo FROM clients ORDER BY id DESC LIMIT 10');

    echo "Recent clients in database:\n";
    echo "ID | English Name | Arabic Name | Logo\n";
    echo "---|--------------|-------------|-----\n";

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['id'] . ' | ' . $row['client_name_en'] . ' | ' . $row['client_name_ar'] . ' | ' . ($row['logo'] ?: 'NULL') . "\n";
    }
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}
