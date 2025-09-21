<?php
/**
 * Litigation Management System - Main Entry Point
 *
 * This is the main entry point for the PHP backend API.
 * It handles routing, CORS, and initializes the application.
 */

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle preflight OPTIONS requests first
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    http_response_code(200);
    exit();
}

// Handle API requests
if (strpos($_SERVER['REQUEST_URI'], '/api/') === 0) {
    // Set headers for CORS and JSON responses
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');

    // Remove /api prefix and forward to the actual API handler
    $_SERVER['REQUEST_URI'] = substr($_SERVER['REQUEST_URI'], 4);
    require_once __DIR__ . '/../api/index.php';
    exit();
}

// For non-API requests, serve the React app
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $path;

// Check if file exists and serve it
if ($path !== '/' && file_exists($file) && !is_dir($file)) {
    // Serve static files with appropriate content type
    $extension = pathinfo($file, PATHINFO_EXTENSION);
    switch ($extension) {
        case 'css':
            header('Content-Type: text/css');
            break;
        case 'js':
            header('Content-Type: application/javascript');
            break;
        case 'json':
            header('Content-Type: application/json');
            break;
        case 'html':
            header('Content-Type: text/html');
            break;
        default:
            // Let the browser determine content type
            break;
    }
    readfile($file);
    exit();
}

// For all other requests, serve the main React app
header('Content-Type: text/html');
readfile(__DIR__ . '/index.html');
