import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '@components/auth/AuthProvider';
import { useLanguage } from '@hooks/useLanguage';
import { useRTL } from '@hooks/useRTL';
import { LanguageSwitcher } from '@components/ui/LanguageSwitcher';
import { UserMenu } from '@components/ui/UserMenu';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function Navbar({ onToggleSidebar, sidebarCollapsed }: NavbarProps) {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const { isRTL } = useRTL();

  return (
    <BootstrapNavbar
      bg='primary'
      variant='dark'
      expand='lg'
      className='navbar-custom'
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Container fluid>
        <Button
          variant='outline-light'
          size='sm'
          onClick={onToggleSidebar}
          className='me-3'
          aria-label='Toggle sidebar'
        >
          {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>

        <BootstrapNavbar.Brand href='/dashboard' className='fw-bold'>
          {currentLanguage === 'ar' ? 'نظام إدارة القضايا' : 'Litigation Management'}
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls='navbar-nav' />

        <BootstrapNavbar.Collapse id='navbar-nav'>
          <Nav className='ms-auto align-items-center'>
            <LanguageSwitcher />

            {user && <UserMenu user={user} />}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
