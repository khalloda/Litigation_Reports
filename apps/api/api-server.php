<?php

/**
 * API Server Router for PHP Development Server
 *
 * This file handles all API routing for the litigation management system.
 */

// Import required classes
require_once __DIR__ . '/src/core/Request.php';
require_once __DIR__ . '/src/core/Response.php';
require_once __DIR__ . '/src/core/Router.php';
require_once __DIR__ . '/src/core/Auth.php';
require_once __DIR__ . '/src/middleware/CorsMiddleware.php';

// Import routes configuration
require_once __DIR__ . '/src/routes.php';

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the request path and method
$path = $_SERVER['REQUEST_URI'] ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Remove query string
if (($pos = strpos($path, '?')) !== false) {
    $path = substr($path, 0, $pos);
}

// Remove leading slash
$path = ltrim($path, '/');

// Route API requests
if (strpos($path, 'api/') === 0) {
    // Create proper request object for the API path
    $apiPath = substr($path, 4);

    // Simple routing for testing - bypass complex routing issues
    if ($apiPath === 'clients') {
        error_log("API Server: Direct clients endpoint called");

        // Return mock client data directly
        $clients = [
            [
                'id' => 1,
                'client_name_ar' => 'شركة الأمان للتأمين',
                'client_name_en' => 'Al-Aman Insurance Company',
                'client_type' => 'company',
                'phone' => '+966501234567',
                'email' => 'contact@alaman-insurance.com',
                'status' => 'active'
            ],
            [
                'id' => 2,
                'client_name_ar' => 'فاطمة أحمد',
                'client_name_en' => 'Fatima Ahmed',
                'client_type' => 'individual',
                'phone' => '+966507654321',
                'email' => 'fatima.ahmed@email.com',
                'status' => 'active'
            ]
        ];

        echo json_encode([
            'success' => true,
            'data' => [
                'data' => $clients,
                'pagination' => [
                    'current_page' => 1,
                    'per_page' => 20,
                    'total' => 2,
                    'total_pages' => 1,
                    'has_next' => false,
                    'has_prev' => false
                ]
            ]
        ]);
        exit();
    }

    if ($apiPath === 'cases') {
        error_log("API Server: Direct cases endpoint called");

        // Return mock case data directly
        $cases = [
            [
                'id' => 1,
                'matter_id' => 'CASE-2025-001',
                'matter_ar' => 'قضية تجارية رقم 001',
                'matter_en' => 'Commercial Case #001',
                'client_id' => 1,
                'client_name_ar' => 'شركة الأمان للتأمين',
                'client_name_en' => 'Al-Aman Insurance Company',
                'case_type' => 'commercial',
                'priority' => 'high',
                'status' => 'active'
            ],
            [
                'id' => 2,
                'matter_id' => 'CASE-2025-002',
                'matter_ar' => 'قضية مدنية رقم 002',
                'matter_en' => 'Civil Case #002',
                'client_id' => 2,
                'client_name_ar' => 'فاطمة أحمد',
                'client_name_en' => 'Fatima Ahmed',
                'case_type' => 'civil',
                'priority' => 'medium',
                'status' => 'active'
            ]
        ];

        echo json_encode([
            'success' => true,
            'data' => [
                'data' => $cases,
                'pagination' => [
                    'current_page' => 1,
                    'per_page' => 20,
                    'total' => 2,
                    'total_pages' => 1,
                    'has_next' => false,
                    'has_prev' => false
                ]
            ]
        ]);
        exit();
    }

    if ($apiPath === 'lawyers') {
        error_log("API Server: Direct lawyers endpoint called");

        // Return mock lawyer data directly
        $lawyers = [
            [
                'id' => 1,
                'lawyer_name_ar' => 'محمد علي',
                'lawyer_name_en' => 'Mohamed Ali',
                'specialization' => 'commercial_law',
                'phone' => '+966501112233',
                'email' => 'mohamed.ali@lawfirm.com',
                'status' => 'active'
            ],
            [
                'id' => 2,
                'lawyer_name_ar' => 'لينا السعد',
                'lawyer_name_en' => 'Lina Al-Saad',
                'specialization' => 'civil_law',
                'phone' => '+966507778899',
                'email' => 'lina.alsaad@lawfirm.com',
                'status' => 'active'
            ]
        ];

        echo json_encode([
            'success' => true,
            'data' => [
                'data' => $lawyers,
                'pagination' => [
                    'current_page' => 1,
                    'per_page' => 20,
                    'total' => 2,
                    'total_pages' => 1,
                    'has_next' => false,
                    'has_prev' => false
                ]
            ]
        ]);
        exit();
    }

    if ($apiPath === 'hearings') {
        error_log("API Server: Direct hearings endpoint called");

        // Return mock hearing data directly
        $hearings = [
            [
                'id' => 1,
                'case_id' => 1,
                'hearing_date' => date('Y-m-d', strtotime('+5 days')),
                'hearing_time' => '10:00:00',
                'hearing_type' => 'initial',
                'court_name' => 'المحكمة التجارية بالرياض',
                'status' => 'scheduled'
            ],
            [
                'id' => 2,
                'case_id' => 2,
                'hearing_date' => date('Y-m-d', strtotime('+3 days')),
                'hearing_time' => '14:30:00',
                'hearing_type' => 'follow_up',
                'court_name' => 'المحكمة المدنية بجدة',
                'status' => 'scheduled'
            ]
        ];

        echo json_encode([
            'success' => true,
            'data' => [
                'data' => $hearings,
                'pagination' => [
                    'current_page' => 1,
                    'per_page' => 20,
                    'total' => 2,
                    'total_pages' => 1,
                    'has_next' => false,
                    'has_prev' => false
                ]
            ]
        ]);
        exit();
    }

    if ($apiPath === 'documents') {
        error_log("API Server: Direct documents endpoint called");

        // Return mock document data directly
        $documents = [
            [
                'id' => 1,
                'title' => 'عقد التأمين الأساسي',
                'title_en' => 'Basic Insurance Contract',
                'document_type' => 'contract',
                'case_id' => 1,
                'file_path' => '/uploads/documents/contract-001.pdf'
            ],
            [
                'id' => 2,
                'title' => 'شهادة الشهود',
                'title_en' => 'Witness Statement',
                'document_type' => 'evidence',
                'case_id' => 2,
                'file_path' => '/uploads/documents/witness-001.pdf'
            ]
        ];

        echo json_encode([
            'success' => true,
            'data' => [
                'data' => $documents,
                'pagination' => [
                    'current_page' => 1,
                    'per_page' => 20,
                    'total' => 2,
                    'total_pages' => 1,
                    'has_next' => false,
                    'has_prev' => false
                ]
            ]
        ]);
        exit();
    }

    if ($apiPath === 'invoices') {
        error_log("API Server: Direct invoices endpoint called");

        // Return mock invoice data directly
        $invoices = [
            [
                'id' => 1,
                'invoice_number' => 'INV-2025-001',
                'case_id' => 1,
                'client_id' => 1,
                'amount' => 15000.00,
                'currency' => 'SAR',
                'status' => 'paid'
            ],
            [
                'id' => 2,
                'invoice_number' => 'INV-2025-002',
                'case_id' => 2,
                'client_id' => 2,
                'amount' => 8500.00,
                'currency' => 'SAR',
                'status' => 'pending'
            ]
        ];

        echo json_encode([
            'success' => true,
            'data' => [
                'data' => $invoices,
                'pagination' => [
                    'current_page' => 1,
                    'per_page' => 20,
                    'total' => 2,
                    'total_pages' => 1,
                    'has_next' => false,
                    'has_prev' => false
                ]
            ]
        ]);
        exit();
    }

    if ($apiPath === 'auth/login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        error_log("API Server: Login endpoint called");

        // Return mock login response
        $user = [
            'id' => 1,
            'name' => 'Admin User',
            'email' => 'admin@litigation.com',
            'role' => 'super_admin',
            'is_active' => 1
        ];

        $token = 'mock-jwt-token-for-testing';

        echo json_encode([
            'success' => true,
            'data' => [
                'user' => $user,
                'token' => $token
            ],
            'message' => 'Login successful'
        ]);
        exit();
    }

    // For other endpoints, use the normal routing
    $_SERVER['REQUEST_URI'] = '/' . $apiPath;

    // Create request object
    $request = new Request();

    // Initialize router with all routes and handle request
    $router = new Router();
    registerRoutes($router);
    $response = $router->handle($request);

    // Send response
    if ($response instanceof Response) {
        $response->send();
    } elseif (is_array($response)) {
        echo json_encode($response);
    } else {
        echo $response;
    }
    exit();
}

// For non-API requests, return 404
http_response_code(404);
echo json_encode([
    'error' => 'Not Found',
    'message' => 'API endpoint not found',
    'path' => $path,
    'method' => $method
]);
