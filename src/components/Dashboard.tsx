/**
 * Dashboard Component
 * 
 * Main dashboard for the litigation management system.
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StatusCheck from './StatusCheck';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            نظام إدارة التقاضي
          </a>
          
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user?.name || 'User'}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#" onClick={logout}>
                    تسجيل الخروج
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-12">
            <h1 className="h3 mb-4">لوحة التحكم</h1>
            <StatusCheck />
          </div>
        </div>

        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="card-title">العملاء</h4>
                    <h2 className="mb-0">0</h2>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-users fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="card-title">القضايا</h4>
                    <h2 className="mb-0">0</h2>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-gavel fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="card-title">الجلسات</h4>
                    <h2 className="mb-0">0</h2>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-calendar fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="card-title">الفواتير</h4>
                    <h2 className="mb-0">0</h2>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-file-invoice fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">مرحباً بك في نظام إدارة التقاضي</h5>
              </div>
              <div className="card-body">
                <p className="card-text">
                  مرحباً <strong>{user?.name}</strong>،
                </p>
                <p className="card-text">
                  تم تسجيل دخولك بنجاح إلى نظام إدارة التقاضي. يمكنك الآن إدارة العملاء والقضايا والجلسات والفواتير من خلال هذا النظام.
                </p>
                <p className="card-text">
                  <small className="text-muted">
                    دورك الحالي: <strong>{user?.role}</strong>
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
