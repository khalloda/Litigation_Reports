<?php
/**
 * Test API Endpoints
 */

function makeRequest($url, $method = 'GET', $headers = [], $body = null) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    if ($headers) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
    
    if ($body) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'body' => $response
    ];
}

echo "Testing API endpoints...\n\n";

// Test 1: Login
echo "1. Testing login endpoint...\n";
$loginResponse = makeRequest(
    'http://localhost:8080/api/auth/login',
    'POST',
    ['Content-Type: application/json'],
    json_encode(['email' => 'admin@litigation.com', 'password' => 'admin123'])
);

echo "   Status: {$loginResponse['code']}\n";
$loginData = json_decode($loginResponse['body'], true);
if ($loginData && isset($loginData['data']['token'])) {
    echo "   ✅ Login successful\n";
    $token = $loginData['data']['token'];
    echo "   Token: " . substr($token, 0, 50) . "...\n";
} else {
    echo "   ❌ Login failed\n";
    echo "   Response: {$loginResponse['body']}\n";
    exit(1);
}

echo "\n";

// Test 2: Get user info
echo "2. Testing /api/auth/me endpoint...\n";
$meResponse = makeRequest(
    'http://localhost:8080/api/auth/me',
    'GET',
    ['Authorization: Bearer ' . $token]
);

echo "   Status: {$meResponse['code']}\n";
$meData = json_decode($meResponse['body'], true);
if ($meData && isset($meData['data']['id'])) {
    echo "   ✅ User info retrieved successfully\n";
    echo "   User: {$meData['data']['name']} ({$meData['data']['email']})\n";
    echo "   Role: {$meData['data']['role']}\n";
} else {
    echo "   ❌ Failed to get user info\n";
    echo "   Response: {$meResponse['body']}\n";
}

echo "\n";

// Test 3: Health check
echo "3. Testing health endpoint...\n";
$healthResponse = makeRequest('http://localhost:8080/api/health');

echo "   Status: {$healthResponse['code']}\n";
$healthData = json_decode($healthResponse['body'], true);
if ($healthData && isset($healthData['status'])) {
    echo "   ✅ Health check successful\n";
    echo "   Status: {$healthData['status']}\n";
} else {
    echo "   ❌ Health check failed\n";
    echo "   Response: {$healthResponse['body']}\n";
}

echo "\n🎉 API testing completed!\n";
?>
