<?php
// Simple router for development server
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// API routes - MUST be handled first before any static files
if (strpos($uri, '/api/') === 0) {
    // Set proper headers for API
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    // Handle preflight OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    // Remove /api prefix and adjust server variables
    $apiPath = substr($uri, 4); // Remove '/api'
    if (empty($apiPath)) {
        $apiPath = '/';
    }

    // Update server variables for API routing
    $_SERVER['REQUEST_URI'] = $apiPath;
    $_SERVER['SCRIPT_NAME'] = '/index.php';
    $_SERVER['PHP_SELF'] = '/index.php';

    // Include the API handler
    require_once __DIR__ . '/api/index.php';
    exit; // Important: prevent further processing
}

// Handle root path
if ($uri === '/') {
    $uri = '/index.html';
}

// Static file serving
$file = __DIR__ . '/public' . $uri;

// Debug logging
error_log("Serving file request: $uri -> $file");

// If file exists, serve it directly
if (file_exists($file) && !is_dir($file)) {
    error_log("Serving static file: $file");

    // Determine content type
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $contentTypes = [
        'html' => 'text/html; charset=UTF-8',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon'
    ];

    if (isset($contentTypes[$ext])) {
        header('Content-Type: ' . $contentTypes[$ext]);
    }

    readfile($file);
    exit;
}

// For all other routes (SPA routing), serve index.html
$indexFile = __DIR__ . '/public/index.html';
error_log("Checking index file: $indexFile - exists: " . (file_exists($indexFile) ? 'yes' : 'no'));

if (file_exists($indexFile)) {
    error_log("Serving SPA index.html");
    header('Content-Type: text/html; charset=UTF-8');
    readfile($indexFile);
} else {
    error_log("Index file not found: $indexFile");
    http_response_code(404);
    echo '404 - File not found: ' . $indexFile;
}
?>