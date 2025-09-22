import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
  Badge,
  Table,
  Modal,
  ListGroup,
  ButtonGroup,
  Tabs,
  Tab,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  Calendar,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
  Filter,
  Settings,
  Eye,
  Save,
  Plus,
} from 'lucide-react';
import { apiService as api } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';

interface DashboardData {
  total_clients: number;
  total_cases: number;
  total_hearings: number;
  total_invoices: number;
  total_lawyers: number;
  recent_activities: Array<{
    type: string;
    name: string;
    action: string;
    created_at: string;
  }>;
  upcoming_hearings: Array<{
    id: number;
    hearing_date: string;
    hearing_type: string;
    matter_ar: string;
    client_name_ar: string;
  }>;
  financial_summary: {
    total_revenue: number;
    paid_amount: number;
    pending_amount: number;
    paid_count: number;
    pending_count: number;
    overdue_count: number;
  };
  case_statistics: Record<string, number>;
  hearing_statistics: Record<string, number>;
  revenue_trend: Array<{
    month: string;
    revenue: number;
  }>;
}

interface ReportTemplate {
  id: number;
  name: string;
  entity: string;
  description: string;
  config: any;
  created_by: string;
  created_at: string;
}

interface CustomReportConfig {
  entity: string;
  filters: Record<string, any>;
  columns: string[];
  grouping?: string;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  limit?: number;
}

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [showClientReportModal, setShowClientReportModal] = useState(false);

  // Report data states
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [customReportOptions, setCustomReportOptions] = useState<any>(null);
  const [currentReportType, setCurrentReportType] = useState<'clients' | 'cases' | 'hearings'>(
    'clients'
  );
  const [reportConfig, setReportConfig] = useState<CustomReportConfig>({
    entity: 'clients',
    filters: {},
    columns: [],
  });
  const [reportData, setReportData] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Client report states
  const [clientReportLoading, setClientReportLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [reportFormat, setReportFormat] = useState<'pdf' | 'jpg'>('pdf');
  const [clientsList, setClientsList] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    loadReportTemplates();
    loadClientsList();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/reports/dashboard');

      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Error loading dashboard data');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadReportTemplates = async () => {
    try {
      const response = await api.get('/reports/templates');
      if (response.success) {
        setReportTemplates(response.data);
      }
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  const loadCustomReportOptions = async (entity: string) => {
    try {
      const response = await api.get(`/reports/custom?type=${entity}`);
      if (response.success) {
        setCustomReportOptions(response.data);
      }
    } catch (err) {
      console.error('Error loading custom report options:', err);
    }
  };

  const generateDetailedReport = async (type: 'clients' | 'cases' | 'hearings', filters = {}) => {
    try {
      setReportLoading(true);
      const response = await api.get(`/reports/${type}`, { params: filters });
      if (response.success) {
        setReportData(response.data);
        setCurrentReportType(type);
        setShowDetailedReport(true);
      }
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setReportLoading(false);
    }
  };

  const generateCustomReport = async (config: CustomReportConfig) => {
    try {
      setReportLoading(true);
      const response = await api.post('/reports/custom', config);
      if (response.success) {
        setReportData(response.data);
        setShowDetailedReport(true);
        setShowReportBuilder(false);
      }
    } catch (err) {
      console.error('Error generating custom report:', err);
    } finally {
      setReportLoading(false);
    }
  };

  const loadClientsList = async () => {
    try {
      const response = await api.get('/clients');
      if (response.success) {
        setClientsList(response.data.data || []);
      }
    } catch (err) {
      console.error('Error loading clients list:', err);
    }
  };

  const generateClientReport = async () => {
    try {
      if (!selectedClientId) {
        alert('يرجى اختيار عميل');
        return;
      }

      setClientReportLoading(true);
      const response = await api.get('/reports/client-report', {
        params: {
          client_id: selectedClientId,
          format: reportFormat,
          template: 'franke',
        },
      });

      if (response.success) {
        const reportData = response.data;

        if (reportData.type === 'html_for_pdf') {
          // Generate PDF from HTML using browser's print functionality
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(reportData.html_content);
            printWindow.document.close();

            printWindow.onload = () => {
              printWindow.print();
              printWindow.close();
            };
          }
        } else if (reportData.type === 'html_for_jpg') {
          // For JPG, we'll open the HTML in a new window for now
          // In a full implementation, this would use html2canvas or similar
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(`
              ${reportData.html_content}
              <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
              <script>
                window.onload = function() {
                  html2canvas(document.body, {
                    useCORS: true,
                    scale: 2,
                    width: document.body.scrollWidth,
                    height: document.body.scrollHeight
                  }).then(function(canvas) {
                    const link = document.createElement('a');
                    link.download = '${reportData.filename}';
                    link.href = canvas.toDataURL('image/jpeg', 0.9);
                    link.click();
                  });
                };
              </script>
            `);
            printWindow.document.close();
          }
        }

        setShowClientReportModal(false);
        setSelectedClientId('');
      }
    } catch (err) {
      console.error('Error generating client report:', err);
      alert('خطأ في إنشاء التقرير');
    } finally {
      setClientReportLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <Container className='py-4'>
        <div className='text-center'>
          <Spinner animation='border' />
          <p className='mt-2'>جاري تحميل التقارير...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className='py-4'>
        <Alert variant='danger'>{error}</Alert>
        <Button variant='primary' onClick={loadDashboardData}>
          إعادة المحاولة
        </Button>
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
                <BarChart3 className='me-2' />
                التقارير والإحصائيات
              </h2>
              <p className='text-muted mb-0'>عرض شامل لأداء المكتب والإحصائيات</p>
            </div>
            <div className='d-flex gap-2'>
              <Button
                variant='outline-primary'
                onClick={() => {
                  setShowReportBuilder(true);
                  loadCustomReportOptions('clients');
                }}
              >
                <BarChart3 className='me-2' size={16} />
                إنشاء تقرير مخصص
              </Button>
              <Button
                variant='outline-secondary'
                onClick={() => {
                  setShowTemplates(true);
                  loadReportTemplates();
                }}
              >
                <FileText className='me-2' size={16} />
                القوالب
              </Button>
              <Button variant='warning' onClick={() => setShowClientReportModal(true)}>
                <FileText className='me-2' size={16} />
                تقرير عميل (فرانكي)
              </Button>
              <Button variant='success' onClick={() => setShowExportOptions(true)}>
                <Download className='me-2' size={16} />
                تصدير
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {dashboardData && (
        <>
          {/* Key Metrics */}
          <Row className='mb-4'>
            <Col md={2} className='mb-3'>
              <Card className='h-100 text-center border-primary'>
                <Card.Body>
                  <Users size={32} className='text-primary mb-2' />
                  <h3 className='mb-1'>{dashboardData.total_clients}</h3>
                  <p className='text-muted mb-0'>العملاء</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className='mb-3'>
              <Card className='h-100 text-center border-info'>
                <Card.Body>
                  <Briefcase size={32} className='text-info mb-2' />
                  <h3 className='mb-1'>{dashboardData.total_cases}</h3>
                  <p className='text-muted mb-0'>القضايا</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className='mb-3'>
              <Card className='h-100 text-center border-warning'>
                <Card.Body>
                  <Calendar size={32} className='text-warning mb-2' />
                  <h3 className='mb-1'>{dashboardData.total_hearings}</h3>
                  <p className='text-muted mb-0'>الجلسات</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className='mb-3'>
              <Card className='h-100 text-center border-success'>
                <Card.Body>
                  <FileText size={32} className='text-success mb-2' />
                  <h3 className='mb-1'>{dashboardData.total_invoices}</h3>
                  <p className='text-muted mb-0'>الفواتير</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className='mb-3'>
              <Card className='h-100 text-center border-secondary'>
                <Card.Body>
                  <Users size={32} className='text-secondary mb-2' />
                  <h3 className='mb-1'>{dashboardData.total_lawyers}</h3>
                  <p className='text-muted mb-0'>المحامون</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className='mb-3'>
              <Card className='h-100 text-center border-primary'>
                <Card.Body>
                  <DollarSign size={32} className='text-primary mb-2' />
                  <h3 className='mb-1'>
                    {formatCurrency(dashboardData.financial_summary.paid_amount)}
                  </h3>
                  <p className='text-muted mb-0'>الإيرادات</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Financial Summary */}
          <Row className='mb-4'>
            <Col md={8}>
              <Card>
                <Card.Header>
                  <h5 className='mb-0'>
                    <DollarSign className='me-2' />
                    الملخص المالي
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4} className='text-center mb-3'>
                      <div className='mb-2'>
                        <TrendingUp size={24} className='text-success' />
                      </div>
                      <h4 className='text-success'>
                        {formatCurrency(dashboardData.financial_summary.paid_amount)}
                      </h4>
                      <p className='text-muted mb-0'>
                        المدفوع ({dashboardData.financial_summary.paid_count} فاتورة)
                      </p>
                    </Col>
                    <Col md={4} className='text-center mb-3'>
                      <div className='mb-2'>
                        <TrendingUp size={24} className='text-warning' />
                      </div>
                      <h4 className='text-warning'>
                        {formatCurrency(dashboardData.financial_summary.pending_amount)}
                      </h4>
                      <p className='text-muted mb-0'>
                        المعلق ({dashboardData.financial_summary.pending_count} فاتورة)
                      </p>
                    </Col>
                    <Col md={4} className='text-center mb-3'>
                      <div className='mb-2'>
                        <TrendingUp size={24} className='text-danger' />
                      </div>
                      <h4 className='text-danger'>
                        {dashboardData.financial_summary.overdue_count}
                      </h4>
                      <p className='text-muted mb-0'>فواتير متأخرة</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Header>
                  <h5 className='mb-0'>
                    <Briefcase className='me-2' />
                    إحصائيات القضايا
                  </h5>
                </Card.Header>
                <Card.Body>
                  {Object.entries(dashboardData.case_statistics).map(([status, count]) => (
                    <div
                      key={status}
                      className='d-flex justify-content-between align-items-center mb-2'
                    >
                      <span>{status}</span>
                      <Badge bg='primary'>{count}</Badge>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Activities & Upcoming Hearings */}
          <Row className='mb-4'>
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5 className='mb-0'>
                    <FileText className='me-2' />
                    الأنشطة الحديثة
                  </h5>
                </Card.Header>
                <Card.Body>
                  {dashboardData.recent_activities.length === 0 ? (
                    <p className='text-muted text-center'>لا توجد أنشطة حديثة</p>
                  ) : (
                    <div className='table-responsive'>
                      <Table size='sm' hover>
                        <thead>
                          <tr>
                            <th>النوع</th>
                            <th>الاسم</th>
                            <th>الإجراء</th>
                            <th>التاريخ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.recent_activities.map((activity, index) => (
                            <tr key={index}>
                              <td>
                                <Badge bg='info'>{activity.type}</Badge>
                              </td>
                              <td>{activity.name}</td>
                              <td>{activity.action}</td>
                              <td>{formatDate(activity.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5 className='mb-0'>
                    <Calendar className='me-2' />
                    الجلسات القادمة
                  </h5>
                </Card.Header>
                <Card.Body>
                  {dashboardData.upcoming_hearings.length === 0 ? (
                    <p className='text-muted text-center'>لا توجد جلسات قادمة</p>
                  ) : (
                    <div className='table-responsive'>
                      <Table size='sm' hover>
                        <thead>
                          <tr>
                            <th>التاريخ</th>
                            <th>النوع</th>
                            <th>القضية</th>
                            <th>العميل</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.upcoming_hearings.map((hearing) => (
                            <tr key={hearing.id}>
                              <td>{formatDate(hearing.hearing_date)}</td>
                              <td>
                                <Badge bg='warning'>{hearing.hearing_type}</Badge>
                              </td>
                              <td>{hearing.matter_ar}</td>
                              <td>{hearing.client_name_ar}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Revenue Trend */}
          {dashboardData.revenue_trend && dashboardData.revenue_trend.length > 0 && (
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <h5 className='mb-0'>
                      <TrendingUp className='me-2' />
                      اتجاه الإيرادات الشهرية
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className='table-responsive'>
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>الشهر</th>
                            <th>الإيرادات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.revenue_trend.map((item, index) => (
                            <tr key={index}>
                              <td>{item.month}</td>
                              <td className='text-success fw-bold'>
                                {formatCurrency(item.revenue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Quick Report Access */}
          <Row className='mb-4'>
            <Col>
              <Card>
                <Card.Header>
                  <h5 className='mb-0'>
                    <BarChart3 className='me-2' />
                    التقارير التفصيلية
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4} className='mb-3'>
                      <Card className='h-100 border-primary'>
                        <Card.Body className='text-center'>
                          <Users size={48} className='text-primary mb-3' />
                          <h5>تقارير العملاء</h5>
                          <p className='text-muted mb-3'>تقارير شاملة عن العملاء والأنشطة</p>
                          <Button
                            variant='primary'
                            size='sm'
                            className='me-2'
                            onClick={() => generateDetailedReport('clients')}
                            disabled={reportLoading}
                          >
                            <Eye className='me-1' size={14} />
                            عرض
                          </Button>
                          <Button
                            variant='outline-primary'
                            size='sm'
                            onClick={() => {
                              setReportConfig({ ...reportConfig, entity: 'clients' });
                              loadCustomReportOptions('clients');
                              setShowReportBuilder(true);
                            }}
                          >
                            <Settings className='me-1' size={14} />
                            تخصيص
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className='mb-3'>
                      <Card className='h-100 border-info'>
                        <Card.Body className='text-center'>
                          <Briefcase size={48} className='text-info mb-3' />
                          <h5>تقارير القضايا</h5>
                          <p className='text-muted mb-3'>تحليل أداء القضايا والنتائج</p>
                          <Button
                            variant='info'
                            size='sm'
                            className='me-2'
                            onClick={() => generateDetailedReport('cases')}
                            disabled={reportLoading}
                          >
                            <Eye className='me-1' size={14} />
                            عرض
                          </Button>
                          <Button
                            variant='outline-info'
                            size='sm'
                            onClick={() => {
                              setReportConfig({ ...reportConfig, entity: 'cases' });
                              loadCustomReportOptions('cases');
                              setShowReportBuilder(true);
                            }}
                          >
                            <Settings className='me-1' size={14} />
                            تخصيص
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className='mb-3'>
                      <Card className='h-100 border-warning'>
                        <Card.Body className='text-center'>
                          <Calendar size={48} className='text-warning mb-3' />
                          <h5>تقارير الجلسات</h5>
                          <p className='text-muted mb-3'>إحصائيات وتحليل الجلسات</p>
                          <Button
                            variant='warning'
                            size='sm'
                            className='me-2'
                            onClick={() => generateDetailedReport('hearings')}
                            disabled={reportLoading}
                          >
                            <Eye className='me-1' size={14} />
                            عرض
                          </Button>
                          <Button
                            variant='outline-warning'
                            size='sm'
                            onClick={() => {
                              setReportConfig({ ...reportConfig, entity: 'hearings' });
                              loadCustomReportOptions('hearings');
                              setShowReportBuilder(true);
                            }}
                          >
                            <Settings className='me-1' size={14} />
                            تخصيص
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Report Builder Modal */}
      <Modal show={showReportBuilder} onHide={() => setShowReportBuilder(false)} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>إنشاء تقرير مخصص</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {customReportOptions && (
            <Tabs defaultActiveKey='filters' className='mb-3'>
              <Tab eventKey='filters' title='المرشحات'>
                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>نوع التقرير</Form.Label>
                      <Form.Select
                        value={reportConfig.entity}
                        onChange={(e) => {
                          const entity = e.target.value;
                          setReportConfig({ ...reportConfig, entity });
                          loadCustomReportOptions(entity);
                        }}
                      >
                        {Object.entries(customReportOptions.available_entities || {}).map(
                          ([key, value]) => (
                            <option key={key} value={key}>
                              {value as string}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>من تاريخ</Form.Label>
                      <Form.Control
                        type='date'
                        value={reportConfig.filters.date_from || ''}
                        onChange={(e) =>
                          setReportConfig({
                            ...reportConfig,
                            filters: { ...reportConfig.filters, date_from: e.target.value },
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>إلى تاريخ</Form.Label>
                      <Form.Control
                        type='date'
                        value={reportConfig.filters.date_to || ''}
                        onChange={(e) =>
                          setReportConfig({
                            ...reportConfig,
                            filters: { ...reportConfig.filters, date_to: e.target.value },
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey='columns' title='الأعمدة'>
                <Row>
                  {Object.entries(customReportOptions.available_columns || {}).map(
                    ([key, value]) => (
                      <Col md={6} key={key} className='mb-2'>
                        <Form.Check
                          type='checkbox'
                          id={`column-${key}`}
                          label={value as string}
                          checked={reportConfig.columns.includes(key)}
                          onChange={(e) => {
                            const newColumns = e.target.checked
                              ? [...reportConfig.columns, key]
                              : reportConfig.columns.filter((col) => col !== key);
                            setReportConfig({ ...reportConfig, columns: newColumns });
                          }}
                        />
                      </Col>
                    )
                  )}
                </Row>
              </Tab>
            </Tabs>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowReportBuilder(false)}>
            إلغاء
          </Button>
          <Button
            variant='primary'
            onClick={() => generateCustomReport(reportConfig)}
            disabled={reportLoading}
          >
            {reportLoading && <Spinner size='sm' className='me-2' />}
            إنشاء التقرير
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Templates Modal */}
      <Modal show={showTemplates} onHide={() => setShowTemplates(false)} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>قوالب التقارير</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {reportTemplates.map((template) => (
              <ListGroup.Item
                key={template.id}
                className='d-flex justify-content-between align-items-start'
              >
                <div className='ms-2 me-auto'>
                  <div className='fw-bold'>{template.name}</div>
                  <p className='mb-1'>{template.description}</p>
                  <small className='text-muted'>
                    بواسطة {template.created_by} - {template.created_at}
                  </small>
                </div>
                <ButtonGroup>
                  <Button
                    variant='outline-primary'
                    size='sm'
                    onClick={() => {
                      setReportConfig({
                        entity: template.entity,
                        filters: template.config.filters || {},
                        columns: template.config.columns || [],
                        grouping: template.config.grouping,
                      });
                      setShowTemplates(false);
                      setShowReportBuilder(true);
                    }}
                  >
                    استخدام
                  </Button>
                </ButtonGroup>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {reportTemplates.length === 0 && (
            <p className='text-center text-muted py-4'>لا توجد قوالب محفوظة</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowTemplates(false)}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Detailed Report Modal */}
      <Modal show={showDetailedReport} onHide={() => setShowDetailedReport(false)} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>
            تقرير{' '}
            {currentReportType === 'clients'
              ? 'العملاء'
              : currentReportType === 'cases'
                ? 'القضايا'
                : 'الجلسات'}{' '}
            التفصيلي
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {reportData && (
            <>
              {/* Summary */}
              <Card className='mb-3'>
                <Card.Body>
                  <h6>ملخص التقرير</h6>
                  <Row>
                    {Object.entries(reportData.summary || {}).map(([key, value]) => (
                      <Col md={3} key={key} className='text-center mb-2'>
                        <div className='fw-bold'>{value as string}</div>
                        <small className='text-muted'>{key}</small>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              {/* Data Table */}
              {reportData.data && reportData.data.length > 0 && (
                <div className='table-responsive'>
                  <Table striped hover>
                    <thead>
                      <tr>
                        {Object.keys(reportData.data[0]).map((key) => (
                          <th key={key}>{reportData.available_columns?.[key] || key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.data.map((row: any, index: number) => (
                        <tr key={index}>
                          {Object.keys(reportData.data[0]).map((key) => (
                            <td key={key}>
                              {key.includes('date') && row[key]
                                ? formatDate(row[key])
                                : row[key] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              {reportData.data && reportData.data.length === 0 && (
                <p className='text-center text-muted py-4'>لا توجد بيانات لعرضها</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='success'
            onClick={() => {
              setShowDetailedReport(false);
              setShowExportOptions(true);
            }}
          >
            <Download className='me-2' size={16} />
            تصدير
          </Button>
          <Button variant='secondary' onClick={() => setShowDetailedReport(false)}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Export Options Modal */}
      <Modal show={showExportOptions} onHide={() => setShowExportOptions(false)} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>خيارات التصدير</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Card className='h-100 border-primary'>
                <Card.Body className='text-center'>
                  <FileText size={48} className='text-primary mb-3' />
                  <h5>تقرير عميل محدد</h5>
                  <p className='text-muted mb-3'>إنشاء تقرير فرانكي لعميل واحد مع جميع قضاياه</p>
                  <Button
                    variant='primary'
                    onClick={() => {
                      setShowExportOptions(false);
                      setShowClientReportModal(true);
                    }}
                  >
                    <FileText className='me-2' size={16} />
                    تقرير العميل
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className='h-100 border-secondary'>
                <Card.Body className='text-center'>
                  <Download size={48} className='text-secondary mb-3' />
                  <h5>تصدير البيانات الحالية</h5>
                  <p className='text-muted mb-3'>تصدير البيانات المعروضة حالياً كـ CSV أو Excel</p>
                  <div className='d-grid gap-2'>
                    <Button variant='outline-success' disabled>
                      <Download className='me-2' size={16} />
                      CSV
                    </Button>
                    <Button variant='outline-info' disabled>
                      <Download className='me-2' size={16} />
                      Excel
                    </Button>
                  </div>
                  <small className='text-muted'>قريباً</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowExportOptions(false)}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Client Report Modal */}
      <Modal show={showClientReportModal} onHide={() => setShowClientReportModal(false)} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>إنشاء تقرير عميل - قالب فرانكي</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>اختر العميل</Form.Label>
                <Form.Select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  disabled={clientReportLoading}
                >
                  <option value=''>-- اختر العميل --</option>
                  {clientsList.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.client_name_ar || client.client_name_en}
                      {client.client_type && ` (${client.client_type})`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>تنسيق التصدير</Form.Label>
                <Form.Select
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value as 'pdf' | 'jpg')}
                  disabled={clientReportLoading}
                >
                  <option value='pdf'>PDF</option>
                  <option value='jpg'>JPG</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Alert variant='info'>
            <strong>قالب فرانكي:</strong> سيتم إنشاء تقرير بموقف العميل يتضمن جميع القضايا وحالتها،
            مع الشعارات المزدوجة (صارى الدين ومشاركوه + فرانكي) وتنسيق مناسب للطباعة.
          </Alert>

          {selectedClientId && (
            <Alert variant='secondary'>
              <strong>العميل المحدد:</strong>{' '}
              {clientsList.find((c) => c.id === parseInt(selectedClientId))?.client_name_ar}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowClientReportModal(false)}
            disabled={clientReportLoading}
          >
            إلغاء
          </Button>
          <Button
            variant='primary'
            onClick={generateClientReport}
            disabled={clientReportLoading || !selectedClientId}
          >
            {clientReportLoading && <Spinner size='sm' className='me-2' />}
            <Download className='me-2' size={16} />
            إنشاء التقرير
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReportsPage;
