import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup,
  Badge
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRTL } from '@hooks/useRTL';
import {
  Settings,
  Save,
  Building,
  Mail,
  Phone,
  Globe,
  FileText,
  Calendar,
  DollarSign,
  Clock
} from 'lucide-react';

interface SystemSettings {
  // Company Information
  company_name: string;
  company_name_ar: string;
  company_address: string;
  company_address_ar: string;
  company_phone: string;
  company_email: string;
  company_website: string;
  company_logo: string;

  // System Configuration
  default_language: 'ar' | 'en';
  timezone: string;
  date_format: string;
  currency: string;
  currency_symbol: string;

  // Business Settings
  default_invoice_terms: string;
  default_payment_terms: number; // in days
  tax_rate: number;
  max_file_size: number; // in MB
  allowed_file_types: string[];

  // Notification Settings
  email_notifications: boolean;
  sms_notifications: boolean;
  reminder_days_before_hearing: number;
  reminder_days_overdue_invoice: number;

  // Security Settings
  session_timeout: number; // in minutes
  password_expiry_days: number;
  max_login_attempts: number;
  require_2fa: boolean;
}

export function GeneralSettings() {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  const [settings, setSettings] = useState<SystemSettings>({
    // Company Information
    company_name: 'مكتب المحاماة',
    company_name_ar: 'مكتب المحاماة',
    company_address: '',
    company_address_ar: '',
    company_phone: '',
    company_email: '',
    company_website: '',
    company_logo: '',

    // System Configuration
    default_language: 'ar',
    timezone: 'Asia/Riyadh',
    date_format: 'DD/MM/YYYY',
    currency: 'EGP',
    currency_symbol: 'ج.م',

    // Business Settings
    default_invoice_terms: 'يرجى السداد خلال 30 يوماً من تاريخ الإصدار',
    default_payment_terms: 30,
    tax_rate: 14,
    max_file_size: 10,
    allowed_file_types: ['pdf', 'doc', 'docx', 'jpg', 'png'],

    // Notification Settings
    email_notifications: true,
    sms_notifications: false,
    reminder_days_before_hearing: 3,
    reminder_days_overdue_invoice: 7,

    // Security Settings
    session_timeout: 60,
    password_expiry_days: 90,
    max_login_attempts: 5,
    require_2fa: false
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSettingChange = (field: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArraySettingChange = (field: 'allowed_file_types', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setSettings(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // In a real implementation, this would call an API
      // For now, we'll simulate the save operation
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('تم حفظ الإعدادات بنجاح');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Settings save error:', err);
      setError('خطأ في حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
      // Reset logic would go here
      setSuccess('تم إعادة تعيين الإعدادات إلى القيم الافتراضية');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          {success}
        </Alert>
      )}

      {/* Company Information */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <Building className="me-2" size={20} />
            معلومات الشركة
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>اسم الشركة (بالإنجليزية)</Form.Label>
                <Form.Control
                  type="text"
                  value={settings.company_name}
                  onChange={(e) => handleSettingChange('company_name', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>اسم الشركة (بالعربية)</Form.Label>
                <Form.Control
                  type="text"
                  value={settings.company_name_ar}
                  onChange={(e) => handleSettingChange('company_name_ar', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>العنوان (بالإنجليزية)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={settings.company_address}
                  onChange={(e) => handleSettingChange('company_address', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>العنوان (بالعربية)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={settings.company_address_ar}
                  onChange={(e) => handleSettingChange('company_address_ar', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <Phone size={16} className="me-1" />
                  رقم الهاتف
                </Form.Label>
                <Form.Control
                  type="tel"
                  value={settings.company_phone}
                  onChange={(e) => handleSettingChange('company_phone', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <Mail size={16} className="me-1" />
                  البريد الإلكتروني
                </Form.Label>
                <Form.Control
                  type="email"
                  value={settings.company_email}
                  onChange={(e) => handleSettingChange('company_email', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <Globe size={16} className="me-1" />
                  الموقع الإلكتروني
                </Form.Label>
                <Form.Control
                  type="url"
                  value={settings.company_website}
                  onChange={(e) => handleSettingChange('company_website', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* System Configuration */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <Settings className="me-2" size={20} />
            إعدادات النظام
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>اللغة الافتراضية</Form.Label>
                <Form.Select
                  value={settings.default_language}
                  onChange={(e) => handleSettingChange('default_language', e.target.value)}
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>المنطقة الزمنية</Form.Label>
                <Form.Select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                >
                  <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                  <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                  <option value="Asia/Dubai">دبي (GMT+4)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>تنسيق التاريخ</Form.Label>
                <Form.Select
                  value={settings.date_format}
                  onChange={(e) => handleSettingChange('date_format', e.target.value)}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>العملة</Form.Label>
                <Form.Select
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                >
                  <option value="EGP">جنيه مصري (EGP)</option>
                  <option value="SAR">ريال سعودي (SAR)</option>
                  <option value="USD">دولار أمريكي (USD)</option>
                  <option value="EUR">يورو (EUR)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Business Settings */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <FileText className="me-2" size={20} />
            إعدادات العمل
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>شروط الفاتورة الافتراضية</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={settings.default_invoice_terms}
                  onChange={(e) => handleSettingChange('default_invoice_terms', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>مدة السداد (بالأيام)</Form.Label>
                    <Form.Control
                      type="number"
                      value={settings.default_payment_terms}
                      onChange={(e) => handleSettingChange('default_payment_terms', parseInt(e.target.value))}
                      min="1"
                      max="365"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>معدل الضريبة (%)</Form.Label>
                    <Form.Control
                      type="number"
                      value={settings.tax_rate}
                      onChange={(e) => handleSettingChange('tax_rate', parseFloat(e.target.value))}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>الحد الأقصى لحجم الملف (MB)</Form.Label>
                    <Form.Control
                      type="number"
                      value={settings.max_file_size}
                      onChange={(e) => handleSettingChange('max_file_size', parseInt(e.target.value))}
                      min="1"
                      max="100"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>أنواع الملفات المسموحة</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.allowed_file_types.join(', ')}
                      onChange={(e) => handleArraySettingChange('allowed_file_types', e.target.value)}
                      placeholder="pdf, doc, docx, jpg, png"
                    />
                    <Form.Text className="text-muted">
                      افصل بين الأنواع بفاصلة
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Notification Settings */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <Calendar className="me-2" size={20} />
            إعدادات التذكير والإشعارات
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="email-notifications"
                  label="تفعيل الإشعارات عبر البريد الإلكتروني"
                  checked={settings.email_notifications}
                  onChange={(e) => handleSettingChange('email_notifications', e.target.checked)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="sms-notifications"
                  label="تفعيل الإشعارات عبر الرسائل النصية"
                  checked={settings.sms_notifications}
                  onChange={(e) => handleSettingChange('sms_notifications', e.target.checked)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>تذكير قبل الجلسة (بالأيام)</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.reminder_days_before_hearing}
                  onChange={(e) => handleSettingChange('reminder_days_before_hearing', parseInt(e.target.value))}
                  min="1"
                  max="30"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>تذكير الفواتير المتأخرة (بالأيام)</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.reminder_days_overdue_invoice}
                  onChange={(e) => handleSettingChange('reminder_days_overdue_invoice', parseInt(e.target.value))}
                  min="1"
                  max="90"
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Security Settings */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <Clock className="me-2" size={20} />
            إعدادات الأمان
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>مهلة انتهاء الجلسة (بالدقائق)</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.session_timeout}
                  onChange={(e) => handleSettingChange('session_timeout', parseInt(e.target.value))}
                  min="15"
                  max="480"
                />
                <Form.Text className="text-muted">
                  يتم تسجيل الخروج التلقائي بعد فترة عدم النشاط
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>انتهاء صلاحية كلمة المرور (بالأيام)</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.password_expiry_days}
                  onChange={(e) => handleSettingChange('password_expiry_days', parseInt(e.target.value))}
                  min="30"
                  max="365"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>الحد الأقصى لمحاولات تسجيل الدخول</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.max_login_attempts}
                  onChange={(e) => handleSettingChange('max_login_attempts', parseInt(e.target.value))}
                  min="3"
                  max="10"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="require-2fa"
                  label="إجبار المصادقة الثنائية"
                  checked={settings.require_2fa}
                  onChange={(e) => handleSettingChange('require_2fa', e.target.checked)}
                />
                <Form.Text className="text-muted">
                  يتطلب من جميع المستخدمين تفعيل المصادقة الثنائية
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Save Actions */}
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Badge variant="info" className="me-2">
                آخر تحديث: {new Date().toLocaleDateString('en-GB')}
              </Badge>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-danger"
                onClick={resetToDefaults}
                disabled={saving}
              >
                إعادة تعيين
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveSettings}
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
                    حفظ الإعدادات
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}