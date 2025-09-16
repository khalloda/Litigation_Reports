/**
 * Permission Gate Component for Conditional Rendering
 * Litigation Management System
 */

import React, { ReactNode } from 'react'
import { usePermissions } from '@hooks/usePermissions'
import { UserRole, Permission, Resource, Action } from '@types/auth'

interface PermissionGateProps {
  children: ReactNode
  fallback?: ReactNode
  requiredRole?: UserRole | UserRole[]
  requiredPermission?: Permission
  requiredResource?: Resource
  requiredAction?: Action
  requireAll?: boolean // If true, all conditions must be met; if false, any condition can be met
  inverse?: boolean // If true, show content when conditions are NOT met
}

export function PermissionGate({
  children,
  fallback = null,
  requiredRole,
  requiredPermission,
  requiredResource,
  requiredAction,
  requireAll = true,
  inverse = false
}: PermissionGateProps) {
  const { 
    checkRole, 
    checkPermission, 
    checkAccess,
    checkAllPermissions,
    checkAnyPermission
  } = usePermissions()

  // Collect all conditions
  const conditions: boolean[] = []

  if (requiredRole) {
    conditions.push(checkRole(requiredRole))
  }

  if (requiredPermission) {
    conditions.push(checkPermission(requiredPermission))
  }

  if (requiredResource && requiredAction) {
    conditions.push(checkAccess(requiredResource, requiredAction))
  }

  // Determine if access is granted
  let hasAccess: boolean

  if (conditions.length === 0) {
    // No conditions specified, always show content
    hasAccess = true
  } else if (requireAll) {
    // All conditions must be met
    hasAccess = conditions.every(condition => condition)
  } else {
    // Any condition can be met
    hasAccess = conditions.some(condition => condition)
  }

  // Apply inverse logic
  const shouldShow = inverse ? !hasAccess : hasAccess

  return shouldShow ? <>{children}</> : <>{fallback}</>
}

// Convenience components for common patterns
export function RoleGate({ 
  children, 
  fallback, 
  role 
}: { 
  children: ReactNode
  fallback?: ReactNode
  role: UserRole | UserRole[]
}) {
  return (
    <PermissionGate requiredRole={role} fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

export function PermissionGateSimple({ 
  children, 
  fallback, 
  permission 
}: { 
  children: ReactNode
  fallback?: ReactNode
  permission: Permission
}) {
  return (
    <PermissionGate requiredPermission={permission} fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

export function ResourceActionGate({ 
  children, 
  fallback, 
  resource, 
  action 
}: { 
  children: ReactNode
  fallback?: ReactNode
  resource: Resource
  action: Action
}) {
  return (
    <PermissionGate requiredResource={resource} requiredAction={action} fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

// Specific role gates
export function SuperAdminGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGate role="super_admin" fallback={fallback}>{children}</RoleGate>
}

export function AdminGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGate role={['admin', 'super_admin']} fallback={fallback}>{children}</RoleGate>
}

export function LawyerGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGate role={['lawyer', 'admin', 'super_admin']} fallback={fallback}>{children}</RoleGate>
}

export function StaffGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGate role={['staff', 'lawyer', 'admin', 'super_admin']} fallback={fallback}>{children}</RoleGate>
}

// Common permission gates
export function CanViewGate({ 
  children, 
  fallback, 
  resource 
}: { 
  children: ReactNode
  fallback?: ReactNode
  resource: Resource
}) {
  return <ResourceActionGate resource={resource} action="view" fallback={fallback}>{children}</ResourceActionGate>
}

export function CanCreateGate({ 
  children, 
  fallback, 
  resource 
}: { 
  children: ReactNode
  fallback?: ReactNode
  resource: Resource
}) {
  return <ResourceActionGate resource={resource} action="create" fallback={fallback}>{children}</ResourceActionGate>
}

export function CanEditGate({ 
  children, 
  fallback, 
  resource 
}: { 
  children: ReactNode
  fallback?: ReactNode
  resource: Resource
}) {
  return <ResourceActionGate resource={resource} action="edit" fallback={fallback}>{children}</ResourceActionGate>
}

export function CanDeleteGate({ 
  children, 
  fallback, 
  resource 
}: { 
  children: ReactNode
  fallback?: ReactNode
  resource: Resource
}) {
  return <ResourceActionGate resource={resource} action="delete" fallback={fallback}>{children}</ResourceActionGate>
}

export function CanExportGate({ 
  children, 
  fallback, 
  resource 
}: { 
  children: ReactNode
  fallback?: ReactNode
  resource: Resource
}) {
  return <ResourceActionGate resource={resource} action="export" fallback={fallback}>{children}</ResourceActionGate>
}

export function CanManageGate({ 
  children, 
  fallback, 
  resource 
}: { 
  children: ReactNode
  fallback?: ReactNode
  resource: Resource
}) {
  return <ResourceActionGate resource={resource} action="manage" fallback={fallback}>{children}</ResourceActionGate>
}

// Specific resource gates
export function CanManageUsersGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGateSimple permission="users:manage" fallback={fallback}>{children}</PermissionGateSimple>
}

export function CanManageClientsGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <CanManageGate resource="clients" fallback={fallback}>{children}</CanManageGate>
}

export function CanManageCasesGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <CanManageGate resource="cases" fallback={fallback}>{children}</CanManageGate>
}

export function CanManageInvoicesGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <CanManageGate resource="invoices" fallback={fallback}>{children}</CanManageGate>
}

export function CanManageDocumentsGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <CanManageGate resource="documents" fallback={fallback}>{children}</CanManageGate>
}

export function CanManageReportsGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <CanViewGate resource="reports" fallback={fallback}>{children}</CanViewGate>
}

// Inverse gates (show when permission is NOT granted)
export function NotSuperAdminGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGate requiredRole="super_admin" inverse={true} fallback={fallback}>{children}</PermissionGate>
}

export function NotAdminGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGate requiredRole={['admin', 'super_admin']} inverse={true} fallback={fallback}>{children}</PermissionGate>
}

// Multiple permission gates
export function AnyPermissionGate({ 
  children, 
  fallback, 
  permissions 
}: { 
  children: ReactNode
  fallback?: ReactNode
  permissions: Permission[]
}) {
  return (
    <PermissionGate 
      requiredPermission={permissions[0]} 
      requireAll={false} 
      fallback={fallback}
    >
      {children}
    </PermissionGate>
  )
}

export function AllPermissionsGate({ 
  children, 
  fallback, 
  permissions 
}: { 
  children: ReactNode
  fallback?: ReactNode
  permissions: Permission[]
}) {
  return (
    <PermissionGate 
      requiredPermission={permissions[0]} 
      requireAll={true} 
      fallback={fallback}
    >
      {children}
    </PermissionGate>
  )
}
