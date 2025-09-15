import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { ar } from './locales/ar'
import { en } from './locales/en'

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: ar
      },
      en: {
        translation: en
      }
    },
    lng: localStorage.getItem('language') || 'ar', // Default to Arabic
    fallbackLng: 'ar',
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    // RTL support
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // React specific options
    react: {
      useSuspense: false
    }
  })

export default i18n
