<?php
/**
 * Simple API Test Endpoint
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
            
            // Simple hardcoded authentication for testing
            if ($input['email'] === 'admin@litigation.com' && $input['password'] === 'admin123') {
                echo json_encode([
                    'success' => true,
                    'message' => 'Login successful',
                    'data' => [
                        'user' => [
                            'id' => 1,
                            'name' => 'Super Admin',
                            'email' => 'admin@litigation.com',
                            'role' => 'super_admin'
                        ],
                        'token' => 'test-token-123'
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
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
            // Check for authorization header using $_SERVER
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            
            if (strpos($authHeader, 'Bearer ') === 0) {
                $token = substr($authHeader, 7);
                
                // Simple token validation (in real app, validate JWT)
                if ($token === 'test-token-123') {
                    echo json_encode([
                        'success' => true,
                        'data' => [
                            'id' => 1,
                            'name' => 'Super Admin',
                            'email' => 'admin@litigation.com',
                            'role' => 'super_admin',
                            'status' => 'active',
                            'created_at' => '2025-01-01T00:00:00Z',
                            'updated_at' => '2025-01-01T00:00:00Z',
                            'last_login_at' => date('c')
                        ]
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode(['error' => 'Invalid token']);
                }
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Authorization header required']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found', 'path' => $path]);
        break;
}
?>
