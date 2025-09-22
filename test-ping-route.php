<?php
echo "Testing ping route directly...\n";
try {
    require_once 'apps/api/src/routes.php';

    echo "Routes loaded successfully!\n";

    // Create a simple router to test the ping route
    require_once 'apps/api/src/core/Router.php';
    $router = new Router();

    // Manually register the ping route
    $router->get('/ping', function () {
        return [
            'success' => true,
            'message' => 'Litigation Management API',
            'timestamp' => time(),
            'version' => '2.0.0'
        ];
    });

    echo "Ping route registered manually\n";

    // Check what routes are registered
    echo "GET routes count: " . count($router->routes['GET']) . "\n";

    // Test the route directly
    $handler = $router->routes['GET']['/ping'] ?? null;
    if ($handler) {
        echo "✅ Ping route handler found\n";
        $result = call_user_func($handler);
        echo "✅ Ping route executed successfully\n";
        echo "Result: " . json_encode($result) . "\n";
    } else {
        echo "❌ Ping route handler not found\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
