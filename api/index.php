<?php
/**
 * Litigation Management System - API Entry Point
 * 
 * This file serves as the main entry point for the API.
 * It handles routing, authentication, and request processing.
 */

// Enable CORS for development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set timezone
date_default_timezone_set('Asia/Riyadh');

// Start session
session_start();

// Autoloader not needed for this simple setup

// Include configuration
require_once __DIR__ . '/../config/config.php';

// Include database connection (MySQL)
require_once __DIR__ . '/../config/database.php';

// Include core classes
require_once __DIR__ . '/../src/Core/Router.php';
require_once __DIR__ . '/../src/Core/Request.php';
require_once __DIR__ . '/../src/Core/Response.php';
require_once __DIR__ . '/../src/Core/Auth.php';
require_once __DIR__ . '/../src/Core/Validator.php';

// Include middleware
require_once __DIR__ . '/../src/Middleware/AuthMiddleware.php';
require_once __DIR__ . '/../src/Middleware/CorsMiddleware.php';
require_once __DIR__ . '/../src/Middleware/ValidationMiddleware.php';

// Include controllers
require_once __DIR__ . '/../src/Controllers/AuthController.php';
require_once __DIR__ . '/../src/Controllers/UserController.php';
require_once __DIR__ . '/../src/Controllers/ClientController.php';
require_once __DIR__ . '/../src/Controllers/CaseController.php';
require_once __DIR__ . '/../src/Controllers/HearingController.php';
require_once __DIR__ . '/../src/Controllers/InvoiceController.php';
require_once __DIR__ . '/../src/Controllers/LawyerController.php';
require_once __DIR__ . '/../src/Controllers/ReportController.php';

// Include models
require_once __DIR__ . '/../src/Models/User.php';
require_once __DIR__ . '/../src/Models/Client.php';
require_once __DIR__ . '/../src/Models/Case.php';
require_once __DIR__ . '/../src/Models/Hearing.php';
require_once __DIR__ . '/../src/Models/Invoice.php';
require_once __DIR__ . '/../src/Models/Lawyer.php';

try {
    // Initialize router
    $router = new Router();
    
    // Apply CORS middleware
    $router->middleware(new CorsMiddleware());
    
    // Define API routes
    
    // Authentication routes
    $router->post('/api/auth/login', 'AuthController@login');
    $router->post('/api/auth/logout', 'AuthController@logout');
    $router->post('/api/auth/refresh', 'AuthController@refresh');
    $router->get('/api/auth/me', 'AuthController@me');
    
    // User management routes
    $router->get('/api/users', 'UserController@index');
    $router->get('/api/users/{id}', 'UserController@show');
    $router->post('/api/users', 'UserController@store');
    $router->put('/api/users/{id}', 'UserController@update');
    $router->delete('/api/users/{id}', 'UserController@destroy');
    
    // Client management routes
    $router->get('/api/clients', 'ClientController@index');
    $router->get('/api/clients/{id}', 'ClientController@show');
    $router->post('/api/clients', 'ClientController@store');
    $router->put('/api/clients/{id}', 'ClientController@update');
    $router->delete('/api/clients/{id}', 'ClientController@destroy');
    
    // Case management routes
    $router->get('/api/cases', 'CaseController@index');
    $router->get('/api/cases/{id}', 'CaseController@show');
    $router->post('/api/cases', 'CaseController@store');
    $router->put('/api/cases/{id}', 'CaseController@update');
    $router->delete('/api/cases/{id}', 'CaseController@destroy');
    
    // Hearing management routes
    $router->get('/api/hearings', 'HearingController@index');
    $router->get('/api/hearings/{id}', 'HearingController@show');
    $router->post('/api/hearings', 'HearingController@store');
    $router->put('/api/hearings/{id}', 'HearingController@update');
    $router->delete('/api/hearings/{id}', 'HearingController@destroy');
    
    // Invoice management routes
    $router->get('/api/invoices', 'InvoiceController@index');
    $router->get('/api/invoices/{id}', 'InvoiceController@show');
    $router->post('/api/invoices', 'InvoiceController@store');
    $router->put('/api/invoices/{id}', 'InvoiceController@update');
    $router->delete('/api/invoices/{id}', 'InvoiceController@destroy');
    
    // Lawyer management routes
    $router->get('/api/lawyers', 'LawyerController@index');
    $router->get('/api/lawyers/{id}', 'LawyerController@show');
    $router->post('/api/lawyers', 'LawyerController@store');
    $router->put('/api/lawyers/{id}', 'LawyerController@update');
    $router->delete('/api/lawyers/{id}', 'LawyerController@destroy');
    
    // Report routes
    $router->get('/api/reports/dashboard', 'ReportController@dashboard');
    $router->get('/api/reports/clients', 'ReportController@clients');
    $router->get('/api/reports/cases', 'ReportController@cases');
    $router->get('/api/reports/financial', 'ReportController@financial');
    
    // Health check route
    $router->get('/api/health', function() {
        return new Response(['status' => 'ok', 'timestamp' => date('Y-m-d H:i:s')]);
    });
    
    // Handle the request
    $request = new Request();
    $response = $router->handle($request);
    
    // Send response
    $response->send();
    
} catch (Exception $e) {
    // Handle errors
    $errorResponse = new Response([
        'error' => true,
        'message' => $e->getMessage(),
        'code' => $e->getCode()
    ], 500);
    
    $errorResponse->send();
}
