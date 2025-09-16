/**
 * Protected Route Component with Role-Based Access Control
 * Litigation Management System
 */

import React, { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { usePermissions } from '@hooks/usePermissions'
import { UserRole, Permission, Resource, Action } from '@types/auth'
import { Container, Alert, Spinner } from 'react-bootstrap'
import { Shield, Lock } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole | UserRole[]
  requiredPermission?: Permission
  requiredResource?: Resource
  requiredAction?: Action
  fallbackPath?: string
  showAccessDenied?: boolean
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  requiredResource,
  requiredAction,
  fallbackPath = '/login',
  showAccessDenied = true
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const { 
    checkRole, 
    checkPermission, 
    checkAccess,
    getUserRole,
    isSuperAdmin,
    isAdmin,
    isLawyer,
    isStaff
  } = usePermissions()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="sm" />
          <p className="mt-2 text-muted">
            جاري التحقق من الصلاحيات...
          </p>
        </div>
      </Container>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Check role-based access
  if (requiredRole && !checkRole(requiredRole)) {
    if (showAccessDenied) {
      return <AccessDeniedPage requiredRole={requiredRole} />
    }
    return <Navigate to="/dashboard" replace />
  }

  // Check permission-based access
  if (requiredPermission && !checkPermission(requiredPermission)) {
    if (showAccessDenied) {
      return <AccessDeniedPage requiredPermission={requiredPermission} />
    }
    return <Navigate to="/dashboard" replace />
  }

  // Check resource-action based access
  if (requiredResource && requiredAction && !checkAccess(requiredResource, requiredAction)) {
    if (showAccessDenied) {
      return <AccessDeniedPage requiredResource={requiredResource} requiredAction={requiredAction} />
    }
    return <Navigate to="/dashboard" replace />
  }

  // All checks passed, render children
  return <>{children}</>
}

interface AccessDeniedPageProps {
  requiredRole?: UserRole | UserRole[]
  requiredPermission?: Permission
  requiredResource?: Resource
  requiredAction?: Action
}

function AccessDeniedPage({
  requiredRole,
  requiredPermission,
  requiredResource,
  requiredAction
}: AccessDeniedPageProps) {
  const { getUserRole } = usePermissions()
  const currentRole = getUserRole()

  const getAccessDeniedMessage = () => {
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      return {
        title: 'صلاحية غير كافية',
        message: `يجب أن تكون ${roles.join(' أو ')} للوصول إلى هذه الصفحة`,
        titleEn: 'Insufficient Role',
        messageEn: `You must be ${roles.join(' or ')} to access this page`
      }
    }

    if (requiredPermission) {
      return {
        title: 'صلاحية غير كافية',
        message: `ليس لديك صلاحية ${requiredPermission} للوصول إلى هذه الصفحة`,
        titleEn: 'Insufficient Permission',
        messageEn: `You don't have ${requiredPermission} permission to access this page`
      }
    }

    if (requiredResource && requiredAction) {
      return {
        title: 'صلاحية غير كافية',
        message: `ليس لديك صلاحية ${requiredAction} على ${requiredResource}`,
        titleEn: 'Insufficient Permission',
        messageEn: `You don't have ${requiredAction} permission on ${requiredResource}`
      }
    }

    return {
      title: 'وصول مرفوض',
      message: 'ليس لديك صلاحية للوصول إلى هذه الصفحة',
      titleEn: 'Access Denied',
      messageEn: 'You do not have permission to access this page'
    }
  }

  const { title, message, titleEn, messageEn } = getAccessDeniedMessage()

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="mb-4">
          <Shield size={64} className="text-danger mb-3" />
          <h2 className="text-danger mb-3">
            {title}
          </h2>
          <p className="text-muted mb-4">
            {message}
          </p>
        </div>

        <Alert variant="warning" className="mb-4">
          <div className="d-flex align-items-center">
            <Lock size={20} className="me-2" />
            <div>
              <strong>Your Role:</strong> {currentRole || 'Unknown'}
            </div>
          </div>
        </Alert>

        <div className="d-grid gap-2 d-md-flex justify-content-md-center">
          <button 
            className="btn btn-primary"
            onClick={() => window.history.back()}
          >
            العودة
          </button>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => window.location.href = '/dashboard'}
          >
            لوحة التحكم
          </button>
        </div>

        {/* English version for debugging */}
        <div className="mt-4 p-3 bg-light rounded">
          <small className="text-muted">
            <strong>EN:</strong> {titleEn} - {messageEn}
          </small>
        </div>
      </div>
    </Container>
  )
}

// Convenience components for common access patterns
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['admin', 'super_admin']}>
      {children}
    </ProtectedRoute>
  )
}

export function SuperAdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="super_admin">
      {children}
    </ProtectedRoute>
  )
}

export function LawyerRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['lawyer', 'admin', 'super_admin']}>
      {children}
    </ProtectedRoute>
  )
}

export function StaffRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['staff', 'lawyer', 'admin', 'super_admin']}>
      {children}
    </ProtectedRoute>
  )
}

// Permission-based route components
export function PermissionRoute({ 
  children, 
  permission 
}: { 
  children: ReactNode
  permission: Permission 
}) {
  return (
    <ProtectedRoute requiredPermission={permission}>
      {children}
    </ProtectedRoute>
  )
}

export function ResourceActionRoute({ 
  children, 
  resource, 
  action 
}: { 
  children: ReactNode
  resource: Resource
  action: Action 
}) {
  return (
    <ProtectedRoute requiredResource={resource} requiredAction={action}>
      {children}
    </ProtectedRoute>
  )
}