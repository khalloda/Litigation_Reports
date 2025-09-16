/**
 * Status Check Component
 * 
 * Displays the current status of the application and API connectivity.
 */

import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const StatusCheck: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        const response = await apiService.healthCheck();
        setStatus(response);
        setError(null);
      } catch (err) {
        setError('Failed to connect to API');
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (loading) {
    return (
      <div className="alert alert-info">
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          جاري فحص حالة النظام...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning">
        <h6>تحذير: {error}</h6>
        <p className="mb-0">النظام يعمل في وضع البيانات الوهمية (Mock Data Mode)</p>
      </div>
    );
  }

  return (
    <div className="alert alert-success">
      <h6>✅ النظام يعمل بشكل طبيعي</h6>
      <p className="mb-0">
        الخادم: {status?.data?.server || 'Mock API'}<br />
        الإصدار: {status?.data?.version || '1.0.0'}<br />
        الوقت: {status?.data?.timestamp || new Date().toLocaleString('ar-SA')}
      </p>
    </div>
  );
};

export default StatusCheck;
