<?php
/**
 * Frontend Entry Point with API Routing
 * Serves React SPA and routes API calls to backend
 */

// Get the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$requestPath = parse_url($requestUri, PHP_URL_PATH);

// Check if this is an API request
if (strpos($requestPath, '/api/') === 0) {
    // Route API requests to the backend API
    include __DIR__ . '/../api/index.php';
    exit;
}

// For all other requests, serve the React SPA
$indexPath = __DIR__ . '/index.html';

if (file_exists($indexPath)) {
    // Set proper headers for HTML
    header('Content-Type: text/html; charset=utf-8');
    readfile($indexPath);
} else {
    // Fallback error
    http_response_code(404);
    echo '<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>Application Not Found</h1><p>The frontend application files are missing.</p></body></html>';
}
?>