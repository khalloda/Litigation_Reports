import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Badge,
  Spinner,
  Alert,
  Modal,
} from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash,
  Calendar,
  Clock,
  Gavel,
  Users,
} from 'lucide-react';
import { apiService as api } from '../services/api';

interface Hearing {
  id: number;
  case_id: number;
  hearing_date: string;
  hearing_decision: string;
  hearing_result: string;
  hearing_type: string;
  hearing_duration: string;
  court_notes: string;
  lawyer_notes: string;
  expert_notes: string;
  next_hearing: string;
  short_decision: string;
  matter_ar: string;
  matter_en: string;
  matter_id: string;
  client_name_ar: string;
  client_name_en: string;
  created_at: string;
}

interface HearingFilters {
  case_id: string;
  hearing_result: string;
  hearing_type: string;
  date_from: string;
  date_to: string;
  search: string;
}

interface HearingOptions {
  result: Record<string, string>;
  type: Record<string, string>;
  duration: Record<string, string>;
}

interface Case {
  id: number;
  matter_id: string;
  matter_ar: string;
  matter_en: string;
  client_name_ar: string;
  client_name_en: string;
}

interface HearingFormData {
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
}

const HearingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HearingFilters>({
    case_id: '',
    hearing_result: '',
    hearing_type: '',
    date_from: '',
    date_to: '',
    search: '',
  });
  const [options, setOptions] = useState<HearingOptions>({
    result: {},
    type: {},
    duration: {},
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);
  const [formData, setFormData] = useState<HearingFormData>({
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
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadHearings();
    loadOptions();
  }, [filters, pagination.current_page]);

  useEffect(() => {
    if (showModal) {
      loadCases();
    }
  }, [showModal]);

  const loadHearings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        limit: pagination.per_page.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value)),
      });

      const response = await api.get(`/hearings?${params}`);

      if (response.success) {
        setHearings(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to load hearings');
      }
    } catch (err) {
      setError('Error loading hearings');
      console.error('Error loading hearings:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const response = await api.get('/hearings/options');
      if (response.success) {
        setOptions(response.data);
      }
    } catch (err) {
      console.error('Error loading options:', err);
    }
  };

  const loadCases = async () => {
    try {
      const response = await api.get('/cases?limit=100');
      if (response.success && response.data?.data) {
        setCases(response.data.data);
      }
    } catch (err) {
      console.error('Error loading cases:', err);
      toast.error('خطأ في تحميل القضايا');
    }
  };

  const handleModalOpen = () => {
    setShowModal(true);
    setFormData({
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
    });
    setFormErrors({});
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData({
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
    });
    setFormErrors({});
  };

  const handleFormChange = (key: keyof HearingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (formErrors[key]) {
      setFormErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.case_id) {
      errors.case_id = 'القضية مطلوبة';
    }
    if (!formData.hearing_date) {
      errors.hearing_date = 'تاريخ الجلسة مطلوب';
    }
    if (!formData.hearing_type) {
      errors.hearing_type = 'نوع الجلسة مطلوب';
    }
    if (!formData.hearing_result) {
      errors.hearing_result = 'نتيجة الجلسة مطلوبة';
    }
    if (!formData.hearing_duration) {
      errors.hearing_duration = 'مدة الجلسة مطلوبة';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setModalLoading(true);
      const response = await api.post('/hearings', formData);

      if (response.success) {
        toast.success('تم إضافة الجلسة بنجاح');
        handleModalClose();
        loadHearings(); // Refresh the list
      } else {
        if (response.errors) {
          setFormErrors(response.errors);
        } else {
          toast.error(response.error || 'حدث خطأ أثناء إضافة الجلسة');
        }
      }
    } catch (err) {
      console.error('Error creating hearing:', err);
      toast.error('حدث خطأ أثناء إضافة الجلسة');
    } finally {
      setModalLoading(false);
    }
  };

  const handleFilterChange = (key: keyof HearingFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  const getResultBadge = (result: string) => {
    const resultColors: Record<string, string> = {
      won: 'success',
      lost: 'danger',
      postponed: 'warning',
      pending: 'info',
    };

    return (
      <Badge bg={resultColors[result] || 'secondary'}>{options.result[result] || result}</Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      initial: 'primary',
      procedural: 'info',
      evidence: 'warning',
      witness: 'success',
      expert: 'secondary',
      final: 'dark',
      appeal: 'danger',
      execution: 'light',
    };

    return <Badge bg={typeColors[type] || 'secondary'}>{options.type[type] || type}</Badge>;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatDuration = (duration: string) => {
    return options.duration[duration] || duration;
  };

  if (loading && hearings.length === 0) {
    return (
      <Container className='py-4'>
        <div className='text-center'>
          <Spinner animation='border' />
          <p className='mt-2'>Loading hearings...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className='py-4'>
      {/* Header */}
      <Row className='mb-4'>
        <Col>
          <div className='d-flex justify-content-between align-items-center'>
            <div>
              <h2 className='mb-1'>
                <Gavel className='me-2' />
                إدارة الجلسات
              </h2>
              <p className='text-muted mb-0'>إدارة وتتبع جميع جلسات المحكمة</p>
            </div>
            <Button
              variant='primary'
              size='lg'
              onClick={handleModalOpen}
              data-testid='add-hearing-button'
            >
              <Plus className='me-2' />
              إضافة جلسة جديدة
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Card className='mb-4'>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>البحث</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <Search size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    type='text'
                    placeholder='البحث في الجلسات...'
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>النتيجة</Form.Label>
                <Form.Select
                  value={filters.hearing_result}
                  onChange={(e) => handleFilterChange('hearing_result', e.target.value)}
                >
                  <option value=''>جميع النتائج</option>
                  {Object.entries(options.result).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>نوع الجلسة</Form.Label>
                <Form.Select
                  value={filters.hearing_type}
                  onChange={(e) => handleFilterChange('hearing_type', e.target.value)}
                >
                  <option value=''>جميع الأنواع</option>
                  {Object.entries(options.type).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>من تاريخ</Form.Label>
                <Form.Control
                  type='date'
                  value={filters.date_from}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>إلى تاريخ</Form.Label>
                <Form.Control
                  type='date'
                  value={filters.date_to}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={1} className='d-flex align-items-end'>
              <Button variant='outline-secondary' onClick={loadHearings}>
                <Filter className='me-1' />
                تطبيق
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant='danger' className='mb-4'>
          {error}
        </Alert>
      )}

      {/* Hearings Table */}
      <Card>
        <Card.Header>
          <div className='d-flex justify-content-between align-items-center'>
            <h5 className='mb-0'>قائمة الجلسات</h5>
            <div className='text-muted'>إجمالي: {pagination.total} جلسة</div>
          </div>
        </Card.Header>
        <Card.Body className='p-0'>
          {loading ? (
            <div className='text-center py-4'>
              <Spinner animation='border' />
              <p className='mt-2'>جاري التحميل...</p>
            </div>
          ) : hearings.length === 0 ? (
            <div className='text-center py-5'>
              <Gavel size={48} className='text-muted mb-3' />
              <h5>لا توجد جلسات</h5>
              <p className='text-muted'>لم يتم العثور على جلسات تطابق المعايير المحددة</p>
            </div>
          ) : (
            <div className='table-responsive'>
              <table className='table table-hover mb-0'>
                <thead className='table-light'>
                  <tr>
                    <th>تاريخ الجلسة</th>
                    <th>القضية</th>
                    <th>العميل</th>
                    <th>نوع الجلسة</th>
                    <th>النتيجة</th>
                    <th>المدة</th>
                    <th>القرار</th>
                    <th>الجلسة التالية</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {hearings.map((hearing) => (
                    <tr key={hearing.id}>
                      <td>
                        <div className='d-flex align-items-center'>
                          <Calendar className='me-2' size={16} />
                          {formatDate(hearing.hearing_date)}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className='fw-bold'>{hearing.matter_id || '-'}</div>
                          <div className='text-muted small'>{hearing.matter_ar || '-'}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{hearing.client_name_ar || '-'}</div>
                          {hearing.client_name_en && (
                            <small className='text-muted'>{hearing.client_name_en}</small>
                          )}
                        </div>
                      </td>
                      <td>{getTypeBadge(hearing.hearing_type)}</td>
                      <td>{getResultBadge(hearing.hearing_result)}</td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <Clock className='me-1' size={14} />
                          {formatDuration(hearing.hearing_duration)}
                        </div>
                      </td>
                      <td>
                        <div className='text-truncate' style={{ maxWidth: '200px' }}>
                          {hearing.hearing_decision || hearing.short_decision || '-'}
                        </div>
                      </td>
                      <td>
                        {hearing.next_hearing ? (
                          <div className='d-flex align-items-center'>
                            <Calendar className='me-1' size={14} />
                            {formatDate(hearing.next_hearing)}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <div className='btn-group btn-group-sm'>
                          <Button variant='outline-primary' size='sm'>
                            <Eye size={14} />
                          </Button>
                          <Button variant='outline-secondary' size='sm'>
                            <Edit size={14} />
                          </Button>
                          <Button variant='outline-danger' size='sm'>
                            <Trash size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <Card.Footer>
            <div className='d-flex justify-content-between align-items-center'>
              <div className='text-muted'>
                عرض {(pagination.current_page - 1) * pagination.per_page + 1} إلى{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} من{' '}
                {pagination.total} جلسة
              </div>
              <div className='btn-group'>
                <Button
                  variant='outline-secondary'
                  size='sm'
                  disabled={!pagination.has_prev}
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                >
                  السابق
                </Button>
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.current_page ? 'primary' : 'outline-secondary'}
                    size='sm'
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant='outline-secondary'
                  size='sm'
                  disabled={!pagination.has_next}
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                >
                  التالي
                </Button>
              </div>
            </div>
          </Card.Footer>
        )}
      </Card>

      {/* Add Hearing Modal */}
      <Modal show={showModal} onHide={handleModalClose} size='lg' backdrop='static'>
        <Modal.Header closeButton>
          <Modal.Title>
            <Gavel className='me-2' />
            إضافة جلسة جديدة
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>القضية *</Form.Label>
                  <Form.Select
                    value={formData.case_id}
                    onChange={(e) => handleFormChange('case_id', e.target.value)}
                    isInvalid={!!formErrors.case_id}
                    data-testid='case-select'
                  >
                    <option value=''>اختر القضية</option>
                    {cases.map((case_item) => (
                      <option key={case_item.id} value={case_item.id}>
                        {case_item.matter_id} - {case_item.matter_ar} ({case_item.client_name_ar})
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>{formErrors.case_id}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>تاريخ الجلسة *</Form.Label>
                  <Form.Control
                    type='datetime-local'
                    value={formData.hearing_date}
                    onChange={(e) => handleFormChange('hearing_date', e.target.value)}
                    isInvalid={!!formErrors.hearing_date}
                    data-testid='hearing-date-input'
                  />
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.hearing_date}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>نوع الجلسة *</Form.Label>
                  <Form.Select
                    value={formData.hearing_type}
                    onChange={(e) => handleFormChange('hearing_type', e.target.value)}
                    isInvalid={!!formErrors.hearing_type}
                    data-testid='hearing-type-select'
                  >
                    <option value=''>اختر النوع</option>
                    {Object.entries(options.type).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.hearing_type}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>نتيجة الجلسة *</Form.Label>
                  <Form.Select
                    value={formData.hearing_result}
                    onChange={(e) => handleFormChange('hearing_result', e.target.value)}
                    isInvalid={!!formErrors.hearing_result}
                    data-testid='hearing-result-select'
                  >
                    <option value=''>اختر النتيجة</option>
                    {Object.entries(options.result).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.hearing_result}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>مدة الجلسة *</Form.Label>
                  <Form.Select
                    value={formData.hearing_duration}
                    onChange={(e) => handleFormChange('hearing_duration', e.target.value)}
                    isInvalid={!!formErrors.hearing_duration}
                    data-testid='hearing-duration-select'
                  >
                    <option value=''>اختر المدة</option>
                    {Object.entries(options.duration).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.hearing_duration}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>الجلسة التالية</Form.Label>
                  <Form.Control
                    type='datetime-local'
                    value={formData.next_hearing}
                    onChange={(e) => handleFormChange('next_hearing', e.target.value)}
                    data-testid='next-hearing-input'
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>القرار المختصر</Form.Label>
                  <Form.Control
                    type='text'
                    value={formData.short_decision}
                    onChange={(e) => handleFormChange('short_decision', e.target.value)}
                    placeholder='القرار المختصر'
                    data-testid='short-decision-input'
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className='mb-3'>
              <Form.Label>قرار الجلسة</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                value={formData.hearing_decision}
                onChange={(e) => handleFormChange('hearing_decision', e.target.value)}
                placeholder='تفاصيل قرار الجلسة'
                data-testid='hearing-decision-textarea'
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>ملاحظات المحكمة</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={formData.court_notes}
                    onChange={(e) => handleFormChange('court_notes', e.target.value)}
                    placeholder='ملاحظات المحكمة'
                    data-testid='court-notes-textarea'
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>ملاحظات المحامي</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={formData.lawyer_notes}
                    onChange={(e) => handleFormChange('lawyer_notes', e.target.value)}
                    placeholder='ملاحظات المحامي'
                    data-testid='lawyer-notes-textarea'
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>ملاحظات الخبراء</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={formData.expert_notes}
                    onChange={(e) => handleFormChange('expert_notes', e.target.value)}
                    placeholder='ملاحظات الخبراء'
                    data-testid='expert-notes-textarea'
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleModalClose} disabled={modalLoading}>
            إلغاء
          </Button>
          <Button
            variant='primary'
            onClick={handleSubmit}
            disabled={modalLoading}
            data-testid='submit-hearing-button'
          >
            {modalLoading ? (
              <>
                <Spinner animation='border' size='sm' className='me-2' />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Plus className='me-2' />
                إضافة الجلسة
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HearingsPage;
