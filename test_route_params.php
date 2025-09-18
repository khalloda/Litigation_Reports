<?php
require_once 'config/config.php';
require_once 'src/Core/Request.php';

echo "=== Testing Route Parameter Extraction ===\n";

// Test 1: Check what the request path is
echo "\n1. Testing request path parsing...\n";
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/api/clients/314';

$request = new Request();
echo "Request method: " . $request->getMethod() . "\n";
echo "Request path: " . $request->getPath() . "\n";

// Test 2: Check route parameters
echo "\n2. Testing route parameters...\n";
$routeParams = $request->getRouteParams();
echo "Route params: " . json_encode($routeParams) . "\n";

$id = $request->getRouteParam('id');
echo "ID from getRouteParam('id'): " . ($id ?: 'NULL') . "\n";

// Test 3: Check if we can manually set route parameters
echo "\n3. Testing manual route parameter setting...\n";
$request->setRouteParams(['id' => '314']);
$id = $request->getRouteParam('id');
echo "ID after manual setting: " . ($id ?: 'NULL') . "\n";

// Test 4: Test the Router to see if it's setting route parameters
echo "\n4. Testing Router route matching...\n";
require_once 'src/Core/Router.php';

$router = new Router();
$request = new Request();

// Add a test route
$router->addRoute('GET', '/api/clients/{id}', function($request) {
    echo "Route matched! ID: " . $request->getRouteParam('id') . "\n";
    return "Route executed";
});

// Test the route
try {
    $response = $router->handle($request);
    echo "Router response: " . $response . "\n";
} catch (Exception $e) {
    echo "Router error: " . $e->getMessage() . "\n";
}
?>

