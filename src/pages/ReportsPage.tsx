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

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-SA');
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
              <Button variant='outline-primary'>
                <Filter className='me-2' size={16} />
                تصفية
              </Button>
              <Button variant='success'>
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
                  <h3 className='mb-1'>{formatCurrency(dashboardData.financial_summary.paid_amount)}</h3>
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
                      <h4 className='text-success'>{formatCurrency(dashboardData.financial_summary.paid_amount)}</h4>
                      <p className='text-muted mb-0'>المدفوع ({dashboardData.financial_summary.paid_count} فاتورة)</p>
                    </Col>
                    <Col md={4} className='text-center mb-3'>
                      <div className='mb-2'>
                        <TrendingUp size={24} className='text-warning' />
                      </div>
                      <h4 className='text-warning'>{formatCurrency(dashboardData.financial_summary.pending_amount)}</h4>
                      <p className='text-muted mb-0'>المعلق ({dashboardData.financial_summary.pending_count} فاتورة)</p>
                    </Col>
                    <Col md={4} className='text-center mb-3'>
                      <div className='mb-2'>
                        <TrendingUp size={24} className='text-danger' />
                      </div>
                      <h4 className='text-danger'>{dashboardData.financial_summary.overdue_count}</h4>
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
                    <div key={status} className='d-flex justify-content-between align-items-center mb-2'>
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
                              <td className='text-success fw-bold'>{formatCurrency(item.revenue)}</td>
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
        </>
      )}
    </Container>
  );
};

export default ReportsPage;