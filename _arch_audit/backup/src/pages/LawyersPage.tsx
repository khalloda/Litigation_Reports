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
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash,
  User,
  Users,
  Mail,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { apiService as api } from '../services/api';

interface Lawyer {
  id: number;
  lawyer_name_ar: string;
  lawyer_name_en: string;
  lawyer_email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface LawyerFilters {
  search: string;
  is_active: string;
}

const LawyersPage: React.FC = () => {
  const { t } = useTranslation();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLawyer, setEditingLawyer] = useState<Lawyer | null>(null);
  const [filters, setFilters] = useState<LawyerFilters>({
    search: '',
    is_active: '',
  });
  const [formData, setFormData] = useState({
    lawyer_name_ar: '',
    lawyer_name_en: '',
    lawyer_email: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });

  useEffect(() => {
    loadLawyers();
  }, [filters, pagination.current_page]);

  const loadLawyers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        limit: pagination.per_page.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value)),
      });

      const response = await api.get(`/lawyers?${params}`);

      if (response.success) {
        setLawyers(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to load lawyers');
      }
    } catch (err) {
      setError('Error loading lawyers');
      console.error('Error loading lawyers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof LawyerFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  const handleCreateLawyer = () => {
    setEditingLawyer(null);
    setFormData({
      lawyer_name_ar: '',
      lawyer_name_en: '',
      lawyer_email: '',
      is_active: true,
    });
    setFormErrors([]);
    setShowModal(true);
  };

  const handleEditLawyer = (lawyer: Lawyer) => {
    setEditingLawyer(lawyer);
    setFormData({
      lawyer_name_ar: lawyer.lawyer_name_ar || '',
      lawyer_name_en: lawyer.lawyer_name_en || '',
      lawyer_email: lawyer.lawyer_email || '',
      is_active: lawyer.is_active,
    });
    setFormErrors([]);
    setShowModal(true);
  };

  const handleDeleteLawyer = async (lawyer: Lawyer) => {
    if (!confirm(`هل أنت متأكد من حذف المحامي "${lawyer.lawyer_name_ar}"؟`)) {
      return;
    }

    try {
      const response = await api.delete(`/lawyers/${lawyer.id}`);
      if (response.success) {
        loadLawyers();
      } else {
        setError('Failed to delete lawyer');
      }
    } catch (err) {
      setError('Error deleting lawyer');
      console.error('Error deleting lawyer:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    try {
      let response;
      if (editingLawyer) {
        response = await api.put(`/lawyers/${editingLawyer.id}`, formData);
      } else {
        response = await api.post('/lawyers', formData);
      }

      if (response.success) {
        setShowModal(false);
        loadLawyers();
      } else {
        if (response.errors) {
          setFormErrors(Object.values(response.errors).flat());
        } else {
          setFormErrors([response.message || 'Failed to save lawyer']);
        }
      }
    } catch (err) {
      setFormErrors(['Error saving lawyer']);
      console.error('Error saving lawyer:', err);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading && lawyers.length === 0) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-2">Loading lawyers...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <Users className="me-2" />
                إدارة المحامين
              </h2>
              <p className="text-muted mb-0">إدارة وتتبع جميع المحامين في المكتب</p>
            </div>
            <Button variant="primary" size="lg" onClick={handleCreateLawyer}>
              <Plus className="me-2" />
              إضافة محامي جديد
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>البحث</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <Search size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="البحث في المحامين..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>الحالة</Form.Label>
                <Form.Select
                  value={filters.is_active}
                  onChange={(e) => handleFilterChange('is_active', e.target.value)}
                >
                  <option value="">جميع الحالات</option>
                  <option value="1">نشط</option>
                  <option value="0">غير نشط</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={loadLawyers}>
                <Filter className="me-1" />
                تطبيق
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Lawyers Table */}
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">قائمة المحامين</h5>
            <div className="text-muted">إجمالي: {pagination.total} محامي</div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">جاري التحميل...</p>
            </div>
          ) : lawyers.length === 0 ? (
            <div className="text-center py-5">
              <Users size={48} className="text-muted mb-3" />
              <h5>لا يوجد محامين</h5>
              <p className="text-muted">لم يتم العثور على محامين تطابق المعايير المحددة</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>الاسم العربي</th>
                    <th>الاسم الإنجليزي</th>
                    <th>البريد الإلكتروني</th>
                    <th>الحالة</th>
                    <th>تاريخ الإنشاء</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {lawyers.map((lawyer) => (
                    <tr key={lawyer.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <User className="me-2" size={16} />
                          {lawyer.lawyer_name_ar || '-'}
                        </div>
                      </td>
                      <td>{lawyer.lawyer_name_en || '-'}</td>
                      <td>
                        {lawyer.lawyer_email ? (
                          <div className="d-flex align-items-center">
                            <Mail className="me-1" size={14} />
                            {lawyer.lawyer_email}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {lawyer.is_active ? (
                          <Badge bg="success">
                            <CheckCircle className="me-1" size={12} />
                            نشط
                          </Badge>
                        ) : (
                          <Badge bg="danger">
                            <XCircle className="me-1" size={12} />
                            غير نشط
                          </Badge>
                        )}
                      </td>
                      <td>{formatDate(lawyer.created_at)}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Button variant="outline-primary" size="sm" title="View">
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleEditLawyer(lawyer)}
                            title="Edit"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteLawyer(lawyer)}
                            title="Delete"
                          >
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
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                عرض {(pagination.current_page - 1) * pagination.per_page + 1} إلى{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} من{' '}
                {pagination.total} محامي
              </div>
              <div className="btn-group">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={!pagination.has_prev}
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                >
                  السابق
                </Button>
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.current_page ? 'primary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline-secondary"
                  size="sm"
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

      {/* Lawyer Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingLawyer ? 'تعديل المحامي' : 'إضافة محامي جديد'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formErrors.length > 0 && (
            <Alert variant="danger">
              <ul className="mb-0">
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>الاسم العربي *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.lawyer_name_ar}
                    onChange={(e) => setFormData({ ...formData, lawyer_name_ar: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>الاسم الإنجليزي</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.lawyer_name_en}
                    onChange={(e) => setFormData({ ...formData, lawyer_name_en: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>البريد الإلكتروني</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.lawyer_email}
                    onChange={(e) => setFormData({ ...formData, lawyer_email: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>الحالة</Form.Label>
                  <Form.Select
                    value={formData.is_active ? '1' : '0'}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.value === '1' })
                    }
                  >
                    <option value="1">نشط</option>
                    <option value="0">غير نشط</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingLawyer ? 'حفظ التغييرات' : 'إضافة المحامي'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LawyersPage;