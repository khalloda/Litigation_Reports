import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Modal
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@components/auth/AuthProvider';
import { useRTL } from '@hooks/useRTL';
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { apiService as api } from '../../services/api';

interface ProfileData {
  id: number;
  name: string;
  arabic_name?: string;
  email: string;
  phone?: string;
  title?: string;
  bio?: string;
  language_preference?: 'ar' | 'en';
  role: string;
  status: string;
  created_at: string;
}

interface PasswordChangeData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export function ProfileSettings() {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const { isRTL } = useRTL();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState<any>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/profile');

      if (response.success) {
        setProfile(response.data);
      } else {
        setError('فشل في تحميل بيانات الملف الشخصي');
      }
    } catch (err) {
      console.error('Profile load error:', err);
      setError('خطأ في تحميل بيانات الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    if (profile) {
      setProfile({
        ...profile,
        [field]: value
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updateData = {
        name: profile.name,
        arabic_name: profile.arabic_name,
        email: profile.email,
        phone: profile.phone,
        title: profile.title,
        bio: profile.bio,
        language_preference: profile.language_preference
      };

      const response = await api.put('/profile', updateData);

      if (response.success) {
        setSuccess('تم تحديث الملف الشخصي بنجاح');
        setProfile(response.data);
        refreshUser(); // Refresh user context

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'فشل في تحديث الملف الشخصي');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('خطأ في تحديث الملف الشخصي');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setPasswordErrors({});

      if (passwordData.new_password !== passwordData.confirm_password) {
        setPasswordErrors({ confirm_password: ['كلمة المرور الجديدة وتأكيدها غير متطابقين'] });
        return;
      }

      const response = await api.post('/profile/change-password', passwordData);

      if (response.success) {
        setSuccess('تم تغيير كلمة المرور بنجاح');
        setShowPasswordModal(false);
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        if (response.errors) {
          setPasswordErrors(response.errors);
        } else {
          setPasswordErrors({ general: [response.message || 'فشل في تغيير كلمة المرور'] });
        }
      }
    } catch (err) {
      console.error('Password change error:', err);
      setPasswordErrors({ general: ['خطأ في تغيير كلمة المرور'] });
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">جاري تحميل بيانات الملف الشخصي...</p>
        </Card.Body>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger">
            فشل في تحميل بيانات الملف الشخصي
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <User className="me-2" size={20} />
            الملف الشخصي
          </h5>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setShowPasswordModal(true)}
          >
            <Lock size={16} className="me-1" />
            تغيير كلمة المرور
          </Button>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-3">
              {success}
            </Alert>
          )}

          <Form dir={isRTL ? 'rtl' : 'ltr'}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>الاسم بالإنجليزية *</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>الاسم بالعربية</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.arabic_name || ''}
                    onChange={(e) => handleProfileChange('arabic_name', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>البريد الإلكتروني *</Form.Label>
                  <Form.Control
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>رقم الهاتف</Form.Label>
                  <Form.Control
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>المسمى الوظيفي</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.title || ''}
                    onChange={(e) => handleProfileChange('title', e.target.value)}
                    placeholder="مثال: محامي أول، مساعد قانوني، إلخ"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>اللغة المفضلة</Form.Label>
                  <Form.Select
                    value={profile.language_preference || 'ar'}
                    onChange={(e) => handleProfileChange('language_preference', e.target.value)}
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>نبذة شخصية</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={profile.bio || ''}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                placeholder="اكتب نبذة مختصرة عن نفسك..."
                maxLength={1000}
              />
              <Form.Text className="text-muted">
                {profile.bio?.length || 0}/1000 حرف
              </Form.Text>
            </Form.Group>

            <hr />

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>الدور</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.role}
                    disabled
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>الحالة</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.status}
                    disabled
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>تاريخ الإنشاء</Form.Label>
                  <Form.Control
                    type="text"
                    value={new Date(profile.created_at).toLocaleDateString('ar-SA')}
                    disabled
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={loadProfile}
                disabled={saving}
              >
                إعادة تعيين
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner size="sm" className="me-1" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save size={16} className="me-1" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Password Change Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Lock size={20} className="me-2" />
            تغيير كلمة المرور
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {passwordErrors.general && (
            <Alert variant="danger">
              {passwordErrors.general.join(', ')}
            </Alert>
          )}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>كلمة المرور الحالية *</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    current_password: e.target.value
                  }))}
                  isInvalid={!!passwordErrors.current_password}
                />
                <Button
                  variant="link"
                  className="position-absolute top-50 end-0 translate-middle-y pe-3"
                  style={{ border: 'none', background: 'none' }}
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {passwordErrors.current_password && (
                <div className="text-danger small mt-1">
                  {passwordErrors.current_password.join(', ')}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>كلمة المرور الجديدة *</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    new_password: e.target.value
                  }))}
                  isInvalid={!!passwordErrors.new_password}
                />
                <Button
                  variant="link"
                  className="position-absolute top-50 end-0 translate-middle-y pe-3"
                  style={{ border: 'none', background: 'none' }}
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {passwordErrors.new_password && (
                <div className="text-danger small mt-1">
                  {passwordErrors.new_password.join(', ')}
                </div>
              )}
              <Form.Text className="text-muted">
                يجب أن تكون كلمة المرور 6 أحرف على الأقل
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>تأكيد كلمة المرور الجديدة *</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    confirm_password: e.target.value
                  }))}
                  isInvalid={!!passwordErrors.confirm_password}
                />
                <Button
                  variant="link"
                  className="position-absolute top-50 end-0 translate-middle-y pe-3"
                  style={{ border: 'none', background: 'none' }}
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {passwordErrors.confirm_password && (
                <div className="text-danger small mt-1">
                  {passwordErrors.confirm_password.join(', ')}
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowPasswordModal(false)}
          >
            إلغاء
          </Button>
          <Button
            variant="primary"
            onClick={handlePasswordChange}
            disabled={!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
          >
            تغيير كلمة المرور
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}