/**
 * Role Management Component
 * Litigation Management System
 */

import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { usePermissions } from '@hooks/usePermissions';
import { PermissionGate, SuperAdminGate } from '@components/auth/PermissionGate';
import { UserRole, ROLE_PERMISSIONS, ROLE_DISPLAY_NAMES, getRoleDisplayName } from '@types/auth';
import { Shield, Users, Settings, Eye, Edit, Save, X } from 'lucide-react';

export function RoleManagement() {
  const { isSuperAdmin } = usePermissions();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [editingPermissions, setEditingPermissions] = useState(false);
  const [modifiedPermissions, setModifiedPermissions] = useState<string[]>([]);

  const roles: UserRole[] = ['super_admin', 'admin', 'lawyer', 'staff'];

  const handleViewPermissions = (role: UserRole) => {
    setSelectedRole(role);
    setModifiedPermissions([...ROLE_PERMISSIONS[role]]);
    setShowPermissions(true);
    setEditingPermissions(false);
  };

  const handleEditPermissions = () => {
    setEditingPermissions(true);
  };

  const handleSavePermissions = () => {
    // Here you would save the modified permissions to the backend
    console.log('Saving permissions for role:', selectedRole, modifiedPermissions);
    setEditingPermissions(false);
  };

  const handleCancelEdit = () => {
    setModifiedPermissions([...ROLE_PERMISSIONS[selectedRole!]]);
    setEditingPermissions(false);
  };

  const togglePermission = (permission: string) => {
    if (editingPermissions) {
      setModifiedPermissions((prev) =>
        prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
      );
    }
  };

  const getPermissionCategory = (permission: string) => {
    const [resource] = permission.split(':');
    return resource;
  };

  const getPermissionAction = (permission: string) => {
    const [, action] = permission.split(':');
    return action;
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'view':
        return 'primary';
      case 'create':
        return 'success';
      case 'edit':
        return 'warning';
      case 'delete':
        return 'danger';
      case 'export':
        return 'info';
      case 'import':
        return 'secondary';
      case 'manage':
        return 'dark';
      default:
        return 'secondary';
    }
  };

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'dashboard':
        return '📊';
      case 'clients':
        return '👥';
      case 'cases':
        return '📋';
      case 'hearings':
        return '⚖️';
      case 'invoices':
        return '💰';
      case 'reports':
        return '📈';
      case 'users':
        return '👤';
      case 'system_settings':
        return '⚙️';
      case 'powers_of_attorney':
        return '📜';
      case 'documents':
        return '📄';
      case 'attendance':
        return '✅';
      case 'admin_work':
        return '🔧';
      case 'contacts':
        return '📞';
      default:
        return '📁';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'danger';
      case 'admin':
        return 'warning';
      case 'lawyer':
        return 'primary';
      case 'staff':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (!isSuperAdmin()) {
    return (
      <Alert variant='warning'>
        <Shield className='me-2' />
        Only Super Administrators can manage roles and permissions.
      </Alert>
    );
  }

  return (
    <div>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div>
          <h3 className='mb-1'>
            <Shield className='me-2' />
            إدارة الأدوار والصلاحيات
          </h3>
          <p className='text-muted mb-0'>Role and Permission Management</p>
        </div>
      </div>

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className='mb-0'>الأدوار المتاحة</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {roles.map((role) => (
                  <Col md={6} key={role} className='mb-3'>
                    <Card className='h-100'>
                      <Card.Body className='text-center'>
                        <div className='mb-3'>
                          <Badge bg={getRoleColor(role)} className='fs-6 px-3 py-2'>
                            {getRoleDisplayName(role, 'ar')}
                          </Badge>
                        </div>

                        <h6 className='text-muted mb-2'>{getRoleDisplayName(role, 'en')}</h6>

                        <p className='text-muted small mb-3'>
                          {ROLE_PERMISSIONS[role].length} صلاحية
                        </p>

                        <Button
                          variant='outline-primary'
                          size='sm'
                          onClick={() => handleViewPermissions(role)}
                          className='w-100'
                        >
                          <Eye size={16} className='me-1' />
                          عرض الصلاحيات
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className='mb-0'>إحصائيات الأدوار</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive size='sm'>
                <thead>
                  <tr>
                    <th>الدور</th>
                    <th>الصلاحيات</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role}>
                      <td>
                        <Badge bg={getRoleColor(role)}>{getRoleDisplayName(role, 'ar')}</Badge>
                      </td>
                      <td className='text-center'>
                        <strong>{ROLE_PERMISSIONS[role].length}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className='mt-3'>
            <Card.Header>
              <h5 className='mb-0'>معلومات النظام</h5>
            </Card.Header>
            <Card.Body>
              <div className='text-center'>
                <Settings size={32} className='text-primary mb-2' />
                <h6>نظام إدارة الصلاحيات</h6>
                <p className='text-muted small mb-0'>نظام متقدم لإدارة الأدوار والصلاحيات</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Permissions Modal */}
      <Modal show={showPermissions} onHide={() => setShowPermissions(false)} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>
            <Shield className='me-2' />
            صلاحيات {selectedRole && getRoleDisplayName(selectedRole, 'ar')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRole && (
            <div>
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <div>
                  <Badge bg={getRoleColor(selectedRole)} className='fs-6'>
                    {getRoleDisplayName(selectedRole, 'ar')}
                  </Badge>
                  <span className='ms-2 text-muted'>
                    ({getRoleDisplayName(selectedRole, 'en')})
                  </span>
                </div>

                <SuperAdminGate>
                  <div>
                    {!editingPermissions ? (
                      <Button variant='outline-primary' size='sm' onClick={handleEditPermissions}>
                        <Edit size={16} className='me-1' />
                        تعديل الصلاحيات
                      </Button>
                    ) : (
                      <div>
                        <Button
                          variant='success'
                          size='sm'
                          onClick={handleSavePermissions}
                          className='me-2'
                        >
                          <Save size={16} className='me-1' />
                          حفظ
                        </Button>
                        <Button variant='outline-secondary' size='sm' onClick={handleCancelEdit}>
                          <X size={16} className='me-1' />
                          إلغاء
                        </Button>
                      </div>
                    )}
                  </div>
                </SuperAdminGate>
              </div>

              {/* Group permissions by resource */}
              {Object.entries(
                modifiedPermissions.reduce(
                  (acc, permission) => {
                    const resource = getPermissionCategory(permission);
                    if (!acc[resource]) acc[resource] = [];
                    acc[resource].push(permission);
                    return acc;
                  },
                  {} as Record<string, string[]>
                )
              ).map(([resource, permissions]) => (
                <Card key={resource} className='mb-3'>
                  <Card.Header className='py-2'>
                    <div className='d-flex align-items-center'>
                      <span className='me-2'>{getResourceIcon(resource)}</span>
                      <strong className='text-capitalize'>{resource}</strong>
                      <Badge bg='secondary' className='ms-2'>
                        {permissions.length}
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body className='py-2'>
                    <div className='d-flex flex-wrap gap-2'>
                      {permissions.map((permission) => {
                        const action = getPermissionAction(permission);
                        const isSelected = modifiedPermissions.includes(permission);

                        return (
                          <Badge
                            key={permission}
                            bg={isSelected ? getActionColor(action) : 'light'}
                            text={isSelected ? 'white' : 'dark'}
                            className={`cursor-pointer ${editingPermissions ? 'hover-shadow' : ''}`}
                            style={{
                              cursor: editingPermissions ? 'pointer' : 'default',
                              transition: 'all 0.2s ease',
                            }}
                            onClick={() => togglePermission(permission)}
                          >
                            {action}
                          </Badge>
                        );
                      })}
                    </div>
                  </Card.Body>
                </Card>
              ))}

              {editingPermissions && (
                <Alert variant='info' className='mt-3'>
                  <strong>تعديل الصلاحيات:</strong> انقر على أي صلاحية لإضافةها أو إزالتها من هذا
                  الدور.
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowPermissions(false)}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
