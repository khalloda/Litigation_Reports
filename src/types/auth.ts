/**
 * Authentication and Authorization Types
 * Litigation Management System
 */

export interface User {
  id: number
  username: string
  email: string
  full_name_ar: string
  full_name_en: string
  role: UserRole
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export type UserRole = 'super_admin' | 'admin' | 'lawyer' | 'staff'

export interface UserSession {
  id: string
  user_id: number
  expires_at: string
  created_at: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember_me?: boolean
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: Permission) => boolean
  hasRole: (role: UserRole | UserRole[]) => boolean
  canAccess: (resource: Resource, action: Action) => boolean
}

// Permission System
export type Resource = 
  | 'dashboard'
  | 'clients'
  | 'cases'
  | 'hearings'
  | 'invoices'
  | 'reports'
  | 'users'
  | 'system_settings'
  | 'powers_of_attorney'
  | 'documents'
  | 'attendance'
  | 'admin_work'
  | 'contacts'

export type Action = 
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'export'
  | 'import'
  | 'manage'

export type Permission = `${Resource}:${Action}`

// Role Permissions Configuration
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    // Dashboard
    'dashboard:view',
    
    // Clients - Full Access
    'clients:view',
    'clients:create',
    'clients:edit',
    'clients:delete',
    'clients:export',
    'clients:import',
    
    // Cases - Full Access
    'cases:view',
    'cases:create',
    'cases:edit',
    'cases:delete',
    'cases:export',
    'cases:import',
    
    // Hearings - Full Access
    'hearings:view',
    'hearings:create',
    'hearings:edit',
    'hearings:delete',
    'hearings:export',
    
    // Invoices - Full Access
    'invoices:view',
    'invoices:create',
    'invoices:edit',
    'invoices:delete',
    'invoices:export',
    
    // Reports - Full Access
    'reports:view',
    'reports:export',
    
    // Users - Full Management
    'users:view',
    'users:create',
    'users:edit',
    'users:delete',
    'users:manage',
    
    // System Settings - Full Access
    'system_settings:view',
    'system_settings:edit',
    'system_settings:manage',
    
    // Powers of Attorney - Full Access
    'powers_of_attorney:view',
    'powers_of_attorney:create',
    'powers_of_attorney:edit',
    'powers_of_attorney:delete',
    'powers_of_attorney:export',
    
    // Documents - Full Access
    'documents:view',
    'documents:create',
    'documents:edit',
    'documents:delete',
    'documents:export',
    
    // Attendance - Full Access
    'attendance:view',
    'attendance:create',
    'attendance:edit',
    'attendance:delete',
    'attendance:export',
    
    // Admin Work - Full Access
    'admin_work:view',
    'admin_work:create',
    'admin_work:edit',
    'admin_work:delete',
    'admin_work:manage',
    
    // Contacts - Full Access
    'contacts:view',
    'contacts:create',
    'contacts:edit',
    'contacts:delete',
    'contacts:export'
  ],
  
  admin: [
    // Dashboard
    'dashboard:view',
    
    // Clients - Full Access
    'clients:view',
    'clients:create',
    'clients:edit',
    'clients:delete',
    'clients:export',
    'clients:import',
    
    // Cases - Full Access
    'cases:view',
    'cases:create',
    'cases:edit',
    'cases:delete',
    'cases:export',
    'cases:import',
    
    // Hearings - Full Access
    'hearings:view',
    'hearings:create',
    'hearings:edit',
    'hearings:delete',
    'hearings:export',
    
    // Invoices - Full Access
    'invoices:view',
    'invoices:create',
    'invoices:edit',
    'invoices:delete',
    'invoices:export',
    
    // Reports - Full Access
    'reports:view',
    'reports:export',
    
    // Users - Limited Management (no super_admin management)
    'users:view',
    'users:create',
    'users:edit',
    'users:delete',
    
    // System Settings - Limited Access
    'system_settings:view',
    'system_settings:edit',
    
    // Powers of Attorney - Full Access
    'powers_of_attorney:view',
    'powers_of_attorney:create',
    'powers_of_attorney:edit',
    'powers_of_attorney:delete',
    'powers_of_attorney:export',
    
    // Documents - Full Access
    'documents:view',
    'documents:create',
    'documents:edit',
    'documents:delete',
    'documents:export',
    
    // Attendance - Full Access
    'attendance:view',
    'attendance:create',
    'attendance:edit',
    'attendance:delete',
    'attendance:export',
    
    // Admin Work - Full Access
    'admin_work:view',
    'admin_work:create',
    'admin_work:edit',
    'admin_work:delete',
    'admin_work:manage',
    
    // Contacts - Full Access
    'contacts:view',
    'contacts:create',
    'contacts:edit',
    'contacts:delete',
    'contacts:export'
  ],
  
  lawyer: [
    // Dashboard
    'dashboard:view',
    
    // Clients - View and Limited Edit
    'clients:view',
    'clients:edit',
    'clients:export',
    
    // Cases - Full Access for assigned cases
    'cases:view',
    'cases:create',
    'cases:edit',
    'cases:export',
    
    // Hearings - Full Access for assigned cases
    'hearings:view',
    'hearings:create',
    'hearings:edit',
    'hearings:export',
    
    // Invoices - View and Create
    'invoices:view',
    'invoices:create',
    'invoices:edit',
    
    // Reports - View Only
    'reports:view',
    'reports:export',
    
    // Powers of Attorney - View and Edit
    'powers_of_attorney:view',
    'powers_of_attorney:create',
    'powers_of_attorney:edit',
    'powers_of_attorney:export',
    
    // Documents - Full Access
    'documents:view',
    'documents:create',
    'documents:edit',
    'documents:export',
    
    // Attendance - View Own Only
    'attendance:view',
    'attendance:create',
    
    // Admin Work - View and Create
    'admin_work:view',
    'admin_work:create',
    'admin_work:edit',
    
    // Contacts - View and Edit
    'contacts:view',
    'contacts:create',
    'contacts:edit'
  ],
  
  staff: [
    // Dashboard
    'dashboard:view',
    
    // Clients - View Only
    'clients:view',
    'clients:export',
    
    // Cases - View Only
    'cases:view',
    'cases:export',
    
    // Hearings - View Only
    'hearings:view',
    'hearings:export',
    
    // Invoices - View Only
    'invoices:view',
    'invoices:export',
    
    // Reports - View Only
    'reports:view',
    'reports:export',
    
    // Powers of Attorney - View Only
    'powers_of_attorney:view',
    'powers_of_attorney:export',
    
    // Documents - View Only
    'documents:view',
    'documents:export',
    
    // Attendance - View Only
    'attendance:view',
    
    // Admin Work - View Only
    'admin_work:view',
    
    // Contacts - View Only
    'contacts:view',
    'contacts:export'
  ]
}

// Role Display Names
export const ROLE_DISPLAY_NAMES: Record<UserRole, { ar: string; en: string }> = {
  super_admin: { ar: 'مدير عام', en: 'Super Administrator' },
  admin: { ar: 'مدير', en: 'Administrator' },
  lawyer: { ar: 'محامي', en: 'Lawyer' },
  staff: { ar: 'موظف', en: 'Staff Member' }
}

// Permission Display Names
export const PERMISSION_DISPLAY_NAMES: Record<Permission, { ar: string; en: string }> = {
  'dashboard:view': { ar: 'عرض لوحة التحكم', en: 'View Dashboard' },
  
  'clients:view': { ar: 'عرض العملاء', en: 'View Clients' },
  'clients:create': { ar: 'إضافة عملاء', en: 'Create Clients' },
  'clients:edit': { ar: 'تعديل العملاء', en: 'Edit Clients' },
  'clients:delete': { ar: 'حذف العملاء', en: 'Delete Clients' },
  'clients:export': { ar: 'تصدير العملاء', en: 'Export Clients' },
  'clients:import': { ar: 'استيراد العملاء', en: 'Import Clients' },
  
  'cases:view': { ar: 'عرض القضايا', en: 'View Cases' },
  'cases:create': { ar: 'إضافة قضايا', en: 'Create Cases' },
  'cases:edit': { ar: 'تعديل القضايا', en: 'Edit Cases' },
  'cases:delete': { ar: 'حذف القضايا', en: 'Delete Cases' },
  'cases:export': { ar: 'تصدير القضايا', en: 'Export Cases' },
  'cases:import': { ar: 'استيراد القضايا', en: 'Import Cases' },
  
  'hearings:view': { ar: 'عرض الجلسات', en: 'View Hearings' },
  'hearings:create': { ar: 'إضافة جلسات', en: 'Create Hearings' },
  'hearings:edit': { ar: 'تعديل الجلسات', en: 'Edit Hearings' },
  'hearings:delete': { ar: 'حذف الجلسات', en: 'Delete Hearings' },
  'hearings:export': { ar: 'تصدير الجلسات', en: 'Export Hearings' },
  
  'invoices:view': { ar: 'عرض الفواتير', en: 'View Invoices' },
  'invoices:create': { ar: 'إضافة فواتير', en: 'Create Invoices' },
  'invoices:edit': { ar: 'تعديل الفواتير', en: 'Edit Invoices' },
  'invoices:delete': { ar: 'حذف الفواتير', en: 'Delete Invoices' },
  'invoices:export': { ar: 'تصدير الفواتير', en: 'Export Invoices' },
  
  'reports:view': { ar: 'عرض التقارير', en: 'View Reports' },
  'reports:export': { ar: 'تصدير التقارير', en: 'Export Reports' },
  
  'users:view': { ar: 'عرض المستخدمين', en: 'View Users' },
  'users:create': { ar: 'إضافة مستخدمين', en: 'Create Users' },
  'users:edit': { ar: 'تعديل المستخدمين', en: 'Edit Users' },
  'users:delete': { ar: 'حذف المستخدمين', en: 'Delete Users' },
  'users:manage': { ar: 'إدارة المستخدمين', en: 'Manage Users' },
  
  'system_settings:view': { ar: 'عرض إعدادات النظام', en: 'View System Settings' },
  'system_settings:edit': { ar: 'تعديل إعدادات النظام', en: 'Edit System Settings' },
  'system_settings:manage': { ar: 'إدارة إعدادات النظام', en: 'Manage System Settings' },
  
  'powers_of_attorney:view': { ar: 'عرض التوكيلات', en: 'View Powers of Attorney' },
  'powers_of_attorney:create': { ar: 'إضافة توكيلات', en: 'Create Powers of Attorney' },
  'powers_of_attorney:edit': { ar: 'تعديل التوكيلات', en: 'Edit Powers of Attorney' },
  'powers_of_attorney:delete': { ar: 'حذف التوكيلات', en: 'Delete Powers of Attorney' },
  'powers_of_attorney:export': { ar: 'تصدير التوكيلات', en: 'Export Powers of Attorney' },
  
  'documents:view': { ar: 'عرض المستندات', en: 'View Documents' },
  'documents:create': { ar: 'إضافة مستندات', en: 'Create Documents' },
  'documents:edit': { ar: 'تعديل المستندات', en: 'Edit Documents' },
  'documents:delete': { ar: 'حذف المستندات', en: 'Delete Documents' },
  'documents:export': { ar: 'تصدير المستندات', en: 'Export Documents' },
  
  'attendance:view': { ar: 'عرض الحضور', en: 'View Attendance' },
  'attendance:create': { ar: 'إضافة حضور', en: 'Create Attendance' },
  'attendance:edit': { ar: 'تعديل الحضور', en: 'Edit Attendance' },
  'attendance:delete': { ar: 'حذف الحضور', en: 'Delete Attendance' },
  'attendance:export': { ar: 'تصدير الحضور', en: 'Export Attendance' },
  
  'admin_work:view': { ar: 'عرض العمل الإداري', en: 'View Admin Work' },
  'admin_work:create': { ar: 'إضافة عمل إداري', en: 'Create Admin Work' },
  'admin_work:edit': { ar: 'تعديل العمل الإداري', en: 'Edit Admin Work' },
  'admin_work:delete': { ar: 'حذف العمل الإداري', en: 'Delete Admin Work' },
  'admin_work:manage': { ar: 'إدارة العمل الإداري', en: 'Manage Admin Work' },
  
  'contacts:view': { ar: 'عرض جهات الاتصال', en: 'View Contacts' },
  'contacts:create': { ar: 'إضافة جهات اتصال', en: 'Create Contacts' },
  'contacts:edit': { ar: 'تعديل جهات الاتصال', en: 'Edit Contacts' },
  'contacts:delete': { ar: 'حذف جهات الاتصال', en: 'Delete Contacts' },
  'contacts:export': { ar: 'تصدير جهات الاتصال', en: 'Export Contacts' }
}

// Helper functions
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false
}

export const hasRole = (userRole: UserRole, allowedRoles: UserRole | UserRole[]): boolean => {
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole)
  }
  return userRole === allowedRoles
}

export const canAccess = (userRole: UserRole, resource: Resource, action: Action): boolean => {
  const permission: Permission = `${resource}:${action}`
  return hasPermission(userRole, permission)
}

export const getRoleDisplayName = (role: UserRole, language: 'ar' | 'en' = 'ar'): string => {
  return ROLE_DISPLAY_NAMES[role][language]
}

export const getPermissionDisplayName = (permission: Permission, language: 'ar' | 'en' = 'ar'): string => {
  return PERMISSION_DISPLAY_NAMES[permission][language]
}
