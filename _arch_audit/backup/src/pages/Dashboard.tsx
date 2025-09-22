import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@components/auth/AuthProvider';
import { useRTL } from '@hooks/useRTL';
import { useLanguage } from '@hooks/useLanguage';
import { Users, FileText, Calendar, Receipt, TrendingUp, Clock, Gavel } from 'lucide-react';
import { apiService as api } from '../services/api';

export function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isRTL } = useRTL();
  const { currentLanguage } = useLanguage();

  const [dashboardData, setDashboardData] = useState<any>(null);
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
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-EG').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'منذ دقائق';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'منذ يوم';
    if (diffInDays < 30) return `منذ ${diffInDays} يوم`;

    return date.toLocaleDateString('en-GB');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'client': return Users;
      case 'case': return FileText;
      case 'hearing': return Calendar;
      case 'invoice': return Receipt;
      default: return FileText;
    }
  };

  const getUserDisplayName = () => {
    if (currentLanguage === 'ar' && user?.arabicName) {
      return user.arabicName;
    }
    return user?.name || 'User';
  };

  if (loading) {
    return (
      <Container fluid className='py-4' dir={isRTL ? 'rtl' : 'ltr'}>
        <div className='text-center py-5'>
          <Spinner animation='border' variant='primary' />
          <p className='mt-3 text-muted'>جاري تحميل لوحة التحكم...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className='py-4' dir={isRTL ? 'rtl' : 'ltr'}>
        <Alert variant='danger' className='text-center'>
          <h5>خطأ في تحميل البيانات</h5>
          <p>{error}</p>
          <button className='btn btn-outline-danger' onClick={loadDashboardData}>
            إعادة المحاولة
          </button>
        </Alert>
      </Container>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const stats = [
    {
      title: 'إجمالي العملاء',
      value: formatNumber(dashboardData.total_clients),
      icon: Users,
      color: 'primary',
    },
    {
      title: 'القضايا النشطة',
      value: formatNumber(dashboardData.total_cases),
      icon: FileText,
      color: 'success',
    },
    {
      title: 'إجمالي الجلسات',
      value: formatNumber(dashboardData.total_hearings),
      icon: Gavel,
      color: 'warning',
    },
    {
      title: 'الفواتير المعلقة',
      value: formatNumber(dashboardData.financial_summary.pending_count),
      icon: Receipt,
      color: 'danger',
    },
  ];

  return (
    <Container fluid className='py-4' dir={isRTL ? 'rtl' : 'ltr'}>
      <Row className='mb-4'>
        <Col>
          <h1 className='h3 mb-0'>
            {currentLanguage === 'ar' ? 'مرحباً بك، ' : 'Welcome, '}
            <span className='text-primary'>{getUserDisplayName()}</span>
          </h1>
          <p className='text-muted'>
            {currentLanguage === 'ar'
              ? 'نظرة عامة على نظام إدارة القضايا'
              : 'Overview of your litigation management system'}
          </p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className='mb-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Col key={index} md={6} lg={3} className='mb-3'>
              <Card className='h-100 shadow-sm'>
                <Card.Body>
                  <Row className='align-items-center'>
                    <Col>
                      <div className={`text-${stat.color} mb-2`}>
                        <Icon size={24} />
                      </div>
                      <h6 className='card-title mb-1'>{stat.title}</h6>
                      <h3 className='mb-0'>{stat.value}</h3>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Row>
        {/* Financial Summary */}
        <Col lg={4} className='mb-4'>
          <Card className='h-100 shadow-sm'>
            <Card.Header>
              <h5 className='card-title mb-0'>الملخص المالي</h5>
            </Card.Header>
            <Card.Body>
              <div className='financial-summary'>
                <div className='mb-3'>
                  <div className='d-flex justify-content-between'>
                    <span>إجمالي الإيرادات:</span>
                    <strong className='text-primary'>
                      {formatCurrency(dashboardData.financial_summary.total_revenue)}
                    </strong>
                  </div>
                </div>
                <div className='mb-3'>
                  <div className='d-flex justify-content-between'>
                    <span>المبالغ المدفوعة:</span>
                    <strong className='text-success'>
                      {formatCurrency(dashboardData.financial_summary.paid_amount)}
                    </strong>
                  </div>
                </div>
                <div className='mb-3'>
                  <div className='d-flex justify-content-between'>
                    <span>المبالغ المعلقة:</span>
                    <strong className='text-warning'>
                      {formatCurrency(dashboardData.financial_summary.pending_amount)}
                    </strong>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col lg={4} className='mb-4'>
          <Card className='h-100 shadow-sm'>
            <Card.Header>
              <h5 className='card-title mb-0'>النشاط الأخير</h5>
            </Card.Header>
            <Card.Body>
              <div className='activity-list'>
                {dashboardData.recent_activities?.slice(0, 5).map((activity: any, index: number) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={index} className='activity-item d-flex align-items-center mb-3'>
                      <div className='activity-icon me-3'>
                        <Icon size={20} className='text-primary' />
                      </div>
                      <div className='flex-grow-1'>
                        <p className='mb-1'>
                          <strong>{activity.action}</strong> {activity.name}
                        </p>
                        <small className='text-muted'>
                          <Clock size={12} className='me-1' />
                          {formatTimeAgo(activity.created_at)}
                        </small>
                      </div>
                    </div>
                  );
                })}
                {(!dashboardData.recent_activities || dashboardData.recent_activities.length === 0) && (
                  <p className='text-muted text-center'>لا يوجد نشاط حديث</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Upcoming Hearings */}
        <Col lg={4} className='mb-4'>
          <Card className='h-100 shadow-sm'>
            <Card.Header>
              <h5 className='card-title mb-0'>الجلسات القادمة</h5>
            </Card.Header>
            <Card.Body>
              <div className='upcoming-hearings'>
                {dashboardData.upcoming_hearings?.map((hearing: any, index: number) => (
                  <div key={index} className='hearing-item d-flex align-items-center mb-3'>
                    <div className='hearing-icon me-3'>
                      <Calendar size={20} className='text-warning' />
                    </div>
                    <div className='flex-grow-1'>
                      <p className='mb-1'>
                        <strong>{hearing.matter_ar || 'جلسة محكمة'}</strong>
                      </p>
                      <small className='text-muted'>
                        {new Date(hearing.hearing_date).toLocaleDateString('en-GB')}
                      </small>
                    </div>
                  </div>
                ))}
                {(!dashboardData.upcoming_hearings || dashboardData.upcoming_hearings.length === 0) && (
                  <p className='text-muted text-center'>لا توجد جلسات قادمة</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
