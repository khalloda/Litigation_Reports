<?php
/**
 * Authentication Class
 * 
 * Handles user authentication, JWT tokens, and session management.
 */

class Auth {
    private static $currentUser = null;
    
    public static function login($email, $password) {
        $user = User::findByEmail($email);
        
        if (!$user) {
            return false;
        }
        
        if (!password_verify($password, $user['password'])) {
            return false;
        }
        
        if ($user['status'] !== 'active') {
            return false;
        }
        
        // Update last login
        User::updateLastLogin($user['id']);
        
        // Generate JWT token
        $token = self::generateToken($user);
        
        // Set session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['token'] = $token;
        
        return [
            'user' => self::sanitizeUser($user),
            'token' => $token
        ];
    }
    
    public static function logout() {
        // Clear session
        session_destroy();
        
        // Clear current user
        self::$currentUser = null;
        
        return true;
    }
    
    public static function check() {
        return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
    }
    
    public static function user() {
        if (self::$currentUser === null && self::check()) {
            $user = User::findById($_SESSION['user_id']);
            if ($user) {
                self::$currentUser = self::sanitizeUser($user);
            }
        }
        
        return self::$currentUser;
    }
    
    public static function id() {
        return $_SESSION['user_id'] ?? null;
    }
    
    public static function role() {
        return $_SESSION['user_role'] ?? null;
    }
    
    public static function hasRole($role) {
        return self::role() === $role;
    }
    
    public static function hasPermission($permission) {
        $user = self::user();
        if (!$user) {
            return false;
        }
        
        $rolePermissions = self::getRolePermissions($user['role']);
        return in_array($permission, $rolePermissions);
    }
    
    public static function hasAnyRole($roles) {
        $userRole = self::role();
        return in_array($userRole, $roles);
    }
    
    public static function hasAllRoles($roles) {
        $userRole = self::role();
        return $userRole === 'super_admin' || in_array($userRole, $roles);
    }
    
    public static function generateToken($user) {
        $payload = [
            'user_id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + JWT_EXPIRY
        ];
        
        return self::encodeJWT($payload);
    }
    
    public static function validateToken($token) {
        try {
            $payload = self::decodeJWT($token);
            
            if ($payload['exp'] < time()) {
                return false;
            }
            
            $user = User::findById($payload['user_id']);
            if (!$user || $user['status'] !== 'active') {
                return false;
            }
            
            return $payload;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public static function refreshToken($token) {
        $payload = self::validateToken($token);
        
        if (!$payload) {
            return false;
        }
        
        $user = User::findById($payload['user_id']);
        if (!$user) {
            return false;
        }
        
        return self::generateToken($user);
    }
    
    private static function encodeJWT($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => JWT_ALGORITHM]);
        $payload = json_encode($payload);
        
        $headerEncoded = self::base64UrlEncode($header);
        $payloadEncoded = self::base64UrlEncode($payload);
        
        $signature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, JWT_SECRET, true);
        $signatureEncoded = self::base64UrlEncode($signature);
        
        return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
    }
    
    private static function decodeJWT($token) {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }
        
        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;
        
        $signature = self::base64UrlDecode($signatureEncoded);
        $expectedSignature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, JWT_SECRET, true);
        
        if (!hash_equals($signature, $expectedSignature)) {
            throw new Exception('Invalid token signature');
        }
        
        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);
        
        if (!$payload) {
            throw new Exception('Invalid token payload');
        }
        
        return $payload;
    }
    
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private static function base64UrlDecode($data) {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }
    
    private static function sanitizeUser($user) {
        unset($user['password']);
        unset($user['remember_token']);
        return $user;
    }
    
    private static function getRolePermissions($role) {
        $permissions = [
            'super_admin' => [
                'users.create', 'users.read', 'users.update', 'users.delete',
                'clients.create', 'clients.read', 'clients.update', 'clients.delete',
                'cases.create', 'cases.read', 'cases.update', 'cases.delete',
                'hearings.create', 'hearings.read', 'hearings.update', 'hearings.delete',
                'invoices.create', 'invoices.read', 'invoices.update', 'invoices.delete',
                'lawyers.create', 'lawyers.read', 'lawyers.update', 'lawyers.delete',
                'reports.read', 'reports.export',
                'settings.read', 'settings.update',
                'system.admin'
            ],
            'admin' => [
                'users.create', 'users.read', 'users.update',
                'clients.create', 'clients.read', 'clients.update', 'clients.delete',
                'cases.create', 'cases.read', 'cases.update', 'cases.delete',
                'hearings.create', 'hearings.read', 'hearings.update', 'hearings.delete',
                'invoices.create', 'invoices.read', 'invoices.update', 'invoices.delete',
                'lawyers.create', 'lawyers.read', 'lawyers.update', 'lawyers.delete',
                'reports.read', 'reports.export',
                'settings.read'
            ],
            'lawyer' => [
                'clients.create', 'clients.read', 'clients.update',
                'cases.create', 'cases.read', 'cases.update',
                'hearings.create', 'hearings.read', 'hearings.update',
                'invoices.create', 'invoices.read', 'invoices.update',
                'reports.read'
            ],
            'staff' => [
                'clients.read', 'clients.update',
                'cases.read', 'cases.update',
                'hearings.read', 'hearings.update',
                'invoices.read', 'invoices.update',
                'reports.read'
            ]
        ];
        
        return $permissions[$role] ?? [];
    }
    
    public static function requireAuth() {
        if (!self::check()) {
            throw new Exception('Authentication required', 401);
        }
    }
    
    public static function requireRole($role) {
        self::requireAuth();
        
        if (!self::hasRole($role)) {
            throw new Exception('Insufficient permissions', 403);
        }
    }
    
    public static function requirePermission($permission) {
        self::requireAuth();
        
        if (!self::hasPermission($permission)) {
            throw new Exception('Insufficient permissions', 403);
        }
    }
    
    public static function requireAnyRole($roles) {
        self::requireAuth();
        
        if (!self::hasAnyRole($roles)) {
            throw new Exception('Insufficient permissions', 403);
        }
    }
    
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => BCRYPT_ROUNDS]);
    }
    
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
    
    public static function generatePasswordResetToken() {
        return bin2hex(random_bytes(32));
    }
    
    public static function validatePasswordResetToken($token) {
        $user = User::findByPasswordResetToken($token);
        
        if (!$user) {
            return false;
        }
        
        // Check if token is expired (24 hours)
        if (strtotime($user['password_reset_expires']) < time()) {
            return false;
        }
        
        return $user;
    }
    
    public static function clearPasswordResetToken($userId) {
        return User::clearPasswordResetToken($userId);
    }
}
