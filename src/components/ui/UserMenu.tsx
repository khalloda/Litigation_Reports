import React from 'react'
import { Dropdown, Nav } from 'react-bootstrap'
import { useAuth } from '@components/auth/AuthProvider'
import { useLanguage } from '@hooks/useLanguage'
import { useRTL } from '@hooks/useRTL'
import { User, LogOut, Settings } from 'lucide-react'
import clsx from 'clsx'

interface UserMenuProps {
  user: {
    id: number
    email: string
    name: string
    arabicName?: string
    role: 'admin' | 'lawyer' | 'staff'
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const { logout } = useAuth()
  const { currentLanguage } = useLanguage()
  const { isRTL } = useRTL()

  const handleLogout = () => {
    logout()
  }

  const getUserDisplayName = () => {
    if (currentLanguage === 'ar' && user.arabicName) {
      return user.arabicName
    }
    return user.name
  }

  const getRoleDisplayName = () => {
    if (currentLanguage === 'ar') {
      switch (user.role) {
        case 'admin':
          return 'مدير'
        case 'lawyer':
          return 'محامي'
        case 'staff':
          return 'موظف'
        default:
          return user.role
      }
    } else {
      return user.role.charAt(0).toUpperCase() + user.role.slice(1)
    }
  }

  return (
    <Dropdown align={isRTL ? 'start' : 'end'}>
      <Dropdown.Toggle
        variant="outline-light"
        size="sm"
        className="d-flex align-items-center user-menu-toggle"
        id="user-menu"
        aria-label="User menu"
      >
        <User size={16} className="me-1" />
        <span className="d-none d-lg-inline">
          {getUserDisplayName()}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu 
        dir={isRTL ? 'rtl' : 'ltr'}
        className="user-dropdown"
      >
        <Dropdown.Header className="user-info">
          <div className="fw-bold">{getUserDisplayName()}</div>
          <small className="text-muted">{user.email}</small>
          <small className="text-muted d-block">{getRoleDisplayName()}</small>
        </Dropdown.Header>
        
        <Dropdown.Divider />
        
        <Dropdown.Item
          href="/settings"
          className="d-flex align-items-center"
        >
          <Settings size={16} className={clsx(isRTL ? 'ms-2' : 'me-2')} />
          {currentLanguage === 'ar' ? 'الإعدادات' : 'Settings'}
        </Dropdown.Item>
        
        <Dropdown.Divider />
        
        <Dropdown.Item
          onClick={handleLogout}
          className="d-flex align-items-center text-danger"
        >
          <LogOut size={16} className={clsx(isRTL ? 'ms-2' : 'me-2')} />
          {currentLanguage === 'ar' ? 'تسجيل الخروج' : 'Logout'}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
