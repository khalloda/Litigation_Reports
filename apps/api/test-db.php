<?php

echo "Testing database connection...\n";

try {
    $connection = new mysqli('localhost', 'root', '1234', 'litigation_db');

    if ($connection->connect_error) {
        throw new Exception("Connection failed: " . $connection->connect_error);
    }

    $connection->set_charset('utf8mb4');

    echo "✅ Database connected successfully!\n";

    // Test if we can query
    $result = $connection->query("SELECT 1 as test");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "✅ Query test successful: " . $row['test'] . "\n";

        // Check if users table exists
        $tablesResult = $connection->query("SHOW TABLES LIKE 'users'");
        if ($tablesResult && $tablesResult->num_rows > 0) {
            echo "✅ Users table exists\n";
        } else {
            echo "❌ Users table does not exist\n";
        }

        $tablesResult->free();
    } else {
        echo "❌ Query test failed\n";
    }

    $result->free();
    $connection->close();

} catch (Exception $e) {
    echo "❌ Database connection error: " . $e->getMessage() . "\n";
    echo "Error code: " . $e->getCode() . "\n";
}

echo "Test completed.\n";
