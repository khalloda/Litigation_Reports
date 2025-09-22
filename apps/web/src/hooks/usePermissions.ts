/**
 * Permission Management Hook
 * Litigation Management System
 */

import { useAuth } from '@components/auth/AuthProvider';
import { Permission, Resource, Action, UserRole } from '@types/auth';

export const usePermissions = () => {
  const { user, hasPermission, hasRole, canAccess } = useAuth();

  // Check if user has specific permission
  const checkPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(permission);
  };

  // Check if user has specific role(s)
  const checkRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    return hasRole(role);
  };

  // Check if user can access specific resource with action
  const checkAccess = (resource: Resource, action: Action): boolean => {
    if (!user) return false;
    return canAccess(resource, action);
  };

  // Check multiple permissions (all must be true)
  const checkAllPermissions = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.every((permission) => hasPermission(permission));
  };

  // Check multiple permissions (any can be true)
  const checkAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.some((permission) => hasPermission(permission));
  };

  // Get user's role
  const getUserRole = (): UserRole | null => {
    return user?.role || null;
  };

  // Check if user is super admin
  const isSuperAdmin = (): boolean => {
    return checkRole('super_admin');
  };

  // Check if user is admin or super admin
  const isAdmin = (): boolean => {
    return checkRole(['admin', 'super_admin']);
  };

  // Check if user is lawyer or higher
  const isLawyer = (): boolean => {
    return checkRole(['lawyer', 'admin', 'super_admin']);
  };

  // Check if user is staff or higher
  const isStaff = (): boolean => {
    return checkRole(['staff', 'lawyer', 'admin', 'super_admin']);
  };

  // Permission shortcuts for common operations
  const canView = (resource: Resource): boolean => {
    return checkAccess(resource, 'view');
  };

  const canCreate = (resource: Resource): boolean => {
    return checkAccess(resource, 'create');
  };

  const canEdit = (resource: Resource): boolean => {
    return checkAccess(resource, 'edit');
  };

  const canDelete = (resource: Resource): boolean => {
    return checkAccess(resource, 'delete');
  };

  const canExport = (resource: Resource): boolean => {
    return checkAccess(resource, 'export');
  };

  const canImport = (resource: Resource): boolean => {
    return checkAccess(resource, 'import');
  };

  const canManage = (resource: Resource): boolean => {
    return checkAccess(resource, 'manage');
  };

  // Specific permission checks for common use cases
  const canManageUsers = (): boolean => {
    return checkPermission('users:manage');
  };

  const canManageSystemSettings = (): boolean => {
    return checkPermission('system_settings:manage');
  };

  const canDeleteUsers = (): boolean => {
    return checkPermission('users:delete');
  };

  const canCreateUsers = (): boolean => {
    return checkPermission('users:create');
  };

  const canEditUsers = (): boolean => {
    return checkPermission('users:edit');
  };

  const canViewUsers = (): boolean => {
    return checkPermission('users:view');
  };

  // Client permissions
  const canManageClients = (): boolean => {
    return checkAllPermissions([
      'clients:view',
      'clients:create',
      'clients:edit',
      'clients:delete',
    ]);
  };

  const canViewClients = (): boolean => {
    return checkPermission('clients:view');
  };

  const canCreateClients = (): boolean => {
    return checkPermission('clients:create');
  };

  const canEditClients = (): boolean => {
    return checkPermission('clients:edit');
  };

  const canDeleteClients = (): boolean => {
    return checkPermission('clients:delete');
  };

  const canExportClients = (): boolean => {
    return checkPermission('clients:export');
  };

  const canImportClients = (): boolean => {
    return checkPermission('clients:import');
  };

  // Case permissions
  const canManageCases = (): boolean => {
    return checkAllPermissions(['cases:view', 'cases:create', 'cases:edit', 'cases:delete']);
  };

  const canViewCases = (): boolean => {
    return checkPermission('cases:view');
  };

  const canCreateCases = (): boolean => {
    return checkPermission('cases:create');
  };

  const canEditCases = (): boolean => {
    return checkPermission('cases:edit');
  };

  const canDeleteCases = (): boolean => {
    return checkPermission('cases:delete');
  };

  const canExportCases = (): boolean => {
    return checkPermission('cases:export');
  };

  const canImportCases = (): boolean => {
    return checkPermission('cases:import');
  };

  // Hearing permissions
  const canManageHearings = (): boolean => {
    return checkAllPermissions([
      'hearings:view',
      'hearings:create',
      'hearings:edit',
      'hearings:delete',
    ]);
  };

  const canViewHearings = (): boolean => {
    return checkPermission('hearings:view');
  };

  const canCreateHearings = (): boolean => {
    return checkPermission('hearings:create');
  };

  const canEditHearings = (): boolean => {
    return checkPermission('hearings:edit');
  };

  const canDeleteHearings = (): boolean => {
    return checkPermission('hearings:delete');
  };

  const canExportHearings = (): boolean => {
    return checkPermission('hearings:export');
  };

  // Invoice permissions
  const canManageInvoices = (): boolean => {
    return checkAllPermissions([
      'invoices:view',
      'invoices:create',
      'invoices:edit',
      'invoices:delete',
    ]);
  };

  const canViewInvoices = (): boolean => {
    return checkPermission('invoices:view');
  };

  const canCreateInvoices = (): boolean => {
    return checkPermission('invoices:create');
  };

  const canEditInvoices = (): boolean => {
    return checkPermission('invoices:edit');
  };

  const canDeleteInvoices = (): boolean => {
    return checkPermission('invoices:delete');
  };

  const canExportInvoices = (): boolean => {
    return checkPermission('invoices:export');
  };

  // Lawyer permissions
  const canManageLawyers = (): boolean => {
    return checkAllPermissions([
      'lawyers:view',
      'lawyers:create',
      'lawyers:edit',
      'lawyers:delete',
    ]);
  };

  const canViewLawyers = (): boolean => {
    return checkPermission('lawyers:view');
  };

  const canCreateLawyers = (): boolean => {
    return checkPermission('lawyers:create');
  };

  const canEditLawyers = (): boolean => {
    return checkPermission('lawyers:edit');
  };

  const canDeleteLawyers = (): boolean => {
    return checkPermission('lawyers:delete');
  };

  const canExportLawyers = (): boolean => {
    return checkPermission('lawyers:export');
  };

  // Report permissions
  const canViewReports = (): boolean => {
    return checkPermission('reports:view');
  };

  const canExportReports = (): boolean => {
    return checkPermission('reports:export');
  };

  // Dashboard permissions
  const canViewDashboard = (): boolean => {
    return checkPermission('dashboard:view');
  };

  // Document permissions
  const canManageDocuments = (): boolean => {
    return checkAllPermissions([
      'documents:view',
      'documents:create',
      'documents:edit',
      'documents:delete',
    ]);
  };

  const canViewDocuments = (): boolean => {
    return checkPermission('documents:view');
  };

  const canCreateDocuments = (): boolean => {
    return checkPermission('documents:create');
  };

  const canEditDocuments = (): boolean => {
    return checkPermission('documents:edit');
  };

  const canDeleteDocuments = (): boolean => {
    return checkPermission('documents:delete');
  };

  const canExportDocuments = (): boolean => {
    return checkPermission('documents:export');
  };

  // Power of Attorney permissions
  const canManagePowersOfAttorney = (): boolean => {
    return checkAllPermissions([
      'powers_of_attorney:view',
      'powers_of_attorney:create',
      'powers_of_attorney:edit',
      'powers_of_attorney:delete',
    ]);
  };

  const canViewPowersOfAttorney = (): boolean => {
    return checkPermission('powers_of_attorney:view');
  };

  const canCreatePowersOfAttorney = (): boolean => {
    return checkPermission('powers_of_attorney:create');
  };

  const canEditPowersOfAttorney = (): boolean => {
    return checkPermission('powers_of_attorney:edit');
  };

  const canDeletePowersOfAttorney = (): boolean => {
    return checkPermission('powers_of_attorney:delete');
  };

  const canExportPowersOfAttorney = (): boolean => {
    return checkPermission('powers_of_attorney:export');
  };

  // Attendance permissions
  const canManageAttendance = (): boolean => {
    return checkAllPermissions([
      'attendance:view',
      'attendance:create',
      'attendance:edit',
      'attendance:delete',
    ]);
  };

  const canViewAttendance = (): boolean => {
    return checkPermission('attendance:view');
  };

  const canCreateAttendance = (): boolean => {
    return checkPermission('attendance:create');
  };

  const canEditAttendance = (): boolean => {
    return checkPermission('attendance:edit');
  };

  const canDeleteAttendance = (): boolean => {
    return checkPermission('attendance:delete');
  };

  const canExportAttendance = (): boolean => {
    return checkPermission('attendance:export');
  };

  // Admin Work permissions
  const canManageAdminWork = (): boolean => {
    return checkAllPermissions([
      'admin_work:view',
      'admin_work:create',
      'admin_work:edit',
      'admin_work:delete',
      'admin_work:manage',
    ]);
  };

  const canViewAdminWork = (): boolean => {
    return checkPermission('admin_work:view');
  };

  const canCreateAdminWork = (): boolean => {
    return checkPermission('admin_work:create');
  };

  const canEditAdminWork = (): boolean => {
    return checkPermission('admin_work:edit');
  };

  const canDeleteAdminWork = (): boolean => {
    return checkPermission('admin_work:delete');
  };

  const canManageAdminWorkTasks = (): boolean => {
    return checkPermission('admin_work:manage');
  };

  // Contact permissions
  const canManageContacts = (): boolean => {
    return checkAllPermissions([
      'contacts:view',
      'contacts:create',
      'contacts:edit',
      'contacts:delete',
    ]);
  };

  const canViewContacts = (): boolean => {
    return checkPermission('contacts:view');
  };

  const canCreateContacts = (): boolean => {
    return checkPermission('contacts:create');
  };

  const canEditContacts = (): boolean => {
    return checkPermission('contacts:edit');
  };

  const canDeleteContacts = (): boolean => {
    return checkPermission('contacts:delete');
  };

  const canExportContacts = (): boolean => {
    return checkPermission('contacts:export');
  };

  return {
    // Basic permission checks
    checkPermission,
    checkRole,
    checkAccess,
    checkAllPermissions,
    checkAnyPermission,

    // User role checks
    getUserRole,
    isSuperAdmin,
    isAdmin,
    isLawyer,
    isStaff,

    // Generic CRUD operations
    canView,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    canImport,
    canManage,

    // User management
    canManageUsers,
    canManageSystemSettings,
    canDeleteUsers,
    canCreateUsers,
    canEditUsers,
    canViewUsers,

    // Client management
    canManageClients,
    canViewClients,
    canCreateClients,
    canEditClients,
    canDeleteClients,
    canExportClients,
    canImportClients,

    // Case management
    canManageCases,
    canViewCases,
    canCreateCases,
    canEditCases,
    canDeleteCases,
    canExportCases,
    canImportCases,

    // Hearing management
    canManageHearings,
    canViewHearings,
    canCreateHearings,
    canEditHearings,
    canDeleteHearings,
    canExportHearings,

    // Invoice management
    canManageInvoices,
    canViewInvoices,
    canCreateInvoices,
    canEditInvoices,
    canDeleteInvoices,
    canExportInvoices,

    // Lawyer management
    canManageLawyers,
    canViewLawyers,
    canCreateLawyers,
    canEditLawyers,
    canDeleteLawyers,
    canExportLawyers,

    // Reports
    canViewReports,
    canExportReports,

    // Dashboard
    canViewDashboard,

    // Document management
    canManageDocuments,
    canViewDocuments,
    canCreateDocuments,
    canEditDocuments,
    canDeleteDocuments,
    canExportDocuments,

    // Power of Attorney management
    canManagePowersOfAttorney,
    canViewPowersOfAttorney,
    canCreatePowersOfAttorney,
    canEditPowersOfAttorney,
    canDeletePowersOfAttorney,
    canExportPowersOfAttorney,

    // Attendance management
    canManageAttendance,
    canViewAttendance,
    canCreateAttendance,
    canEditAttendance,
    canDeleteAttendance,
    canExportAttendance,

    // Admin Work management
    canManageAdminWork,
    canViewAdminWork,
    canCreateAdminWork,
    canEditAdminWork,
    canDeleteAdminWork,
    canManageAdminWorkTasks,

    // Contact management
    canManageContacts,
    canViewContacts,
    canCreateContacts,
    canEditContacts,
    canDeleteContacts,
    canExportContacts,
  };
};
