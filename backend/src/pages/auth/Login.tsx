import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@components/auth/AuthProvider';
import { useRTL } from '@hooks/useRTL';
import { useLanguage } from '@hooks/useLanguage';
import { MixedContentInput } from '@components/forms/MixedContentInput';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import clsx from 'clsx';

export function Login() {
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  const { isRTL } = useRTL();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        navigate(from, { replace: true });
      } else {
        setError(t('auth.invalidCredentials'));
      }
    } catch (err) {
      setError(t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='login-page min-vh-100 d-flex align-items-center' dir={isRTL ? 'rtl' : 'ltr'}>
      <Container>
        <Row className='justify-content-center'>
          <Col md={6} lg={4}>
            <Card className='shadow'>
              <Card.Body className='p-4'>
                <div className='text-center mb-4'>
                  <div className='logo-container mb-3'>
                    <img
                      src='/logo/arabic_green_gold_logo.png'
                      alt='Law Office Logo'
                      className='img-fluid'
                      style={{ maxHeight: '60px' }}
                    />
                  </div>

                  <h3 className='card-title'>
                    {currentLanguage === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </h3>

                  <p className='text-muted'>
                    {currentLanguage === 'ar'
                      ? 'مرحباً بك في نظام إدارة القضايا'
                      : 'Welcome to Litigation Management System'}
                  </p>
                </div>

                {error && (
                  <Alert variant='danger' className='mb-3'>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className='mb-3'>
                    <Form.Label htmlFor='email'>{t('auth.email')}</Form.Label>

                    <div className='input-group'>
                      <span className='input-group-text'>
                        <Mail size={16} />
                      </span>

                      <MixedContentInput
                        id='email'
                        type='email'
                        value={formData.email}
                        onChange={(value) => handleInputChange('email', value)}
                        placeholder={
                          currentLanguage === 'ar' ? 'example@domain.com' : 'example@domain.com'
                        }
                        required
                        disabled={loading}
                        aria-label={t('auth.email')}
                        className={clsx('form-control', error && 'is-invalid')}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Label htmlFor='password'>{t('auth.password')}</Form.Label>

                    <div className='input-group'>
                      <span className='input-group-text'>
                        <Lock size={16} />
                      </span>

                      <MixedContentInput
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(value) => handleInputChange('password', value)}
                        placeholder={currentLanguage === 'ar' ? 'كلمة المرور' : 'Password'}
                        required
                        disabled={loading}
                        aria-label={t('auth.password')}
                        className={clsx('form-control', error && 'is-invalid')}
                      />

                      <Button
                        variant='outline-secondary'
                        type='button'
                        onClick={togglePasswordVisibility}
                        disabled={loading}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Check
                      type='checkbox'
                      id='rememberMe'
                      label={t('auth.rememberMe')}
                      disabled={loading}
                    />
                  </Form.Group>

                  <Button
                    type='submit'
                    variant='primary'
                    size='lg'
                    className='w-100'
                    disabled={loading || isLoading}
                  >
                    {loading || isLoading ? (
                      <>
                        <span
                          className='spinner-border spinner-border-sm me-2'
                          role='status'
                          aria-hidden='true'
                        />
                        {currentLanguage === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                      </>
                    ) : (
                      t('auth.loginButton')
                    )}
                  </Button>
                </Form>

                <div className='text-center mt-3'>
                  <Button
                    variant='link'
                    size='sm'
                    className='text-decoration-none'
                    disabled={loading}
                  >
                    {t('auth.forgotPassword')}
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <div className='text-center mt-3'>
              <small className='text-muted'>
                {currentLanguage === 'ar'
                  ? 'نظام إدارة القضايا القانونية v1.0'
                  : 'Litigation Management System v1.0'}
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
