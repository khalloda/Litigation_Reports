import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import {
  Save,
  X,
  Gavel,
  User,
  Calendar,
  Building,
  DollarSign,
  FileText,
  Users,
} from 'lucide-react';
import { apiService as api } from '../../services/api';

interface CaseFormData {
  id?: number;
  client_id: string;
  matter_id: string;
  matter_ar: string;
  matter_en: string;
  client_capacity: string;
  opponent_capacity: string;
  matter_subject: string;
  matter_status: string;
  matter_category: string;
  matter_degree: string;
  matter_importance: string;
  matter_start_date: string;
  matter_end_date: string;
  circuit_secretary: string;
  matter_asked_amount: string;
  matter_judged_amount: string;
  client_branch: string;
  matter_shelf: string;
  court_floor: string;
  court_hall: string;
  secretary_room: string;
  matter_court: string;
  matter_circuit: string;
  matter_destination: string;
  matter_select: string;
  matter_partner: string;
  matter_notes1: string;
  matter_notes2: string;
  lawyer_a: string;
  lawyer_b: string;
  matter_evaluation: string;
  financial_allocation: string;
  work_team_id: string;
  contract_id: string;
}

interface CaseModalProps {
  show: boolean;
  onHide: () => void;
  onSave: () => void;
  caseData?: Partial<CaseFormData>;
  mode: 'create' | 'edit' | 'view';
}

interface CaseOptions {
  status: Record<string, string>;
  category: Record<string, string>;
  importance: Record<string, string>;
  degree: Record<string, string>;
}

const defaultFormData: CaseFormData = {
  client_id: '',
  matter_id: '',
  matter_ar: '',
  matter_en: '',
  client_capacity: '',
  opponent_capacity: '',
  matter_subject: '',
  matter_status: 'active',
  matter_category: '',
  matter_degree: '',
  matter_importance: 'medium',
  matter_start_date: '',
  matter_end_date: '',
  circuit_secretary: '',
  matter_asked_amount: '',
  matter_judged_amount: '',
  client_branch: '',
  matter_shelf: '',
  court_floor: '',
  court_hall: '',
  secretary_room: '',
  matter_court: '',
  matter_circuit: '',
  matter_destination: '',
  matter_select: '',
  matter_partner: '',
  matter_notes1: '',
  matter_notes2: '',
  lawyer_a: '',
  lawyer_b: '',
  matter_evaluation: '',
  financial_allocation: '',
  work_team_id: '',
  contract_id: '',
};

const CaseModal: React.FC<CaseModalProps> = ({
  show,
  onHide,
  onSave,
  caseData,
  mode,
}) => {
  const [formData, setFormData] = useState<CaseFormData>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [options, setOptions] = useState<CaseOptions>({
    status: {},
    category: {},
    importance: {},
    degree: {},
  });

  useEffect(() => {
    if (show) {
      loadClients();
      loadOptions();
      if (caseData) {
        setFormData({ ...defaultFormData, ...caseData });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [show, caseData]);

  const loadClients = async () => {
    try {
      const response = await api.get('/clients');
      if (response.success) {
        setClients(response.data.data || []);
      }
    } catch (err) {
      console.error('Error loading clients:', err);
    }
  };

  const loadOptions = async () => {
    try {
      const response = await api.get('/cases/options');
      if (response.success) {
        setOptions(response.data);
      }
    } catch (err) {
      console.error('Error loading case options:', err);
    }
  };

  const handleInputChange = (field: keyof CaseFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.client_id.trim()) {
      setError('يرجى اختيار العميل');
      return false;
    }
    if (!formData.matter_id.trim()) {
      setError('يرجى إدخال رقم القضية');
      return false;
    }
    if (!formData.matter_ar.trim()) {
      setError('يرجى إدخال موضوع القضية باللغة العربية');
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
      let response;
      if (mode === 'edit' && formData.id) {
        // Update existing case
        response = await api.put(`/cases/${formData.id}`, formData);
      } else {
        // Create new case
        response = await api.post('/cases', formData);
      }

      if (response.success) {
        toast.success(mode === 'edit' ? 'تم تحديث القضية بنجاح' : 'تم إضافة القضية بنجاح');
        onSave();
        onHide();
      } else {
        setError(response.error || 'حدث خطأ أثناء حفظ القضية');
      }
    } catch (err: any) {
      console.error('Error saving case:', err);
      setError(err.message || 'حدث خطأ أثناء حفظ القضية');
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = mode === 'create' ? 'إضافة قضية جديدة' : mode === 'edit' ? 'تعديل القضية' : 'تفاصيل القضية';

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
                <Form.Label>العميل *</Form.Label>
                <Form.Select
                  value={formData.client_id}
                  onChange={(e) => handleInputChange('client_id', e.target.value)}
                  disabled={mode === 'view'}
                  required
                >
                  <option value="">اختر العميل</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.client_name_ar} {client.client_name_en && `(${client.client_name_en})`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>رقم القضية *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="أدخل رقم القضية"
                  value={formData.matter_id}
                  onChange={(e) => handleInputChange('matter_id', e.target.value)}
                  disabled={mode === 'view'}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>موضوع القضية (عربي) *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="أدخل موضوع القضية باللغة العربية"
                  value={formData.matter_ar}
                  onChange={(e) => handleInputChange('matter_ar', e.target.value)}
                  disabled={mode === 'view'}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>موضوع القضية (إنجليزي)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter case subject in English"
                  value={formData.matter_en}
                  onChange={(e) => handleInputChange('matter_en', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>حالة القضية</Form.Label>
                <Form.Select
                  value={formData.matter_status}
                  onChange={(e) => handleInputChange('matter_status', e.target.value)}
                  disabled={mode === 'view'}
                >
                  {Object.entries(options.status).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>نوع القضية</Form.Label>
                <Form.Select
                  value={formData.matter_category}
                  onChange={(e) => handleInputChange('matter_category', e.target.value)}
                  disabled={mode === 'view'}
                >
                  <option value="">اختر نوع القضية</option>
                  {Object.entries(options.category).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>أهمية القضية</Form.Label>
                <Form.Select
                  value={formData.matter_importance}
                  onChange={(e) => handleInputChange('matter_importance', e.target.value)}
                  disabled={mode === 'view'}
                >
                  {Object.entries(options.importance).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>درجة القضية</Form.Label>
                <Form.Select
                  value={formData.matter_degree}
                  onChange={(e) => handleInputChange('matter_degree', e.target.value)}
                  disabled={mode === 'view'}
                >
                  <option value="">اختر درجة القضية</option>
                  {Object.entries(options.degree).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Dates Section */}
            <Col md={12} className="mb-4 mt-4">
              <h5 className="border-bottom pb-2 mb-3">
                <Calendar className="me-2" size={18} />
                التواريخ
              </h5>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>تاريخ بداية القضية</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.matter_start_date}
                  onChange={(e) => handleInputChange('matter_start_date', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>تاريخ انتهاء القضية</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.matter_end_date}
                  onChange={(e) => handleInputChange('matter_end_date', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            {/* Court Information */}
            <Col md={12} className="mb-4 mt-4">
              <h5 className="border-bottom pb-2 mb-3">
                <Building className="me-2" size={18} />
                معلومات المحكمة
              </h5>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>اسم المحكمة</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="أدخل اسم المحكمة"
                  value={formData.matter_court}
                  onChange={(e) => handleInputChange('matter_court', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>رقم الدائرة</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="أدخل رقم الدائرة"
                  value={formData.matter_circuit}
                  onChange={(e) => handleInputChange('matter_circuit', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>طابق المحكمة</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="أدخل طابق المحكمة"
                  value={formData.court_floor}
                  onChange={(e) => handleInputChange('court_floor', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>رقم القاعة</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="أدخل رقم القاعة"
                  value={formData.court_hall}
                  onChange={(e) => handleInputChange('court_hall', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            {/* Financial Information */}
            <Col md={12} className="mb-4 mt-4">
              <h5 className="border-bottom pb-2 mb-3">
                <DollarSign className="me-2" size={18} />
                المعلومات المالية
              </h5>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>المبلغ المطلوب</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.matter_asked_amount}
                  onChange={(e) => handleInputChange('matter_asked_amount', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>المبلغ المحكوم به</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.matter_judged_amount}
                  onChange={(e) => handleInputChange('matter_judged_amount', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            {/* Parties Information */}
            <Col md={12} className="mb-4 mt-4">
              <h5 className="border-bottom pb-2 mb-3">
                <Users className="me-2" size={18} />
                الأطراف
              </h5>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>صفة الموكل</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="أدخل صفة الموكل"
                  value={formData.client_capacity}
                  onChange={(e) => handleInputChange('client_capacity', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>صفة المخصم</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="أدخل صفة المخصم"
                  value={formData.opponent_capacity}
                  onChange={(e) => handleInputChange('opponent_capacity', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            {/* Notes */}
            <Col md={12} className="mb-4 mt-4">
              <h5 className="border-bottom pb-2 mb-3">الملاحظات</h5>
            </Col>

            <Col md={12} className="mb-3">
              <Form.Group>
                <Form.Label>موضوع القضية</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="أدخل تفاصيل موضوع القضية"
                  value={formData.matter_subject}
                  onChange={(e) => handleInputChange('matter_subject', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>ملاحظات إضافية 1</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="ملاحظات إضافية..."
                  value={formData.matter_notes1}
                  onChange={(e) => handleInputChange('matter_notes1', e.target.value)}
                  disabled={mode === 'view'}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>ملاحظات إضافية 2</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="ملاحظات إضافية..."
                  value={formData.matter_notes2}
                  onChange={(e) => handleInputChange('matter_notes2', e.target.value)}
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

export default CaseModal;