<?php
/**
 * Simple API Test
 * Tests the API by including the files directly
 */

echo "🧪 Testing API Directly...\n\n";

// Test 1: Test bootstrap
echo "1. Testing Bootstrap...\n";
try {
    require_once 'public_html/api/_bootstrap.php';
    echo "   ✅ Bootstrap loaded successfully\n";
} catch (Exception $e) {
    echo "   ❌ Bootstrap failed: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 2: Test database connection
echo "2. Testing Database Connection...\n";
try {
    require_once 'public_html/api/db.php';
    $db = Database::getInstance();
    echo "   ✅ Database connection successful\n";
} catch (Exception $e) {
    echo "   ❌ Database connection failed: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 3: Test ping endpoint
echo "3. Testing Ping Endpoint...\n";
try {
    require_once 'public_html/api/ping.php';
    echo "   ✅ Ping endpoint loaded successfully\n";
} catch (Exception $e) {
    echo "   ❌ Ping endpoint failed: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 4: Test API router
echo "4. Testing API Router...\n";
try {
    // Simulate a request
    $_SERVER['REQUEST_URI'] = '/api/ping';
    $_SERVER['REQUEST_METHOD'] = 'GET';
    
    ob_start();
    require_once 'public_html/api/index.php';
    $output = ob_get_clean();
    
    if ($output) {
        $data = json_decode($output, true);
        if ($data && isset($data['success'])) {
            echo "   ✅ API router working\n";
            echo "   📊 Response: " . $output . "\n";
        } else {
            echo "   ❌ API router failed - Invalid response\n";
        }
    } else {
        echo "   ❌ API router failed - No output\n";
    }
} catch (Exception $e) {
    echo "   ❌ API router failed: " . $e->getMessage() . "\n";
}

echo "\n🎉 API testing completed!\n";
?>
