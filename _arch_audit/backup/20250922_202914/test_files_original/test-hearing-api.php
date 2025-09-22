<?php
/**
 * Test Hearing API Endpoints
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/src/Core/Auth.php';
require_once __DIR__ . '/src/Core/Request.php';
require_once __DIR__ . '/src/Core/Response.php';
require_once __DIR__ . '/src/Core/Validator.php';
require_once __DIR__ . '/src/Models/User.php';
require_once __DIR__ . '/src/Models/Hearing.php';
require_once __DIR__ . '/src/Controllers/HearingController.php';

echo "Testing Hearing API endpoints...\n\n";

// Test authentication first
echo "1. Getting authentication token...\n";
$loginData = [
    'email' => 'admin@litigation.com',
    'password' => 'admin123'
];

$loginResponse = Auth::login($loginData['email'], $loginData['password']);
if ($loginResponse && isset($loginResponse['token'])) {
    echo "   ✅ Login successful\n";
    $token = $loginResponse['token'];
} else {
    echo "   ❌ Login failed\n";
    exit(1);
}

// Test API endpoints
$baseUrl = 'http://localhost:8080';
$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
];

function makeRequest($url, $method = 'GET', $data = null, $headers = []) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'status' => $httpCode,
        'data' => json_decode($response, true)
    ];
}

// Test 1: Get hearings list
echo "\n2. Testing GET /api/hearings...\n";
$response = makeRequest($baseUrl . '/api/hearings', 'GET', null, $headers);
echo "   Status: " . $response['status'] . "\n";
if ($response['status'] === 200) {
    echo "   ✅ Hearings list retrieved successfully\n";
    if (isset($response['data']['data']['data'])) {
        echo "   Total hearings: " . count($response['data']['data']['data']) . "\n";
    }
} else {
    echo "   ❌ Failed to retrieve hearings list\n";
    echo "   Response: " . json_encode($response['data']) . "\n";
}

// Test 2: Get hearing options
echo "\n3. Testing GET /api/hearings/options...\n";
$response = makeRequest($baseUrl . '/api/hearings/options', 'GET', null, $headers);
echo "   Status: " . $response['status'] . "\n";
if ($response['status'] === 200) {
    echo "   ✅ Hearing options retrieved successfully\n";
    if (isset($response['data']['data']['result'])) {
        echo "   Result options: " . count($response['data']['data']['result']) . " items\n";
    }
    if (isset($response['data']['data']['type'])) {
        echo "   Type options: " . count($response['data']['data']['type']) . " items\n";
    }
} else {
    echo "   ❌ Failed to retrieve hearing options\n";
}

// Test 3: Get hearing statistics
echo "\n4. Testing GET /api/hearings/stats...\n";
$response = makeRequest($baseUrl . '/api/hearings/stats', 'GET', null, $headers);
echo "   Status: " . $response['status'] . "\n";
if ($response['status'] === 200) {
    echo "   ✅ Hearing statistics retrieved successfully\n";
    if (isset($response['data']['data']['total'])) {
        echo "   Total hearings: " . $response['data']['data']['total'] . "\n";
    }
} else {
    echo "   ❌ Failed to retrieve hearing statistics\n";
}

// Test 4: Create a new hearing
echo "\n5. Testing POST /api/hearings (create new hearing)...\n";
$hearingData = [
    'case_id' => 1702, // Use existing case
    'hearing_date' => '2025-09-20',
    'hearing_type' => 'initial',
    'hearing_result' => 'pending',
    'hearing_duration' => '2hours',
    'hearing_decision' => 'جلسة أولى للقضية',
    'court_notes' => 'ملاحظات المحكمة',
    'lawyer_notes' => 'ملاحظات المحامي'
];

$response = makeRequest($baseUrl . '/api/hearings', 'POST', $hearingData, $headers);
echo "   Status: " . $response['status'] . "\n";
if ($response['status'] === 201) {
    echo "   ✅ Hearing created successfully\n";
    if (isset($response['data']['data']['id'])) {
        echo "   Hearing ID: " . $response['data']['data']['id'] . "\n";
        $hearingId = $response['data']['data']['id'];
    }
} else {
    echo "   ❌ Failed to create hearing\n";
    echo "   Response: " . json_encode($response['data']) . "\n";
}

// Test 5: Get specific hearing
if (isset($hearingId)) {
    echo "\n6. Testing GET /api/hearings/{id}...\n";
    $response = makeRequest($baseUrl . '/api/hearings/' . $hearingId, 'GET', null, $headers);
    echo "   Status: " . $response['status'] . "\n";
    if ($response['status'] === 200) {
        echo "   ✅ Hearing retrieved successfully\n";
        if (isset($response['data']['data']['hearing_decision'])) {
            echo "   Hearing decision: " . $response['data']['data']['hearing_decision'] . "\n";
        }
    } else {
        echo "   ❌ Failed to retrieve hearing\n";
    }
}

// Test 6: Get upcoming hearings
echo "\n7. Testing GET /api/hearings/upcoming...\n";
$response = makeRequest($baseUrl . '/api/hearings/upcoming', 'GET', null, $headers);
echo "   Status: " . $response['status'] . "\n";
if ($response['status'] === 200) {
    echo "   ✅ Upcoming hearings retrieved successfully\n";
    if (isset($response['data']['data']['data'])) {
        echo "   Upcoming hearings: " . count($response['data']['data']['data']) . "\n";
    }
} else {
    echo "   ❌ Failed to retrieve upcoming hearings\n";
}

echo "\n🎉 Hearing API testing completed!\n";
?>
