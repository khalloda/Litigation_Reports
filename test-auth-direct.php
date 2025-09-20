<?php
/**
 * Test Auth Class Directly
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/src/Core/Auth.php';
require_once __DIR__ . '/src/Models/User.php';

try {
    echo "Testing Auth class directly...\n";
    
    // Test login
    $email = 'admin@litigation.com';
    $password = 'admin123';
    
    echo "Attempting login with: {$email} / {$password}\n";
    
    $result = Auth::login($email, $password);
    
    if ($result) {
        echo "✅ Login successful!\n";
        echo "Result: " . json_encode($result, JSON_PRETTY_PRINT) . "\n";
    } else {
        echo "❌ Login failed\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
?>
