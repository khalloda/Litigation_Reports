<?php

/**
 * API Routes Configuration
 *
 * Defines all API routes and their corresponding controllers and methods.
 */

// Import required classes
require_once __DIR__ . '/core/Router.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/CaseController.php';
require_once __DIR__ . '/controllers/ClientController.php';
require_once __DIR__ . '/controllers/DocumentController.php';
require_once __DIR__ . '/controllers/HearingController.php';
require_once __DIR__ . '/controllers/InvoiceController.php';
require_once __DIR__ . '/controllers/LawyerController.php';
require_once __DIR__ . '/controllers/ReportController.php';
require_once __DIR__ . '/controllers/UserController.php';

function registerRoutes(Router $router)
{
    error_log("Routes: Registering routes in registerRoutes function");

    // Health check endpoints
    $router->get('/ping', function () {
        return [
            'success' => true,
            'message' => 'Litigation Management API',
            'timestamp' => time(),
            'version' => '2.0.0'
        ];
    });

    $router->get('/health', function () {
        return [
            'success' => true,
            'message' => 'API is healthy',
            'timestamp' => time(),
            'version' => '2.0.0'
        ];
    });

    // Authentication routes
    $router->post('/auth/login', 'AuthController@login');
    $router->post('/auth/logout', 'AuthController@logout');
    $router->get('/auth/me', 'AuthController@me');
    $router->post('/auth/refresh', 'AuthController@refresh');
    $router->post('/auth/forgot-password', 'AuthController@forgotPassword');
    $router->post('/auth/reset-password', 'AuthController@resetPassword');
    $router->post('/auth/change-password', 'AuthController@changePassword');
    $router->put('/auth/profile', 'AuthController@updateProfile');

    // Case management routes
    $router->get('/cases', 'CaseController@index');
    $router->post('/cases', 'CaseController@store');
    $router->get('/cases/{id}', 'CaseController@show');
    $router->put('/cases/{id}', 'CaseController@update');
    $router->delete('/cases/{id}', 'CaseController@destroy');
    $router->get('/cases/{id}/hearings', 'CaseController@hearings');
    $router->get('/cases/{id}/documents', 'CaseController@documents');

    // Client management routes
    $router->get('/clients', 'ClientController@index');
    $router->post('/clients', 'ClientController@store');
    $router->get('/clients/{id}', 'ClientController@show');
    $router->put('/clients/{id}', 'ClientController@update');
    $router->delete('/clients/{id}', 'ClientController@destroy');
    $router->get('/clients/{id}/cases', 'ClientController@cases');

    // Document management routes
    $router->get('/documents', 'DocumentController@index');
    $router->post('/documents', 'DocumentController@store');
    $router->get('/documents/{id}', 'DocumentController@show');
    $router->put('/documents/{id}', 'DocumentController@update');
    $router->delete('/documents/{id}', 'DocumentController@destroy');
    $router->get('/documents/{id}/download', 'DocumentController@download');

    // Hearing management routes
    $router->get('/hearings', 'HearingController@index');
    $router->post('/hearings', 'HearingController@store');
    $router->get('/hearings/{id}', 'HearingController@show');
    $router->put('/hearings/{id}', 'HearingController@update');
    $router->delete('/hearings/{id}', 'HearingController@destroy');
    $router->get('/hearings/{id}/documents', 'HearingController@documents');

    // Invoice management routes
    $router->get('/invoices', 'InvoiceController@index');
    $router->post('/invoices', 'InvoiceController@store');
    $router->get('/invoices/{id}', 'InvoiceController@show');
    $router->put('/invoices/{id}', 'InvoiceController@update');
    $router->delete('/invoices/{id}', 'InvoiceController@destroy');
    $router->get('/invoices/{id}/pdf', 'InvoiceController@generatePDF');

    // Lawyer management routes
    $router->get('/lawyers', 'LawyerController@index');
    $router->post('/lawyers', 'LawyerController@store');
    $router->get('/lawyers/{id}', 'LawyerController@show');
    $router->put('/lawyers/{id}', 'LawyerController@update');
    $router->delete('/lawyers/{id}', 'LawyerController@destroy');
    $router->get('/lawyers/{id}/cases', 'LawyerController@cases');

    // Report and dashboard routes
    $router->get('/reports/dashboard', 'ReportController@dashboard');
    $router->get('/reports/cases', 'ReportController@cases');
    $router->get('/reports/clients', 'ReportController@clients');
    $router->get('/reports/financial', 'ReportController@financial');
    $router->get('/reports/export', 'ReportController@export');

    // User management routes
    $router->get('/users', 'UserController@index');
    $router->post('/users', 'UserController@store');
    $router->get('/users/{id}', 'UserController@show');
    $router->put('/users/{id}', 'UserController@update');
    $router->delete('/users/{id}', 'UserController@destroy');
    $router->get('/users/{id}/permissions', 'UserController@permissions');
    $router->put('/users/{id}/permissions', 'UserController@updatePermissions');
    $router->get('/users/{id}/activity', 'UserController@activity');
}

// Routes will be registered by calling registerRoutes($router) from the API server
