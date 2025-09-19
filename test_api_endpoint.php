<?php
require_once 'config/config.php';
require_once 'config/database.php';
require_once 'src/Core/Request.php';
require_once 'src/Core/Response.php';
require_once 'src/Core/Auth.php';
require_once 'src/Models/User.php';
require_once 'src/Models/Client.php';
require_once 'src/Controllers/ClientController.php';
require_once 'src/Core/Router.php';

echo "=== Testing API Endpoint ===\n";

// Generate a valid JWT token
$user = User::findById(1);
$token = Auth::generateToken($user);
echo "Token: " . substr($token, 0, 50) . "...\n";

// Simulate the exact HTTP request
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/api/clients/314';
$_SERVER['HTTP_AUTHORIZATION'] = 'Bearer ' . $token;
$_SERVER['HTTP_HOST'] = 'localhost:8000';
$_SERVER['SCRIPT_NAME'] = '/api/index.php';

echo "\nRequest URI: " . $_SERVER['REQUEST_URI'] . "\n";
echo "Script Name: " . $_SERVER['SCRIPT_NAME'] . "\n";

// Create request object
$request = new Request();
echo "Parsed path: " . $request->getPath() . "\n";

// Test the Router
$router = new Router();
$router->get('/api/clients/{id}', 'ClientController@show');

try {
    $response = $router->handle($request);
    echo "Router response: " . json_encode($response->getData()) . "\n";
} catch (Exception $e) {
    echo "Router error: " . $e->getMessage() . "\n";
}
