import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import {
  Save,
  X,
  Calendar,
  Clock,
  Gavel,
  FileText,
  Users,
  Building,
} from 'lucide-react';
import { apiService as api } from '../../services/api';
import LawyerMultiSelect, { LawyerOption } from '../forms/LawyerMultiSelect';

interface HearingFormData {
  id?: number;
  case_id: string;
  hearing_date: string;
  hearing_type: string;
  hearing_result: string;
  hearing_duration: string;
  hearing_decision: string;
  court_notes: string;
  lawyer_notes: string;
  expert_notes: string;
  next_hearing: string;
  short_decision: string;
  lawyer_ids?: number[];
  lawyers?: LawyerOption[];
}

interface HearingModalProps {
  show: boolean;
  onHide: () => void;
  onSave: () => void;
  hearingData?: Partial<HearingFormData>;
  mode: 'create' | 'edit' | 'view';
}

interface HearingOptions {
  hearing_type: Record<string, string>;
  hearing_result: Record<string, string>;
  hearing_duration: Record<string, string>;
}

// Helper function to format date for datetime-local input
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const defaultFormData: HearingFormData = {
  case_id: '',
  hearing_date: '',
  hearing_type: '',
  hearing_result: '',
  hearing_duration: '',
  hearing_decision: '',
  court_notes: '',
  lawyer_notes: '',
  expert_notes: '',
  next_hearing: '',
  short_decision: '',
};

const HearingModal: React.FC<HearingModalProps> = ({
  show,
  onHide,
  onSave,
  hearingData,
  mode,
}) => {
  const [formData, setFormData] = useState<HearingFormData>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [selectedLawyers, setSelectedLawyers] = useState<LawyerOption[]>([]);
  const [options, setOptions] = useState<HearingOptions>({
    hearing_type: {},
    hearing_result: {},
    hearing_duration: {},
  });

  useEffect(() => {
    if (show) {
      loadCases();
      loadOptions();
      if (hearingData) {
        setFormData({
          ...defaultFormData,
          ...hearingData,
          case_id: String(hearingData.case_id || ''),
          hearing_date: formatDateForInput(hearingData.hearing_date || ''),
          next_hearing: formatDateForInput(hearingData.next_hearing || ''),
        });

        // Handle lawyer data if available - transform from backend format to LawyerOption format
        console.log('HearingModal: Loading hearing data:', hearingData);
        if (hearingData.lawyers && Array.isArray(hearingData.lawyers)) {
          console.log('HearingModal: Raw lawyers data:', hearingData.lawyers);
          const transformedLawyers = hearingData.lawyers.map((lawyer: any) => ({
            value: lawyer.id,
            label: lawyer.lawyer_name_ar
              ? `${lawyer.lawyer_name_ar}${lawyer.lawyer_name_en ? ` - ${lawyer.lawyer_name_en}` : ''}`
              : lawyer.lawyer_name_en || `Lawyer ${lawyer.id}`,
            data: lawyer
          }));
          console.log('HearingModal: Transformed lawyers:', transformedLawyers);
          setSelectedLawyers(transformedLawyers);
        } else {
          console.log('HearingModal: No lawyers data found, setting empty array');
          setSelectedLawyers([]);
        }
      } else {
        setFormData(defaultFormData);
        setSelectedLawyers([]);
      }
    }
  }, [show, hearingData]);

  const loadCases = async () => {
    try {
      const response = await api.get('/cases');
      if (response.success) {
        setCases(response.data.data || []);
      }
    } catch (err) {
      console.error('Error loading cases:', err);
    }
  };

  const loadOptions = async () => {
    try {
      const response = await api.get('/hearings/options');
      if (response.success && response.data) {
        // Ensure the response has the expected structure
        setOptions({
          hearing_type: response.data.type || {},
          hearing_result: response.data.result || {},
          hearing_duration: {
            '30min': '30 دقيقة',
            '1hour': 'ساعة واحدة',
            '2hours': 'ساعتان',
            '3hours': 'ثلاث ساعات',
            '4hours': 'أربع ساعات',
            'fullday': 'يوم كامل'
          },
        });
      }
    } catch (err) {
      console.error('Error loading hearing options:', err);
      // Set default options if API fails
      setOptions({
        hearing_type: {
          'initial': 'أولى',
          'procedural': 'إجرائية',
          'evidence': 'بينات',
          'witness': 'شهود',
          'expert': 'خبراء',
          'final': 'نهائية',
          'appeal': 'استئناف',
          'execution': 'تنفيذ',
        },
        hearing_result: {
          'won': 'لصالح',
          'lost': 'ضد',
          'postponed': 'مؤجلة',
          'pending': 'معلقة',
          'settled': 'تسوية'
        },
        hearing_duration: {
          '30min': '30 دقيقة',
          '1hour': 'ساعة واحدة',
          '2hours': 'ساعتان',
          '3hours': 'ثلاث ساعات',
          '4hours': 'أربع ساعات',
          'fullday': 'يوم كامل'
        }
      });
    }
  };

  const handleInputChange = (field: keyof HearingFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!String(formData.case_id).trim()) {
      setError('يرجى اختيار القضية');
      return false;
    }
    if (!formData.hearing_date.trim()) {
      setError('يرجى إدخال تاريخ الجلسة');
      return false;
    }
    if (!formData.hearing_type.trim()) {
      setError('يرجى اختيار نوع الجلسة');
      return false;
    }
    if (!formData.hearing_duration.trim()) {
      setError('يرجى اختيار مدة الجلسة');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Prepare form data with lawyer IDs
      const submitData = {
        ...formData,
        lawyer_ids: selectedLawyers.map(lawyer => lawyer.value)
      };

      console.log('HearingModal: Submitting data:', {
        mode,
        formData,
        selectedLawyers,
        submitData,
        lawyerIds: submitData.lawyer_ids
      });

      let response;
      if (mode === 'edit' && formData.id) {
        // Update existing hearing
        console.log('HearingModal: Updating hearing ID:', formData.id);
        response = await api.put(`/hearings/${formData.id}`, submitData);
      } else {
        // Create new hearing
        console.log('HearingModal: Creating new hearing');
        response = await api.post('/hearings', submitData);
      }

      console.log('HearingModal: API response:', response);

      if (response.success) {
        toast.success(mode === 'edit' ? 'تم تحديث الجلسة بنجاح' : 'تم إضافة الجلسة بنجاح');
        onSave();
        onHide();
      } else {
        setError(response.error || 'حدث خطأ أثناء حفظ الجلسة');
      }
    } catch (err: any) {
      console.error('Error saving hearing:', err);
      setError(err.message || 'حدث خطأ أثناء حفظ الجلسة');
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = mode === 'create' ? 'إضافة جلسة جديدة' : mode === 'edit' ? 'تعديل الجلسة' : 'تفاصيل الجلسة';

  return (
    <Modal show={show} onHide={onHide} size="xl" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <Gavel className="me-2" size={20} />
          {modalTitle}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {error && <Alert variant="danger">{error}</Alert>}

          <Row>
            {/* Basic Information */}
            <Col md={12} className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <FileText className="me-2" size={18} />
                المعلومات الأساسية
              </h5>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>القضية *</Form.Label>
                <Form.Select
                  value={formData.case_id}
                  onChange={(e) => handleInputChange('case_id', e.target.value)}
                  disabled={mode === 'view'}
                  required
                >
                  <option value="">اختر القضية</option>
                  {cases.map((caseItem) => (
                    <option key={caseItem.id} value={caseItem.id}>
                      {caseItem.matter_id} - {caseItem.matter_ar}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>تاريخ الجلسة *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={formData.hearing_date}
                  onChange={(e) => handleInputChange('hearing_date', e.target.value)}
                  disabled={mode === 'view'}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>نوع الجلسة *</Form.Label>
                <Form.Select
                  value={formData.hearing_type}
                  onChange={(e) => handleInputChange('hearing_type', e.target.value)}
                  disabled={mode === 'view'}
                  required
                >
                  <option value="">اختر نوع الجلسة</option>
                  {Object.entries(options.hearing_type).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>نتيجة الجلسة</Form.Label>
                <Form.Select
                  value={formData.hearing_result}
                  onChange={(e) => handleInputChange('hearing_result', e.target.value)}
                  disabled={mode === 'view'}
                >
                  <option value="">اختر نتيجة الجلسة</option>
                  {Object.entries(options.hearing_result).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12} className="mb-3">
              <Form.Group>
                <Form.Label>
                  <Users className="me-2" size={16} />
                  المحامون الحاضرون
                </Form.Label>
                <LawyerMultiSelect
                  value={selectedLawyers}
                  onChange={setSelectedLawyers}
                  placeholder="اختر المحامين الحاضرين في الجلسة..."
                  isDisabled={mode === 'view'}
                  className="mt-2"
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>مدة الجلسة *</Form.Label>
                <Form.Select
                  value={formData.hearing_duration}
                  onChange={(e) => handleInputChange('hearing_duration', e.target.value)}
                  disabled={mode === 'view'}
                  required
                >
                  <option value="">اختر مدة الجلسة</option>
                  {Object.entries(options.hearing_duration).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>تاريخ الجلسة القادمة</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={formData.next_hearing}
                  onChange={(e) => handleInputChange('next_hearing', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            {/* Decisions and Notes Section */}
            <Col md={12} className="mb-4 mt-4">
              <h5 className="border-bottom pb-2 mb-3">
                <Building className="me-2" size={18} />
                القرارات والملاحظات
              </h5>
            </Col>

            <Col md={12} className="mb-3">
              <Form.Group>
                <Form.Label>قرار الجلسة</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="أدخل قرار الجلسة..."
                  value={formData.hearing_decision}
                  onChange={(e) => handleInputChange('hearing_decision', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            <Col md={12} className="mb-3">
              <Form.Group>
                <Form.Label>القرار المختصر</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="ملخص مختصر للقرار..."
                  value={formData.short_decision}
                  onChange={(e) => handleInputChange('short_decision', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>ملاحظات المحكمة</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="ملاحظات المحكمة..."
                  value={formData.court_notes}
                  onChange={(e) => handleInputChange('court_notes', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>ملاحظات المحامي</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="ملاحظات المحامي..."
                  value={formData.lawyer_notes}
                  onChange={(e) => handleInputChange('lawyer_notes', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            <Col md={12} className="mb-3">
              <Form.Group>
                <Form.Label>ملاحظات الخبير</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="ملاحظات الخبير إن وجد..."
                  value={formData.expert_notes}
                  onChange={(e) => handleInputChange('expert_notes', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            <X className="me-1" size={16} />
            إلغاء
          </Button>
          {mode !== 'view' && (
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? (
                <Spinner animation="border" size="sm" className="me-1" />
              ) : (
                <Save className="me-1" size={16} />
              )}
              {saving ? 'جاري الحفظ...' : mode === 'edit' ? 'تحديث' : 'حفظ'}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default HearingModal;