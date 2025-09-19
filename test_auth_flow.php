<?php
require_once 'config/config.php';
require_once 'src/Core/Request.php';
require_once 'src/Core/Response.php';
require_once 'src/Core/Auth.php';
require_once 'src/Controllers/ClientController.php';

echo "=== Testing Authentication Flow ===\n";

// Test 1: Check if we can access a client without authentication
echo "\n1. Testing client access without authentication...\n";
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/api/clients/314';
$_SERVER['HTTP_AUTHORIZATION'] = '';

$request = new Request();
$controller = new ClientController();

try {
    $response = $controller->show($request);
    echo "Response: " . json_encode($response) . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

// Test 2: Check if we can access a client with a fake token
echo "\n2. Testing client access with fake token...\n";
$_SERVER['HTTP_AUTHORIZATION'] = 'Bearer fake_token_123';

$request = new Request();
$controller = new ClientController();

try {
    $response = $controller->show($request);
    echo "Response: " . json_encode($response) . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

// Test 3: Check what the Auth::check() method is doing
echo "\n3. Testing Auth::check() method...\n";
try {
    $authResult = Auth::check();
    echo "Auth::check() result: " . ($authResult ? 'true' : 'false') . "\n";
} catch (Exception $e) {
    echo "Auth::check() error: " . $e->getMessage() . "\n";
}

// Test 4: Check the request headers
echo "\n4. Request headers:\n";
$request = new Request();
$headers = $request->getHeaders();
foreach ($headers as $key => $value) {
    echo "  $key: $value\n";
}

// Test 5: Check if we can get the authorization header
echo "\n5. Authorization header:\n";
echo "  Authorization: " . ($request->getHeader('Authorization') ?: 'Not set') . "\n";
?>

