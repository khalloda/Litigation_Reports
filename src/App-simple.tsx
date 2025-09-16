/**
 * Simple App Component with Management Pages
 * 
 * A simplified version of the App component with routing for management pages.
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import CasesPage from './pages/CasesPage';
import ClientsPage from './pages/ClientsPage';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Gavel, Users, Home, LogOut } from 'lucide-react';

type Page = 'dashboard' | 'cases' | 'clients';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (isLoading) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'cases':
        return <CasesPage />;
      case 'clients':
        return <ClientsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app" dir="rtl">
      {/* Navigation */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container fluid>
          <Navbar.Brand href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('dashboard'); }}>
            <Gavel className="me-2" />
            نظام إدارة التقاضي
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                href="#" 
                onClick={(e) => { e.preventDefault(); setCurrentPage('dashboard'); }}
                className={currentPage === 'dashboard' ? 'active' : ''}
              >
                <Home className="me-1" size={16} />
                الرئيسية
              </Nav.Link>
              <Nav.Link 
                href="#" 
                onClick={(e) => { e.preventDefault(); setCurrentPage('cases'); }}
                className={currentPage === 'cases' ? 'active' : ''}
              >
                <Gavel className="me-1" size={16} />
                القضايا
              </Nav.Link>
              <Nav.Link 
                href="#" 
                onClick={(e) => { e.preventDefault(); setCurrentPage('clients'); }}
                className={currentPage === 'clients' ? 'active' : ''}
              >
                <Users className="me-1" size={16} />
                العملاء
              </Nav.Link>
            </Nav>
            
            <Nav>
              <NavDropdown 
                title={
                  <span>
                    <Users className="me-1" size={16} />
                    {user?.name || 'المستخدم'}
                  </span>
                } 
                id="user-dropdown"
              >
                <NavDropdown.Item href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
                  <LogOut className="me-1" size={16} />
                  تسجيل الخروج
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Page Content */}
      <Container fluid>
        {renderPage()}
      </Container>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
