/**
 * Simple App Component
 * 
 * A simplified version of the App component for testing the authentication system.
 */

import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

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

  return isAuthenticated ? <Dashboard /> : <LoginForm />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="app" dir="rtl">
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default App;
