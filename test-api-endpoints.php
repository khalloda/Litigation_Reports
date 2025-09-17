<?php
/**
 * Test API Endpoints
 * Tests the production API endpoints directly
 */

echo "🧪 Testing Production API Endpoints...\n\n";

// Test 1: Health Check
echo "1. Testing Health Check...\n";
$response = file_get_contents('http://lit.local/api/ping');
if ($response) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "   ✅ Health check successful\n";
        echo "   📊 Response: " . json_encode($data) . "\n";
    } else {
        echo "   ❌ Health check failed - Invalid response\n";
    }
} else {
    echo "   ❌ Health check failed - No response\n";
}

echo "\n";

// Test 2: API Root
echo "2. Testing API Root...\n";
$response = file_get_contents('http://lit.local/api/');
if ($response) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "   ✅ API root successful\n";
        echo "   📊 Response: " . json_encode($data) . "\n";
    } else {
        echo "   ❌ API root failed - Invalid response\n";
    }
} else {
    echo "   ❌ API root failed - No response\n";
}

echo "\n";

// Test 3: Cases Endpoint
echo "3. Testing Cases Endpoint...\n";
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => 'Content-Type: application/json'
    ]
]);
$response = file_get_contents('http://lit.local/api/cases', false, $context);
if ($response) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "   ✅ Cases endpoint successful\n";
        echo "   📊 Response: " . json_encode($data) . "\n";
    } else {
        echo "   ❌ Cases endpoint failed - Invalid response\n";
    }
} else {
    echo "   ❌ Cases endpoint failed - No response\n";
}

echo "\n";

// Test 4: Login Endpoint
echo "4. Testing Login Endpoint...\n";
$postData = json_encode([
    'email' => 'admin@litigation.com',
    'password' => 'admin123'
]);
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $postData
    ]
]);
$response = file_get_contents('http://lit.local/api/auth/login', false, $context);
if ($response) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "   ✅ Login endpoint successful\n";
        echo "   📊 Response: " . json_encode($data) . "\n";
    } else {
        echo "   ❌ Login endpoint failed - Invalid response\n";
    }
} else {
    echo "   ❌ Login endpoint failed - No response\n";
}

echo "\n🎉 API endpoint testing completed!\n";
?>