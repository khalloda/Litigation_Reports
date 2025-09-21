<?php

/**
 * Litigation Management System - API Entry Point
 * 
 * This file serves as the main entry point for the API.
 * It handles routing, authentication, and request processing.
 */

// Set content type for API responses
header('Content-Type: application/json; charset=utf-8');

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
require_once __DIR__ . '/../src/Controllers/DocumentController.php';

// Include models
require_once __DIR__ . '/../src/Models/User.php';
require_once __DIR__ . '/../src/Models/Client.php';
require_once __DIR__ . '/../src/Models/Case.php';
require_once __DIR__ . '/../src/Models/Hearing.php';
require_once __DIR__ . '/../src/Models/Invoice.php';
require_once __DIR__ . '/../src/Models/Lawyer.php';
require_once __DIR__ . '/../src/Models/Document.php';

try {
    // Initialize router
    $router = new Router();

    // No CORS middleware needed when serving from same origin

    // Define API routes

    // Authentication routes
    $router->post('/auth/login', 'AuthController@login');
    $router->post('/auth/logout', 'AuthController@logout');
    $router->post('/auth/refresh', 'AuthController@refresh');
    $router->get('/auth/me', 'AuthController@me');

    // User management routes
    $router->get('/users', 'UserController@index');
    $router->get('/users/{id}', 'UserController@show');
    $router->post('/users', 'UserController@store');
    $router->put('/users/{id}', 'UserController@update');
    $router->delete('/users/{id}', 'UserController@destroy');

    // Profile management routes
    $router->get('/profile', 'UserController@profile');
    $router->put('/profile', 'UserController@updateProfile');
    $router->post('/profile/change-password', 'UserController@changePassword');

    // Client management routes
    $router->get('/clients', 'ClientController@index');
    $router->get('/clients/options', 'ClientController@options');
    $router->get('/clients/{id}', 'ClientController@show');
    $router->post('/clients', 'ClientController@store');
    $router->put('/clients/{id}', 'ClientController@update');
    $router->delete('/clients/{id}', 'ClientController@destroy');

    // Case management routes
    $router->get('/cases', 'CaseController@index');
    $router->get('/cases/options', 'CaseController@options');
    $router->get('/cases/{id}', 'CaseController@show');
    $router->post('/cases', 'CaseController@store');
    $router->put('/cases/{id}', 'CaseController@update');
    $router->delete('/cases/{id}', 'CaseController@destroy');

    // Hearing management routes
    $router->get('/hearings', 'HearingController@index');
    $router->get('/hearings/options', 'HearingController@options');
    $router->get('/hearings/{id}', 'HearingController@show');
    $router->post('/hearings', 'HearingController@store');
    $router->put('/hearings/{id}', 'HearingController@update');
    $router->delete('/hearings/{id}', 'HearingController@destroy');

    // Invoice management routes
    $router->get('/invoices', 'InvoiceController@index');
    $router->get('/invoices/options', 'InvoiceController@options');
    $router->get('/invoices/stats', 'InvoiceController@stats');
    $router->get('/invoices/search', 'InvoiceController@search');
    $router->get('/invoices/overdue', 'InvoiceController@overdue');
    $router->get('/invoices/by-status', 'InvoiceController@byStatus');
    $router->get('/invoices/{id}', 'InvoiceController@show');
    $router->post('/invoices', 'InvoiceController@store');
    $router->put('/invoices/{id}', 'InvoiceController@update');
    $router->delete('/invoices/{id}', 'InvoiceController@destroy');

    // Lawyer management routes
    $router->get('/lawyers', 'LawyerController@index');
    $router->get('/lawyers/active', 'LawyerController@active');
    $router->get('/lawyers/stats', 'LawyerController@stats');
    $router->get('/lawyers/search', 'LawyerController@search');
    $router->get('/lawyers/{id}', 'LawyerController@show');
    $router->post('/lawyers', 'LawyerController@store');
    $router->put('/lawyers/{id}', 'LawyerController@update');
    $router->delete('/lawyers/{id}', 'LawyerController@destroy');

    // Report routes
    $router->get('/reports/dashboard', 'ReportController@dashboard');
    $router->get('/reports/clients', 'ReportController@clients');
    $router->get('/reports/cases', 'ReportController@cases');
    $router->get('/reports/financial', 'ReportController@financial');
    $router->get('/reports/hearings', 'ReportController@hearings');

    // Advanced reporting routes
    $router->get('/reports/custom', 'ReportController@customReport');
    $router->post('/reports/custom', 'ReportController@generateCustomReport');
    $router->get('/reports/export', 'ReportController@exportReport');
    $router->get('/reports/templates', 'ReportController@getReportTemplates');
    $router->post('/reports/templates', 'ReportController@saveReportTemplate');
    $router->get('/reports/options', 'ReportController@getReportOptions');

    // Document management routes
    $router->get('/documents', 'DocumentController@index');
    $router->get('/documents/options', 'DocumentController@options');
    $router->get('/documents/stats', 'DocumentController@stats');
    $router->get('/documents/search', 'DocumentController@search');
    $router->get('/documents/entity', 'DocumentController@getByEntity');
    $router->get('/documents/{id}', 'DocumentController@show');
    $router->get('/documents/{id}/download', 'DocumentController@download');
    $router->post('/documents', 'DocumentController@store');
    $router->put('/documents/{id}', 'DocumentController@update');
    $router->delete('/documents/{id}', 'DocumentController@destroy');

    // Health check route
    $router->get('/health', function () {
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
