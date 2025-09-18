import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Spinner, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  Save,
  X,
  User,
  Building,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Upload,
  FileImage,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useRTL } from '../../hooks/useRTL';
import { MixedContentInput } from '../forms/MixedContentInput';
import { MixedContentTextarea } from '../forms/MixedContentTextarea';

interface ClientFormData {
  client_name_ar: string;
  client_name_en: string;
  client_type: 'individual' | 'company';
  cash_pro_bono: 'cash' | 'probono';
  status: 'active' | 'inactive' | 'disabled';
  contact_lawyer: string;
  phone: string;
  email: string;
  address_ar: string;
  address_en: string;
  notes_ar: string;
  notes_en: string;
  client_start_date: string;
  logo_file?: File;
  logo_url?: string;
}

interface ClientModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (clientData: ClientFormData) => Promise<void>;
  client?: Partial<ClientFormData>;
  mode: 'create' | 'edit' | 'view';
  loading?: boolean;
}

const defaultFormData: ClientFormData = {
  client_name_ar: '',
  client_name_en: '',
  client_type: 'individual',
  cash_pro_bono: 'cash',
  status: 'active',
  contact_lawyer: '',
  phone: '',
  email: '',
  address_ar: '',
  address_en: '',
  notes_ar: '',
  notes_en: '',
  client_start_date: new Date().toISOString().split('T')[0],
  logo_file: undefined,
  logo_url: '',
};

export const ClientModal: React.FC<ClientModalProps> = ({
  show,
  onHide,
  onSave,
  client,
  mode,
  loading = false,
}) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { isRTL } = useRTL();
  const [formData, setFormData] = useState<ClientFormData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  useEffect(() => {
    if (client && (isEditMode || isViewMode)) {
      // Ensure all fields have string values, never null or undefined
      const clientData = {
        ...defaultFormData,
        ...client,
        client_name_ar: client.client_name_ar || '',
        client_name_en: client.client_name_en || '',
        contact_lawyer: client.contact_lawyer || '',
        phone: client.phone || '',
        email: client.email || '',
        address_ar: client.address_ar || '',
        address_en: client.address_en || '',
        notes_ar: client.notes_ar || '',
        notes_en: client.notes_en || '',
        client_start_date: client.client_start_date || new Date().toISOString().split('T')[0],
      };
      setFormData(clientData);
      // Set logo preview if client has existing logo
      if (client.logo_url) {
        setLogoPreview(client.logo_url);
      } else {
        setLogoPreview(null);
      }
    } else if (isCreateMode) {
      setFormData(defaultFormData);
      setLogoPreview(null);
    }
    setErrors({});
  }, [client, mode, show]);

  // Cleanup blob URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ClientFormData, string>> = {};

    // Arabic name is required
    if (!formData.client_name_ar?.trim()) {
      newErrors.client_name_ar =
        currentLanguage === 'ar' ? 'اسم العميل بالعربية مطلوب' : 'Arabic client name is required';
    }

    // Email validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        currentLanguage === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format';
    }

    // Phone validation if provided
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = currentLanguage === 'ar' ? 'رقم الهاتف غير صحيح' : 'Invalid phone number';
    }

    // Contact lawyer is required
    if (!formData.contact_lawyer?.trim()) {
      newErrors.contact_lawyer =
        currentLanguage === 'ar' ? 'المحامي المسؤول مطلوب' : 'Contact lawyer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isViewMode) {
      onHide();
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await onSave(formData);
      onHide();
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Logo handling functions
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        logo_file:
          currentLanguage === 'ar'
            ? 'يرجى اختيار ملف صورة صحيح (JPEG, PNG, GIF, WebP)'
            : 'Please select a valid image file (JPEG, PNG, GIF, WebP)',
      }));
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        logo_file:
          currentLanguage === 'ar'
            ? 'حجم الملف يجب أن يكون أقل من 5 ميجابايت'
            : 'File size must be less than 5MB',
      }));
      return;
    }

    // Clear any existing errors
    setErrors((prev) => ({ ...prev, logo_file: undefined }));

    // Clean up previous preview URL to prevent memory leaks
    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }

    // Update form data
    setFormData((prev) => ({ ...prev, logo_file: file }));

    // Create preview using URL.createObjectURL (more efficient than FileReader)
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  const handleLogoRemove = () => {
    // Clean up preview URL to prevent memory leaks
    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }

    setFormData((prev) => ({ ...prev, logo_file: undefined, logo_url: '' }));
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setErrors((prev) => ({ ...prev, logo_file: undefined }));
  };

  const triggerFileInput = () => {
    if (!isViewMode) {
      fileInputRef.current?.click();
    }
  };

  const getModalTitle = () => {
    const titles = {
      create: currentLanguage === 'ar' ? 'إضافة عميل جديد' : 'Add New Client',
      edit: currentLanguage === 'ar' ? 'تعديل العميل' : 'Edit Client',
      view: currentLanguage === 'ar' ? 'تفاصيل العميل' : 'Client Details',
    };
    return titles[mode];
  };

  const getSubmitButtonText = () => {
    if (submitting) {
      return currentLanguage === 'ar' ? 'جاري الحفظ...' : 'Saving...';
    }
    if (isViewMode) {
      return currentLanguage === 'ar' ? 'إغلاق' : 'Close';
    }
    return currentLanguage === 'ar' ? 'حفظ' : 'Save';
  };

  return (
    <Modal show={show} onHide={onHide} size='lg' centered dir={isRTL ? 'rtl' : 'ltr'}>
      <Modal.Header closeButton className='border-bottom'>
        <Modal.Title className='d-flex align-items-center'>
          {formData.client_type === 'company' ? (
            <Building className='me-2' size={20} />
          ) : (
            <User className='me-2' size={20} />
          )}
          {getModalTitle()}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className='p-4'>
          {loading && (
            <div className='text-center py-3'>
              <Spinner animation='border' />
              <p className='mt-2 text-muted'>
                {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </p>
            </div>
          )}

          {!loading && (
            <>
              {/* Basic Information */}
              <Row className='mb-4'>
                <Col xs={12}>
                  <h6 className='text-muted mb-3'>
                    {currentLanguage === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                  </h6>
                </Col>
              </Row>

              {/* Logo Upload Section */}
              <Row className='mb-4'>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      <FileImage size={16} className='me-1' />
                      {currentLanguage === 'ar' ? 'شعار العميل' : 'Client Logo'}
                      <small className='text-muted ms-2'>
                        (
                        {currentLanguage === 'ar'
                          ? 'اختياري - للشركات والتقارير'
                          : 'Optional - for companies and reports'}
                        )
                      </small>
                    </Form.Label>

                    <div
                      className='logo-upload-container border rounded p-3'
                      style={{ minHeight: '120px' }}
                    >
                      {logoPreview ? (
                        <div className='text-center position-relative'>
                          <Image
                            src={logoPreview}
                            alt='Client Logo Preview'
                            style={{
                              maxWidth: '200px',
                              maxHeight: '100px',
                              objectFit: 'contain',
                            }}
                            className='border rounded'
                          />
                          {!isViewMode && (
                            <Button
                              variant='outline-danger'
                              size='sm'
                              className='position-absolute top-0 end-0 mt-1 me-1'
                              onClick={handleLogoRemove}
                              title={currentLanguage === 'ar' ? 'إزالة الشعار' : 'Remove Logo'}
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                          <div className='mt-2'>
                            <small className='text-muted'>
                              {formData.logo_file?.name ||
                                (currentLanguage === 'ar' ? 'الشعار الحالي' : 'Current Logo')}
                            </small>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`text-center py-4 ${!isViewMode ? 'cursor-pointer' : ''}`}
                          onClick={triggerFileInput}
                          style={{
                            border: '2px dashed #dee2e6',
                            borderRadius: '0.375rem',
                            backgroundColor: '#f8f9fa',
                          }}
                        >
                          <Upload size={32} className='text-muted mb-2' />
                          <div>
                            <div className='fw-medium'>
                              {currentLanguage === 'ar'
                                ? 'اضغط لرفع الشعار'
                                : 'Click to upload logo'}
                            </div>
                            <small className='text-muted'>
                              {currentLanguage === 'ar'
                                ? 'PNG, JPG, GIF حتى 5 ميجابايت'
                                : 'PNG, JPG, GIF up to 5MB'}
                            </small>
                          </div>
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        onChange={handleLogoUpload}
                        style={{ display: 'none' }}
                        disabled={isViewMode}
                      />
                    </div>

                    {errors.logo_file && (
                      <Form.Control.Feedback type='invalid' className='d-block'>
                        {errors.logo_file}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <div className='text-muted small mt-4'>
                    <h6 className='small'>
                      {currentLanguage === 'ar' ? 'إرشادات الشعار:' : 'Logo Guidelines:'}
                    </h6>
                    <ul className='mb-0'>
                      <li>
                        {currentLanguage === 'ar'
                          ? 'مفيد للشركات والمؤسسات'
                          : 'Useful for companies and organizations'}
                      </li>
                      <li>
                        {currentLanguage === 'ar'
                          ? 'يظهر في التقارير والوثائق'
                          : 'Appears in reports and documents'}
                      </li>
                      <li>
                        {currentLanguage === 'ar'
                          ? 'أبعاد مثلى: 300×100 بكسل'
                          : 'Optimal dimensions: 300×100 pixels'}
                      </li>
                      <li>
                        {currentLanguage === 'ar'
                          ? 'خلفية شفافة مفضلة'
                          : 'Transparent background preferred'}
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>

              <Row className='mb-3'>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className='required'>
                      {currentLanguage === 'ar' ? 'اسم العميل (عربي)' : 'Client Name (Arabic)'}
                    </Form.Label>
                    <MixedContentInput
                      value={formData.client_name_ar}
                      onChange={(value) => handleInputChange('client_name_ar', value)}
                      placeholder={
                        currentLanguage === 'ar'
                          ? 'أدخل اسم العميل بالعربية'
                          : 'Enter Arabic client name'
                      }
                      disabled={isViewMode}
                      isInvalid={!!errors.client_name_ar}
                      dir='rtl'
                    />
                    {errors.client_name_ar && (
                      <Form.Control.Feedback type='invalid' className='d-block'>
                        {errors.client_name_ar}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      {currentLanguage === 'ar' ? 'اسم العميل (إنجليزي)' : 'Client Name (English)'}
                    </Form.Label>
                    <MixedContentInput
                      value={formData.client_name_en}
                      onChange={(value) => handleInputChange('client_name_en', value)}
                      placeholder={
                        currentLanguage === 'ar'
                          ? 'أدخل اسم العميل بالإنجليزية'
                          : 'Enter English client name'
                      }
                      disabled={isViewMode}
                      dir='ltr'
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='mb-3'>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      {currentLanguage === 'ar' ? 'نوع العميل' : 'Client Type'}
                    </Form.Label>
                    <Form.Select
                      value={formData.client_type}
                      onChange={(e) => handleInputChange('client_type', e.target.value)}
                      disabled={isViewMode}
                    >
                      <option value='individual'>
                        {currentLanguage === 'ar' ? 'فرد' : 'Individual'}
                      </option>
                      <option value='company'>
                        {currentLanguage === 'ar' ? 'شركة' : 'Company'}
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      {currentLanguage === 'ar' ? 'نوع الخدمة' : 'Service Type'}
                    </Form.Label>
                    <Form.Select
                      value={formData.cash_pro_bono}
                      onChange={(e) => handleInputChange('cash_pro_bono', e.target.value)}
                      disabled={isViewMode}
                    >
                      <option value='cash'>{currentLanguage === 'ar' ? 'مدفوع' : 'Paid'}</option>
                      <option value='probono'>
                        {currentLanguage === 'ar' ? 'مجاني' : 'Pro Bono'}
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</Form.Label>
                    <Form.Select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      disabled={isViewMode}
                    >
                      <option value='active'>{currentLanguage === 'ar' ? 'نشط' : 'Active'}</option>
                      <option value='inactive'>
                        {currentLanguage === 'ar' ? 'غير نشط' : 'Inactive'}
                      </option>
                      <option value='disabled'>
                        {currentLanguage === 'ar' ? 'معطل' : 'Disabled'}
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Contact Information */}
              <Row className='mb-4 mt-4'>
                <Col xs={12}>
                  <h6 className='text-muted mb-3'>
                    {currentLanguage === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                  </h6>
                </Col>
              </Row>

              <Row className='mb-3'>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className='required'>
                      <Phone size={16} className='me-1' />
                      {currentLanguage === 'ar' ? 'المحامي المسؤول' : 'Contact Lawyer'}
                    </Form.Label>
                    <Form.Control
                      type='text'
                      value={formData.contact_lawyer}
                      onChange={(e) => handleInputChange('contact_lawyer', e.target.value)}
                      placeholder={
                        currentLanguage === 'ar' ? 'اسم المحامي المسؤول' : 'Contact lawyer name'
                      }
                      disabled={isViewMode}
                      isInvalid={!!errors.contact_lawyer}
                    />
                    {errors.contact_lawyer && (
                      <Form.Control.Feedback type='invalid'>
                        {errors.contact_lawyer}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      <Phone size={16} className='me-1' />
                      {currentLanguage === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </Form.Label>
                    <Form.Control
                      type='tel'
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder={
                        currentLanguage === 'ar' ? '+966 xx xxx xxxx' : '+966 xx xxx xxxx'
                      }
                      disabled={isViewMode}
                      isInvalid={!!errors.phone}
                      dir='ltr'
                    />
                    {errors.phone && (
                      <Form.Control.Feedback type='invalid'>{errors.phone}</Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      <Mail size={16} className='me-1' />
                      {currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </Form.Label>
                    <Form.Control
                      type='email'
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={
                        currentLanguage === 'ar' ? 'client@example.com' : 'client@example.com'
                      }
                      disabled={isViewMode}
                      isInvalid={!!errors.email}
                      dir='ltr'
                    />
                    {errors.email && (
                      <Form.Control.Feedback type='invalid'>{errors.email}</Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row className='mb-3'>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      <MapPin size={16} className='me-1' />
                      {currentLanguage === 'ar' ? 'العنوان (عربي)' : 'Address (Arabic)'}
                    </Form.Label>
                    <MixedContentTextarea
                      value={formData.address_ar}
                      onChange={(value) => handleInputChange('address_ar', value)}
                      placeholder={
                        currentLanguage === 'ar' ? 'أدخل العنوان بالعربية' : 'Enter Arabic address'
                      }
                      disabled={isViewMode}
                      rows={3}
                      dir='rtl'
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      <MapPin size={16} className='me-1' />
                      {currentLanguage === 'ar' ? 'العنوان (إنجليزي)' : 'Address (English)'}
                    </Form.Label>
                    <MixedContentTextarea
                      value={formData.address_en}
                      onChange={(value) => handleInputChange('address_en', value)}
                      placeholder={
                        currentLanguage === 'ar'
                          ? 'أدخل العنوان بالإنجليزية'
                          : 'Enter English address'
                      }
                      disabled={isViewMode}
                      rows={3}
                      dir='ltr'
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Additional Information */}
              <Row className='mb-4 mt-4'>
                <Col xs={12}>
                  <h6 className='text-muted mb-3'>
                    {currentLanguage === 'ar' ? 'معلومات إضافية' : 'Additional Information'}
                  </h6>
                </Col>
              </Row>

              <Row className='mb-3'>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      <Calendar size={16} className='me-1' />
                      {currentLanguage === 'ar' ? 'تاريخ بداية العلاقة' : 'Start Date'}
                    </Form.Label>
                    <Form.Control
                      type='date'
                      value={formData.client_start_date}
                      onChange={(e) => handleInputChange('client_start_date', e.target.value)}
                      disabled={isViewMode}
                      dir='ltr'
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='mb-3'>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      {currentLanguage === 'ar' ? 'ملاحظات (عربي)' : 'Notes (Arabic)'}
                    </Form.Label>
                    <MixedContentTextarea
                      value={formData.notes_ar}
                      onChange={(value) => handleInputChange('notes_ar', value)}
                      placeholder={
                        currentLanguage === 'ar'
                          ? 'ملاحظات إضافية بالعربية'
                          : 'Additional notes in Arabic'
                      }
                      disabled={isViewMode}
                      rows={4}
                      dir='rtl'
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      {currentLanguage === 'ar' ? 'ملاحظات (إنجليزي)' : 'Notes (English)'}
                    </Form.Label>
                    <MixedContentTextarea
                      value={formData.notes_en}
                      onChange={(value) => handleInputChange('notes_en', value)}
                      placeholder={
                        currentLanguage === 'ar'
                          ? 'ملاحظات إضافية بالإنجليزية'
                          : 'Additional notes in English'
                      }
                      disabled={isViewMode}
                      rows={4}
                      dir='ltr'
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>

        <Modal.Footer className='border-top'>
          <Button
            variant='outline-secondary'
            onClick={onHide}
            disabled={submitting}
            className='d-flex align-items-center'
          >
            <X size={16} className='me-1' />
            {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>

          <Button
            variant={isViewMode ? 'primary' : 'success'}
            type='submit'
            disabled={submitting}
            className='d-flex align-items-center'
          >
            {submitting ? (
              <Spinner size='sm' animation='border' className='me-1' />
            ) : (
              <Save size={16} className='me-1' />
            )}
            {getSubmitButtonText()}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
