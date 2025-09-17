/**
 * Language Switcher Component
 *
 * Allows users to switch between Arabic and English languages.
 */

import React, { useState, useEffect } from 'react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
  size?: 'sm' | 'md';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'default',
  size = 'md'
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    // Check document direction to determine current language
    const htmlDir = document.documentElement.dir;
    setCurrentLanguage(htmlDir === 'rtl' ? 'ar' : 'en');
  }, []);

  const switchLanguage = (lang: 'ar' | 'en') => {
    setCurrentLanguage(lang);

    // Update document direction and language
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';

    // Store preference in localStorage
    localStorage.setItem('preferred-language', lang);

    // Trigger a custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  };

  if (variant === 'minimal') {
    return (
      <div
        className="language-switcher d-flex align-items-center gap-1"
        data-testid="language-switcher"
        role="group"
        aria-label="Language selector"
      >
        <button
          type="button"
          className={`btn btn-sm ${currentLanguage === 'ar' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => switchLanguage('ar')}
          data-lang="ar"
          aria-pressed={currentLanguage === 'ar'}
          title="العربية"
        >
          ع
        </button>
        <button
          type="button"
          className={`btn btn-sm ${currentLanguage === 'en' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => switchLanguage('en')}
          data-lang="en"
          aria-pressed={currentLanguage === 'en'}
          title="English"
        >
          En
        </button>
      </div>
    );
  }

  const buttonSize = size === 'sm' ? 'btn-sm' : '';

  return (
    <div
      className="language-switcher dropdown"
      data-testid="language-switcher"
    >
      <button
        className={`btn btn-outline-secondary dropdown-toggle ${buttonSize}`}
        type="button"
        id="languageDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Select language"
      >
        <span className="me-2">
          {currentLanguage === 'ar' ? '🇸🇦' : '🇺🇸'}
        </span>
        {currentLanguage === 'ar' ? 'العربية' : 'English'}
      </button>

      <ul className="dropdown-menu" aria-labelledby="languageDropdown">
        <li>
          <button
            className={`dropdown-item d-flex align-items-center ${currentLanguage === 'ar' ? 'active' : ''}`}
            type="button"
            onClick={() => switchLanguage('ar')}
            data-lang="ar"
          >
            <span className="me-2">🇸🇦</span>
            العربية
            {currentLanguage === 'ar' && (
              <i className="bi bi-check-lg ms-auto text-primary" />
            )}
          </button>
        </li>
        <li>
          <button
            className={`dropdown-item d-flex align-items-center ${currentLanguage === 'en' ? 'active' : ''}`}
            type="button"
            onClick={() => switchLanguage('en')}
            data-lang="en"
          >
            <span className="me-2">🇺🇸</span>
            English
            {currentLanguage === 'en' && (
              <i className="bi bi-check-lg ms-auto text-primary" />
            )}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;