<?php
/**
 * Test Case API Endpoints
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

echo "Testing Case API endpoints...\n\n";

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

// Test 2: Get cases list
echo "2. Testing GET /api/cases...\n";
$casesResponse = makeRequest(
    'http://localhost:8080/api/cases',
    'GET',
    ['Authorization: Bearer ' . $token]
);

echo "   Status: {$casesResponse['code']}\n";
$casesData = json_decode($casesResponse['body'], true);
if ($casesData && isset($casesData['data'])) {
    echo "   ✅ Cases list retrieved successfully\n";
    echo "   Total cases: {$casesData['data']['pagination']['total']}\n";
} else {
    echo "   ❌ Failed to get cases list\n";
    echo "   Response: {$casesResponse['body']}\n";
}

echo "\n";

// Test 3: Get case options
echo "3. Testing GET /api/cases/options...\n";
$optionsResponse = makeRequest(
    'http://localhost:8080/api/cases/options',
    'GET',
    ['Authorization: Bearer ' . $token]
);

echo "   Status: {$optionsResponse['code']}\n";
$optionsData = json_decode($optionsResponse['body'], true);
if ($optionsData && isset($optionsData['data']['status'])) {
    echo "   ✅ Case options retrieved successfully\n";
    echo "   Status options: " . count($optionsData['data']['status']) . " items\n";
    echo "   Category options: " . count($optionsData['data']['category']) . " items\n";
} else {
    echo "   ❌ Failed to get case options\n";
    echo "   Response: {$optionsResponse['body']}\n";
}

echo "\n";

// Test 4: Get case statistics
echo "4. Testing GET /api/cases/stats...\n";
$statsResponse = makeRequest(
    'http://localhost:8080/api/cases/stats',
    'GET',
    ['Authorization: Bearer ' . $token]
);

echo "   Status: {$statsResponse['code']}\n";
$statsData = json_decode($statsResponse['body'], true);
if ($statsData && isset($statsData['data']['total'])) {
    echo "   ✅ Case statistics retrieved successfully\n";
    echo "   Total cases: {$statsData['data']['total']}\n";
} else {
    echo "   ❌ Failed to get case statistics\n";
    echo "   Response: {$statsResponse['body']}\n";
}

echo "\n";

// Test 5: Create a new case
echo "5. Testing POST /api/cases (create new case)...\n";
$newCaseData = [
    'client_id' => 1,
    'matter_ar' => 'قضية تجريبية جديدة',
    'matter_en' => 'New Test Case',
    'matter_subject' => 'This is a test case created via API',
    'matter_status' => 'active',
    'matter_category' => 'civil',
    'matter_importance' => 'medium',
    'matter_court' => 'محكمة النقض',
    'matter_start_date' => date('Y-m-d')
];

$createResponse = makeRequest(
    'http://localhost:8080/api/cases',
    'POST',
    ['Content-Type: application/json', 'Authorization: Bearer ' . $token],
    json_encode($newCaseData)
);

echo "   Status: {$createResponse['code']}\n";
$createData = json_decode($createResponse['body'], true);
if ($createData && isset($createData['data']['id'])) {
    echo "   ✅ Case created successfully\n";
    echo "   Case ID: {$createData['data']['id']}\n";
    echo "   Matter ID: {$createData['data']['matter_id']}\n";
    $createdCaseId = $createData['data']['id'];
} else {
    echo "   ❌ Failed to create case\n";
    echo "   Response: {$createResponse['body']}\n";
    $createdCaseId = null;
}

echo "\n";

// Test 6: Get specific case (if created)
if ($createdCaseId) {
    echo "6. Testing GET /api/cases/{$createdCaseId}...\n";
    $caseResponse = makeRequest(
        "http://localhost:8080/api/cases/{$createdCaseId}",
        'GET',
        ['Authorization: Bearer ' . $token]
    );

    echo "   Status: {$caseResponse['code']}\n";
    $caseData = json_decode($caseResponse['body'], true);
    if ($caseData && isset($caseData['data']['id'])) {
        echo "   ✅ Case retrieved successfully\n";
        echo "   Case: {$caseData['data']['matter_ar']}\n";
    } else {
        echo "   ❌ Failed to get case\n";
        echo "   Response: {$caseResponse['body']}\n";
    }
}

echo "\n🎉 Case API testing completed!\n";
?>
