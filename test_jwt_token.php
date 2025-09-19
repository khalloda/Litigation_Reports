<?php
require_once 'config/config.php';
require_once 'config/database.php';
require_once 'src/Core/Auth.php';
require_once 'src/Models/User.php';

echo "=== Testing JWT Token Generation and Validation ===\n";

// Test 1: Try to find a user to generate a token for
echo "\n1. Finding a user to test with...\n";
try {
    $user = User::findById(1); // Try to find user with ID 1
    if ($user) {
        echo "Found user: " . $user['username'] . " (ID: " . $user['id'] . ")\n";
        echo "User status: " . $user['status'] . "\n";
    } else {
        echo "No user found with ID 1\n";
        // Try to find any user
        $db = Database::getInstance();
        $users = $db->fetchAll("SELECT * FROM users LIMIT 1");
        if (!empty($users)) {
            $user = $users[0];
            echo "Found user: " . $user['username'] . " (ID: " . $user['id'] . ")\n";
            echo "User status: " . $user['status'] . "\n";
        } else {
            echo "No users found in database\n";
            exit;
        }
    }
} catch (Exception $e) {
    echo "Error finding user: " . $e->getMessage() . "\n";
    exit;
}

// Test 2: Generate a token for the user
echo "\n2. Generating JWT token...\n";
try {
    $token = Auth::generateToken($user);
    echo "Generated token: " . substr($token, 0, 50) . "...\n";
} catch (Exception $e) {
    echo "Error generating token: " . $e->getMessage() . "\n";
    exit;
}

// Test 3: Validate the token
echo "\n3. Validating JWT token...\n";
try {
    $payload = Auth::validateToken($token);
    if ($payload) {
        echo "Token validation successful!\n";
        echo "Payload: " . json_encode($payload) . "\n";
    } else {
        echo "Token validation failed\n";
    }
} catch (Exception $e) {
    echo "Error validating token: " . $e->getMessage() . "\n";
}

// Test 4: Test Auth::check() with the valid token
echo "\n4. Testing Auth::check() with valid token...\n";
$_SERVER['HTTP_AUTHORIZATION'] = 'Bearer ' . $token;
try {
    $authResult = Auth::check();
    echo "Auth::check() result: " . ($authResult ? 'true' : 'false') . "\n";
} catch (Exception $e) {
    echo "Auth::check() error: " . $e->getMessage() . "\n";
}

// Test 5: Test client access with valid token
echo "\n5. Testing client access with valid token...\n";
require_once 'src/Core/Request.php';
require_once 'src/Core/Response.php';
require_once 'src/Controllers/ClientController.php';

$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/api/clients/314';

$request = new Request();
$controller = new ClientController();

try {
    $response = $controller->show($request);
    echo "Response: " . json_encode($response) . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
