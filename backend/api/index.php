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
    http_response_code(501);
    echo json_encode(['error' => 'Create case not implemented yet']);
}

function handleUpdateCase($id) {
    http_response_code(501);
    echo json_encode(['error' => 'Update case not implemented yet']);
}

function handleDeleteCase($id) {
    http_response_code(501);
    echo json_encode(['error' => 'Delete case not implemented yet']);
}

function handleCreateClient() {
    http_response_code(501);
    echo json_encode(['error' => 'Create client not implemented yet']);
}

function handleUpdateClient($id) {
    http_response_code(501);
    echo json_encode(['error' => 'Update client not implemented yet']);
}

function handleDeleteClient($id) {
    http_response_code(501);
    echo json_encode(['error' => 'Delete client not implemented yet']);
}

function handleCreateHearing() {
    http_response_code(501);
    echo json_encode(['error' => 'Create hearing not implemented yet']);
}

function handleUpdateHearing($id) {
    http_response_code(501);
    echo json_encode(['error' => 'Update hearing not implemented yet']);
}

function handleDeleteHearing($id) {
    http_response_code(501);
    echo json_encode(['error' => 'Delete hearing not implemented yet']);
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
    http_response_code(501);
    echo json_encode(['error' => 'Create invoice not implemented yet']);
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
            $newId = $db->getLastInsertId();
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
    http_response_code(501);
    echo json_encode(['error' => 'Document upload not implemented yet']);
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
    http_response_code(501);
    echo json_encode(['error' => 'Update document not implemented yet']);
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
?>
