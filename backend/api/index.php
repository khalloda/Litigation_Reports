<?php
/**
 * Main API Router
 * Routes all API requests to appropriate endpoints
 */

require_once __DIR__ . '/_bootstrap.php';
require_once __DIR__ . '/db.php';

// Get request path and method
$path = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Remove query string from path
$path = strtok($path, '?');

// Remove /api prefix if present
$path = preg_replace('/^\/api\/?/', '/', $path);

// Handle root API path
if ($path === '/') {
    $path = '/ping';
}

// Debug logging
error_log("API Request: " . $_SERVER['REQUEST_URI'] . " -> " . $path);

// Route the request
switch ($path) {
    case '/ping':
    case '/health':
        echo json_encode([
            'success' => true,
            'message' => 'Litigation Management API',
            'timestamp' => time(),
            'server' => 'Apache/PHP',
            'version' => '1.0.0'
        ]);
        break;
        
    case '/auth/login':
        if ($method === 'POST') {
            handleLogin();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/auth/me':
        if ($method === 'GET') {
            handleGetCurrentUser();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/cases':
        if ($method === 'GET') {
            handleGetCases();
        } elseif ($method === 'POST') {
            handleCreateCase();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/clients':
        if ($method === 'GET') {
            handleGetClients();
        } elseif ($method === 'POST') {
            handleCreateClient();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/hearings':
        if ($method === 'GET') {
            handleGetHearings();
        } elseif ($method === 'POST') {
            handleCreateHearing();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/invoices':
        if ($method === 'GET') {
            handleGetInvoices();
        } elseif ($method === 'POST') {
            handleCreateInvoice();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/invoices/options':
        if ($method === 'GET') {
            handleGetInvoiceOptions();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/reports/dashboard':
        if ($method === 'GET') {
            handleReportsDashboard();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/reports/templates':
        if ($method === 'GET') {
            handleReportsTemplates();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/reports/client-report':
        if ($method === 'GET') {
            handleClientReport();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/reports/clients':
        if ($method === 'GET') {
            handleClientsReport();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/reports/cases':
        if ($method === 'GET') {
            handleCasesReport();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/reports/hearings':
        if ($method === 'GET') {
            handleHearingsReport();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/reports/custom':
        if ($method === 'GET') {
            handleCustomReportOptions();
        } elseif ($method === 'POST') {
            handleGenerateCustomReport();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/reports/client-specific':
        if ($method === 'GET') {
            handleClientSpecificReportOptions();
        } elseif ($method === 'POST') {
            handleGenerateClientSpecificReport();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/lawyers':
        if ($method === 'GET') {
            handleGetLawyers();
        } elseif ($method === 'POST') {
            handleCreateLawyer();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/documents':
        if ($method === 'GET') {
            handleGetDocuments();
        } elseif ($method === 'POST') {
            handleCreateDocument();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/documents/stats':
        if ($method === 'GET') {
            handleGetDocumentStats();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/documents/options':
        if ($method === 'GET') {
            handleGetDocumentOptions();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/hearings/options':
        if ($method === 'GET') {
            handleGetHearingOptions();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/cases/options':
        if ($method === 'GET') {
            handleGetCaseOptions();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/clients/options':
        if ($method === 'GET') {
            handleGetClientOptions();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case '/export/pdf':
    case '/export/pdf-chrome':
        if ($method === 'POST') {
            handlePDFExport();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed. Use POST.']);
        }
        break;

    case '/export/csv':
        if ($method === 'POST') {
            handleCSVExport();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed. Use POST.']);
        }
        break;

    case '/export/excel':
    case '/export/xls':
        if ($method === 'POST') {
            handleExcelExport();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed. Use POST.']);
        }
        break;

    default:
        // Handle dynamic routes (e.g., /cases/123)
        if (preg_match('/^\/cases\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method === 'GET') {
                handleGetCase($id);
            } elseif ($method === 'PUT' || $method === 'PATCH') {
                handleUpdateCase($id);
            } elseif ($method === 'DELETE') {
                handleDeleteCase($id);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
        } elseif (preg_match('/^\/clients\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method === 'GET') {
                handleGetClient($id);
            } elseif ($method === 'PUT' || $method === 'PATCH') {
                handleUpdateClient($id);
            } elseif ($method === 'DELETE') {
                handleDeleteClient($id);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
        } elseif (preg_match('/^\/hearings\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method === 'GET') {
                handleGetHearing($id);
            } elseif ($method === 'PUT' || $method === 'PATCH') {
                handleUpdateHearing($id);
            } elseif ($method === 'DELETE') {
                handleDeleteHearing($id);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
        } elseif (preg_match('/^\/invoices\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method === 'GET') {
                handleGetInvoice($id);
            } elseif ($method === 'PUT' || $method === 'PATCH') {
                handleUpdateInvoice($id);
            } elseif ($method === 'DELETE') {
                handleDeleteInvoice($id);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
        } elseif (preg_match('/^\/lawyers\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method === 'GET') {
                handleGetLawyer($id);
            } elseif ($method === 'PUT' || $method === 'PATCH') {
                handleUpdateLawyer($id);
            } elseif ($method === 'DELETE') {
                handleDeleteLawyer($id);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
        } elseif (preg_match('/^\/documents\/(\d+)\/download$/', $path, $matches)) {
            $id = $matches[1];
            if ($method === 'GET') {
                handleDownloadDocument($id);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
        } elseif (preg_match('/^\/documents\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method === 'GET') {
                handleGetDocument($id);
            } elseif ($method === 'PUT' || $method === 'PATCH') {
                handleUpdateDocument($id);
            } elseif ($method === 'DELETE') {
                handleDeleteDocument($id);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found', 'path' => $path]);
        }
        break;
}

// Authentication functions
function handleLogin() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['email']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        return;
    }
    
    $db = Database::getInstance();
    
    try {
        $user = $db->fetch(
            "SELECT * FROM users WHERE email = ? AND is_active = 1",
            [$input['email']]
        );
        
        if ($user && password_verify($input['password'], $user['password_hash'])) {
            // Generate JWT token (simplified)
            $token = base64_encode(json_encode([
                'user_id' => $user['id'],
                'email' => $user['email'],
                'exp' => time() + (24 * 60 * 60) // 24 hours
            ]));
            
            // Update last login
            $db->execute(
                "UPDATE users SET last_login = NOW() WHERE id = ?",
                [$user['id']]
            );
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['full_name_en'] ?: $user['full_name_ar'] ?: $user['username'],
                        'email' => $user['email'],
                        'role' => $user['role'],
                        'status' => $user['is_active'] ? 'active' : 'inactive'
                    ],
                    'token' => $token
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Login failed']);
    }
}

function handleGetCurrentUser() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    
    if (strpos($authHeader, 'Bearer ') !== 0) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        return;
    }
    
    $token = substr($authHeader, 7);
    $payload = json_decode(base64_decode($token), true);
    
    if (!$payload || $payload['exp'] < time()) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        return;
    }
    
    $db = Database::getInstance();
    
    try {
        $user = $db->fetch(
            "SELECT * FROM users WHERE id = ? AND is_active = 1",
            [$payload['user_id']]
        );
        
        if ($user) {
            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => $user['id'],
                    'name' => $user['full_name_en'] ?: $user['full_name_ar'] ?: $user['username'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'status' => $user['is_active'] ? 'active' : 'inactive'
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'User not found']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to get user']);
    }
}

// Cases functions
function handleGetCases() {
    $db = Database::getInstance();
    
    try {
        $page = $_GET['page'] ?? 1;
        $limit = $_GET['limit'] ?? 10;
        $filters = [
            'status' => $_GET['status'] ?? null,
            'client_id' => $_GET['client_id'] ?? null,
            'search' => $_GET['search'] ?? null
        ];
        
        // Remove empty filters
        $filters = array_filter($filters, function($value) {
            return $value !== null && $value !== '';
        });
        
        $whereClause = '1=1';
        $params = [];
        
        if (!empty($filters['status'])) {
            $whereClause .= ' AND matter_status = ?';
            $params[] = $filters['status'];
        }
        
        if (!empty($filters['client_id'])) {
            $whereClause .= ' AND client_id = ?';
            $params[] = $filters['client_id'];
        }
        
        if (!empty($filters['search'])) {
            $whereClause .= ' AND (matter_ar LIKE ? OR matter_en LIKE ? OR matter_subject LIKE ?)';
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        $sql = "SELECT c.*, cl.client_name_ar, cl.client_name_en 
                FROM cases c 
                LEFT JOIN clients cl ON c.client_id = cl.id 
                WHERE {$whereClause} 
                ORDER BY c.created_at DESC";
        
        $result = $db->paginate($sql, $params, $page, $limit);
        
        echo json_encode([
            'success' => true,
            'data' => $result
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to retrieve cases']);
    }
}

function handleGetCase($id) {
    $db = Database::getInstance();
    
    try {
        $case = $db->fetch(
            "SELECT c.*, cl.client_name_ar, cl.client_name_en 
             FROM cases c 
             LEFT JOIN clients cl ON c.client_id = cl.id 
             WHERE c.id = ?",
            [$id]
        );
        
        if ($case) {
            echo json_encode([
                'success' => true,
                'data' => $case
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Case not found']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to retrieve case']);
    }
}

// Clients functions
function handleGetClients() {
    $db = Database::getInstance();
    
    try {
        $page = $_GET['page'] ?? 1;
        $limit = $_GET['limit'] ?? 10;
        $filters = [
            'status' => $_GET['status'] ?? null,
            'type' => $_GET['type'] ?? null,
            'search' => $_GET['search'] ?? null
        ];
        
        // Remove empty filters
        $filters = array_filter($filters, function($value) {
            return $value !== null && $value !== '';
        });
        
        $whereClause = '1=1';
        $params = [];
        
        if (!empty($filters['status'])) {
            $whereClause .= ' AND status = ?';
            $params[] = $filters['status'];
        }
        
        if (!empty($filters['type'])) {
            $whereClause .= ' AND client_type = ?';
            $params[] = $filters['type'];
        }
        
        if (!empty($filters['search'])) {
            $whereClause .= ' AND (client_name_ar LIKE ? OR client_name_en LIKE ? OR email LIKE ?)';
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        $sql = "SELECT * FROM clients WHERE {$whereClause} ORDER BY created_at DESC";
        $result = $db->paginate($sql, $params, $page, $limit);
        
        echo json_encode([
            'success' => true,
            'data' => $result
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to retrieve clients']);
    }
}

function handleGetClient($id) {
    $db = Database::getInstance();
    
    try {
        $client = $db->fetch("SELECT * FROM clients WHERE id = ?", [$id]);
        
        if ($client) {
            echo json_encode([
                'success' => true,
                'data' => $client
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Client not found']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to retrieve client']);
    }
}

// Hearings functions
function handleGetHearings() {
    $db = Database::getInstance();
    
    try {
        $page = $_GET['page'] ?? 1;
        $limit = $_GET['limit'] ?? 10;
        $filters = [
            'case_id' => $_GET['case_id'] ?? null,
            'date_from' => $_GET['date_from'] ?? null,
            'date_to' => $_GET['date_to'] ?? null
        ];
        
        // Remove empty filters
        $filters = array_filter($filters, function($value) {
            return $value !== null && $value !== '';
        });
        
        $whereClause = '1=1';
        $params = [];
        
        if (!empty($filters['case_id'])) {
            $whereClause .= ' AND case_id = ?';
            $params[] = $filters['case_id'];
        }
        
        if (!empty($filters['date_from'])) {
            $whereClause .= ' AND hearing_date >= ?';
            $params[] = $filters['date_from'];
        }
        
        if (!empty($filters['date_to'])) {
            $whereClause .= ' AND hearing_date <= ?';
            $params[] = $filters['date_to'];
        }
        
        $sql = "SELECT h.*, c.matter_ar, c.matter_en 
                FROM hearings h 
                LEFT JOIN cases c ON h.case_id = c.id 
                WHERE {$whereClause} 
                ORDER BY h.hearing_date DESC";
        
        $result = $db->paginate($sql, $params, $page, $limit);
        
        echo json_encode([
            'success' => true,
            'data' => $result
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to retrieve hearings']);
    }
}

function handleGetHearing($id) {
    $db = Database::getInstance();
    
    try {
        $hearing = $db->fetch(
            "SELECT h.*, c.matter_ar, c.matter_en 
             FROM hearings h 
             LEFT JOIN cases c ON h.case_id = c.id 
             WHERE h.id = ?",
            [$id]
        );
        
        if ($hearing) {
            echo json_encode([
                'success' => true,
                'data' => $hearing
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Hearing not found']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to retrieve hearing']);
    }
}

// Placeholder functions for other operations
function handleCreateCase() {
    $db = Database::getInstance();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }

    // Validate required fields
    $errors = [];
    if (empty($input['client_id'])) {
        $errors['client_id'] = 'Client ID is required';
    }
    if (empty($input['matter_ar']) && empty($input['matter_en'])) {
        $errors['matter'] = 'Case matter (Arabic or English) is required';
    }

    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(['error' => 'Validation failed', 'errors' => $errors]);
        return;
    }

    try {
        $result = $db->execute(
            "INSERT INTO cases (client_id, matter_id, matter_ar, matter_en, client_capacity, opponent_capacity, matter_subject, matter_status, matter_category, matter_degree, matter_importance, matter_start_date, matter_end_date, circuit_secretary, matter_asked_amount, matter_judged_amount, client_branch, matter_shelf, court_floor, court_hall, secretary_room, matter_court, matter_circuit, matter_destination, matter_select, matter_partner, matter_notes1, matter_notes2, lawyer_a, lawyer_b, matter_evaluation, financial_allocation, work_team_id, contract_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $input['client_id'],
                $input['matter_id'] ?? null,
                $input['matter_ar'] ?? '',
                $input['matter_en'] ?? '',
                $input['client_capacity'] ?? '',
                $input['opponent_capacity'] ?? '',
                $input['matter_subject'] ?? '',
                $input['matter_status'] ?? 'active',
                $input['matter_category'] ?? '',
                $input['matter_degree'] ?? '',
                $input['matter_importance'] ?? 'medium',
                !empty($input['matter_start_date']) ? $input['matter_start_date'] : null,
                !empty($input['matter_end_date']) ? $input['matter_end_date'] : null,
                $input['circuit_secretary'] ?? '',
                !empty($input['matter_asked_amount']) ? (float)$input['matter_asked_amount'] : null,
                !empty($input['matter_judged_amount']) ? (float)$input['matter_judged_amount'] : null,
                $input['client_branch'] ?? '',
                $input['matter_shelf'] ?? '',
                $input['court_floor'] ?? '',
                $input['court_hall'] ?? '',
                $input['secretary_room'] ?? '',
                $input['matter_court'] ?? '',
                $input['matter_circuit'] ?? '',
                $input['matter_destination'] ?? '',
                $input['matter_select'] ?? '',
                $input['matter_partner'] ?? '',
                $input['matter_notes1'] ?? '',
                $input['matter_notes2'] ?? '',
                $input['lawyer_a'] ?? '',
                $input['lawyer_b'] ?? '',
                $input['matter_evaluation'] ?? '',
                $input['financial_allocation'] ?? '',
                !empty($input['work_team_id']) ? (int)$input['work_team_id'] : null,
                $input['contract_id'] ?? null
            ]
        );

        if ($result) {
            $newId = $db->lastInsertId();
            $newCase = $db->fetch(
                "SELECT c.*, cl.client_name_ar, cl.client_name_en FROM cases c LEFT JOIN clients cl ON c.client_id = cl.id WHERE c.id = ?",
                [$newId]
            );

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'data' => $newCase,
                'message' => 'Case created successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create case']);
        }
    } catch (Exception $e) {
        error_log("Create case error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create case']);
    }
}

function handleUpdateCase($id) {
    $db = Database::getInstance();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }

    try {
        // Check if case exists
        $existing = $db->fetch("SELECT id FROM cases WHERE id = ?", [$id]);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Case not found']);
            return;
        }

        $result = $db->execute(
            "UPDATE cases SET client_id = ?, matter_id = ?, matter_ar = ?, matter_en = ?, client_capacity = ?, opponent_capacity = ?, matter_subject = ?, matter_status = ?, matter_category = ?, matter_degree = ?, matter_importance = ?, matter_start_date = ?, matter_end_date = ?, circuit_secretary = ?, matter_asked_amount = ?, matter_judged_amount = ?, client_branch = ?, matter_shelf = ?, court_floor = ?, court_hall = ?, secretary_room = ?, matter_court = ?, matter_circuit = ?, matter_destination = ?, matter_select = ?, matter_partner = ?, matter_notes1 = ?, matter_notes2 = ?, lawyer_a = ?, lawyer_b = ?, matter_evaluation = ?, financial_allocation = ?, work_team_id = ?, contract_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [
                $input['client_id'] ?? null,
                $input['matter_id'] ?? null,
                $input['matter_ar'] ?? '',
                $input['matter_en'] ?? '',
                $input['client_capacity'] ?? '',
                $input['opponent_capacity'] ?? '',
                $input['matter_subject'] ?? '',
                $input['matter_status'] ?? 'active',
                $input['matter_category'] ?? '',
                $input['matter_degree'] ?? '',
                $input['matter_importance'] ?? 'medium',
                !empty($input['matter_start_date']) ? $input['matter_start_date'] : null,
                !empty($input['matter_end_date']) ? $input['matter_end_date'] : null,
                $input['circuit_secretary'] ?? '',
                !empty($input['matter_asked_amount']) ? (float)$input['matter_asked_amount'] : null,
                !empty($input['matter_judged_amount']) ? (float)$input['matter_judged_amount'] : null,
                $input['client_branch'] ?? '',
                $input['matter_shelf'] ?? '',
                $input['court_floor'] ?? '',
                $input['court_hall'] ?? '',
                $input['secretary_room'] ?? '',
                $input['matter_court'] ?? '',
                $input['matter_circuit'] ?? '',
                $input['matter_destination'] ?? '',
                $input['matter_select'] ?? '',
                $input['matter_partner'] ?? '',
                $input['matter_notes1'] ?? '',
                $input['matter_notes2'] ?? '',
                $input['lawyer_a'] ?? '',
                $input['lawyer_b'] ?? '',
                $input['matter_evaluation'] ?? '',
                $input['financial_allocation'] ?? '',
                !empty($input['work_team_id']) ? (int)$input['work_team_id'] : null,
                $input['contract_id'] ?? null,
                $id
            ]
        );

        if ($result) {
            $updatedCase = $db->fetch(
                "SELECT c.*, cl.client_name_ar, cl.client_name_en FROM cases c LEFT JOIN clients cl ON c.client_id = cl.id WHERE c.id = ?",
                [$id]
            );

            echo json_encode([
                'success' => true,
                'data' => $updatedCase,
                'message' => 'Case updated successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update case']);
        }
    } catch (Exception $e) {
        error_log("Update case error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update case']);
    }
}

function handleDeleteCase($id) {
    $db = Database::getInstance();

    try {
        // Check if case exists
        $existing = $db->fetch("SELECT id FROM cases WHERE id = ?", [$id]);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Case not found']);
            return;
        }

        // Check if case has related hearings
        $relatedHearings = $db->fetch("SELECT COUNT(*) as count FROM hearings WHERE case_id = ?", [$id]);
        if ($relatedHearings['count'] > 0) {
            http_response_code(422);
            echo json_encode([
                'error' => 'Cannot delete case with existing hearings',
                'message' => 'Please delete all hearings for this case first'
            ]);
            return;
        }

        $result = $db->execute("DELETE FROM cases WHERE id = ?", [$id]);

        if ($result) {
            http_response_code(204);
            echo json_encode([
                'success' => true,
                'message' => 'Case deleted successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete case']);
        }
    } catch (Exception $e) {
        error_log("Delete case error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete case']);
    }
}

function handleCreateClient() {
    $db = Database::getInstance();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }

    // Validate required fields
    $errors = [];
    if (empty($input['client_name_ar'])) {
        $errors['client_name_ar'] = 'Arabic client name is required';
    }

    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(['error' => 'Validation failed', 'errors' => $errors]);
        return;
    }

    try {
        $result = $db->execute(
            "INSERT INTO clients (client_name_ar, client_name_en, client_type, cash_pro_bono, status, logo, contact_lawyer, email, phone, address_ar, address_en, notes_ar, notes_en, client_start_date, client_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $input['client_name_ar'],
                $input['client_name_en'] ?? '',
                $input['client_type'] ?? 'company',
                $input['cash_pro_bono'] ?? 'cash',
                $input['status'] ?? 'active',
                $input['logo'] ?? null,
                $input['contact_lawyer'] ?? '',
                $input['email'] ?? '',
                $input['phone'] ?? '',
                $input['address_ar'] ?? '',
                $input['address_en'] ?? '',
                $input['notes_ar'] ?? '',
                $input['notes_en'] ?? '',
                !empty($input['client_start_date']) ? $input['client_start_date'] : null,
                !empty($input['client_end_date']) ? $input['client_end_date'] : null
            ]
        );

        if ($result) {
            $newId = $db->lastInsertId();
            $newClient = $db->fetch("SELECT * FROM clients WHERE id = ?", [$newId]);

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'data' => $newClient,
                'message' => 'Client created successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create client']);
        }
    } catch (Exception $e) {
        error_log("Create client error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create client']);
    }
}

function handleUpdateClient($id) {
    $db = Database::getInstance();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }

    try {
        // Check if client exists
        $existing = $db->fetch("SELECT id FROM clients WHERE id = ?", [$id]);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Client not found']);
            return;
        }

        $result = $db->execute(
            "UPDATE clients SET client_name_ar = ?, client_name_en = ?, client_type = ?, cash_pro_bono = ?, status = ?, logo = ?, contact_lawyer = ?, email = ?, phone = ?, address_ar = ?, address_en = ?, notes_ar = ?, notes_en = ?, client_start_date = ?, client_end_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [
                $input['client_name_ar'] ?? '',
                $input['client_name_en'] ?? '',
                $input['client_type'] ?? 'company',
                $input['cash_pro_bono'] ?? 'cash',
                $input['status'] ?? 'active',
                $input['logo'] ?? null,
                $input['contact_lawyer'] ?? '',
                $input['email'] ?? '',
                $input['phone'] ?? '',
                $input['address_ar'] ?? '',
                $input['address_en'] ?? '',
                $input['notes_ar'] ?? '',
                $input['notes_en'] ?? '',
                !empty($input['client_start_date']) ? $input['client_start_date'] : null,
                !empty($input['client_end_date']) ? $input['client_end_date'] : null,
                $id
            ]
        );

        if ($result) {
            $updatedClient = $db->fetch("SELECT * FROM clients WHERE id = ?", [$id]);

            echo json_encode([
                'success' => true,
                'data' => $updatedClient,
                'message' => 'Client updated successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update client']);
        }
    } catch (Exception $e) {
        error_log("Update client error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update client']);
    }
}

function handleDeleteClient($id) {
    $db = Database::getInstance();

    try {
        // Check if client exists
        $existing = $db->fetch("SELECT id FROM clients WHERE id = ?", [$id]);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Client not found']);
            return;
        }

        // Check if client has related cases
        $relatedCases = $db->fetch("SELECT COUNT(*) as count FROM cases WHERE client_id = ?", [$id]);
        if ($relatedCases['count'] > 0) {
            http_response_code(422);
            echo json_encode([
                'error' => 'Cannot delete client with existing cases',
                'message' => 'Please delete all cases for this client first'
            ]);
            return;
        }

        $result = $db->execute("DELETE FROM clients WHERE id = ?", [$id]);

        if ($result) {
            http_response_code(204);
            echo json_encode([
                'success' => true,
                'message' => 'Client deleted successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete client']);
        }
    } catch (Exception $e) {
        error_log("Delete client error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete client']);
    }
}

function handleCreateHearing() {
    $db = Database::getInstance();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }

    // Validate required fields
    $errors = [];
    if (empty($input['case_id'])) {
        $errors['case_id'] = 'Case ID is required';
    }
    if (empty($input['hearing_date'])) {
        $errors['hearing_date'] = 'Hearing date is required';
    }
    if (empty($input['hearing_type'])) {
        $errors['hearing_type'] = 'Hearing type is required';
    }
    if (empty($input['hearing_result'])) {
        $errors['hearing_result'] = 'Hearing result is required';
    }
    if (empty($input['hearing_duration'])) {
        $errors['hearing_duration'] = 'Hearing duration is required';
    }

    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(['error' => 'Validation failed', 'errors' => $errors]);
        return;
    }

    try {
        $result = $db->execute(
            "INSERT INTO hearings (case_id, hearing_date, hearing_type, hearing_result, hearing_duration, hearing_decision, court_notes, lawyer_notes, expert_notes, next_hearing, short_decision) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $input['case_id'],
                $input['hearing_date'],
                $input['hearing_type'],
                $input['hearing_result'],
                $input['hearing_duration'],
                $input['hearing_decision'] ?? '',
                $input['court_notes'] ?? '',
                $input['lawyer_notes'] ?? '',
                $input['expert_notes'] ?? '',
                !empty($input['next_hearing']) ? $input['next_hearing'] : null,
                $input['short_decision'] ?? ''
            ]
        );

        if ($result) {
            $newId = $db->lastInsertId();
            $newHearing = $db->fetch(
                "SELECT h.*, c.matter_ar, c.matter_en FROM hearings h LEFT JOIN cases c ON h.case_id = c.id WHERE h.id = ?",
                [$newId]
            );

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'data' => $newHearing,
                'message' => 'Hearing created successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create hearing']);
        }
    } catch (Exception $e) {
        error_log("Create hearing error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create hearing']);
    }
}

function handleUpdateHearing($id) {
    $db = Database::getInstance();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }

    try {
        // Check if hearing exists
        $existing = $db->fetch("SELECT id FROM hearings WHERE id = ?", [$id]);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Hearing not found']);
            return;
        }

        $result = $db->execute(
            "UPDATE hearings SET case_id = ?, hearing_date = ?, hearing_type = ?, hearing_result = ?, hearing_duration = ?, hearing_decision = ?, court_notes = ?, lawyer_notes = ?, expert_notes = ?, next_hearing = ?, short_decision = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [
                $input['case_id'] ?? null,
                $input['hearing_date'] ?? null,
                $input['hearing_type'] ?? '',
                $input['hearing_result'] ?? '',
                $input['hearing_duration'] ?? '',
                $input['hearing_decision'] ?? '',
                $input['court_notes'] ?? '',
                $input['lawyer_notes'] ?? '',
                $input['expert_notes'] ?? '',
                !empty($input['next_hearing']) ? $input['next_hearing'] : null,
                $input['short_decision'] ?? '',
                $id
            ]
        );

        if ($result) {
            $updatedHearing = $db->fetch(
                "SELECT h.*, c.matter_ar, c.matter_en FROM hearings h LEFT JOIN cases c ON h.case_id = c.id WHERE h.id = ?",
                [$id]
            );

            echo json_encode([
                'success' => true,
                'data' => $updatedHearing,
                'message' => 'Hearing updated successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update hearing']);
        }
    } catch (Exception $e) {
        error_log("Update hearing error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update hearing']);
    }
}

function handleDeleteHearing($id) {
    $db = Database::getInstance();

    try {
        // Check if hearing exists
        $existing = $db->fetch("SELECT id FROM hearings WHERE id = ?", [$id]);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Hearing not found']);
            return;
        }

        $result = $db->execute("DELETE FROM hearings WHERE id = ?", [$id]);

        if ($result) {
            http_response_code(204);
            echo json_encode([
                'success' => true,
                'message' => 'Hearing deleted successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete hearing']);
        }
    } catch (Exception $e) {
        error_log("Delete hearing error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete hearing']);
    }
}

// Invoice handler functions
function handleGetInvoices() {
    $db = Database::getInstance();

    try {
        // Get pagination parameters
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        // Get total count
        $totalResult = $db->fetch("SELECT COUNT(*) as total FROM invoices");
        $total = $totalResult['total'] ?? 0;

        // Get invoices with pagination
        $invoices = $db->fetchAll("
            SELECT i.*
            FROM invoices i
            ORDER BY i.created_at DESC
            LIMIT $limit OFFSET $offset
        ");

        // Calculate pagination info
        $totalPages = ceil($total / $limit);

        echo json_encode([
            'success' => true,
            'data' => [
                'data' => $invoices,
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $limit,
                    'total' => $total,
                    'total_pages' => $totalPages,
                    'has_next' => $page < $totalPages,
                    'has_prev' => $page > 1,
                    'next_page' => $page < $totalPages ? $page + 1 : null,
                    'prev_page' => $page > 1 ? $page - 1 : null
                ]
            ]
        ]);
    } catch (Exception $e) {
        error_log("Get invoices error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch invoices']);
    }
}

function handleGetInvoiceOptions() {
    $db = Database::getInstance();

    try {
        // Get clients for dropdown
        $clients = $db->fetchAll("
            SELECT id, client_name_ar as name_ar, client_name_en as name_en
            FROM clients
            ORDER BY client_name_ar
        ");

        // Get cases for dropdown
        $cases = $db->fetchAll("
            SELECT id, matter_ar, matter_en, client_id
            FROM cases
            ORDER BY matter_ar
        ");

        echo json_encode([
            'success' => true,
            'data' => [
                'clients' => $clients,
                'cases' => $cases,
                'status' => [
                    'draft' => 'مسودة',
                    'sent' => 'مرسلة',
                    'paid' => 'مدفوعة',
                    'overdue' => 'متأخرة',
                    'cancelled' => 'ملغاة'
                ],
                'type' => [
                    'service' => 'خدمات',
                    'expenses' => 'مصروفات',
                    'advance' => 'مقدم'
                ],
                'currency' => [
                    'EGP' => 'جنيه مصري',
                    'USD' => 'دولار أمريكي',
                    'EUR' => 'يورو'
                ]
            ]
        ]);
    } catch (Exception $e) {
        error_log("Get invoice options error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch invoice options']);
    }
}

function handleCreateInvoice() {
    $db = Database::getInstance();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }

    // Validate required fields
    $errors = [];
    if (empty($input['invoice_date'])) {
        $errors['invoice_date'] = 'Invoice date is required';
    }
    if (empty($input['amount']) || !is_numeric($input['amount'])) {
        $errors['amount'] = 'Valid amount is required';
    }

    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(['error' => 'Validation failed', 'errors' => $errors]);
        return;
    }

    try {
        // Generate invoice number if not provided or empty
        $invoiceNumber = (!empty($input['invoice_number'])) ? $input['invoice_number'] : 'INV-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

        $result = $db->execute(
            "INSERT INTO invoices (invoice_number, contract_id, client_id, case_id, invoice_date, amount, currency, usd_amount, invoice_details, invoice_status, invoice_type, has_vat, payment_date, report_generated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $invoiceNumber,
                $input['contract_id'] ?? null,
                !empty($input['client_id']) ? (int)$input['client_id'] : null,
                !empty($input['case_id']) ? (int)$input['case_id'] : null,
                $input['invoice_date'],
                (float)$input['amount'],
                $input['currency'] ?? 'EGP',
                !empty($input['usd_amount']) ? (float)$input['usd_amount'] : null,
                $input['invoice_details'] ?? '',
                $input['invoice_status'] ?? 'draft',
                $input['invoice_type'] ?? 'service',
                isset($input['has_vat']) ? (int)$input['has_vat'] : 0,
                !empty($input['payment_date']) ? $input['payment_date'] : null,
                isset($input['report_generated']) ? (int)$input['report_generated'] : 0
            ]
        );

        if ($result) {
            $newId = $db->lastInsertId();
            $newInvoice = $db->fetch("SELECT * FROM invoices WHERE id = ?", [$newId]);

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'data' => $newInvoice,
                'message' => 'Invoice created successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create invoice']);
        }
    } catch (Exception $e) {
        error_log("Create invoice error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create invoice']);
    }
}

function handleGetInvoice($id) {
    $db = Database::getInstance();

    try {
        $invoice = $db->fetch(
            "SELECT * FROM invoices WHERE id = ?",
            [$id]
        );

        if ($invoice) {
            echo json_encode([
                'success' => true,
                'data' => $invoice
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Invoice not found']);
        }
    } catch (Exception $e) {
        error_log("Get invoice error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Internal server error']);
    }
}

function handleUpdateInvoice($id) {
    $db = Database::getInstance();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }

    try {
        // Check if invoice exists
        $existing = $db->fetch("SELECT id FROM invoices WHERE id = ?", [$id]);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Invoice not found']);
            return;
        }

        // Generate invoice number if not provided or empty during update
        $invoiceNumber = (!empty($input['invoice_number'])) ? $input['invoice_number'] : 'INV-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

        $result = $db->execute(
            "UPDATE invoices SET invoice_number = ?, contract_id = ?, client_id = ?, case_id = ?, invoice_date = ?, amount = ?, currency = ?, usd_amount = ?, invoice_details = ?, invoice_status = ?, invoice_type = ?, has_vat = ?, payment_date = ?, report_generated = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [
                $invoiceNumber,
                $input['contract_id'] ?? '',
                !empty($input['client_id']) ? (int)$input['client_id'] : null,
                !empty($input['case_id']) ? (int)$input['case_id'] : null,
                $input['invoice_date'] ?? null,
                $input['amount'] ?? 0,
                $input['currency'] ?? 'EGP',
                $input['usd_amount'] ?? null,
                $input['invoice_details'] ?? '',
                $input['invoice_status'] ?? 'draft',
                $input['invoice_type'] ?? 'service',
                isset($input['has_vat']) ? (int)$input['has_vat'] : 0,
                !empty($input['payment_date']) ? $input['payment_date'] : null,
                isset($input['report_generated']) ? (int)$input['report_generated'] : 0,
                $id
            ]
        );

        if ($result) {
            $updatedInvoice = $db->fetch(
                "SELECT * FROM invoices WHERE id = ?",
                [$id]
            );

            echo json_encode([
                'success' => true,
                'data' => $updatedInvoice,
                'message' => 'Invoice updated successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update invoice']);
        }
    } catch (Exception $e) {
        error_log("Update invoice error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update invoice']);
    }
}

function handleDeleteInvoice($id) {
    $db = Database::getInstance();

    try {
        // Check if invoice exists
        $existing = $db->fetch("SELECT id FROM invoices WHERE id = ?", [$id]);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Invoice not found']);
            return;
        }

        $result = $db->execute("DELETE FROM invoices WHERE id = ?", [$id]);

        if ($result) {
            http_response_code(204);
            echo json_encode([
                'success' => true,
                'message' => 'Invoice deleted successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete invoice']);
        }
    } catch (Exception $e) {
        error_log("Delete invoice error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete invoice']);
    }
}

// Options handler functions
function handleGetHearingOptions() {
    try {
        echo json_encode([
            'success' => true,
            'data' => [
                'type' => [
                    'initial' => 'أولى',
                    'procedural' => 'إجرائية',
                    'evidence' => 'بينات',
                    'witness' => 'شهود',
                    'expert' => 'خبراء',
                    'final' => 'نهائية',
                    'appeal' => 'استئناف',
                    'execution' => 'تنفيذ'
                ],
                'result' => [
                    'won' => 'لصالح',
                    'lost' => 'ضد',
                    'postponed' => 'مؤجلة',
                    'pending' => 'معلقة',
                    'settled' => 'تسوية'
                ],
                'duration' => [
                    '30m' => '30 دقيقة',
                    '1h' => 'ساعة',
                    '1h30m' => 'ساعة ونصف',
                    '2h' => 'ساعتان',
                    '3h' => 'ثلاث ساعات',
                    'full_day' => 'يوم كامل'
                ]
            ]
        ]);
    } catch (Exception $e) {
        error_log("Get hearing options error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch hearing options']);
    }
}

function handleGetCaseOptions() {
    try {
        echo json_encode([
            'success' => true,
            'data' => [
                'status' => [
                    'active' => 'نشطة',
                    'closed' => 'مغلقة',
                    'suspended' => 'معلقة',
                    'appealed' => 'مستأنفة',
                    'settled' => 'محسومة'
                ],
                'category' => [
                    'civil' => 'مدنية',
                    'criminal' => 'جنائية',
                    'commercial' => 'تجارية',
                    'administrative' => 'إدارية',
                    'family' => 'أحوال شخصية',
                    'labor' => 'عمالية',
                    'tax' => 'ضريبية'
                ],
                'importance' => [
                    'high' => 'عالية',
                    'medium' => 'متوسطة',
                    'low' => 'منخفضة'
                ],
                'degree' => [
                    'first' => 'أولى',
                    'appeal' => 'استئناف',
                    'cassation' => 'نقض',
                    'execution' => 'تنفيذ'
                ]
            ]
        ]);
    } catch (Exception $e) {
        error_log("Get case options error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch case options']);
    }
}

function handleGetClientOptions() {
    try {
        echo json_encode([
            'success' => true,
            'data' => [
                'type' => [
                    'individual' => 'فرد',
                    'company' => 'شركة'
                ],
                'status' => [
                    'active' => 'نشط',
                    'disabled' => 'معطل',
                    'inactive' => 'غير نشط'
                ],
                'cash_pro_bono' => [
                    'cash' => 'نقدي',
                    'probono' => 'مجاني'
                ]
            ]
        ]);
    } catch (Exception $e) {
        error_log("Get client options error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch client options']);
    }
}

// Reports handler functions
function handleReportsDashboard() {
    $db = Database::getInstance();

    try {
        // Get basic counts for dashboard
        $clientsResult = $db->fetch("SELECT COUNT(*) as count FROM clients");
        $clientsCount = $clientsResult['count'] ?? 0;

        $casesResult = $db->fetch("SELECT COUNT(*) as count FROM cases");
        $casesCount = $casesResult['count'] ?? 0;

        $hearingsResult = $db->fetch("SELECT COUNT(*) as count FROM hearings");
        $hearingsCount = $hearingsResult['count'] ?? 0;

        $invoicesResult = $db->fetch("SELECT COUNT(*) as count FROM invoices");
        $invoicesCount = $invoicesResult['count'] ?? 0;

        $lawyersResult = $db->fetch("SELECT COUNT(*) as count FROM lawyers");
        $lawyersCount = $lawyersResult['count'] ?? 0;

        // Get case statistics by status
        $caseStats = [];
        $caseStatsResult = $db->fetchAll("
            SELECT matter_status, COUNT(*) as count
            FROM cases
            WHERE matter_status IS NOT NULL
            GROUP BY matter_status
        ");
        foreach ($caseStatsResult as $stat) {
            $caseStats[$stat['matter_status']] = (int)$stat['count'];
        }

        // Get upcoming hearings
        $upcomingHearings = $db->fetchAll("
            SELECT h.id, h.hearing_date, h.hearing_type,
                   c.matter_ar, cl.client_name_ar
            FROM hearings h
            LEFT JOIN cases c ON h.case_id = c.id
            LEFT JOIN clients cl ON c.client_id = cl.id
            WHERE h.hearing_date >= CURDATE()
            ORDER BY h.hearing_date ASC
            LIMIT 10
        ");

        // Get recent activities (simplified)
        $recentActivities = [
            [
                'type' => 'case',
                'name' => 'إضافة قضية جديدة',
                'action' => 'تم إنشاؤها',
                'created_at' => date('Y-m-d H:i:s')
            ]
        ];

        echo json_encode([
            'success' => true,
            'data' => [
                'total_clients' => $clientsCount,
                'total_cases' => $casesCount,
                'total_hearings' => $hearingsCount,
                'total_invoices' => $invoicesCount,
                'total_lawyers' => $lawyersCount,
                'case_statistics' => $caseStats,
                'upcoming_hearings' => $upcomingHearings,
                'recent_activities' => $recentActivities,
                'financial_summary' => [
                    'total_revenue' => 0,
                    'paid_amount' => 0,
                    'pending_amount' => 0,
                    'paid_count' => 0,
                    'pending_count' => 0,
                    'overdue_count' => 0
                ],
                'hearing_statistics' => [
                    'scheduled' => $hearingsCount
                ],
                'revenue_trend' => []
            ]
        ]);
    } catch (Exception $e) {
        error_log("Dashboard API Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to load dashboard data: ' . $e->getMessage()]);
    }
}

function handleReportsTemplates() {
    echo json_encode([
        'success' => true,
        'data' => [
            [
                'id' => 'client_cases',
                'name' => 'Client Cases Report',
                'description' => 'Generate report for specific client with all cases',
                'type' => 'client'
            ]
        ]
    ]);
}

function handleClientReport() {
    $clientId = $_GET['client_id'] ?? null;
    $format = $_GET['format'] ?? 'pdf';
    $template = $_GET['template'] ?? 'franke';

    if (!$clientId) {
        http_response_code(400);
        echo json_encode(['error' => 'Client ID is required']);
        return;
    }

    $db = Database::getInstance();

    try {
        // Get client information
        $client = $db->fetch("SELECT * FROM clients WHERE id = ?", [$clientId]);

        if (!$client) {
            http_response_code(404);
            echo json_encode(['error' => 'Client not found']);
            return;
        }

        // Get client's cases
        $cases = $db->fetchAll(
            "SELECT * FROM cases WHERE client_id = ? ORDER BY created_at DESC",
            [$clientId]
        );

        // Generate report HTML based on template
        if ($template === 'franke') {
            $html = generateFrankeReport($client, $cases, $format);
        } else {
            $html = generateBasicReport($client, $cases, $format);
        }

        $filename = "client_report_" . $client['client_name_en'] . "_" . date('Y-m-d_H-i-s') . "." . $format;

        echo json_encode([
            'success' => true,
            'data' => [
                'client_name' => $client['client_name_ar'] ?: $client['client_name_en'],
                'total_cases' => count($cases),
                'generated_at' => date('Y-m-d H:i:s'),
                'filename' => $filename,
                'type' => $format === 'pdf' ? 'html_for_pdf' : 'html_for_jpg',
                'html_content' => $html
            ]
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to generate report']);
    }
}

function generateFrankeReport($client, $cases, $format) {
    $clientName = $client['client_name_ar'] ?: $client['client_name_en'];
    $totalCases = count($cases);
    $currentDate = date('Y/m/d');
    $currentTime = date('h:i A');

    // Generate case rows
    $caseRows = '';
    $serial = 1;
    foreach ($cases as $case) {
        $caseRows .= '<tr>';
        $caseRows .= '<td style="border: 1px solid #000; padding: 8px; text-align: center;">' . $serial . '</td>';
        $caseRows .= '<td style="border: 1px solid #000; padding: 8px;">' . ($case['matter_id'] ?: '-') . '</td>';
        $caseRows .= '<td style="border: 1px solid #000; padding: 8px;">' . ($case['matter_court'] ?: '-') . '</td>';
        $caseRows .= '<td style="border: 1px solid #000; padding: 8px;">' . ($case['client_capacity'] ?: '-') . '</td>';
        $caseRows .= '<td style="border: 1px solid #000; padding: 8px;">' . ($case['opponent_capacity'] ?: '-') . '</td>';
        $caseRows .= '<td style="border: 1px solid #000; padding: 8px;">' . ($case['matter_subject'] ?: '-') . '</td>';
        $caseRows .= '<td style="border: 1px solid #000; padding: 8px;">' . ($case['matter_status'] ?: '-') . '</td>';
        $caseRows .= '</tr>';
        $serial++;
    }

    $html = '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بيان بموقف ' . htmlspecialchars($clientName) . '</title>
    <style>
        @font-face {
            font-family: "NotoSansArabic";
            src: url("https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap");
        }
        body {
            font-family: "NotoSansArabic", Arial, sans-serif;
            margin: 20px;
            direction: rtl;
            line-height: 1.6;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
        }
        .logo {
            font-weight: bold;
            font-size: 18px;
        }
        .logo-left {
            color: #2d5016;
        }
        .logo-right {
            color: #d32f2f;
            background: #d32f2f;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
        }
        .title {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin: 30px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th {
            background-color: #f5f5f5;
            border: 1px solid #000;
            padding: 12px 8px;
            text-align: center;
            font-weight: bold;
        }
        td {
            border: 1px solid #000;
            padding: 8px;
            text-align: right;
        }
        .summary {
            margin: 20px 0;
            text-align: right;
        }
        .summary span {
            background-color: #f0f0f0;
            padding: 5px 10px;
            margin-right: 10px;
        }
        .footer {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #666;
        }
        @media print {
            body { margin: 0; }
            .header { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo logo-left">صارى الدين ومشاركوه</div>
        <div class="logo logo-right">FRANKE</div>
    </div>

    <div class="title">بيان بموقف ' . htmlspecialchars($clientName) . '</div>

    <table>
        <thead>
            <tr>
                <th>م</th>
                <th>رقم الدعوى</th>
                <th>المحكمة</th>
                <th>الموكل وصفته</th>
                <th>المخصم وصفته</th>
                <th>موضوع الدعوى</th>
                <th>قرار آخر جلسة/إجراء</th>
            </tr>
        </thead>
        <tbody>
            ' . $caseRows . '
        </tbody>
    </table>

    <div class="summary">
        <strong>إجمالي عدد الدعاوى:</strong> <span>' . $totalCases . '</span>
    </div>

    <div class="footer">
        <div>صفحة ١ من ١</div>
        <div>' . $currentDate . ' ' . $currentTime . '</div>
    </div>
</body>
</html>';

    return $html;
}

function generateBasicReport($client, $cases, $format) {
    // Basic report template
    return '<html><body><h1>Basic Report</h1><p>Client: ' . htmlspecialchars($client['client_name_ar'] ?: $client['client_name_en']) . '</p></body></html>';
}

// Lawyers handler functions
function handleGetLawyers() {
    $db = Database::getInstance();

    try {
        // Get pagination parameters
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        // Get filters
        $search = $_GET['search'] ?? '';
        $is_active = $_GET['is_active'] ?? '';

        // Build WHERE clause
        $whereClause = '1=1';
        $params = [];

        if (!empty($search)) {
            $whereClause .= ' AND (lawyer_name_ar LIKE ? OR lawyer_name_en LIKE ? OR lawyer_email LIKE ?)';
            $searchParam = '%' . $search . '%';
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
        }

        if ($is_active !== '') {
            $whereClause .= ' AND is_active = ?';
            $params[] = (int)$is_active;
        }

        // Get total count
        $totalResult = $db->fetch("SELECT COUNT(*) as total FROM lawyers WHERE {$whereClause}", $params);
        $total = $totalResult['total'] ?? 0;

        // Get lawyers with pagination
        $lawyers = $db->fetchAll("
            SELECT *
            FROM lawyers
            WHERE {$whereClause}
            ORDER BY lawyer_name_ar
            LIMIT $limit OFFSET $offset
        ", $params);

        // Calculate pagination info
        $totalPages = ceil($total / $limit);

        echo json_encode([
            'success' => true,
            'data' => [
                'data' => $lawyers,
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $limit,
                    'total' => $total,
                    'total_pages' => $totalPages,
                    'has_next' => $page < $totalPages,
                    'has_prev' => $page > 1,
                    'next_page' => $page < $totalPages ? $page + 1 : null,
                    'prev_page' => $page > 1 ? $page - 1 : null
                ]
            ]
        ]);
    } catch (Exception $e) {
        error_log("Get lawyers error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch lawyers']);
    }
}

function handleGetLawyer($id) {
    $db = Database::getInstance();

    try {
        $lawyer = $db->fetch("SELECT * FROM lawyers WHERE id = ?", [$id]);

        if ($lawyer) {
            echo json_encode([
                'success' => true,
                'data' => $lawyer
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Lawyer not found']);
        }
    } catch (Exception $e) {
        error_log("Get lawyer error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to retrieve lawyer']);
    }
}

function handleCreateLawyer() {
    $db = Database::getInstance();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }

    // Validate required fields
    if (empty($input['lawyer_name_ar'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Arabic name is required']);
        return;
    }

    try {
        $result = $db->execute(
            "INSERT INTO lawyers (lawyer_name_ar, lawyer_name_en, lawyer_email, is_active) VALUES (?, ?, ?, ?)",
            [
                $input['lawyer_name_ar'],
                $input['lawyer_name_en'] ?? '',
                $input['lawyer_email'] ?? '',
                isset($input['is_active']) ? (int)$input['is_active'] : 1
            ]
        );

        if ($result) {
            $newId = $db->lastInsertId();
            $newLawyer = $db->fetch("SELECT * FROM lawyers WHERE id = ?", [$newId]);

            echo json_encode([
                'success' => true,
                'data' => $newLawyer,
                'message' => 'Lawyer created successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create lawyer']);
        }
    } catch (Exception $e) {
        error_log("Create lawyer error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create lawyer']);
    }
}

function handleUpdateLawyer($id) {
    $db = Database::getInstance();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }

    try {
        // Check if lawyer exists
        $existing = $db->fetch("SELECT id FROM lawyers WHERE id = ?", [$id]);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Lawyer not found']);
            return;
        }

        $result = $db->execute(
            "UPDATE lawyers SET lawyer_name_ar = ?, lawyer_name_en = ?, lawyer_email = ?, is_active = ? WHERE id = ?",
            [
                $input['lawyer_name_ar'],
                $input['lawyer_name_en'] ?? '',
                $input['lawyer_email'] ?? '',
                isset($input['is_active']) ? (int)$input['is_active'] : 1,
                $id
            ]
        );

        if ($result) {
            $updatedLawyer = $db->fetch("SELECT * FROM lawyers WHERE id = ?", [$id]);

            echo json_encode([
                'success' => true,
                'data' => $updatedLawyer,
                'message' => 'Lawyer updated successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update lawyer']);
        }
    } catch (Exception $e) {
        error_log("Update lawyer error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update lawyer']);
    }
}

function handleDeleteLawyer($id) {
    $db = Database::getInstance();

    try {
        // Check if lawyer exists
        $existing = $db->fetch("SELECT id FROM lawyers WHERE id = ?", [$id]);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Lawyer not found']);
            return;
        }

        $result = $db->execute("DELETE FROM lawyers WHERE id = ?", [$id]);

        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Lawyer deleted successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete lawyer']);
        }
    } catch (Exception $e) {
        error_log("Delete lawyer error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete lawyer']);
    }
}

// Documents handler functions
function handleGetDocuments() {
    $db = Database::getInstance();

    try {
        // Get pagination parameters
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        // Get filters
        $search = $_GET['search'] ?? '';
        $document_type = $_GET['document_type'] ?? '';
        $entity_type = $_GET['entity_type'] ?? '';
        $entity_id = $_GET['entity_id'] ?? '';
        $uploaded_by = $_GET['uploaded_by'] ?? '';
        $date_from = $_GET['date_from'] ?? '';
        $date_to = $_GET['date_to'] ?? '';

        // Build WHERE clause
        $whereClause = '1=1';
        $params = [];

        if (!empty($search)) {
            $whereClause .= ' AND (d.title LIKE ? OR d.description LIKE ? OR d.original_filename LIKE ?)';
            $searchParam = '%' . $search . '%';
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
        }

        if (!empty($document_type)) {
            $whereClause .= ' AND d.document_type = ?';
            $params[] = $document_type;
        }

        if (!empty($entity_type)) {
            $whereClause .= ' AND d.entity_type = ?';
            $params[] = $entity_type;
        }

        if (!empty($entity_id)) {
            $whereClause .= ' AND d.entity_id = ?';
            $params[] = $entity_id;
        }

        if (!empty($uploaded_by)) {
            $whereClause .= ' AND d.uploaded_by = ?';
            $params[] = $uploaded_by;
        }

        if (!empty($date_from)) {
            $whereClause .= ' AND DATE(d.created_at) >= ?';
            $params[] = $date_from;
        }

        if (!empty($date_to)) {
            $whereClause .= ' AND DATE(d.created_at) <= ?';
            $params[] = $date_to;
        }

        // Get total count
        $totalResult = $db->fetch("SELECT COUNT(*) as total FROM documents d WHERE {$whereClause}", $params);
        $total = $totalResult['total'] ?? 0;

        // Get documents with pagination and uploader info
        $documents = $db->fetchAll("
            SELECT d.*, u.full_name_ar as uploader_name,
                   CASE
                       WHEN d.entity_type = 'client' THEN (SELECT client_name_ar FROM clients WHERE id = d.entity_id)
                       WHEN d.entity_type = 'case' THEN (SELECT matter_ar FROM cases WHERE id = d.entity_id)
                       ELSE NULL
                   END as entity_name,
                   CASE
                       WHEN d.entity_type = 'client' THEN (SELECT client_name_en FROM clients WHERE id = d.entity_id)
                       WHEN d.entity_type = 'case' THEN (SELECT matter_en FROM cases WHERE id = d.entity_id)
                       ELSE NULL
                   END as entity_name_en
            FROM documents d
            LEFT JOIN users u ON d.uploaded_by = u.id
            WHERE {$whereClause}
            ORDER BY d.created_at DESC
            LIMIT $limit OFFSET $offset
        ", $params);

        // Calculate pagination info
        $totalPages = ceil($total / $limit);

        echo json_encode([
            'success' => true,
            'data' => [
                'data' => $documents,
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $limit,
                    'total' => $total,
                    'total_pages' => $totalPages,
                    'has_next' => $page < $totalPages,
                    'has_prev' => $page > 1,
                    'next_page' => $page < $totalPages ? $page + 1 : null,
                    'prev_page' => $page > 1 ? $page - 1 : null
                ]
            ]
        ]);
    } catch (Exception $e) {
        error_log("Get documents error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch documents']);
    }
}

function handleGetDocumentStats() {
    $db = Database::getInstance();

    try {
        // Get total documents count
        $totalResult = $db->fetch("SELECT COUNT(*) as total FROM documents");
        $total = $totalResult['total'] ?? 0;

        // Get counts by document type
        $typeStats = $db->fetchAll("
            SELECT document_type, COUNT(*) as count
            FROM documents
            GROUP BY document_type
        ");

        $stats = [
            'total_documents' => $total,
            'contracts' => 0,
            'evidence' => 0,
            'correspondence' => 0,
            'legal_memos' => 0,
            'court_filings' => 0,
            'other' => 0
        ];

        foreach ($typeStats as $stat) {
            $type = $stat['document_type'];
            $count = $stat['count'];

            switch ($type) {
                case 'contract':
                    $stats['contracts'] = $count;
                    break;
                case 'evidence':
                    $stats['evidence'] = $count;
                    break;
                case 'correspondence':
                    $stats['correspondence'] = $count;
                    break;
                case 'legal_memo':
                    $stats['legal_memos'] = $count;
                    break;
                case 'court_filing':
                    $stats['court_filings'] = $count;
                    break;
                default:
                    $stats['other'] += $count;
                    break;
            }
        }

        // Get total file size
        $sizeResult = $db->fetch("SELECT SUM(file_size) as total_size FROM documents");
        $totalSize = $sizeResult['total_size'] ?? 0;
        $stats['total_size_mb'] = round($totalSize / (1024 * 1024), 2);

        // Get public/private counts
        $publicResult = $db->fetch("SELECT COUNT(*) as count FROM documents WHERE is_public = 1");
        $privateResult = $db->fetch("SELECT COUNT(*) as count FROM documents WHERE is_public = 0");

        $stats['public_documents'] = $publicResult['count'] ?? 0;
        $stats['private_documents'] = $privateResult['count'] ?? 0;

        echo json_encode([
            'success' => true,
            'data' => $stats
        ]);
    } catch (Exception $e) {
        error_log("Get document stats error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch document statistics']);
    }
}

function handleGetDocumentOptions() {
    $db = Database::getInstance();

    try {
        // Get clients for dropdown
        $clients = $db->fetchAll("
            SELECT id, client_name_ar as name_ar, client_name_en as name_en
            FROM clients
            ORDER BY client_name_ar
        ");

        // Get cases for dropdown
        $cases = $db->fetchAll("
            SELECT id, matter_ar, matter_en, client_id
            FROM cases
            ORDER BY matter_ar
        ");

        // Get users for uploader dropdown
        $users = $db->fetchAll("
            SELECT id, full_name_ar as name, email
            FROM users
            WHERE is_active = 1
            ORDER BY full_name_ar
        ");

        echo json_encode([
            'success' => true,
            'data' => [
                'clients' => $clients,
                'cases' => $cases,
                'users' => $users,
                'document_types' => [
                    'contract' => 'عقد',
                    'evidence' => 'دليل',
                    'correspondence' => 'مراسلات',
                    'legal_memo' => 'مذكرة قانونية',
                    'court_filing' => 'مذكرة محكمة',
                    'power_of_attorney' => 'توكيل',
                    'settlement' => 'تسوية',
                    'judgment' => 'حكم',
                    'appeal' => 'استئناف',
                    'expert_report' => 'تقرير خبير',
                    'financial_document' => 'مستند مالي',
                    'identification' => 'هوية',
                    'other' => 'أخرى'
                ],
                'entity_types' => [
                    'client' => 'عميل',
                    'case' => 'قضية',
                    'hearing' => 'جلسة',
                    'invoice' => 'فاتورة',
                    'general' => 'عام'
                ]
            ]
        ]);
    } catch (Exception $e) {
        error_log("Get document options error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch document options']);
    }
}

function handleCreateDocument() {
    $db = Database::getInstance();

    try {
        // Check if file was uploaded
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'No file uploaded or upload error']);
            return;
        }

        // Get form data
        $title = $_POST['title'] ?? '';
        $description = $_POST['description'] ?? '';
        $document_type = $_POST['document_type'] ?? 'other';
        $entity_type = $_POST['entity_type'] ?? null;
        $entity_id = !empty($_POST['entity_id']) ? (int)$_POST['entity_id'] : null;
        $is_public = isset($_POST['is_public']) ? (bool)$_POST['is_public'] : false;
        $tags = $_POST['tags'] ?? '';

        // Validate required fields
        if (empty($title)) {
            http_response_code(400);
            echo json_encode(['error' => 'Title is required']);
            return;
        }

        // Get file info
        $file = $_FILES['file'];
        $originalFilename = $file['name'];
        $fileSize = $file['size'];
        $mimeType = $file['type'];
        $tempPath = $file['tmp_name'];

        // Generate unique filename
        $extension = pathinfo($originalFilename, PATHINFO_EXTENSION);
        $storedFilename = uniqid() . '_' . time() . '.' . $extension;

        // Create uploads directory if it doesn't exist
        $uploadDir = __DIR__ . '/../uploads/documents/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filePath = $uploadDir . $storedFilename;
        $relativeFilePath = 'uploads/documents/' . $storedFilename;

        // Move uploaded file
        if (!move_uploaded_file($tempPath, $filePath)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save uploaded file']);
            return;
        }

        // Get current user ID (simplified for now)
        $uploadedBy = 1; // Default admin user

        // Insert document record
        $result = $db->execute(
            "INSERT INTO documents (title, description, document_type, entity_type, entity_id,
             original_filename, stored_filename, file_path, file_size, mime_type, uploaded_by,
             is_public, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $title,
                $description,
                $document_type,
                $entity_type,
                $entity_id,
                $originalFilename,
                $storedFilename,
                $relativeFilePath,
                $fileSize,
                $mimeType,
                $uploadedBy,
                $is_public ? 1 : 0,
                $tags
            ]
        );

        if ($result) {
            $newId = $db->lastInsertId();
            $newDocument = $db->fetch("
                SELECT d.*, u.full_name_ar as uploader_name
                FROM documents d
                LEFT JOIN users u ON d.uploaded_by = u.id
                WHERE d.id = ?
            ", [$newId]);

            echo json_encode([
                'success' => true,
                'data' => $newDocument,
                'message' => 'Document uploaded successfully'
            ]);
        } else {
            // Clean up file if database insert failed
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save document record']);
        }
    } catch (Exception $e) {
        error_log("Create document error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload document']);
    }
}

function handleGetDocument($id) {
    $db = Database::getInstance();

    try {
        $document = $db->fetch("
            SELECT d.*, u.full_name_ar as uploader_name
            FROM documents d
            LEFT JOIN users u ON d.uploaded_by = u.id
            WHERE d.id = ?
        ", [$id]);

        if ($document) {
            echo json_encode([
                'success' => true,
                'data' => $document
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Document not found']);
        }
    } catch (Exception $e) {
        error_log("Get document error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to retrieve document']);
    }
}

function handleUpdateDocument($id) {
    $db = Database::getInstance();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }

    try {
        // Check if document exists
        $existing = $db->fetch("SELECT id FROM documents WHERE id = ?", [$id]);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Document not found']);
            return;
        }

        // Validate required fields
        if (empty($input['title'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Title is required']);
            return;
        }

        $result = $db->execute(
            "UPDATE documents SET title = ?, description = ?, document_type = ?,
             entity_type = ?, entity_id = ?, is_public = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?",
            [
                $input['title'],
                $input['description'] ?? '',
                $input['document_type'] ?? 'other',
                !empty($input['entity_type']) ? $input['entity_type'] : null,
                !empty($input['entity_id']) ? (int)$input['entity_id'] : null,
                isset($input['is_public']) ? (int)$input['is_public'] : 0,
                $input['tags'] ?? '',
                $id
            ]
        );

        if ($result) {
            $updatedDocument = $db->fetch("
                SELECT d.*, u.full_name_ar as uploader_name
                FROM documents d
                LEFT JOIN users u ON d.uploaded_by = u.id
                WHERE d.id = ?
            ", [$id]);

            echo json_encode([
                'success' => true,
                'data' => $updatedDocument,
                'message' => 'Document updated successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update document']);
        }
    } catch (Exception $e) {
        error_log("Update document error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update document']);
    }
}

function handleDeleteDocument($id) {
    $db = Database::getInstance();

    try {
        // Check if document exists
        $existing = $db->fetch("SELECT id, file_path FROM documents WHERE id = ?", [$id]);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Document not found']);
            return;
        }

        $result = $db->execute("DELETE FROM documents WHERE id = ?", [$id]);

        if ($result) {
            // Optionally delete the physical file here
            // unlink($existing['file_path']);

            echo json_encode([
                'success' => true,
                'message' => 'Document deleted successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete document']);
        }
    } catch (Exception $e) {
        error_log("Delete document error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete document']);
    }
}

function handleDownloadDocument($id) {
    $db = Database::getInstance();

    try {
        // Get document info
        $document = $db->fetch("
            SELECT * FROM documents WHERE id = ?
        ", [$id]);

        if (!$document) {
            http_response_code(404);
            echo json_encode(['error' => 'Document not found']);
            return;
        }

        // Build full file path
        $filePath = __DIR__ . '/../' . $document['file_path'];

        // Check if file exists
        if (!file_exists($filePath)) {
            http_response_code(404);
            echo json_encode(['error' => 'File not found on disk']);
            return;
        }

        // Set headers for file download
        header('Content-Type: ' . $document['mime_type']);
        header('Content-Disposition: attachment; filename="' . $document['original_filename'] . '"');
        header('Content-Length: ' . $document['file_size']);
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache');

        // Stream the file
        readfile($filePath);
        exit;

    } catch (Exception $e) {
        error_log("Download document error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to download document']);
    }
}

// Additional Reports handler functions
function handleClientsReport() {
    $db = Database::getInstance();

    try {
        // Get filters from query parameters
        $filters = [];
        $params = [];
        $whereConditions = [];

        if (!empty($_GET['status'])) {
            $whereConditions[] = "c.status = ?";
            $params[] = $_GET['status'];
            $filters['status'] = $_GET['status'];
        }

        if (!empty($_GET['client_type'])) {
            $whereConditions[] = "c.client_type = ?";
            $params[] = $_GET['client_type'];
            $filters['client_type'] = $_GET['client_type'];
        }

        if (!empty($_GET['date_from'])) {
            $whereConditions[] = "c.created_at >= ?";
            $params[] = $_GET['date_from'];
            $filters['date_from'] = $_GET['date_from'];
        }

        if (!empty($_GET['date_to'])) {
            $whereConditions[] = "c.created_at <= ?";
            $params[] = $_GET['date_to'] . ' 23:59:59';
            $filters['date_to'] = $_GET['date_to'];
        }

        $whereClause = '';
        if (!empty($whereConditions)) {
            $whereClause = 'WHERE ' . implode(' AND ', $whereConditions);
        }

        // Get clients data
        $sql = "SELECT c.*,
                       COUNT(cases.id) as total_cases,
                       COUNT(CASE WHEN cases.matter_status = 'active' THEN 1 END) as active_cases,
                       COUNT(CASE WHEN cases.matter_status = 'closed' THEN 1 END) as closed_cases
                FROM clients c
                LEFT JOIN cases ON c.id = cases.client_id
                $whereClause
                GROUP BY c.id
                ORDER BY c.created_at DESC";

        $clients = $db->fetchAll($sql, $params);

        // Get summary statistics
        $summarySQL = "SELECT
                         COUNT(*) as total_clients,
                         COUNT(CASE WHEN status = 'active' THEN 1 END) as active_clients,
                         COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_clients,
                         COUNT(CASE WHEN client_type = 'individual' THEN 1 END) as individual_clients,
                         COUNT(CASE WHEN client_type = 'company' THEN 1 END) as company_clients
                       FROM clients c $whereClause";

        $summary = $db->fetch($summarySQL, $params);

        echo json_encode([
            'success' => true,
            'data' => $clients,
            'summary' => $summary,
            'filters' => $filters,
            'available_columns' => [
                'client_name_ar' => 'اسم العميل (عربي)',
                'client_name_en' => 'اسم العميل (إنجليزي)',
                'client_type' => 'نوع العميل',
                'status' => 'الحالة',
                'email' => 'البريد الإلكتروني',
                'phone' => 'الهاتف',
                'total_cases' => 'إجمالي القضايا',
                'active_cases' => 'القضايا النشطة',
                'closed_cases' => 'القضايا المغلقة',
                'created_at' => 'تاريخ الإنشاء'
            ]
        ]);

    } catch (Exception $e) {
        error_log("Clients report error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to generate clients report']);
    }
}

function handleCasesReport() {
    $db = Database::getInstance();

    try {
        // Get filters from query parameters
        $filters = [];
        $params = [];
        $whereConditions = [];

        if (!empty($_GET['status'])) {
            $whereConditions[] = "cases.matter_status = ?";
            $params[] = $_GET['status'];
            $filters['status'] = $_GET['status'];
        }

        if (!empty($_GET['matter_category'])) {
            $whereConditions[] = "cases.matter_category = ?";
            $params[] = $_GET['matter_category'];
            $filters['matter_category'] = $_GET['matter_category'];
        }

        if (!empty($_GET['matter_importance'])) {
            $whereConditions[] = "cases.matter_importance = ?";
            $params[] = $_GET['matter_importance'];
            $filters['matter_importance'] = $_GET['matter_importance'];
        }

        if (!empty($_GET['date_from'])) {
            $whereConditions[] = "cases.created_at >= ?";
            $params[] = $_GET['date_from'];
            $filters['date_from'] = $_GET['date_from'];
        }

        if (!empty($_GET['date_to'])) {
            $whereConditions[] = "cases.created_at <= ?";
            $params[] = $_GET['date_to'] . ' 23:59:59';
            $filters['date_to'] = $_GET['date_to'];
        }

        $whereClause = '';
        if (!empty($whereConditions)) {
            $whereClause = 'WHERE ' . implode(' AND ', $whereConditions);
        }

        // Get cases data with client information
        $sql = "SELECT cases.*,
                       c.client_name_ar,
                       c.client_name_en,
                       COUNT(h.id) as total_hearings,
                       COUNT(CASE WHEN h.hearing_result = 'pending' THEN 1 END) as pending_hearings,
                       COUNT(CASE WHEN h.hearing_result = 'won' THEN 1 END) as won_hearings
                FROM cases
                LEFT JOIN clients c ON cases.client_id = c.id
                LEFT JOIN hearings h ON cases.id = h.case_id
                $whereClause
                GROUP BY cases.id
                ORDER BY cases.created_at DESC";

        $cases = $db->fetchAll($sql, $params);

        // Get summary statistics
        $summarySQL = "SELECT
                         COUNT(*) as total_cases,
                         COUNT(CASE WHEN matter_status = 'active' THEN 1 END) as active_cases,
                         COUNT(CASE WHEN matter_status = 'closed' THEN 1 END) as closed_cases,
                         COUNT(CASE WHEN matter_importance = 'high' THEN 1 END) as high_importance_cases,
                         COUNT(CASE WHEN matter_importance = 'medium' THEN 1 END) as medium_importance_cases,
                         COUNT(CASE WHEN matter_importance = 'low' THEN 1 END) as low_importance_cases
                       FROM cases $whereClause";

        $summary = $db->fetch($summarySQL, $params);

        echo json_encode([
            'success' => true,
            'data' => $cases,
            'summary' => $summary,
            'filters' => $filters,
            'available_columns' => [
                'matter_ar' => 'موضوع القضية (عربي)',
                'matter_en' => 'موضوع القضية (إنجليزي)',
                'matter_court' => 'المحكمة',
                'status' => 'الحالة',
                'case_type' => 'نوع القضية',
                'priority' => 'الأولوية',
                'client_name_ar' => 'اسم العميل',
                'total_hearings' => 'إجمالي الجلسات',
                'scheduled_hearings' => 'الجلسات المجدولة',
                'completed_hearings' => 'الجلسات المكتملة',
                'created_at' => 'تاريخ الإنشاء'
            ]
        ]);

    } catch (Exception $e) {
        error_log("Cases report error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to generate cases report']);
    }
}

function handleHearingsReport() {
    $db = Database::getInstance();

    try {
        // Get filters from query parameters
        $filters = [];
        $params = [];
        $whereConditions = [];

        if (!empty($_GET['hearing_result'])) {
            $whereConditions[] = "h.hearing_result = ?";
            $params[] = $_GET['hearing_result'];
            $filters['hearing_result'] = $_GET['hearing_result'];
        }

        if (!empty($_GET['hearing_type'])) {
            $whereConditions[] = "h.hearing_type = ?";
            $params[] = $_GET['hearing_type'];
            $filters['hearing_type'] = $_GET['hearing_type'];
        }

        if (!empty($_GET['hearing_result'])) {
            $whereConditions[] = "h.hearing_result = ?";
            $params[] = $_GET['hearing_result'];
            $filters['hearing_result'] = $_GET['hearing_result'];
        }

        if (!empty($_GET['date_from'])) {
            $whereConditions[] = "h.hearing_date >= ?";
            $params[] = $_GET['date_from'];
            $filters['date_from'] = $_GET['date_from'];
        }

        if (!empty($_GET['date_to'])) {
            $whereConditions[] = "h.hearing_date <= ?";
            $params[] = $_GET['date_to'] . ' 23:59:59';
            $filters['date_to'] = $_GET['date_to'];
        }

        $whereClause = '';
        if (!empty($whereConditions)) {
            $whereClause = 'WHERE ' . implode(' AND ', $whereConditions);
        }

        // Get hearings data with case and client information
        $sql = "SELECT h.*,
                       cases.matter_ar,
                       cases.matter_court,
                       c.client_name_ar,
                       c.client_name_en
                FROM hearings h
                LEFT JOIN cases ON h.case_id = cases.id
                LEFT JOIN clients c ON cases.client_id = c.id
                $whereClause
                ORDER BY h.hearing_date DESC";

        $hearings = $db->fetchAll($sql, $params);

        // Get summary statistics
        $summarySQL = "SELECT
                         COUNT(*) as total_hearings,
                         COUNT(CASE WHEN hearing_result = 'pending' THEN 1 END) as pending_hearings,
                         COUNT(CASE WHEN hearing_result = 'won' THEN 1 END) as won_hearings,
                         COUNT(CASE WHEN hearing_result = 'lost' THEN 1 END) as lost_hearings,
                         COUNT(CASE WHEN hearing_result = 'postponed' THEN 1 END) as postponed_hearings
                       FROM hearings h $whereClause";

        $summary = $db->fetch($summarySQL, $params);

        echo json_encode([
            'success' => true,
            'data' => $hearings,
            'summary' => $summary,
            'filters' => $filters,
            'available_columns' => [
                'hearing_date' => 'تاريخ الجلسة',
                'hearing_type' => 'نوع الجلسة',
                'status' => 'الحالة',
                'outcome' => 'النتيجة',
                'notes' => 'ملاحظات',
                'matter_ar' => 'موضوع القضية',
                'matter_court' => 'المحكمة',
                'client_name_ar' => 'اسم العميل',
                'created_at' => 'تاريخ الإنشاء'
            ]
        ]);

    } catch (Exception $e) {
        error_log("Hearings report error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to generate hearings report']);
    }
}

function handleCustomReportOptions() {
    try {
        $type = $_GET['type'] ?? 'clients';

        $options = [
            'available_entities' => [
                'clients' => 'العملاء',
                'cases' => 'القضايا',
                'hearings' => 'الجلسات',
                'invoices' => 'الفواتير',
                'documents' => 'المستندات'
            ]
        ];

        switch ($type) {
            case 'clients':
                $options['available_columns'] = [
                    'client_name_ar' => 'اسم العميل (عربي)',
                    'client_name_en' => 'اسم العميل (إنجليزي)',
                    'client_type' => 'نوع العميل',
                    'status' => 'الحالة',
                    'email' => 'البريد الإلكتروني',
                    'phone' => 'الهاتف',
                    'address' => 'العنوان',
                    'created_at' => 'تاريخ الإنشاء'
                ];
                $options['available_filters'] = [
                    'status' => ['active' => 'نشط', 'inactive' => 'غير نشط'],
                    'client_type' => ['individual' => 'فرد', 'company' => 'شركة', 'government' => 'حكومي']
                ];
                break;

            case 'cases':
                $options['available_columns'] = [
                    'id' => 'معرف القضية',
                    'matter_id' => 'رقم القضية',
                    'matter_ar' => 'عنوان القضية (عربي)',
                    'matter_en' => 'عنوان القضية (إنجليزي)',
                    'matter_category' => 'نوع القضية',
                    'matter_status' => 'حالة القضية',
                    'matter_court' => 'اسم المحكمة',
                    'matter_subject' => 'موضوع القضية',
                    'created_at' => 'تاريخ الإنشاء'
                ];
                $options['available_filters'] = [
                    'matter_status' => ['active' => 'نشطة', 'closed' => 'مغلقة', 'suspended' => 'معلقة'],
                    'matter_category' => ['civil' => 'مدنية', 'criminal' => 'جنائية', 'commercial' => 'تجارية'],
                    'matter_importance' => ['high' => 'عالية', 'medium' => 'متوسطة', 'low' => 'منخفضة']
                ];
                break;

            case 'hearings':
                $options['available_columns'] = [
                    'hearing_date' => 'تاريخ الجلسة',
                    'hearing_type' => 'نوع الجلسة',
                    'status' => 'الحالة',
                    'outcome' => 'النتيجة',
                    'notes' => 'ملاحظات',
                    'matter_ar' => 'موضوع القضية',
                    'client_name_ar' => 'اسم العميل',
                    'created_at' => 'تاريخ الإنشاء'
                ];
                $options['available_filters'] = [
                    'status' => ['scheduled' => 'مجدولة', 'completed' => 'مكتملة', 'postponed' => 'مؤجلة'],
                    'hearing_type' => ['initial' => 'أولى', 'follow_up' => 'متابعة', 'final' => 'نهائية'],
                    'outcome' => ['for' => 'لصالح', 'against' => 'ضد', 'pending' => 'معلقة']
                ];
                break;

            case 'invoices':
                $options['available_columns'] = [
                    'id' => 'معرف الفاتورة',
                    'invoice_number' => 'رقم الفاتورة',
                    'invoice_date' => 'تاريخ الفاتورة',
                    'amount' => 'المبلغ',
                    'currency' => 'العملة',
                    'usd_amount' => 'المبلغ بالدولار',
                    'invoice_details' => 'تفاصيل الفاتورة',
                    'invoice_status' => 'حالة الفاتورة',
                    'invoice_type' => 'نوع الفاتورة',
                    'has_vat' => 'يتضمن ضريبة',
                    'payment_date' => 'تاريخ الدفع',
                    'contract_id' => 'رقم العقد',
                    'created_at' => 'تاريخ الإنشاء'
                ];
                $options['available_filters'] = [
                    'invoice_status' => ['paid' => 'مدفوعة', 'unpaid' => 'غير مدفوعة', 'partial' => 'مدفوعة جزئياً', 'cancelled' => 'ملغاة'],
                    'invoice_type' => ['service' => 'خدمة', 'consultation' => 'استشارة', 'retainer' => 'أتعاب مسبقة'],
                    'currency' => ['EGP' => 'جنيه مصري', 'USD' => 'دولار أمريكي', 'SAR' => 'ريال سعودي'],
                    'has_vat' => ['1' => 'نعم', '0' => 'لا']
                ];
                break;

            case 'documents':
                $options['available_columns'] = [
                    'id' => 'معرف الوثيقة',
                    'title' => 'عنوان الوثيقة',
                    'description' => 'الوصف',
                    'document_type' => 'نوع الوثيقة',
                    'entity_type' => 'نوع الكيان',
                    'entity_id' => 'معرف الكيان',
                    'original_filename' => 'اسم الملف الأصلي',
                    'file_size' => 'حجم الملف',
                    'mime_type' => 'نوع الملف',
                    'is_public' => 'عام',
                    'tags' => 'العلامات',
                    'created_at' => 'تاريخ الرفع'
                ];
                $options['available_filters'] = [
                    'document_type' => ['contract' => 'عقد', 'judgment' => 'حكم', 'pleading' => 'مرافعة', 'evidence' => 'دليل'],
                    'entity_type' => ['client' => 'عميل', 'case' => 'قضية', 'hearing' => 'جلسة'],
                    'is_public' => ['1' => 'عام', '0' => 'خاص'],
                    'mime_type' => ['application/pdf' => 'PDF', 'image/jpeg' => 'صورة', 'application/msword' => 'وورد']
                ];
                break;

            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid report type']);
                return;
        }

        echo json_encode([
            'success' => true,
            'data' => $options
        ]);

    } catch (Exception $e) {
        error_log("Custom report options error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to get custom report options']);
    }
}

function handleGenerateCustomReport() {
    $db = Database::getInstance();

    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON input']);
            return;
        }

        $entity = $input['entity'] ?? 'clients';
        $filters = $input['filters'] ?? [];
        $columns = $input['columns'] ?? [];
        $limit = $input['limit'] ?? 100;
        $page = $input['page'] ?? 1;
        $offset = ($page - 1) * $limit;

        $whereConditions = [];
        $params = [];

        // 🔧 FIX: Define available columns for each entity type
        $availableColumnsByEntity = [
            'clients' => [
                'id' => 'معرف العميل',
                'client_name_ar' => 'اسم العميل (عربي)',
                'client_name_en' => 'اسم العميل (إنجليزي)',
                'client_type' => 'نوع العميل',
                'phone' => 'رقم الهاتف',
                'email' => 'البريد الإلكتروني',
                'status' => 'الحالة',
                'created_at' => 'تاريخ التسجيل'
            ],
            'cases' => [
                'id' => 'معرف القضية',
                'matter_id' => 'رقم القضية',
                'matter_ar' => 'عنوان القضية (عربي)',
                'matter_en' => 'عنوان القضية (إنجليزي)',
                'matter_category' => 'نوع القضية',
                'matter_status' => 'حالة القضية',
                'matter_court' => 'اسم المحكمة',
                'matter_degree' => 'درجة القضية',
                'matter_importance' => 'أهمية القضية',
                'client_capacity' => 'صفة الموكل',
                'opponent_capacity' => 'صفة المخصم',
                'matter_subject' => 'موضوع القضية',
                'matter_start_date' => 'تاريخ بدء القضية',
                'matter_end_date' => 'تاريخ انتهاء القضية',
                'matter_asked_amount' => 'المبلغ المطلوب',
                'matter_judged_amount' => 'المبلغ المحكوم به',
                'created_at' => 'تاريخ الإنشاء'
            ],
            'hearings' => [
                'id' => 'معرف الجلسة',
                'hearing_date' => 'تاريخ الجلسة',
                'hearing_type' => 'نوع الجلسة',
                'hearing_result' => 'نتيجة الجلسة',
                'case_id' => 'معرف القضية',
                'hearing_decision' => 'قرار الجلسة',
                'last_decision' => 'آخر قرار',
                'hearing_duration' => 'مدة الجلسة',
                'next_hearing' => 'الجلسة القادمة',
                'court_notes' => 'ملاحظات المحكمة',
                'lawyer_notes' => 'ملاحظات المحامي',
                'created_at' => 'تاريخ الإنشاء'
            ],
            'invoices' => [
                'id' => 'معرف الفاتورة',
                'invoice_number' => 'رقم الفاتورة',
                'invoice_date' => 'تاريخ الفاتورة',
                'amount' => 'المبلغ',
                'currency' => 'العملة',
                'usd_amount' => 'المبلغ بالدولار',
                'invoice_details' => 'تفاصيل الفاتورة',
                'invoice_status' => 'حالة الفاتورة',
                'invoice_type' => 'نوع الفاتورة',
                'has_vat' => 'يتضمن ضريبة',
                'payment_date' => 'تاريخ الدفع',
                'contract_id' => 'رقم العقد',
                'created_at' => 'تاريخ الإنشاء'
            ],
            'documents' => [
                'id' => 'معرف الوثيقة',
                'title' => 'عنوان الوثيقة',
                'description' => 'الوصف',
                'document_type' => 'نوع الوثيقة',
                'entity_type' => 'نوع الكيان',
                'entity_id' => 'معرف الكيان',
                'original_filename' => 'اسم الملف الأصلي',
                'file_size' => 'حجم الملف',
                'mime_type' => 'نوع الملف',
                'is_public' => 'عام',
                'tags' => 'العلامات',
                'created_at' => 'تاريخ الرفع'
            ]
        ];

        $availableColumns = $availableColumnsByEntity[$entity] ?? [];

        // 🔧 FIX: Filter and validate selected columns
        $selectedColumns = [];
        if (!empty($columns) && is_array($columns)) {
            // Only include columns that exist in the available columns list (security)
            $selectedColumns = array_intersect($columns, array_keys($availableColumns));
        }

        // If no columns selected or invalid columns, use default columns
        if (empty($selectedColumns)) {
            $selectedColumns = array_slice(array_keys($availableColumns), 0, 4); // Use first 4 columns as default
        }

        // Build dynamic query based on entity type with column filtering
        switch ($entity) {
            case 'clients':
                $tableName = 'clients';
                // 🔧 FIX: Use selected columns instead of SELECT *
                $selectClause = implode(', ', array_map(function($col) {
                    return "c.$col";
                }, $selectedColumns));
                $baseSQL = "SELECT $selectClause FROM clients c";

                if (!empty($filters['status'])) {
                    $whereConditions[] = "c.status = ?";
                    $params[] = $filters['status'];
                }
                if (!empty($filters['client_type'])) {
                    $whereConditions[] = "c.client_type = ?";
                    $params[] = $filters['client_type'];
                }
                if (!empty($filters['date_from'])) {
                    $whereConditions[] = "c.created_at >= ?";
                    $params[] = $filters['date_from'];
                }
                if (!empty($filters['date_to'])) {
                    $whereConditions[] = "c.created_at <= ?";
                    $params[] = $filters['date_to'] . ' 23:59:59';
                }
                break;

            case 'cases':
                $tableName = 'cases';
                // 🔧 FIX: Use selected columns for cases
                $selectClause = implode(', ', array_map(function($col) {
                    return "cases.$col";
                }, $selectedColumns));
                $baseSQL = "SELECT $selectClause FROM cases LEFT JOIN clients c ON cases.client_id = c.id";

                if (!empty($filters['status'])) {
                    $whereConditions[] = "cases.matter_status = ?";
                    $params[] = $filters['status'];
                }
                if (!empty($filters['case_type'])) {
                    $whereConditions[] = "cases.matter_category = ?";
                    $params[] = $filters['case_type'];
                }
                if (!empty($filters['priority'])) {
                    $whereConditions[] = "cases.priority = ?";
                    $params[] = $filters['priority'];
                }
                if (!empty($filters['date_from'])) {
                    $whereConditions[] = "cases.created_at >= ?";
                    $params[] = $filters['date_from'];
                }
                if (!empty($filters['date_to'])) {
                    $whereConditions[] = "cases.created_at <= ?";
                    $params[] = $filters['date_to'] . ' 23:59:59';
                }
                break;

            case 'hearings':
                $tableName = 'hearings';
                // 🔧 FIX: Use selected columns for hearings
                $selectClause = implode(', ', array_map(function($col) {
                    return "h.$col";
                }, $selectedColumns));
                $baseSQL = "SELECT $selectClause FROM hearings h LEFT JOIN cases ON h.case_id = cases.id LEFT JOIN clients c ON cases.client_id = c.id";

                if (!empty($filters['hearing_type'])) {
                    $whereConditions[] = "h.hearing_type = ?";
                    $params[] = $filters['hearing_type'];
                }
                if (!empty($filters['hearing_result'])) {
                    $whereConditions[] = "h.hearing_result = ?";
                    $params[] = $filters['hearing_result'];
                }
                if (!empty($filters['date_from'])) {
                    $whereConditions[] = "h.hearing_date >= ?";
                    $params[] = $filters['date_from'];
                }
                if (!empty($filters['date_to'])) {
                    $whereConditions[] = "h.hearing_date <= ?";
                    $params[] = $filters['date_to'] . ' 23:59:59';
                }
                break;

            case 'invoices':
                $tableName = 'invoices';
                // 🔧 FIX: Use selected columns for invoices
                $selectClause = implode(', ', array_map(function($col) {
                    return "i.$col";
                }, $selectedColumns));
                $baseSQL = "SELECT $selectClause FROM invoices i";

                if (!empty($filters['invoice_status'])) {
                    $whereConditions[] = "i.invoice_status = ?";
                    $params[] = $filters['invoice_status'];
                }
                if (!empty($filters['invoice_type'])) {
                    $whereConditions[] = "i.invoice_type = ?";
                    $params[] = $filters['invoice_type'];
                }
                if (!empty($filters['currency'])) {
                    $whereConditions[] = "i.currency = ?";
                    $params[] = $filters['currency'];
                }
                if (!empty($filters['has_vat'])) {
                    $whereConditions[] = "i.has_vat = ?";
                    $params[] = $filters['has_vat'];
                }
                if (!empty($filters['date_from'])) {
                    $whereConditions[] = "i.invoice_date >= ?";
                    $params[] = $filters['date_from'];
                }
                if (!empty($filters['date_to'])) {
                    $whereConditions[] = "i.invoice_date <= ?";
                    $params[] = $filters['date_to'] . ' 23:59:59';
                }
                break;

            case 'documents':
                $tableName = 'documents';
                // 🔧 FIX: Use selected columns for documents
                $selectClause = implode(', ', array_map(function($col) {
                    return "d.$col";
                }, $selectedColumns));
                $baseSQL = "SELECT $selectClause FROM documents d";

                if (!empty($filters['document_type'])) {
                    $whereConditions[] = "d.document_type = ?";
                    $params[] = $filters['document_type'];
                }
                if (!empty($filters['entity_type'])) {
                    $whereConditions[] = "d.entity_type = ?";
                    $params[] = $filters['entity_type'];
                }
                if (!empty($filters['entity_id'])) {
                    $whereConditions[] = "d.entity_id = ?";
                    $params[] = $filters['entity_id'];
                }
                if (!empty($filters['is_public'])) {
                    $whereConditions[] = "d.is_public = ?";
                    $params[] = $filters['is_public'];
                }
                if (!empty($filters['mime_type'])) {
                    $whereConditions[] = "d.mime_type LIKE ?";
                    $params[] = '%' . $filters['mime_type'] . '%';
                }
                if (!empty($filters['date_from'])) {
                    $whereConditions[] = "d.created_at >= ?";
                    $params[] = $filters['date_from'];
                }
                if (!empty($filters['date_to'])) {
                    $whereConditions[] = "d.created_at <= ?";
                    $params[] = $filters['date_to'] . ' 23:59:59';
                }
                break;

            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid entity type: ' . $entity]);
                return;
        }

        $whereClause = '';
        if (!empty($whereConditions)) {
            $whereClause = 'WHERE ' . implode(' AND ', $whereConditions);
        }

        // 🔧 FIX: Use appropriate table alias for ORDER BY to avoid ambiguity in JOINs
        $orderByColumn = 'created_at';
        switch ($entity) {
            case 'clients':
                $orderByColumn = 'c.created_at';
                break;
            case 'cases':
                $orderByColumn = 'cases.created_at';
                break;
            case 'hearings':
                $orderByColumn = 'h.created_at';
                break;
            case 'invoices':
                $orderByColumn = 'i.created_at';
                break;
            case 'documents':
                $orderByColumn = 'd.created_at';
                break;
        }

        $sql = $baseSQL . ' ' . $whereClause . " ORDER BY $orderByColumn DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $data = $db->fetchAll($sql, $params);

        // Get total count for pagination
        $countSQL = "SELECT COUNT(*) as total FROM ($baseSQL $whereClause) as subquery";
        $countParams = array_slice($params, 0, -2); // Remove limit and offset
        $totalResult = $db->fetch($countSQL, $countParams);
        $total = $totalResult['total'];

        // 🔧 FIX: Include config and available columns in response for frontend
        echo json_encode([
            'success' => true,
            'data' => $data,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => ceil($total / $limit)
            ],
            // 🔧 FIX: Include the report configuration so frontend knows which columns were selected
            'config' => [
                'entity' => $entity,
                'columns' => $selectedColumns, // Use the filtered selected columns
                'filters' => $filters,
                'limit' => $limit,
                'page' => $page
            ],
            // 🔧 FIX: Include available columns mapping for display labels
            'available_columns' => $availableColumns,
            'generated_at' => date('Y-m-d H:i:s'),
            'generated_by' => 'API'
        ]);

    } catch (Exception $e) {
        error_log("Generate custom report error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to generate custom report']);
    }
}

function handlePDFExport() {
    try {
        // Include the existing PDF export script
        include_once __DIR__ . '/export/pdf-chrome.php';
    } catch (Exception $e) {
        error_log("PDF export error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'PDF export failed: ' . $e->getMessage()]);
    }
}

function handleCSVExport() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['data']) || !is_array($input['data'])) {
            throw new Exception('No data provided for export');
        }

        $data = $input['data'];
        $filename = 'litigation_report_' . date('Y-m-d_H-i-s') . '.csv';

        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Cache-Control: no-cache, must-revalidate');

        $output = fopen('php://output', 'w');

        // Write CSV headers
        if (!empty($data)) {
            $headers = array_keys($data[0]);
            fputcsv($output, $headers);

            // Write data rows
            foreach ($data as $row) {
                fputcsv($output, $row);
            }
        }

        fclose($output);

    } catch (Exception $e) {
        error_log("CSV export error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'CSV export failed: ' . $e->getMessage()]);
    }
}

function handleExcelExport() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['data']) || !is_array($input['data'])) {
            throw new Exception('No data provided for export');
        }

        // For now, redirect to CSV export as fallback
        handleCSVExport();

    } catch (Exception $e) {
        error_log("Excel export error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Excel export failed: ' . $e->getMessage()]);
    }
}

function handleClientSpecificReportOptions() {
    try {
        $db = Database::getInstance();

        // Get all clients for dropdown
        $clients = $db->fetchAll("SELECT id, client_name_ar, client_name_en FROM clients ORDER BY client_name_ar");

        // Define available columns for each report type (synchronized with POST handler)
        $availableColumns = [
            'cases' => [
                ['key' => 'c.id', 'label' => 'معرف القضية', 'label_en' => 'Case ID'],
                ['key' => 'c.matter_id', 'label' => 'رقم القضية', 'label_en' => 'Case Number'],
                ['key' => 'c.matter_ar', 'label' => 'عنوان القضية (عربي)', 'label_en' => 'Case Title (Arabic)'],
                ['key' => 'c.matter_en', 'label' => 'عنوان القضية (إنجليزي)', 'label_en' => 'Case Title (English)'],
                ['key' => 'c.matter_category', 'label' => 'نوع القضية', 'label_en' => 'Case Category'],
                ['key' => 'c.matter_status', 'label' => 'حالة القضية', 'label_en' => 'Case Status'],
                ['key' => 'c.matter_court', 'label' => 'اسم المحكمة', 'label_en' => 'Court Name'],
                ['key' => 'c.matter_importance', 'label' => 'أهمية القضية', 'label_en' => 'Case Importance'],
                ['key' => 'c.created_at', 'label' => 'تاريخ الإنشاء', 'label_en' => 'Created Date'],
                ['key' => 'c.updated_at', 'label' => 'آخر تحديث', 'label_en' => 'Last Updated']
            ],
            'hearings' => [
                ['key' => 'h.id', 'label' => 'معرف الجلسة', 'label_en' => 'Hearing ID'],
                ['key' => 'h.hearing_date', 'label' => 'تاريخ الجلسة', 'label_en' => 'Hearing Date'],
                ['key' => 'h.hearing_type', 'label' => 'نوع الجلسة', 'label_en' => 'Hearing Type'],
                ['key' => 'h.hearing_result', 'label' => 'نتيجة الجلسة', 'label_en' => 'Hearing Result'],
                ['key' => 'h.hearing_duration', 'label' => 'مدة الجلسة', 'label_en' => 'Hearing Duration'],
                ['key' => 'c.matter_id', 'label' => 'رقم القضية', 'label_en' => 'Case Number'],
                ['key' => 'c.matter_ar', 'label' => 'عنوان القضية', 'label_en' => 'Case Title'],
                ['key' => 'c.matter_court', 'label' => 'اسم المحكمة', 'label_en' => 'Court Name'],
                ['key' => 'h.court_notes', 'label' => 'ملاحظات المحكمة', 'label_en' => 'Court Notes'],
                ['key' => 'h.lawyer_notes', 'label' => 'ملاحظات المحامي', 'label_en' => 'Lawyer Notes'],
                ['key' => 'h.next_hearing', 'label' => 'الجلسة القادمة', 'label_en' => 'Next Hearing'],
                ['key' => 'h.created_at', 'label' => 'تاريخ الإنشاء', 'label_en' => 'Created Date']
            ]
        ];

        echo json_encode([
            'success' => true,
            'data' => [
                'clients' => $clients,
                'availableColumns' => $availableColumns,
                'reportTypes' => [
                    ['key' => 'cases', 'label' => 'القضايا القديمة', 'label_en' => 'Old Cases'],
                    ['key' => 'hearings', 'label' => 'الجلسات', 'label_en' => 'Hearings']
                ]
            ]
        ]);

    } catch (Exception $e) {
        error_log("Client specific report options error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to get client specific report options']);
    }
}

function handleGenerateClientSpecificReport() {
    try {
        require_once __DIR__ . '/../src/Core/Request.php';
        require_once __DIR__ . '/../src/Core/Auth.php';
        require_once __DIR__ . '/../src/Core/Response.php';
        require_once __DIR__ . '/../src/Controllers/ReportController.php';

        // Create a proper Request object
        $request = new Request();

        // Get JSON input and validate
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON input']);
            return;
        }

        // Manually populate the request body with the input data
        $reflection = new ReflectionClass($request);
        $bodyProperty = $reflection->getProperty('body');
        $bodyProperty->setAccessible(true);
        $bodyProperty->setValue($request, $input);

        // Use the ReportController's clientSpecific method
        $controller = new ReportController();
        $result = $controller->clientSpecific($request);

        // The controller returns a Response object, so call send() to output it
        if ($result && method_exists($result, 'send')) {
            $result->send();
        } else {
            // Fallback for non-Response objects
            if ($result && !headers_sent()) {
                echo json_encode($result);
            }
        }

    } catch (Exception $e) {
        error_log("Generate client specific report error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to generate client specific report: ' . $e->getMessage()]);
    }
}
?>
