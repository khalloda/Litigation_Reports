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
  Dropdown,
} from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, Eye, Edit, Trash, Calendar, User, Gavel, Download } from 'lucide-react';
import { apiService as api } from '../services/api';
import CaseModal from '../components/modals/CaseModal';
import { exportToCSV, exportToExcel, exportToPDF, EXPORT_COLUMNS } from '../utils/exportUtils';

interface Case {
  id: number;
  matter_id: string;
  matter_ar: string;
  matter_en: string;
  matter_status: string;
  matter_category: string;
  matter_importance: string;
  matter_start_date: string;
  matter_court: string;
  client_name_ar: string;
  client_name_en: string;
  created_at: string;
}

interface CaseFilters {
  status: string;
  category: string;
  search: string;
}

interface CaseOptions {
  status: Record<string, string>;
  category: Record<string, string>;
  importance: Record<string, string>;
}

const CasesPage: React.FC = () => {
  const { t } = useTranslation();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CaseFilters>({
    status: '',
    category: '',
    search: '',
  });
  const [options, setOptions] = useState<CaseOptions>({
    status: {},
    category: {},
    importance: {},
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  useEffect(() => {
    loadCases();
    loadOptions();
  }, [filters, pagination.current_page]);

  const loadCases = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        limit: pagination.per_page.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value)),
      });

      const response = await api.get(`/cases?${params}`);

      if (response.success) {
        setCases(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to load cases');
      }
    } catch (err) {
      setError('Error loading cases');
      console.error('Error loading cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const response = await api.get('/cases/options');
      if (response.success) {
        setOptions(response.data);
      }
    } catch (err) {
      console.error('Error loading options:', err);
    }
  };

  const handleFilterChange = (key: keyof CaseFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  const handleViewCase = (caseItem: Case) => {
    // For now, just show an alert with case details
    // In the future, this could open a view modal
    const details = `
      رقم القضية: ${caseItem.matter_id || '-'}
      الموضوع: ${caseItem.matter_ar}
      العميل: ${caseItem.client_name_ar}
      الحالة: ${options.status[caseItem.matter_status] || caseItem.matter_status}
      الأهمية: ${options.importance[caseItem.matter_importance] || caseItem.matter_importance}
      المحكمة: ${caseItem.matter_court || '-'}
    `;
    alert(details);
  };

  const handleEditCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setModalMode('edit');
    setShowCaseModal(true);
  };

  const handleAddCase = () => {
    setSelectedCase(null);
    setModalMode('create');
    setShowCaseModal(true);
  };

  const handleCaseModalSave = () => {
    loadCases(); // Refresh the cases list after save
  };

  const handleCaseModalHide = () => {
    setShowCaseModal(false);
    setSelectedCase(null);
  };

  const handleDeleteCase = async (caseItem: Case) => {
    if (confirm(`هل أنت متأكد من حذف القضية ${caseItem.matter_id || caseItem.matter_ar}؟`)) {
      try {
        const response = await api.delete(`/cases/${caseItem.id}`);
        if (response.success) {
          toast.success('تم حذف القضية بنجاح');
          loadCases(); // Refresh the list
        } else {
          toast.error(response.error || 'حدث خطأ أثناء حذف القضية');
        }
      } catch (err) {
        console.error('Error deleting case:', err);
        toast.error('حدث خطأ أثناء حذف القضية');
      }
    }
  };

  // Export functionality
  const handleExportCSV = () => {
    if (!cases || cases.length === 0) {
      toast.error('لا توجد بيانات للتصدير');
      return;
    }

    exportToCSV(cases, {
      filename: `cases_export_${new Date().toISOString().split('T')[0]}`,
      columns: EXPORT_COLUMNS.cases,
      title: 'تقرير القضايا',
    });

    toast.success('تم تصدير ملف CSV بنجاح');
  };

  const handleExportExcel = () => {
    if (!cases || cases.length === 0) {
      toast.error('لا توجد بيانات للتصدير');
      return;
    }

    exportToExcel(cases, {
      filename: `cases_export_${new Date().toISOString().split('T')[0]}`,
      columns: EXPORT_COLUMNS.cases,
      title: 'تقرير القضايا',
    });

    toast.success('تم تصدير ملف Excel بنجاح');
  };

  const handleExportPDF = () => {
    if (!cases || cases.length === 0) {
      toast.error('لا توجد بيانات للتصدير');
      return;
    }

    exportToPDF(cases, {
      filename: `cases_export_${new Date().toISOString().split('T')[0]}`,
      columns: EXPORT_COLUMNS.cases,
      title: 'تقرير القضايا',
    });

    toast.success('تم تصدير ملف PDF بنجاح');
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: 'success',
      pending: 'warning',
      completed: 'primary',
      cancelled: 'danger',
      on_hold: 'secondary',
      appealed: 'info',
    };

    return (
      <Badge bg={statusColors[status] || 'secondary'}>{options.status[status] || status}</Badge>
    );
  };

  const getImportanceBadge = (importance: string) => {
    const importanceColors: Record<string, string> = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
      critical: 'dark',
    };

    return (
      <Badge bg={importanceColors[importance] || 'secondary'}>
        {options.importance[importance] || importance}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading && cases.length === 0) {
    return (
      <Container className='py-4'>
        <div className='text-center'>
          <Spinner animation='border' />
          <p className='mt-2'>Loading cases...</p>
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
                إدارة القضايا
              </h2>
              <p className='text-muted mb-0'>إدارة وتتبع جميع القضايا القانونية</p>
            </div>
            <div className='d-flex gap-2'>
              <Button variant='primary' size='lg' onClick={handleAddCase}>
                <Plus className='me-2' />
                إضافة قضية جديدة
              </Button>
              <Dropdown>
                <Dropdown.Toggle
                  variant='success'
                  size='lg'
                  disabled={!cases || cases.length === 0}
                >
                  <Download className='me-2' size={18} />
                  تصدير
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleExportCSV}>
                    <Download className='me-2' size={14} />
                    تصدير CSV
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleExportExcel}>
                    <Download className='me-2' size={14} />
                    تصدير Excel
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleExportPDF}>
                    <Download className='me-2' size={14} />
                    تصدير PDF
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Card className='mb-4'>
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
                    type='text'
                    placeholder='البحث في القضايا...'
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
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value=''>جميع الحالات</option>
                  {Object.entries(options.status).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>التصنيف</Form.Label>
                <Form.Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value=''>جميع التصنيفات</option>
                  {Object.entries(options.category).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className='d-flex align-items-end'>
              <Button variant='outline-secondary' onClick={loadCases}>
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

      {/* Cases Table */}
      <Card>
        <Card.Header>
          <div className='d-flex justify-content-between align-items-center'>
            <h5 className='mb-0'>قائمة القضايا</h5>
            <div className='text-muted'>إجمالي: {pagination.total} قضية</div>
          </div>
        </Card.Header>
        <Card.Body className='p-0'>
          {loading ? (
            <div className='text-center py-4'>
              <Spinner animation='border' />
              <p className='mt-2'>جاري التحميل...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className='text-center py-5'>
              <Gavel size={48} className='text-muted mb-3' />
              <h5>لا توجد قضايا</h5>
              <p className='text-muted'>لم يتم العثور على قضايا تطابق المعايير المحددة</p>
            </div>
          ) : (
            <div className='table-responsive'>
              <table className='table table-hover mb-0'>
                <thead className='table-light'>
                  <tr>
                    <th>رقم القضية</th>
                    <th>الموضوع</th>
                    <th>العميل</th>
                    <th>الحالة</th>
                    <th>الأهمية</th>
                    <th>المحكمة</th>
                    <th>تاريخ البداية</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((caseItem) => (
                    <tr key={caseItem.id}>
                      <td>
                        <strong>{caseItem.matter_id}</strong>
                      </td>
                      <td>
                        <div>
                          <div className='fw-bold'>{caseItem.matter_ar}</div>
                          {caseItem.matter_en && (
                            <small className='text-muted'>{caseItem.matter_en}</small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{caseItem.client_name_ar}</div>
                          {caseItem.client_name_en && (
                            <small className='text-muted'>{caseItem.client_name_en}</small>
                          )}
                        </div>
                      </td>
                      <td>{getStatusBadge(caseItem.matter_status)}</td>
                      <td>{getImportanceBadge(caseItem.matter_importance)}</td>
                      <td>{caseItem.matter_court || '-'}</td>
                      <td>{formatDate(caseItem.matter_start_date)}</td>
                      <td>
                        <div className='btn-group btn-group-sm'>
                          <Button
                            variant='outline-primary'
                            size='sm'
                            onClick={() => handleViewCase(caseItem)}
                            title='عرض تفاصيل القضية'
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant='outline-secondary'
                            size='sm'
                            onClick={() => handleEditCase(caseItem)}
                            title='تعديل القضية'
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant='outline-danger'
                            size='sm'
                            onClick={() => handleDeleteCase(caseItem)}
                            title='حذف القضية'
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
            <div className='d-flex justify-content-between align-items-center'>
              <div className='text-muted'>
                عرض {(pagination.current_page - 1) * pagination.per_page + 1} إلى{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} من{' '}
                {pagination.total} قضية
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

      {/* Case Modal */}
      <CaseModal
        show={showCaseModal}
        onHide={handleCaseModalHide}
        onSave={handleCaseModalSave}
        caseData={selectedCase}
        mode={modalMode}
      />
    </Container>
  );
};

export default CasesPage;
