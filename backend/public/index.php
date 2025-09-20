<?php
/**
 * Litigation Management System - Main Entry Point
 *
 * This is the main entry point for the PHP backend API.
 * It handles routing and serves the React SPA.
 */

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if this is an API request
$requestUri = $_SERVER['REQUEST_URI'];
if (strpos($requestUri, '/api/') !== false) {
    // Forward API requests to the API entry point
    require_once __DIR__ . '/api/index.php';
    exit;
}

// For all other requests, serve the React SPA with proper HTML content type
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/index.html');