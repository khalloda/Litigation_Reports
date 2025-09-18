import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@hooks/usePermissions';
import { PermissionGate, SuperAdminGate } from '@components/auth/PermissionGate';
import { RoleManagement } from '@components/admin/RoleManagement';
import {
  Settings as SettingsIcon,
  Shield,
  User,
  Globe,
  Database,
  Bell,
  Palette,
  Lock,
} from 'lucide-react';

export function Settings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');

  const settingsTabs = [
    { key: 'general', title: 'عام', icon: SettingsIcon, permission: 'system_settings:view' },
    { key: 'roles', title: 'الأدوار والصلاحيات', icon: Shield, permission: 'users:manage' },
    { key: 'profile', title: 'الملف الشخصي', icon: User, permission: 'system_settings:view' },
    { key: 'language', title: 'اللغة', icon: Globe, permission: 'system_settings:view' },
    {
      key: 'database',
      title: 'قاعدة البيانات',
      icon: Database,
      permission: 'system_settings:manage',
    },
    { key: 'notifications', title: 'الإشعارات', icon: Bell, permission: 'system_settings:edit' },
    { key: 'appearance', title: 'المظهر', icon: Palette, permission: 'system_settings:edit' },
    { key: 'security', title: 'الأمان', icon: Lock, permission: 'system_settings:manage' },
  ];

  return (
    <Container fluid className='py-4'>
      <Row>
        <Col>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <div>
              <h2 className='mb-1'>
                <SettingsIcon className='me-2' />
                الإعدادات
              </h2>
              <p className='text-muted mb-0'>Settings</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'general')}>
            <Row>
              <Col lg={3}>
                <Card>
                  <Card.Body className='p-0'>
                    <Nav variant='pills' className='flex-column'>
                      {settingsTabs.map((tab) => (
                        <PermissionGate key={tab.key} requiredPermission={tab.permission as any}>
                          <Nav.Item>
                            <Nav.Link eventKey={tab.key} className='d-flex align-items-center'>
                              <tab.icon size={16} className='me-2' />
                              {tab.title}
                            </Nav.Link>
                          </Nav.Item>
                        </PermissionGate>
                      ))}
                    </Nav>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={9}>
                <Tab.Content>
                  <Tab.Pane eventKey='general'>
                    <Card>
                      <Card.Header>
                        <h5 className='mb-0'>الإعدادات العامة</h5>
                      </Card.Header>
                      <Card.Body>
                        <p>General system settings will be implemented here.</p>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane eventKey='roles'>
                    <RoleManagement />
                  </Tab.Pane>

                  <Tab.Pane eventKey='profile'>
                    <Card>
                      <Card.Header>
                        <h5 className='mb-0'>الملف الشخصي</h5>
                      </Card.Header>
                      <Card.Body>
                        <p>User profile settings will be implemented here.</p>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane eventKey='language'>
                    <Card>
                      <Card.Header>
                        <h5 className='mb-0'>إعدادات اللغة</h5>
                      </Card.Header>
                      <Card.Body>
                        <p>Language and localization settings will be implemented here.</p>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane eventKey='database'>
                    <SuperAdminGate>
                      <Card>
                        <Card.Header>
                          <h5 className='mb-0'>إعدادات قاعدة البيانات</h5>
                        </Card.Header>
                        <Card.Body>
                          <p>Database management settings (Super Admin only).</p>
                        </Card.Body>
                      </Card>
                    </SuperAdminGate>
                  </Tab.Pane>

                  <Tab.Pane eventKey='notifications'>
                    <Card>
                      <Card.Header>
                        <h5 className='mb-0'>إعدادات الإشعارات</h5>
                      </Card.Header>
                      <Card.Body>
                        <p>Notification settings will be implemented here.</p>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane eventKey='appearance'>
                    <Card>
                      <Card.Header>
                        <h5 className='mb-0'>إعدادات المظهر</h5>
                      </Card.Header>
                      <Card.Body>
                        <p>Appearance and theme settings will be implemented here.</p>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane eventKey='security'>
                    <SuperAdminGate>
                      <Card>
                        <Card.Header>
                          <h5 className='mb-0'>إعدادات الأمان</h5>
                        </Card.Header>
                        <Card.Body>
                          <p>Security settings (Super Admin only).</p>
                        </Card.Body>
                      </Card>
                    </SuperAdminGate>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
}
