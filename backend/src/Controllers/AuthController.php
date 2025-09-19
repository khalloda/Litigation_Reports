<?php
/**
 * Authentication Controller
 * 
 * Handles user authentication, login, logout, and session management.
 */

class AuthController {
    
    public function login(Request $request) {
        try {
            // Validate input
            $validator = new Validator($request->all(), [
                'email' => 'required|email',
                'password' => 'required|min:6'
            ]);
            
            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }
            
            $email = $request->post('email');
            $password = $request->post('password');
            
            // Attempt login
            $result = Auth::login($email, $password);
            
            if (!$result) {
                return Response::error('Invalid credentials', 401);
            }
            
            // Log successful login
            error_log("User {$email} logged in successfully");
            
            return Response::success($result, 'Login successful');
            
        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            return Response::serverError('Login failed');
        }
    }
    
    public function logout(Request $request) {
        try {
            Auth::logout();
            
            return Response::success(null, 'Logout successful');
            
        } catch (Exception $e) {
            error_log("Logout error: " . $e->getMessage());
            return Response::serverError('Logout failed');
        }
    }
    
    public function me(Request $request) {
        try {
            if (!Auth::check()) {
                return Response::unauthorized('Not authenticated');
            }
            
            $user = Auth::user();
            
            return Response::success($user);
            
        } catch (Exception $e) {
            error_log("Get user error: " . $e->getMessage());
            return Response::serverError('Failed to get user information');
        }
    }
    
    public function refresh(Request $request) {
        try {
            $token = $request->getHeader('Authorization');
            
            if (!$token) {
                return Response::unauthorized('Token required');
            }
            
            // Remove "Bearer " prefix if present
            if (strpos($token, 'Bearer ') === 0) {
                $token = substr($token, 7);
            }
            
            $newToken = Auth::refreshToken($token);
            
            if (!$newToken) {
                return Response::unauthorized('Invalid or expired token');
            }
            
            return Response::success(['token' => $newToken], 'Token refreshed');
            
        } catch (Exception $e) {
            error_log("Token refresh error: " . $e->getMessage());
            return Response::serverError('Token refresh failed');
        }
    }
    
    public function forgotPassword(Request $request) {
        try {
            // Validate input
            $validator = new Validator($request->all(), [
                'email' => 'required|email'
            ]);
            
            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }
            
            $email = $request->post('email');
            
            // Check if user exists
            $user = User::findByEmail($email);
            if (!$user) {
                // Don't reveal if email exists or not
                return Response::success(null, 'If the email exists, a password reset link has been sent');
            }
            
            // Generate reset token
            $token = Auth::generatePasswordResetToken();
            
            // Save token to database
            User::setPasswordResetToken($email, $token);
            
            // TODO: Send email with reset link
            // For now, just log the token (in production, send email)
            error_log("Password reset token for {$email}: {$token}");
            
            return Response::success(null, 'If the email exists, a password reset link has been sent');
            
        } catch (Exception $e) {
            error_log("Forgot password error: " . $e->getMessage());
            return Response::serverError('Password reset request failed');
        }
    }
    
    public function resetPassword(Request $request) {
        try {
            // Validate input
            $validator = new Validator($request->all(), [
                'token' => 'required',
                'password' => 'required|min:6|confirmed'
            ]);
            
            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }
            
            $token = $request->post('token');
            $password = $request->post('password');
            
            // Validate token
            $user = Auth::validatePasswordResetToken($token);
            if (!$user) {
                return Response::error('Invalid or expired reset token', 400);
            }
            
            // Update password
            User::changePassword($user['id'], $password);
            
            // Clear reset token
            Auth::clearPasswordResetToken($user['id']);
            
            return Response::success(null, 'Password reset successful');
            
        } catch (Exception $e) {
            error_log("Reset password error: " . $e->getMessage());
            return Response::serverError('Password reset failed');
        }
    }
    
    public function changePassword(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            // Validate input
            $validator = new Validator($request->all(), [
                'current_password' => 'required',
                'new_password' => 'required|min:6|confirmed'
            ]);
            
            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }
            
            $currentPassword = $request->post('current_password');
            $newPassword = $request->post('new_password');
            $userId = Auth::id();
            
            // Get current user
            $user = User::findById($userId);
            if (!$user) {
                return Response::error('User not found', 404);
            }
            
            // Verify current password
            if (!Auth::verifyPassword($currentPassword, $user['password'])) {
                return Response::error('Current password is incorrect', 400);
            }
            
            // Update password
            User::changePassword($userId, $newPassword);
            
            return Response::success(null, 'Password changed successfully');
            
        } catch (Exception $e) {
            error_log("Change password error: " . $e->getMessage());
            return Response::serverError('Password change failed');
        }
    }
    
    public function updateProfile(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            // Validate input
            $validator = new Validator($request->all(), [
                'name' => 'required|min:2|max:255',
                'email' => 'required|email'
            ]);
            
            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }
            
            $userId = Auth::id();
            $data = $request->only(['name', 'email']);
            
            // Check if email is already taken by another user
            $existingUser = User::findByEmail($data['email']);
            if ($existingUser && $existingUser['id'] != $userId) {
                return Response::error('Email is already taken', 400);
            }
            
            // Update user
            User::update($userId, $data);
            
            // Get updated user data
            $user = User::findById($userId);
            $sanitizedUser = Auth::sanitizeUser($user);
            
            return Response::success($sanitizedUser, 'Profile updated successfully');
            
        } catch (Exception $e) {
            error_log("Update profile error: " . $e->getMessage());
            return Response::serverError('Profile update failed');
        }
    }
}
