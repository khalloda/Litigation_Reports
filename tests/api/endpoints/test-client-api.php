<?php
/**
 * Test Client API Endpoints
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

echo "Testing Client API endpoints...\n\n";

// First, get authentication token
echo "1. Getting authentication token...\n";
$loginResponse = makeRequest(
    'http://localhost:8080/api/auth/login',
    'POST',
    ['Content-Type: application/json'],
    json_encode(['email' => 'admin@litigation.com', 'password' => 'admin123'])
);

$loginData = json_decode($loginResponse['body'], true);
if ($loginData && isset($loginData['data']['token'])) {
    echo "   ✅ Login successful\n";
    $token = $loginData['data']['token'];
} else {
    echo "   ❌ Login failed\n";
    echo "   Response: {$loginResponse['body']}\n";
    exit(1);
}

echo "\n";

// Test 2: Get clients list
echo "2. Testing GET /api/clients...\n";
$clientsResponse = makeRequest(
    'http://localhost:8080/api/clients',
    'GET',
    ['Authorization: Bearer ' . $token]
);

echo "   Status: {$clientsResponse['code']}\n";
$clientsData = json_decode($clientsResponse['body'], true);
if ($clientsData && isset($clientsData['data'])) {
    echo "   ✅ Clients list retrieved successfully\n";
    echo "   Total clients: {$clientsData['data']['pagination']['total']}\n";
} else {
    echo "   ❌ Failed to get clients list\n";
    echo "   Response: {$clientsResponse['body']}\n";
}

echo "\n";

// Test 3: Get client options
echo "3. Testing GET /api/clients/options...\n";
$optionsResponse = makeRequest(
    'http://localhost:8080/api/clients/options',
    'GET',
    ['Authorization: Bearer ' . $token]
);

echo "   Status: {$optionsResponse['code']}\n";
$optionsData = json_decode($optionsResponse['body'], true);
if ($optionsData && isset($optionsData['data']['status'])) {
    echo "   ✅ Client options retrieved successfully\n";
    echo "   Status options: " . count($optionsData['data']['status']) . " items\n";
    echo "   Type options: " . count($optionsData['data']['type']) . " items\n";
} else {
    echo "   ❌ Failed to get client options\n";
    echo "   Response: {$optionsResponse['body']}\n";
}

echo "\n";

// Test 4: Get client statistics
echo "4. Testing GET /api/clients/stats...\n";
$statsResponse = makeRequest(
    'http://localhost:8080/api/clients/stats',
    'GET',
    ['Authorization: Bearer ' . $token]
);

echo "   Status: {$statsResponse['code']}\n";
$statsData = json_decode($statsResponse['body'], true);
if ($statsData && isset($statsData['data']['total'])) {
    echo "   ✅ Client statistics retrieved successfully\n";
    echo "   Total clients: {$statsData['data']['total']}\n";
} else {
    echo "   ❌ Failed to get client statistics\n";
    echo "   Response: {$statsResponse['body']}\n";
}

echo "\n";

// Test 5: Get active clients
echo "5. Testing GET /api/clients/active...\n";
$activeResponse = makeRequest(
    'http://localhost:8080/api/clients/active',
    'GET',
    ['Authorization: Bearer ' . $token]
);

echo "   Status: {$activeResponse['code']}\n";
$activeData = json_decode($activeResponse['body'], true);
if ($activeData && isset($activeData['data'])) {
    echo "   ✅ Active clients retrieved successfully\n";
    echo "   Active clients: {$activeData['data']['pagination']['total']}\n";
} else {
    echo "   ❌ Failed to get active clients\n";
    echo "   Response: {$activeResponse['body']}\n";
}

echo "\n";

// Test 6: Get clients for select
echo "6. Testing GET /api/clients/for-select...\n";
$selectResponse = makeRequest(
    'http://localhost:8080/api/clients/for-select',
    'GET',
    ['Authorization: Bearer ' . $token]
);

echo "   Status: {$selectResponse['code']}\n";
$selectData = json_decode($selectResponse['body'], true);
if ($selectData && isset($selectData['data'])) {
    echo "   ✅ Clients for select retrieved successfully\n";
    echo "   Available clients: " . count($selectData['data']) . " items\n";
} else {
    echo "   ❌ Failed to get clients for select\n";
    echo "   Response: {$selectResponse['body']}\n";
}

echo "\n";

// Test 7: Get specific client
echo "7. Testing GET /api/clients/1...\n";
$clientResponse = makeRequest(
    'http://localhost:8080/api/clients/1',
    'GET',
    ['Authorization: Bearer ' . $token]
);

echo "   Status: {$clientResponse['code']}\n";
$clientData = json_decode($clientResponse['body'], true);
if ($clientData && isset($clientData['data']['id'])) {
    echo "   ✅ Client retrieved successfully\n";
    echo "   Client: {$clientData['data']['client_name_ar']}\n";
    echo "   Cases count: {$clientData['data']['cases_count']}\n";
} else {
    echo "   ❌ Failed to get client\n";
    echo "   Response: {$clientResponse['body']}\n";
}

echo "\n🎉 Client API testing completed!\n";
?>
