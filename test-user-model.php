<?php
echo "Testing User model...\n";
try {
    require_once 'apps/api/src/models/User.php';

    echo "User model loaded successfully!\n";

    // Test finding a user
    $user = User::findByEmail('admin@litigation.com');

    if ($user) {
        echo "User found: " . $user['email'] . "\n";
        echo "User role: " . $user['role'] . "\n";
        echo "✅ User model working correctly\n";
    } else {
        echo "❌ User not found\n";
        echo "This might be because the database table is empty\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
