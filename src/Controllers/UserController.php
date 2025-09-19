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
            
            // Validate input - for updates, only validate provided fields
            $validationRules = [];
            $requestData = $request->all();

            // Only add validation rules for fields that are actually provided
            if (isset($requestData['name'])) {
                $validationRules['name'] = 'min:2|max:255';
            }
            if (isset($requestData['email'])) {
                $validationRules['email'] = 'email|unique:users,email,' . $id;
            }
            if (isset($requestData['password'])) {
                $validationRules['password'] = 'min:6';
            }
            if (isset($requestData['role'])) {
                $validationRules['role'] = 'in:super_admin,admin,lawyer,staff';
            }
            if (isset($requestData['status'])) {
                $validationRules['status'] = 'in:active,inactive,suspended';
            }

            $validator = new Validator($requestData, $validationRules);
            
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

    public function profile(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $userId = Auth::id();
            $user = User::findById($userId);

            if (!$user) {
                return Response::notFound('User not found');
            }

            // Remove sensitive data
            unset($user['password']);
            unset($user['remember_token']);
            unset($user['password_reset_token']);

            return Response::success($user);

        } catch (Exception $e) {
            error_log("Get profile error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve profile');
        }
    }

    public function updateProfile(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $userId = Auth::id();

            // Validate input - for profile updates, only validate provided fields
            $validationRules = [];
            $requestData = $request->all();

            if (isset($requestData['name'])) {
                $validationRules['name'] = 'min:2|max:255';
            }
            if (isset($requestData['arabic_name'])) {
                $validationRules['arabic_name'] = 'max:255';
            }
            if (isset($requestData['email'])) {
                $validationRules['email'] = 'email|unique:users,email,' . $userId;
            }
            if (isset($requestData['phone'])) {
                $validationRules['phone'] = 'max:20';
            }
            if (isset($requestData['title'])) {
                $validationRules['title'] = 'max:100';
            }
            if (isset($requestData['bio'])) {
                $validationRules['bio'] = 'max:1000';
            }
            if (isset($requestData['language_preference'])) {
                $validationRules['language_preference'] = 'in:ar,en';
            }

            $validator = new Validator($requestData, $validationRules);

            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }

            $data = $request->only([
                'name', 'arabic_name', 'email', 'phone', 'title', 'bio', 'language_preference'
            ]);

            // Remove empty values
            $data = array_filter($data, function($value) {
                return $value !== null && $value !== '';
            });

            if (empty($data)) {
                return Response::error('No data to update', 400);
            }

            User::update($userId, $data);

            // Get updated user
            $user = User::findById($userId);
            unset($user['password']);
            unset($user['remember_token']);
            unset($user['password_reset_token']);

            return Response::success($user, 'Profile updated successfully');

        } catch (Exception $e) {
            error_log("Update profile error: " . $e->getMessage());
            return Response::serverError('Failed to update profile');
        }
    }

    public function changePassword(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $userId = Auth::id();

            // Validate input
            $validator = new Validator($request->all(), [
                'current_password' => 'required',
                'new_password' => 'required|min:6',
                'confirm_password' => 'required|same:new_password'
            ]);

            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }

            $currentPassword = $request->get('current_password');
            $newPassword = $request->get('new_password');

            // Get current user
            $user = User::findById($userId);

            // Verify current password
            if (!password_verify($currentPassword, $user['password'])) {
                return Response::error('Current password is incorrect', 400);
            }

            // Update password
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            User::update($userId, ['password' => $hashedPassword]);

            return Response::success(null, 'Password changed successfully');

        } catch (Exception $e) {
            error_log("Change password error: " . $e->getMessage());
            return Response::serverError('Failed to change password');
        }
    }
}
