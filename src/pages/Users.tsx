/**
 * User Management Page
 * Litigation Management System
 */

import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert } from 'react-bootstrap'
import { usePermissions } from '@hooks/usePermissions'
import { PermissionGate, AdminGate, SuperAdminGate, CanManageUsersGate } from '@components/auth/PermissionGate'
import { ProtectedRoute } from '@components/auth/ProtectedRoute'
import { User, UserRole, getRoleDisplayName } from '@types/auth'
import { Plus, Edit, Trash2, Eye, Shield, User as UserIcon, Users as UsersIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Users() {
  const { t } = useTranslation()
  const {
    canViewUsers,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    canManageUsers,
    isSuperAdmin,
    isAdmin
  } = usePermissions()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name_ar: '',
    full_name_en: '',
    role: 'staff' as UserRole,
    password: ''
  })
  const [errors, setErrors] = useState<string[]>([])

  // Fetch users
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@litigation.com',
          full_name_ar: 'مدير النظام',
          full_name_en: 'System Administrator',
          role: 'super_admin',
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          username: 'lawyer1',
          email: 'lawyer1@litigation.com',
          full_name_ar: 'أحمد محمد',
          full_name_en: 'Ahmed Mohamed',
          role: 'lawyer',
          is_active: true,
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z'
        },
        {
          id: 3,
          username: 'staff1',
          email: 'staff1@litigation.com',
          full_name_ar: 'فاطمة علي',
          full_name_en: 'Fatima Ali',
          role: 'staff',
          is_active: true,
          created_at: '2024-01-03T00:00:00Z',
          updated_at: '2024-01-03T00:00:00Z'
        }
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = () => {
    setEditingUser(null)
    setFormData({
      username: '',
      email: '',
      full_name_ar: '',
      full_name_en: '',
      role: 'staff',
      password: ''
    })
    setErrors([])
    setShowModal(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      full_name_ar: user.full_name_ar,
      full_name_en: user.full_name_en,
      role: user.role,
      password: ''
    })
    setErrors([])
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    // Validation
    const newErrors: string[] = []
    if (!formData.username) newErrors.push('Username is required')
    if (!formData.email) newErrors.push('Email is required')
    if (!formData.full_name_ar) newErrors.push('Arabic name is required')
    if (!formData.full_name_en) newErrors.push('English name is required')
    if (!editingUser && !formData.password) newErrors.push('Password is required')

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // Here you would make API calls to create/update user
      console.log('Saving user:', formData)
      
      // Mock success
      setShowModal(false)
      fetchUsers()
    } catch (error) {
      setErrors(['Failed to save user'])
    }
  }

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete user ${user.username}?`)) {
      try {
        // Here you would make API call to delete user
        console.log('Deleting user:', user.id)
        fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'danger'
      case 'admin': return 'warning'
      case 'lawyer': return 'primary'
      case 'staff': return 'secondary'
      default: return 'secondary'
    }
  }

  if (!canViewUsers) {
    return (
      <Container>
        <Alert variant="warning">
          <Shield className="me-2" />
          You don't have permission to view users.
        </Alert>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">
                <UsersIcon className="me-2" />
                إدارة المستخدمين
              </h2>
              <p className="text-muted mb-0">User Management</p>
            </div>
            
            <PermissionGate requiredPermission="users:create">
              <Button 
                variant="primary" 
                onClick={handleCreateUser}
                className="d-flex align-items-center"
              >
                <Plus size={16} className="me-1" />
                إضافة مستخدم
              </Button>
            </PermissionGate>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">قائمة المستخدمين</h5>
              <Badge bg="primary">{users.length} مستخدم</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>المستخدم</th>
                      <th>البريد الإلكتروني</th>
                      <th>الاسم العربي</th>
                      <th>الاسم الإنجليزي</th>
                      <th>الدور</th>
                      <th>الحالة</th>
                      <th>آخر دخول</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <UserIcon size={16} className="me-2 text-muted" />
                            {user.username}
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.full_name_ar}</td>
                        <td>{user.full_name_en}</td>
                        <td>
                          <Badge bg={getRoleBadgeVariant(user.role)}>
                            {getRoleDisplayName(user.role, 'ar')}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={user.is_active ? 'success' : 'danger'}>
                            {user.is_active ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </td>
                        <td>
                          {user.last_login ? new Date(user.last_login).toLocaleDateString('ar-SA') : 'لم يسجل دخول'}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <PermissionGate requiredPermission="users:view">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                title="View User"
                              >
                                <Eye size={14} />
                              </Button>
                            </PermissionGate>
                            
                            <PermissionGate requiredPermission="users:edit">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                                title="Edit User"
                              >
                                <Edit size={14} />
                              </Button>
                            </PermissionGate>
                            
                            <PermissionGate requiredPermission="users:delete">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                                title="Delete User"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </PermissionGate>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors.length > 0 && (
            <Alert variant="danger">
              <ul className="mb-0">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>اسم المستخدم</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>البريد الإلكتروني</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>الاسم العربي</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.full_name_ar}
                    onChange={(e) => setFormData({ ...formData, full_name_ar: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>الاسم الإنجليزي</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.full_name_en}
                    onChange={(e) => setFormData({ ...formData, full_name_en: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>الدور</Form.Label>
                  <Form.Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  >
                    <option value="staff">موظف</option>
                    <option value="lawyer">محامي</option>
                    <option value="admin">مدير</option>
                    <SuperAdminGate>
                      <option value="super_admin">مدير عام</option>
                    </SuperAdminGate>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                {!editingUser && (
                  <Form.Group className="mb-3">
                    <Form.Label>كلمة المرور</Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingUser}
                    />
                  </Form.Group>
                )}
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إلغاء
          </Button>
          <PermissionGate requiredPermission="users:create">
            <Button variant="primary" onClick={handleSubmit}>
              {editingUser ? 'حفظ التغييرات' : 'إضافة المستخدم'}
            </Button>
          </PermissionGate>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
