import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, Eye, Edit, Trash, Users, Building, User } from 'lucide-react';
import { apiService as api } from '../services/api';

interface Client {
  id: number;
  client_name_ar: string;
  client_name_en: string;
  client_type: string;
  cash_pro_bono: string;
  status: string;
  contact_lawyer: string;
  client_start_date: string;
  cases_count: number;
  last_case_date: string;
  created_at: string;
}

interface ClientFilters {
  status: string;
  type: string;
  cash_pro_bono: string;
  search: string;
}

interface ClientOptions {
  status: Record<string, string>;
  type: Record<string, string>;
  cash_pro_bono: Record<string, string>;
}

const ClientsPage: React.FC = () => {
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClientFilters>({
    status: '',
    type: '',
    cash_pro_bono: '',
    search: ''
  });
  const [options, setOptions] = useState<ClientOptions>({
    status: {},
    type: {},
    cash_pro_bono: {}
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
    loadClients();
    loadOptions();
  }, [filters, pagination.current_page]);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        limit: pagination.per_page.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value))
      });

      const response = await api.get(`/clients?${params}`);
      
      if (response.success) {
        setClients(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to load clients');
      }
    } catch (err) {
      setError('Error loading clients');
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const response = await api.get('/clients/options');
      if (response.success) {
        setOptions(response.data);
      }
    } catch (err) {
      console.error('Error loading options:', err);
    }
  };

  const handleFilterChange = (key: keyof ClientFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: 'success',
      disabled: 'danger',
      inactive: 'secondary'
    };
    
    return (
      <Badge bg={statusColors[status] || 'secondary'}>
        {options.status[status] || status}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    return type === 'company' ? <Building size={16} /> : <User size={16} />;
  };

  const getCashProBonoBadge = (cashProBono: string) => {
    const colors: Record<string, string> = {
      cash: 'success',
      probono: 'info'
    };
    
    return (
      <Badge bg={colors[cashProBono] || 'secondary'}>
        {options.cash_pro_bono[cashProBono] || cashProBono}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  if (loading && clients.length === 0) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-2">Loading clients...</p>
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
                إدارة العملاء
              </h2>
              <p className="text-muted mb-0">إدارة وتتبع جميع العملاء والشركات</p>
            </div>
            <Button variant="primary" size="lg">
              <Plus className="me-2" />
              إضافة عميل جديد
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
                    placeholder="البحث في العملاء..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>الحالة</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">جميع الحالات</option>
                  {Object.entries(options.status).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>النوع</Form.Label>
                <Form.Select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
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
                <Form.Label>نوع الدفع</Form.Label>
                <Form.Select
                  value={filters.cash_pro_bono}
                  onChange={(e) => handleFilterChange('cash_pro_bono', e.target.value)}
                >
                  <option value="">جميع الأنواع</option>
                  {Object.entries(options.cash_pro_bono).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={loadClients}>
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

      {/* Clients Table */}
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">قائمة العملاء</h5>
            <div className="text-muted">
              إجمالي: {pagination.total} عميل
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">جاري التحميل...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-5">
              <Users size={48} className="text-muted mb-3" />
              <h5>لا يوجد عملاء</h5>
              <p className="text-muted">لم يتم العثور على عملاء يطابقون المعايير المحددة</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>الاسم</th>
                    <th>النوع</th>
                    <th>الحالة</th>
                    <th>نوع الدفع</th>
                    <th>المحامي المسؤول</th>
                    <th>عدد القضايا</th>
                    <th>تاريخ البداية</th>
                    <th>آخر قضية</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            {getTypeIcon(client.client_type)}
                          </div>
                          <div>
                            <div className="fw-bold">{client.client_name_ar}</div>
                            {client.client_name_en && (
                              <small className="text-muted">{client.client_name_en}</small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info">
                          {options.type[client.client_type] || client.client_type}
                        </Badge>
                      </td>
                      <td>{getStatusBadge(client.status)}</td>
                      <td>{getCashProBonoBadge(client.cash_pro_bono)}</td>
                      <td>{client.contact_lawyer || '-'}</td>
                      <td>
                        <Badge bg="primary">{client.cases_count}</Badge>
                      </td>
                      <td>{formatDate(client.client_start_date)}</td>
                      <td>{formatDate(client.last_case_date)}</td>
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
                {pagination.total} عميل
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

export default ClientsPage;
