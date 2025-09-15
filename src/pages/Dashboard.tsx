import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@components/auth/AuthProvider'
import { useRTL } from '@hooks/useRTL'
import { useLanguage } from '@hooks/useLanguage'
import { 
  Users, 
  FileText, 
  Calendar, 
  Receipt, 
  TrendingUp,
  Clock
} from 'lucide-react'

export function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { isRTL } = useRTL()
  const { currentLanguage } = useLanguage()

  const stats = [
    {
      title: t('dashboard.totalClients'),
      titleAr: 'إجمالي العملاء',
      value: '1,234',
      icon: Users,
      color: 'primary',
      change: '+12%'
    },
    {
      title: t('dashboard.activeCases'),
      titleAr: 'القضايا النشطة',
      value: '567',
      icon: FileText,
      color: 'success',
      change: '+8%'
    },
    {
      title: t('dashboard.upcomingHearings'),
      titleAr: 'الجلسات القادمة',
      value: '23',
      icon: Calendar,
      color: 'warning',
      change: '+3'
    },
    {
      title: t('dashboard.pendingInvoices'),
      titleAr: 'الفواتير المعلقة',
      value: '89',
      icon: Receipt,
      color: 'danger',
      change: '-5%'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      action: 'New client added',
      actionAr: 'تم إضافة عميل جديد',
      client: 'John Smith',
      clientAr: 'ناجي رمضان',
      time: '2 hours ago',
      timeAr: 'منذ ساعتين',
      icon: Users
    },
    {
      id: 2,
      action: 'Case updated',
      actionAr: 'تم تحديث قضية',
      client: 'ABC Company',
      clientAr: 'شركة أ ب ج',
      time: '4 hours ago',
      timeAr: 'منذ 4 ساعات',
      icon: FileText
    },
    {
      id: 3,
      action: 'Hearing scheduled',
      actionAr: 'تم جدولة جلسة',
      client: 'Jane Doe',
      clientAr: 'فاطمة أحمد',
      time: '1 day ago',
      timeAr: 'منذ يوم',
      icon: Calendar
    }
  ]

  const getUserDisplayName = () => {
    if (currentLanguage === 'ar' && user?.arabicName) {
      return user.arabicName
    }
    return user?.name || 'User'
  }

  return (
    <Container fluid className="py-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            {currentLanguage === 'ar' ? 'مرحباً بك، ' : 'Welcome, '}
            <span className="text-primary">{getUserDisplayName()}</span>
          </h1>
          <p className="text-muted">
            {currentLanguage === 'ar' 
              ? 'نظرة عامة على نظام إدارة القضايا'
              : 'Overview of your litigation management system'
            }
          </p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Col key={index} md={6} lg={3} className="mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col>
                      <div className={`text-${stat.color} mb-2`}>
                        <Icon size={24} />
                      </div>
                      <h6 className="card-title mb-1">
                        {currentLanguage === 'ar' ? stat.titleAr : stat.title}
                      </h6>
                      <h3 className="mb-0">{stat.value}</h3>
                      <small className={`text-${stat.change.startsWith('+') ? 'success' : 'danger'}`}>
                        {stat.change}
                      </small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>

      <Row>
        {/* Recent Activity */}
        <Col lg={8} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header>
              <h5 className="card-title mb-0">
                {currentLanguage === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="activity-list">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="activity-item d-flex align-items-center mb-3">
                      <div className="activity-icon me-3">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1">
                          <strong>
                            {currentLanguage === 'ar' ? activity.actionAr : activity.action}
                          </strong>
                          {' '}
                          {currentLanguage === 'ar' ? activity.clientAr : activity.client}
                        </p>
                        <small className="text-muted">
                          <Clock size={12} className="me-1" />
                          {currentLanguage === 'ar' ? activity.timeAr : activity.time}
                        </small>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col lg={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header>
              <h5 className="card-title mb-0">
                {currentLanguage === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="quick-actions">
                <button className="btn btn-outline-primary w-100 mb-2">
                  {currentLanguage === 'ar' ? 'إضافة عميل جديد' : 'Add New Client'}
                </button>
                <button className="btn btn-outline-success w-100 mb-2">
                  {currentLanguage === 'ar' ? 'إنشاء قضية جديدة' : 'Create New Case'}
                </button>
                <button className="btn btn-outline-warning w-100 mb-2">
                  {currentLanguage === 'ar' ? 'جدولة جلسة' : 'Schedule Hearing'}
                </button>
                <button className="btn btn-outline-info w-100">
                  {currentLanguage === 'ar' ? 'إنشاء فاتورة' : 'Create Invoice'}
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
