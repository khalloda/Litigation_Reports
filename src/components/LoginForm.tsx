/**
 * Login Form Component
 * 
 * Handles user authentication.
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ width: '400px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="card-title text-primary">نظام إدارة التقاضي</h2>
            <p className="text-muted">Litigation Management System</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                البريد الإلكتروني / Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@litigation.com"
                dir="ltr"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                كلمة المرور / Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="admin123"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول / Login'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <small className="text-muted">
              <strong>Test Accounts:</strong><br />
              Admin: admin@litigation.com / admin123<br />
              Lawyer: lawyer@litigation.com / admin123<br />
              Staff: staff@litigation.com / admin123
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
