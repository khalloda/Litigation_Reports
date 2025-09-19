<?php
/**
 * API Server Router for PHP Development Server
 * 
 * This file handles all API routing for the litigation management system.
 */

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

// Get the request path and method
$path = $_SERVER['REQUEST_URI'] ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Remove query string
if (($pos = strpos($path, '?')) !== false) {
    $path = substr($path, 0, $pos);
}

// Remove leading slash
$path = ltrim($path, '/');

// Route API requests
if (strpos($path, 'api/') === 0) {
    // Remove 'api/' prefix
    $apiPath = substr($path, 4);
    
    // Include the API test file which handles all endpoints
    include 'api-test.php';
    exit();
}

// For non-API requests, return 404
http_response_code(404);
echo json_encode([
    'error' => 'Not Found',
    'message' => 'API endpoint not found',
    'path' => $path,
    'method' => $method
]);
?>
