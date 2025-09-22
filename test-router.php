<?php
echo "Testing Router...\n";
try {
    require_once 'apps/api/src/core/Router.php';
    require_once 'apps/api/src/core/Request.php';
    require_once 'apps/api/src/core/Response.php';
    require_once 'apps/api/src/routes.php';

    echo "All components loaded successfully!\n";

    // Create a mock request
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_SERVER['REQUEST_URI'] = '/api/ping';

    $request = new Request();
    $router = new Router();

    echo "Router created successfully!\n";

    // Register routes
    registerRoutes($router);

    echo "Routes registered successfully!\n";

    // Handle the request
    $response = $router->handle($request);

    if ($response) {
        echo "Response received: " . gettype($response) . "\n";
        echo "✅ Router working correctly\n";
    } else {
        echo "❌ No response from router\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
