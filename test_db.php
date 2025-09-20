<?php
// Test database connection
$host = 'localhost';
$port = '3306';
$dbname = 'litigation_db';
$user = 'root';
$pass = '1234';

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass);
    echo "Database connection successful with password '1234'\n";
} catch (PDOException $e) {
    echo "Database connection failed with password '1234': " . $e->getMessage() . "\n";

    // Try with empty password
    try {
        $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, '');
        echo "Database connection successful with empty password\n";
    } catch (PDOException $e2) {
        echo "Database connection failed with empty password: " . $e2->getMessage() . "\n";
    }
}
?>