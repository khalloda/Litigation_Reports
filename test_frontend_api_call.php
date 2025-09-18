<?php
require_once 'config/config.php';
require_once 'config/database.php';
require_once 'src/Core/Request.php';
require_once 'src/Core/Response.php';
require_once 'src/Core/Auth.php';
require_once 'src/Models/User.php';
require_once 'src/Models/Client.php';
require_once 'src/Controllers/ClientController.php';

echo "=== Testing Frontend API Call Simulation ===\n";

// Step 1: Generate a valid JWT token
echo "\n1. Generating valid JWT token...\n";
$user = User::findById(1);
$token = Auth::generateToken($user);
echo "Token generated: " . substr($token, 0, 50) . "...\n";

// Step 2: Simulate the exact request the frontend would make
echo "\n2. Simulating frontend API request...\n";
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/api/clients/314';
$_SERVER['HTTP_AUTHORIZATION'] = 'Bearer ' . $token;
$_SERVER['HTTP_HOST'] = 'localhost:8000';
$_SERVER['HTTP_ACCEPT'] = 'application/json';
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// Step 3: Create request object and test authentication
echo "\n3. Testing authentication...\n";
$request = new Request();
echo "Request method: " . $request->getMethod() . "\n";
echo "Request path: " . $request->getPath() . "\n";
echo "Authorization header: " . $request->getHeader('Authorization') . "\n";

$authResult = Auth::check();
echo "Auth::check() result: " . ($authResult ? 'true' : 'false') . "\n";

// Step 4: Test the Router directly
echo "\n4. Testing Router directly...\n";
require_once 'src/Core/Router.php';

$router = new Router();
$request = new Request();

// Add the client route
$router->get('/api/clients/{id}', 'ClientController@show');

try {
    $response = $router->handle($request);
    echo "Router response type: " . gettype($response) . "\n";
    
    if (method_exists($response, 'getData')) {
        echo "Router response data: " . json_encode($response->getData()) . "\n";
    } else {
        echo "Router response: " . json_encode($response) . "\n";
    }
} catch (Exception $e) {
    echo "Router error: " . $e->getMessage() . "\n";
}

// Step 5: Test the ClientController directly
echo "\n5. Testing ClientController directly...\n";
$request = new Request();
$controller = new ClientController();

try {
    $response = $controller->show($request);
    echo "Controller response type: " . gettype($response) . "\n";
    
    if (method_exists($response, 'getData')) {
        echo "Controller response data: " . json_encode($response->getData()) . "\n";
    } else {
        echo "Controller response: " . json_encode($response) . "\n";
    }
} catch (Exception $e) {
    echo "Controller error: " . $e->getMessage() . "\n";
}

// Step 6: Check route parameters
echo "\n6. Checking route parameters...\n";
$routeParams = $request->getRouteParams();
echo "Route params: " . json_encode($routeParams) . "\n";
$id = $request->getRouteParam('id');
echo "ID from getRouteParam('id'): " . ($id ?: 'NULL') . "\n";
?>
