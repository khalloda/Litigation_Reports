<?php

/**
 * Simple Router for PHP Development Server
 */

$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);

// Handle API routes
if (strpos($path, '/api/') === 0) {
    // Include the proper API endpoint
    include 'api/index.php';
    return true;
}

// Handle static files
if (file_exists(__DIR__ . $path)) {
    return false; // Let the server handle it
}

// Handle SPA routes - serve index.html
if (strpos($path, '/src/') !== 0 && strpos($path, '/node_modules/') !== 0) {
    include 'index.html';
    return true;
}

return false;
