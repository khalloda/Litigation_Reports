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

// Set headers for CORS and JSON responses
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3001');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include the application bootstrap
require_once __DIR__ . '/../bootstrap/app.php';

// Initialize and run the application
try {
    $app = new App();
    $app->run();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Internal server error',
        'details' => $e->getMessage()
    ]);
}
