<?php
/**
 * Router for PHP Built-in Server
 * Routes API requests to the appropriate handler
 */

$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);

// Route API requests
if (strpos($path, '/api/') === 0) {
    // Remove /api prefix
    $apiPath = substr($path, 4);
    
    // Set the path for the API handler
    $_SERVER['REQUEST_URI'] = $apiPath;
    
    // Include the API index
    include __DIR__ . '/api/index.php';
    return true;
}

// For non-API requests, serve files normally
return false;
?>
