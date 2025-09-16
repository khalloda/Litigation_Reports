<?php
/**
 * Simple API Test Endpoint with Real Authentication
 */

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include configuration and database
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/src/Core/Auth.php';
require_once __DIR__ . '/src/Core/Request.php';
require_once __DIR__ . '/src/Core/Response.php';
require_once __DIR__ . '/src/Core/Validator.php';
require_once __DIR__ . '/src/Models/User.php';
require_once __DIR__ . '/src/Models/Case.php';
require_once __DIR__ . '/src/Models/Client.php';
require_once __DIR__ . '/src/Controllers/CaseController.php';
require_once __DIR__ . '/src/Controllers/ClientController.php';

// Get the request path
$path = $_SERVER['REQUEST_URI'] ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Handle command line execution
if (php_sapi_name() === 'cli') {
    $path = '/api/health';
    $method = 'GET';
}

// Remove query string
if (($pos = strpos($path, '?')) !== false) {
    $path = substr($path, 0, $pos);
}

// Simple routing
switch ($path) {
    case '/api/health':
        if ($method === 'GET') {
            echo json_encode([
                'status' => 'ok',
                'timestamp' => date('Y-m-d H:i:s'),
                'server' => 'PHP Development Server',
                'version' => '1.0.0'
            ]);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/api/auth/login':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['email']) || !isset($input['password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Email and password are required']);
                break;
            }
            
            try {
                // Use real authentication system
                $result = Auth::login($input['email'], $input['password']);
                
                if ($result) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Login successful',
                        'data' => $result
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode(['error' => 'Invalid credentials']);
                }
            } catch (Exception $e) {
                error_log("Login error: " . $e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'Login failed']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/api/users':
        if ($method === 'GET') {
            echo json_encode([
                'success' => true,
                'data' => [
                    [
                        'id' => 1,
                        'name' => 'Super Admin',
                        'email' => 'admin@litigation.com',
                        'role' => 'super_admin',
                        'status' => 'active'
                    ],
                    [
                        'id' => 2,
                        'name' => 'ناجي رمضان',
                        'email' => 'lawyer@litigation.com',
                        'role' => 'lawyer',
                        'status' => 'active'
                    ]
                ],
                'pagination' => [
                    'current_page' => 1,
                    'per_page' => 20,
                    'total' => 2,
                    'total_pages' => 1
                ]
            ]);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/api/auth/me':
        if ($method === 'GET') {
            try {
                // Check if user is authenticated
                if (!Auth::check()) {
                    http_response_code(401);
                    echo json_encode(['error' => 'Not authenticated']);
                    break;
                }
                
                // Get current user
                $user = Auth::user();
                
                echo json_encode([
                    'success' => true,
                    'data' => $user
                ]);
            } catch (Exception $e) {
                error_log("Get user error: " . $e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'Failed to get user information']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    // Case Management Endpoints
    case '/api/cases':
        if ($method === 'GET') {
            try {
                $controller = new CaseController();
                $request = new Request();
                $response = $controller->index($request);
                $response->send();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal server error']);
            }
        } elseif ($method === 'POST') {
            try {
                $controller = new CaseController();
                $request = new Request();
                $response = $controller->store($request);
                $response->send();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal server error']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/api/cases/stats':
        if ($method === 'GET') {
            try {
                $controller = new CaseController();
                $request = new Request();
                $response = $controller->stats($request);
                $response->send();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal server error']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/api/cases/search':
        if ($method === 'GET') {
            try {
                $controller = new CaseController();
                $request = new Request();
                $response = $controller->search($request);
                $response->send();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal server error']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/api/cases/options':
        if ($method === 'GET') {
            try {
                $controller = new CaseController();
                $request = new Request();
                $response = $controller->options($request);
                $response->send();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal server error']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    // Client Management Endpoints
    case '/api/clients':
        if ($method === 'GET') {
            try {
                $controller = new ClientController();
                $request = new Request();
                $response = $controller->index($request);
                $response->send();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal server error']);
            }
        } elseif ($method === 'POST') {
            try {
                $controller = new ClientController();
                $request = new Request();
                $response = $controller->store($request);
                $response->send();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal server error']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/api/clients/stats':
        if ($method === 'GET') {
            try {
                $controller = new ClientController();
                $request = new Request();
                $response = $controller->stats($request);
                $response->send();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal server error']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/api/clients/search':
        if ($method === 'GET') {
            try {
                $controller = new ClientController();
                $request = new Request();
                $response = $controller->search($request);
                $response->send();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal server error']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/api/clients/options':
        if ($method === 'GET') {
            try {
                $controller = new ClientController();
                $request = new Request();
                $response = $controller->options($request);
                $response->send();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal server error']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/api/clients/active':
        if ($method === 'GET') {
            try {
                $controller = new ClientController();
                $request = new Request();
                $response = $controller->active($request);
                $response->send();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal server error']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/api/clients/for-select':
        if ($method === 'GET') {
            try {
                $controller = new ClientController();
                $request = new Request();
                $response = $controller->forSelect($request);
                $response->send();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal server error']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    default:
        // Handle dynamic client ID routes
        if (preg_match('/^\/api\/clients\/(\d+)$/', $path, $matches)) {
            $clientId = $matches[1];
            if ($method === 'GET') {
                try {
                    $controller = new ClientController();
                    $request = new Request();
                    $request->set('id', $clientId);
                    $response = $controller->show($request);
                    $response->send();
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Internal server error']);
                }
            } elseif ($method === 'PUT' || $method === 'PATCH') {
                try {
                    $controller = new ClientController();
                    $request = new Request();
                    $request->set('id', $clientId);
                    $response = $controller->update($request);
                    $response->send();
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Internal server error']);
                }
            } elseif ($method === 'DELETE') {
                try {
                    $controller = new ClientController();
                    $request = new Request();
                    $request->set('id', $clientId);
                    $response = $controller->destroy($request);
                    $response->send();
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Internal server error']);
                }
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
        }
        // Handle dynamic case ID routes
        elseif (preg_match('/^\/api\/cases\/(\d+)$/', $path, $matches)) {
            $caseId = $matches[1];
            if ($method === 'GET') {
                try {
                    $controller = new CaseController();
                    $request = new Request();
                    $request->set('id', $caseId);
                    $response = $controller->show($request);
                    $response->send();
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Internal server error']);
                }
            } elseif ($method === 'PUT' || $method === 'PATCH') {
                try {
                    $controller = new CaseController();
                    $request = new Request();
                    $request->set('id', $caseId);
                    $response = $controller->update($request);
                    $response->send();
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Internal server error']);
                }
            } elseif ($method === 'DELETE') {
                try {
                    $controller = new CaseController();
                    $request = new Request();
                    $request->set('id', $caseId);
                    $response = $controller->destroy($request);
                    $response->send();
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Internal server error']);
                }
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
?>
