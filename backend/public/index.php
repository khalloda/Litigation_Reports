<?php
/**
 * Litigation Management System - Main Entry Point
 *
 * This serves both the React frontend and handles API routes.
 */

// Get the request URI and method
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query string from URI
$path = parse_url($requestUri, PHP_URL_PATH);

// Check if this is an API request
if (strpos($path, '/api/') === 0) {
    // Handle API requests

    // Set JSON response headers
    header('Content-Type: application/json; charset=utf-8');

    // Enable error reporting for development
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    // Set timezone
    date_default_timezone_set('Asia/Riyadh');

    // Include configuration and API handlers from the api directory
    require_once __DIR__ . '/../api/index.php';
    exit;
} else {
    // Serve static React app files

    // Check if requesting a static asset
    $publicFile = __DIR__ . $path;

    if ($path !== '/' && file_exists($publicFile) && is_file($publicFile)) {
        // Serve the static file with appropriate content type
        $extension = pathinfo($publicFile, PATHINFO_EXTENSION);

        switch ($extension) {
            case 'css':
                header('Content-Type: text/css');
                break;
            case 'js':
                header('Content-Type: application/javascript');
                break;
            case 'png':
                header('Content-Type: image/png');
                break;
            case 'jpg':
            case 'jpeg':
                header('Content-Type: image/jpeg');
                break;
            case 'svg':
                header('Content-Type: image/svg+xml');
                break;
            case 'woff':
            case 'woff2':
                header('Content-Type: font/woff2');
                break;
            default:
                header('Content-Type: text/plain');
        }

        readfile($publicFile);
        exit;
    } else {
        // Serve the React app's index.html for all other routes (SPA routing)
        header('Content-Type: text/html; charset=utf-8');
        readfile(__DIR__ . '/index.html');
        exit;
    }
}
?>