<?php
/**
 * Add missing fields to clients table
 */

echo "=== Adding Missing Client Fields ===\n\n";

// Load local configuration
$config = require_once 'config.local.php';
$host = $config['host'];
$username = $config['username'];
$password = $config['password'];
$database = $config['database'];

try {
    // Connect to database
    echo "1. Connecting to database...\n";
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "   ✓ Connected successfully\n\n";

    // Add missing columns to clients table
    echo "2. Adding missing columns to clients table...\n";

    // Check if columns already exist
    $result = $pdo->query("SHOW COLUMNS FROM clients LIKE 'email'");
    if ($result->rowCount() == 0) {
        $pdo->exec("ALTER TABLE clients ADD COLUMN email VARCHAR(200) NULL AFTER contact_lawyer");
        echo "   ✓ Added email column\n";
    } else {
        echo "   ✓ Email column already exists\n";
    }

    $result = $pdo->query("SHOW COLUMNS FROM clients LIKE 'phone'");
    if ($result->rowCount() == 0) {
        $pdo->exec("ALTER TABLE clients ADD COLUMN phone VARCHAR(50) NULL AFTER email");
        echo "   ✓ Added phone column\n";
    } else {
        echo "   ✓ Phone column already exists\n";
    }

    $result = $pdo->query("SHOW COLUMNS FROM clients LIKE 'address_ar'");
    if ($result->rowCount() == 0) {
        $pdo->exec("ALTER TABLE clients ADD COLUMN address_ar TEXT NULL AFTER phone");
        echo "   ✓ Added address_ar column\n";
    } else {
        echo "   ✓ Address_ar column already exists\n";
    }

    $result = $pdo->query("SHOW COLUMNS FROM clients LIKE 'address_en'");
    if ($result->rowCount() == 0) {
        $pdo->exec("ALTER TABLE clients ADD COLUMN address_en TEXT NULL AFTER address_ar");
        echo "   ✓ Added address_en column\n";
    } else {
        echo "   ✓ Address_en column already exists\n";
    }

    $result = $pdo->query("SHOW COLUMNS FROM clients LIKE 'notes_ar'");
    if ($result->rowCount() == 0) {
        $pdo->exec("ALTER TABLE clients ADD COLUMN notes_ar TEXT NULL AFTER address_en");
        echo "   ✓ Added notes_ar column\n";
    } else {
        echo "   ✓ Notes_ar column already exists\n";
    }

    $result = $pdo->query("SHOW COLUMNS FROM clients LIKE 'notes_en'");
    if ($result->rowCount() == 0) {
        $pdo->exec("ALTER TABLE clients ADD COLUMN notes_en TEXT NULL AFTER notes_ar");
        echo "   ✓ Added notes_en column\n";
    } else {
        echo "   ✓ Notes_en column already exists\n";
    }

    echo "\n3. Database schema updated successfully!\n";
    echo "   ✓ All missing client fields have been added\n\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}