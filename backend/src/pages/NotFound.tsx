import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRTL } from '@hooks/useRTL';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  return (
    <Container className='py-5' dir={isRTL ? 'rtl' : 'ltr'}>
      <Row className='justify-content-center'>
        <Col md={6} className='text-center'>
          <h1 className='display-1 text-muted'>404</h1>
          <h2 className='h4 mb-3'>{isRTL ? 'الصفحة غير موجودة' : 'Page Not Found'}</h2>
          <p className='text-muted mb-4'>
            {isRTL
              ? 'عذراً، الصفحة التي تبحث عنها غير موجودة.'
              : 'Sorry, the page you are looking for does not exist.'}
          </p>

          <div className='d-flex gap-2 justify-content-center'>
            <Link to='/dashboard' className='btn btn-primary'>
              <Home size={16} className='me-1' />
              {isRTL ? 'العودة للرئيسية' : 'Go Home'}
            </Link>

            <button onClick={() => window.history.back()} className='btn btn-outline-secondary'>
              <ArrowLeft size={16} className='me-1' />
              {isRTL ? 'العودة للخلف' : 'Go Back'}
            </button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
