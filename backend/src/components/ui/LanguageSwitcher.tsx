import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@hooks/useLanguage';
import { useRTL } from '@hooks/useRTL';
import { Globe, Check } from 'lucide-react';
import clsx from 'clsx';

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { currentLanguage, setLanguage, toggleLanguage } = useLanguage();
  const { isRTL } = useRTL();

  const languages = [
    {
      code: 'ar',
      name: 'العربية',
      nameEn: 'Arabic',
      flag: '🇸🇦',
    },
    {
      code: 'en',
      name: 'English',
      nameEn: 'English',
      flag: '🇺🇸',
    },
  ];

  const currentLang = languages.find((lang) => lang.code === currentLanguage);

  return (
    <Dropdown align={isRTL ? 'start' : 'end'}>
      <Dropdown.Toggle
        variant='outline-light'
        size='sm'
        className='d-flex align-items-center'
        id='language-switcher'
        aria-label={t('language.currentLanguage')}
      >
        <Globe size={16} className='me-1' />
        <span className='d-none d-md-inline'>
          {currentLang?.flag} {currentLang?.name}
        </span>
        <span className='d-md-none'>{currentLang?.flag}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu dir={isRTL ? 'rtl' : 'ltr'} className='language-dropdown'>
        {languages.map((lang) => (
          <Dropdown.Item
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'ar' | 'en')}
            className={clsx(
              'd-flex align-items-center justify-content-between',
              currentLanguage === lang.code && 'active'
            )}
            active={currentLanguage === lang.code}
          >
            <span className='d-flex align-items-center'>
              <span className='me-2'>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>

            {currentLanguage === lang.code && <Check size={16} className='text-primary' />}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
