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
?>
