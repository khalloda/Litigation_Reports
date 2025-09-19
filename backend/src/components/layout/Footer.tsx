import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRTL } from '@hooks/useRTL';
import { useLanguage } from '@hooks/useLanguage';

export function Footer() {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const { currentLanguage } = useLanguage();

  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer bg-light border-top mt-auto' dir={isRTL ? 'rtl' : 'ltr'}>
      <Container fluid className='py-3'>
        <Row className='align-items-center'>
          <Col md={6}>
            <small className='text-muted'>
              {currentLanguage === 'ar'
                ? `© ${currentYear} مكتب المحاماة. جميع الحقوق محفوظة.`
                : `© ${currentYear} Law Office. All rights reserved.`}
            </small>
          </Col>

          <Col md={6} className='text-md-end'>
            <small className='text-muted'>
              {currentLanguage === 'ar'
                ? 'نظام إدارة القضايا القانونية v1.0'
                : 'Litigation Management System v1.0'}
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
