/**
 * Login Form Component
 *
 * Handles user authentication with enhanced UI components.
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import FormInput from './FormInput';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const validateFields = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = 'البريد الإلكتروني مطلوب / Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'البريد الإلكتروني غير صحيح / Invalid email format';
    }

    if (!password) {
      errors.password = 'كلمة المرور مطلوبة / Password is required';
    } else if (password.length < 3) {
      errors.password = 'كلمة المرور قصيرة جداً / Password too short';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('LoginForm: handleSubmit called');
    e.preventDefault();
    setError('');

    // Always validate fields first
    const validationErrors = validateFields();
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log('LoginForm: Validation errors found:', validationErrors);
      // Force a small delay to ensure validation errors are visible
      setTimeout(() => {
        const firstErrorField = document.querySelector('.is-invalid');
        if (firstErrorField) {
          (firstErrorField as HTMLElement).focus();
        }
      }, 100);
      return;
    }

    console.log('LoginForm: Starting login process');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      console.log('LoginForm: Login result:', success);
      if (!success) {
        setError('بيانات غير صحيحة / Invalid email or password');
      }
    } catch (err) {
      console.error('LoginForm: Login error:', err);
      setError('فشل تسجيل الدخول. حاول مرة أخرى / Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container-fluid vh-100 d-flex align-items-center justify-content-center bg-light'>
      <div className='card shadow-lg' style={{ width: '450px' }}>
        <div className='card-body p-5'>
          {/* Language Switcher */}
          <div className='d-flex justify-content-end mb-3'>
            <LanguageSwitcher variant='minimal' size='sm' />
          </div>

          {/* Logo and Title */}
          <div className='text-center mb-4'>
            <Logo size='lg' showText={false} variant='primary' type='full' language='ar' />
            <div className='mt-3'>
              <h2 className='card-title text-primary mb-2'>نظام إدارة التقاضي</h2>
              <p className='text-muted'>Litigation Management System</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} data-testid='login-form'>
            {error && (
              <div className='alert alert-danger' role='alert'>
                {error}
              </div>
            )}

            <FormInput
              id='email'
              type='email'
              label='البريد الإلكتروني / Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={false}
              placeholder='admin@litigation.com'
              dir='ltr'
              error={fieldErrors.email}
              autoComplete='username'
            />

            <FormInput
              id='password'
              type='password'
              label='كلمة المرور / Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={false}
              placeholder='admin123'
              dir='ltr'
              error={fieldErrors.password}
              autoComplete='current-password'
            />

            <button type='submit' className='btn btn-primary w-100' disabled={isLoading}>
              {isLoading ? (
                <>
                  <span
                    className='spinner-border spinner-border-sm me-2'
                    role='status'
                    aria-hidden='true'
                  ></span>
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول / Login'
              )}
            </button>
          </form>

          <div className='mt-4 text-center'>
            <small className='text-muted'>
              <strong>Test Accounts:</strong>
              <br />
              Admin: admin@litigation.com / admin123
              <br />
              Lawyer: lawyer@litigation.com / admin123
              <br />
              Staff: staff@litigation.com / admin123
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
