<?php
echo "Testing API server components...\n";
try {
    // Simulate what api-server.php does
    require_once 'apps/api/src/core/Request.php';
    require_once 'apps/api/src/core/Response.php';
    require_once 'apps/api/src/core/Router.php';
    require_once 'apps/api/src/routes.php';

    echo "✅ All components loaded successfully\n";

    // Create request object
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_SERVER['REQUEST_URI'] = '/api/ping';

    $request = new Request();
    echo "✅ Request object created\n";
    echo "Request path: " . $request->getPath() . "\n";

    // Create router and register routes
    $router = new Router();
    registerRoutes($router);
    echo "✅ Router created and routes registered\n";
    echo "GET routes: " . implode(', ', array_keys($router->routes['GET'])) . "\n";

    // Handle request
    $response = $router->handle($request);
    echo "✅ Request handled successfully\n";

    if ($response) {
        echo "✅ Response received: " . gettype($response) . "\n";
        echo "Response JSON: " . $response->toJson() . "\n";
    } else {
        echo "❌ No response received\n";
    }

    echo "✅ API server simulation completed successfully\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
