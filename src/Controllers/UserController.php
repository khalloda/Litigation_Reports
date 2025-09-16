<?php
/**
 * User Controller
 * 
 * Handles user management operations.
 */

class UserController {
    
    public function index(Request $request) {
        try {
            // Check authentication and permissions
            Auth::requirePermission('users.read');
            
            $page = $request->get('page', 1);
            $limit = $request->get('limit', DEFAULT_PAGE_SIZE);
            $filters = $request->only(['status', 'role', 'search']);
            
            $result = User::getAll($page, $limit, $filters);
            
            return Response::paginated($result['data'], $result['pagination']);
            
        } catch (Exception $e) {
            error_log("Get users error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve users');
        }
    }
    
    public function show(Request $request) {
        try {
            // Check authentication and permissions
            Auth::requirePermission('users.read');
            
            $id = $request->getRouteParam('id');
            
            if (!$id) {
                return Response::error('User ID is required', 400);
            }
            
            $user = User::findById($id);
            
            if (!$user) {
                return Response::notFound('User not found');
            }
            
            // Remove sensitive data
            unset($user['password']);
            unset($user['remember_token']);
            unset($user['password_reset_token']);
            
            return Response::success($user);
            
        } catch (Exception $e) {
            error_log("Get user error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve user');
        }
    }
    
    public function store(Request $request) {
        try {
            // Check authentication and permissions
            Auth::requirePermission('users.create');
            
            // Validate input
            $validator = new Validator($request->all(), [
                'name' => 'required|min:2|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:6',
                'role' => 'required|in:super_admin,admin,lawyer,staff',
                'status' => 'in:active,inactive,suspended'
            ]);
            
            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }
            
            $data = $request->only(['name', 'email', 'password', 'role', 'status']);
            
            $userId = User::create($data);
            
            // Get created user
            $user = User::findById($userId);
            unset($user['password']);
            
            return Response::created($user, 'User created successfully');
            
        } catch (Exception $e) {
            error_log("Create user error: " . $e->getMessage());
            return Response::serverError('Failed to create user');
        }
    }
    
    public function update(Request $request) {
        try {
            // Check authentication and permissions
            Auth::requirePermission('users.update');
            
            $id = $request->getRouteParam('id');
            
            if (!$id) {
                return Response::error('User ID is required', 400);
            }
            
            // Check if user exists
            $existingUser = User::findById($id);
            if (!$existingUser) {
                return Response::notFound('User not found');
            }
            
            // Validate input
            $validator = new Validator($request->all(), [
                'name' => 'min:2|max:255',
                'email' => 'email|unique:users,email,' . $id,
                'password' => 'min:6',
                'role' => 'in:super_admin,admin,lawyer,staff',
                'status' => 'in:active,inactive,suspended'
            ]);
            
            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }
            
            $data = $request->only(['name', 'email', 'password', 'role', 'status']);
            
            // Remove empty values
            $data = array_filter($data, function($value) {
                return $value !== null && $value !== '';
            });
            
            if (empty($data)) {
                return Response::error('No data to update', 400);
            }
            
            User::update($id, $data);
            
            // Get updated user
            $user = User::findById($id);
            unset($user['password']);
            
            return Response::updated($user, 'User updated successfully');
            
        } catch (Exception $e) {
            error_log("Update user error: " . $e->getMessage());
            return Response::serverError('Failed to update user');
        }
    }
    
    public function destroy(Request $request) {
        try {
            // Check authentication and permissions
            Auth::requirePermission('users.delete');
            
            $id = $request->getRouteParam('id');
            
            if (!$id) {
                return Response::error('User ID is required', 400);
            }
            
            // Check if user exists
            $user = User::findById($id);
            if (!$user) {
                return Response::notFound('User not found');
            }
            
            // Prevent deleting own account
            if ($id == Auth::id()) {
                return Response::error('Cannot delete your own account', 400);
            }
            
            User::delete($id);
            
            return Response::deleted('User deleted successfully');
            
        } catch (Exception $e) {
            error_log("Delete user error: " . $e->getMessage());
            return Response::serverError('Failed to delete user');
        }
    }
    
    public function stats(Request $request) {
        try {
            // Check authentication and permissions
            Auth::requirePermission('users.read');
            
            $stats = User::getStats();
            
            return Response::success($stats);
            
        } catch (Exception $e) {
            error_log("Get user stats error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve user statistics');
        }
    }
}
