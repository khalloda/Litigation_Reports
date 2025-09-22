<?php
/**
 * Authentication Middleware
 * 
 * Handles authentication and authorization for protected routes.
 */

class AuthMiddleware {
    private $requiredRole = null;
    private $requiredPermission = null;
    private $requiredRoles = [];
    private $requiredPermissions = [];
    
    public function __construct($options = []) {
        $this->requiredRole = $options['role'] ?? null;
        $this->requiredPermission = $options['permission'] ?? null;
        $this->requiredRoles = $options['roles'] ?? [];
        $this->requiredPermissions = $options['permissions'] ?? [];
    }
    
    public function handle(Request $request) {
        // Check if user is authenticated
        if (!Auth::check()) {
            return Response::unauthorized('Authentication required');
        }
        
        // Check specific role
        if ($this->requiredRole && !Auth::hasRole($this->requiredRole)) {
            return Response::forbidden('Insufficient permissions');
        }
        
        // Check specific permission
        if ($this->requiredPermission && !Auth::hasPermission($this->requiredPermission)) {
            return Response::forbidden('Insufficient permissions');
        }
        
        // Check multiple roles
        if (!empty($this->requiredRoles) && !Auth::hasAnyRole($this->requiredRoles)) {
            return Response::forbidden('Insufficient permissions');
        }
        
        // Check multiple permissions
        if (!empty($this->requiredPermissions)) {
            $hasPermission = false;
            foreach ($this->requiredPermissions as $permission) {
                if (Auth::hasPermission($permission)) {
                    $hasPermission = true;
                    break;
                }
            }
            
            if (!$hasPermission) {
                return Response::forbidden('Insufficient permissions');
            }
        }
        
        // Add user info to request
        $request->setSession('auth_user', Auth::user());
        
        return null; // Continue to next middleware/controller
    }
    
    public static function requireAuth() {
        return new self();
    }
    
    public static function requireRole($role) {
        return new self(['role' => $role]);
    }
    
    public static function requirePermission($permission) {
        return new self(['permission' => $permission]);
    }
    
    public static function requireAnyRole($roles) {
        return new self(['roles' => $roles]);
    }
    
    public static function requireAnyPermission($permissions) {
        return new self(['permissions' => $permissions]);
    }
}
