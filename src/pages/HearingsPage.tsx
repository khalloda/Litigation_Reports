import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, Eye, Edit, Trash, Calendar, Clock, Gavel, Users } from 'lucide-react';
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
    search: ''
  });
  const [options, setOptions] = useState<HearingOptions>({
    result: {},
    type: {},
    duration: {}
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false
  });

  useEffect(() => {
    loadHearings();
    loadOptions();
  }, [filters, pagination.current_page]);

  const loadHearings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        limit: pagination.per_page.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value))
      });

      const response = await api.get(`/hearings?${params}`);
      
      if (response.data.success) {
        setHearings(response.data.data.data);
        setPagination(response.data.data.pagination);
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
      if (response.data.success) {
        setOptions(response.data.data);
      }
    } catch (err) {
      console.error('Error loading options:', err);
    }
  };

  const handleFilterChange = (key: keyof HearingFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  const getResultBadge = (result: string) => {
    const resultColors: Record<string, string> = {
      won: 'success',
      lost: 'danger',
      postponed: 'warning',
      pending: 'info'
    };
    
    return (
      <Badge bg={resultColors[result] || 'secondary'}>
        {options.result[result] || result}
      </Badge>
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
      execution: 'light'
    };
    
    return (
      <Badge bg={typeColors[type] || 'secondary'}>
        {options.type[type] || type}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatDuration = (duration: string) => {
    return options.duration[duration] || duration;
  };

  if (loading && hearings.length === 0) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-2">Loading hearings...</p>
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
                <Gavel className="me-2" />
                إدارة الجلسات
              </h2>
              <p className="text-muted mb-0">إدارة وتتبع جميع جلسات المحكمة</p>
            </div>
            <Button variant="primary" size="lg">
              <Plus className="me-2" />
              إضافة جلسة جديدة
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
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
                    type="text"
                    placeholder="البحث في الجلسات..."
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
                  <option value="">جميع النتائج</option>
                  {Object.entries(options.result).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
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
                  <option value="">جميع الأنواع</option>
                  {Object.entries(options.type).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>من تاريخ</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>إلى تاريخ</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={1} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={loadHearings}>
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

      {/* Hearings Table */}
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">قائمة الجلسات</h5>
            <div className="text-muted">
              إجمالي: {pagination.total} جلسة
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">جاري التحميل...</p>
            </div>
          ) : hearings.length === 0 ? (
            <div className="text-center py-5">
              <Gavel size={48} className="text-muted mb-3" />
              <h5>لا توجد جلسات</h5>
              <p className="text-muted">لم يتم العثور على جلسات تطابق المعايير المحددة</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
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
                        <div className="d-flex align-items-center">
                          <Calendar className="me-2" size={16} />
                          {formatDate(hearing.hearing_date)}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{hearing.matter_id}</div>
                          <div className="text-muted small">{hearing.matter_ar}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{hearing.client_name_ar}</div>
                          {hearing.client_name_en && (
                            <small className="text-muted">{hearing.client_name_en}</small>
                          )}
                        </div>
                      </td>
                      <td>{getTypeBadge(hearing.hearing_type)}</td>
                      <td>{getResultBadge(hearing.hearing_result)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Clock className="me-1" size={14} />
                          {formatDuration(hearing.hearing_duration)}
                        </div>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '200px' }}>
                          {hearing.hearing_decision || hearing.short_decision || '-'}
                        </div>
                      </td>
                      <td>
                        {hearing.next_hearing ? (
                          <div className="d-flex align-items-center">
                            <Calendar className="me-1" size={14} />
                            {formatDate(hearing.next_hearing)}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Button variant="outline-primary" size="sm">
                            <Eye size={14} />
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            <Edit size={14} />
                          </Button>
                          <Button variant="outline-danger" size="sm">
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
                عرض {((pagination.current_page - 1) * pagination.per_page) + 1} إلى{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} من{' '}
                {pagination.total} جلسة
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
    </Container>
  );
};

export default HearingsPage;
