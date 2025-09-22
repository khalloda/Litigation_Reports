<?php

/**
 * API Server Router for PHP Development Server
 *
 * This file handles all API routing for the litigation management system.
 */

// Import required classes
require_once __DIR__ . '/src/core/Request.php';
require_once __DIR__ . '/src/core/Response.php';
require_once __DIR__ . '/src/core/Router.php';
require_once __DIR__ . '/src/core/Auth.php';
require_once __DIR__ . '/src/middleware/CorsMiddleware.php';

// Import routes configuration
require_once __DIR__ . '/src/routes.php';

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the request path
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Route API requests
if (strpos($path, 'api/') === 0) {
    // Create proper request object for the API path
    $apiPath = substr($path, 4);

    // Use normal routing through Router
    $_SERVER['REQUEST_URI'] = '/' . $apiPath;

    // Create request object
    $request = new Request();

    // Initialize router with all routes and handle request
    $router = new Router();
    registerRoutes($router); // Register routes from routes.php
    $response = $router->handle($request);

    // Output the response
    if ($response) {
        echo $response->toJson();
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Endpoint not found']);
    }
}
