import React from 'react'
import { Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useRTL } from '@hooks/useRTL'

export function Clients() {
  const { t } = useTranslation()
  const { isRTL } = useRTL()

  return (
    <Container fluid className="py-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1>{t('clients.title')}</h1>
      <p>Client management page - Coming soon...</p>
    </Container>
  )
}
