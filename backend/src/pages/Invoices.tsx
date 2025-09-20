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
  FileText,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  FileX,
} from 'lucide-react';
import { apiService as api } from '../services/api';

interface Invoice {
  id: number;
  invoice_number: string;
  contract_id: string;
  invoice_date: string;
  amount: number;
  currency: string;
  usd_amount?: number;
  invoice_details: string;
  invoice_status: string;
  invoice_type: string;
  has_vat: boolean;
  payment_date?: string;
  report_generated: boolean;
  created_at: string;
  updated_at: string;
}

interface InvoiceFilters {
  search: string;
  invoice_status: string;
  invoice_type: string;
  currency: string;
  date_from: string;
  date_to: string;
}

interface InvoiceOptions {
  status: Record<string, string>;
  type: Record<string, string>;
  currency: Record<string, string>;
}

export function Invoices() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [filters, setFilters] = useState<InvoiceFilters>({
    search: '',
    invoice_status: '',
    invoice_type: '',
    currency: '',
    date_from: '',
    date_to: '',
  });
  const [options, setOptions] = useState<InvoiceOptions>({
    status: {},
    type: {},
    currency: {},
  });
  const [formData, setFormData] = useState({
    invoice_number: '',
    contract_id: '',
    invoice_date: '',
    amount: '',
    currency: 'EGP',
    usd_amount: '',
    invoice_details: '',
    invoice_status: 'draft',
    invoice_type: 'service',
    has_vat: false,
    payment_date: '',
    report_generated: false,
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
    loadInvoices();
    loadOptions();
  }, [filters, pagination.current_page]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        limit: pagination.per_page.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value)),
      });

      const response = await api.get(`/invoices?${params}`);

      if (response.success) {
        setInvoices(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to load invoices');
      }
    } catch (err) {
      setError('Error loading invoices');
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const response = await api.get('/invoices/options');
      if (response.success) {
        setOptions(response.data);
      }
    } catch (err) {
      console.error('Error loading options:', err);
    }
  };

  const handleFilterChange = (key: keyof InvoiceFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setFormData({
      invoice_number: '',
      contract_id: '',
      invoice_date: '',
      amount: '',
      currency: 'EGP',
      usd_amount: '',
      invoice_details: '',
      invoice_status: 'draft',
      invoice_type: 'service',
      has_vat: false,
      payment_date: '',
      report_generated: false,
    });
    setFormErrors([]);
    setShowModal(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      invoice_number: invoice.invoice_number || '',
      contract_id: invoice.contract_id || '',
      invoice_date: invoice.invoice_date || '',
      amount: invoice.amount?.toString() || '',
      currency: invoice.currency || 'EGP',
      usd_amount: invoice.usd_amount?.toString() || '',
      invoice_details: invoice.invoice_details || '',
      invoice_status: invoice.invoice_status || 'draft',
      invoice_type: invoice.invoice_type || 'service',
      has_vat: invoice.has_vat || false,
      payment_date: invoice.payment_date || '',
      report_generated: invoice.report_generated || false,
    });
    setFormErrors([]);
    setShowModal(true);
  };

  const handleDeleteInvoice = async (invoice: Invoice) => {
    if (!confirm(`هل أنت متأكد من حذف الفاتورة "${invoice.invoice_number}"؟`)) {
      return;
    }

    try {
      const response = await api.delete(`/invoices/${invoice.id}`);
      if (response.success) {
        loadInvoices();
      } else {
        setError('Failed to delete invoice');
      }
    } catch (err) {
      setError('Error deleting invoice');
      console.error('Error deleting invoice:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        usd_amount: formData.usd_amount ? parseFloat(formData.usd_amount) : null,
        has_vat: formData.has_vat,
        report_generated: formData.report_generated,
      };

      let response;
      if (editingInvoice) {
        response = await api.put(`/invoices/${editingInvoice.id}`, submitData);
      } else {
        response = await api.post('/invoices', submitData);
      }

      if (response.success) {
        setShowModal(false);
        loadInvoices();
      } else {
        if (response.errors) {
          setFormErrors(Object.values(response.errors).flat());
        } else {
          setFormErrors([response.message || 'Failed to save invoice']);
        }
      }
    } catch (err) {
      setFormErrors(['Error saving invoice']);
      console.error('Error saving invoice:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: string; icon: React.ReactNode }> = {
      draft: { variant: 'secondary', icon: <FileText size={12} /> },
      sent: { variant: 'info', icon: <Clock size={12} /> },
      paid: { variant: 'success', icon: <CheckCircle size={12} /> },
      overdue: { variant: 'danger', icon: <AlertTriangle size={12} /> },
      cancelled: { variant: 'dark', icon: <XCircle size={12} /> },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <Badge bg={config.variant}>
        {config.icon}
        <span className="ms-1">{options.status[status] || status}</span>
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      service: 'primary',
      expenses: 'warning',
      advance: 'info',
    };

    return (
      <Badge bg={typeColors[type] || 'secondary'}>
        {options.type[type] || type}
      </Badge>
    );
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  if (loading && invoices.length === 0) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-2">Loading invoices...</p>
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
                <FileText className="me-2" />
                إدارة الفواتير
              </h2>
              <p className="text-muted mb-0">إدارة وتتبع جميع الفواتير والمدفوعات</p>
            </div>
            <Button variant="primary" size="lg" onClick={handleCreateInvoice}>
              <Plus className="me-2" />
              إضافة فاتورة جديدة
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
                    placeholder="البحث في الفواتير..."
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
                  value={filters.invoice_status}
                  onChange={(e) => handleFilterChange('invoice_status', e.target.value)}
                >
                  <option value="">جميع الحالات</option>
                  {Object.entries(options.status).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>النوع</Form.Label>
                <Form.Select
                  value={filters.invoice_type}
                  onChange={(e) => handleFilterChange('invoice_type', e.target.value)}
                >
                  <option value="">جميع الأنواع</option>
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
                <Form.Label>العملة</Form.Label>
                <Form.Select
                  value={filters.currency}
                  onChange={(e) => handleFilterChange('currency', e.target.value)}
                >
                  <option value="">جميع العملات</option>
                  {Object.entries(options.currency).map(([key, value]) => (
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
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={1} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={loadInvoices}>
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

      {/* Invoices Table */}
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">قائمة الفواتير</h5>
            <div className="text-muted">إجمالي: {pagination.total} فاتورة</div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">جاري التحميل...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-5">
              <FileText size={48} className="text-muted mb-3" />
              <h5>لا توجد فواتير</h5>
              <p className="text-muted">لم يتم العثور على فواتير تطابق المعايير المحددة</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>رقم الفاتورة</th>
                    <th>تاريخ الفاتورة</th>
                    <th>المبلغ</th>
                    <th>النوع</th>
                    <th>الحالة</th>
                    <th>العقد</th>
                    <th>تاريخ الدفع</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FileText className="me-2" size={16} />
                          {invoice.invoice_number || '-'}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar className="me-1" size={14} />
                          {formatDate(invoice.invoice_date)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <DollarSign className="me-1" size={14} />
                          {formatAmount(invoice.amount, invoice.currency)}
                          {invoice.has_vat && (
                            <Badge bg="secondary" className="ms-1" size="sm">
                              ضريبة
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td>{getTypeBadge(invoice.invoice_type)}</td>
                      <td>{getStatusBadge(invoice.invoice_status)}</td>
                      <td>{invoice.contract_id || '-'}</td>
                      <td>
                        {invoice.payment_date ? (
                          <div className="d-flex align-items-center">
                            <Calendar className="me-1" size={14} />
                            {formatDate(invoice.payment_date)}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Button variant="outline-primary" size="sm" title="View">
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleEditInvoice(invoice)}
                            title="Edit"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteInvoice(invoice)}
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
                {pagination.total} فاتورة
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

      {/* Invoice Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{editingInvoice ? 'تعديل الفاتورة' : 'إضافة فاتورة جديدة'}</Modal.Title>
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
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>رقم الفاتورة</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.invoice_number}
                    onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                    placeholder="سيتم توليده تلقائياً إذا ترك فارغ"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>رقم العقد</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.contract_id}
                    onChange={(e) => setFormData({ ...formData, contract_id: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>تاريخ الفاتورة *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.invoice_date}
                    onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>المبلغ *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>العملة</Form.Label>
                  <Form.Select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    {Object.entries(options.currency).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>المبلغ بالدولار</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.usd_amount}
                    onChange={(e) => setFormData({ ...formData, usd_amount: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>نوع الفاتورة</Form.Label>
                  <Form.Select
                    value={formData.invoice_type}
                    onChange={(e) => setFormData({ ...formData, invoice_type: e.target.value })}
                  >
                    {Object.entries(options.type).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>حالة الفاتورة</Form.Label>
                  <Form.Select
                    value={formData.invoice_status}
                    onChange={(e) => setFormData({ ...formData, invoice_status: e.target.value })}
                  >
                    {Object.entries(options.status).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>تاريخ الدفع</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>تفاصيل الفاتورة</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.invoice_details}
                    onChange={(e) => setFormData({ ...formData, invoice_details: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="تشمل ضريبة القيمة المضافة"
                  checked={formData.has_vat}
                  onChange={(e) => setFormData({ ...formData, has_vat: e.target.checked })}
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="تم إنشاء التقرير"
                  checked={formData.report_generated}
                  onChange={(e) => setFormData({ ...formData, report_generated: e.target.checked })}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingInvoice ? 'حفظ التغييرات' : 'إضافة الفاتورة'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}