import React from 'react'
import { Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRTL } from '@hooks/useRTL'
import { useLanguage } from '@hooks/useLanguage'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Receipt, 
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import clsx from 'clsx'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const { isRTL } = useRTL()
  const { currentLanguage } = useLanguage()

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: t('nav.dashboard'),
      labelAr: 'لوحة التحكم'
    },
    {
      path: '/clients',
      icon: Users,
      label: t('nav.clients'),
      labelAr: 'العملاء'
    },
    {
      path: '/cases',
      icon: FileText,
      label: t('nav.cases'),
      labelAr: 'القضايا'
    },
    {
      path: '/hearings',
      icon: Calendar,
      label: t('nav.hearings'),
      labelAr: 'الجلسات'
    },
    {
      path: '/invoices',
      icon: Receipt,
      label: t('nav.invoices'),
      labelAr: 'الفواتير'
    },
    {
      path: '/reports',
      icon: BarChart3,
      label: t('nav.reports'),
      labelAr: 'التقارير'
    },
    {
      path: '/settings',
      icon: Settings,
      label: t('nav.settings'),
      labelAr: 'الإعدادات'
    }
  ]

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <aside 
      className={clsx(
        'sidebar',
        collapsed && 'collapsed'
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="sidebar-header d-flex align-items-center justify-content-between p-3">
        {!collapsed && (
          <h6 className="sidebar-title mb-0 text-white">
            {currentLanguage === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
          </h6>
        )}
        
        <Button
          variant="link"
          size="sm"
          onClick={onToggle}
          className="text-white p-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isRTL ? (
            collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
          ) : (
            collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
          )}
        </Button>
      </div>

      <Nav className="flex-column sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Nav.Item key={item.path}>
              <Nav.Link
                as={Link}
                to={item.path}
                className={clsx(
                  'sidebar-link d-flex align-items-center',
                  active && 'active'
                )}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <Icon 
                  size={20} 
                  className={clsx(
                    'sidebar-icon',
                    isRTL ? 'me-0 ms-2' : 'me-2'
                  )}
                />
                
                {!collapsed && (
                  <span className="sidebar-text">
                    {currentLanguage === 'ar' ? item.labelAr : item.label}
                  </span>
                )}
                
                {active && (
                  <span className="visually-hidden">
                    {currentLanguage === 'ar' ? '(الصفحة الحالية)' : '(current page)'}
                  </span>
                )}
              </Nav.Link>
            </Nav.Item>
          )
        })}
      </Nav>

      <div className="sidebar-footer mt-auto p-3">
        {!collapsed && (
          <small className="text-muted">
            {currentLanguage === 'ar' ? 'نظام إدارة القضايا v1.0' : 'Litigation Management v1.0'}
          </small>
        )}
      </div>
    </aside>
  )
}
