import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from '@components/auth/AuthProvider';
import { ProtectedRoute } from '@components/auth/ProtectedRoute';
import { Layout } from '@components/layout/Layout';
import { Login } from '@pages/auth/Login';
import { Dashboard } from '@pages/Dashboard';
import { Clients } from '@pages/Clients';
import { Cases } from '@pages/Cases';
import { Hearings } from '@pages/Hearings';
import { Invoices } from '@pages/Invoices';
import { Reports } from '@pages/Reports';
import { Settings } from '@pages/Settings';
import { Users } from '@pages/Users';
import { NotFound } from '@pages/NotFound';
import { useRTL } from '@hooks/useRTL';
import { useLanguage } from '@hooks/useLanguage';

function App() {
  const { i18n } = useTranslation();
  const { setDirection } = useRTL();
  const { currentLanguage } = useLanguage();

  // Set document direction based on language
  useEffect(() => {
    const direction = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    setDirection(direction);

    // Update document attributes
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = direction;

    // Update i18n language
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage, setDirection, i18n]);

  return (
    <AuthProvider>
      <div className='app' dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Routes>
          {/* Public routes */}
          <Route path='/login' element={<Login />} />

          {/* Protected routes */}
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to='/dashboard' replace />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='clients' element={<Clients />} />
            <Route path='clients/new' element={<Clients />} />
            <Route path='clients/:id' element={<Clients />} />
            <Route path='clients/:id/edit' element={<Clients />} />
            <Route path='cases' element={<Cases />} />
            <Route path='cases/new' element={<Cases />} />
            <Route path='cases/:id' element={<Cases />} />
            <Route path='cases/:id/edit' element={<Cases />} />
            <Route path='hearings' element={<Hearings />} />
            <Route path='hearings/new' element={<Hearings />} />
            <Route path='hearings/:id' element={<Hearings />} />
            <Route path='hearings/:id/edit' element={<Hearings />} />
            <Route path='invoices' element={<Invoices />} />
            <Route path='invoices/new' element={<Invoices />} />
            <Route path='invoices/:id' element={<Invoices />} />
            <Route path='invoices/:id/edit' element={<Invoices />} />
            <Route path='reports' element={<Reports />} />
            <Route path='settings' element={<Settings />} />
            <Route path='users' element={<Users />} />
          </Route>

          {/* 404 route */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
