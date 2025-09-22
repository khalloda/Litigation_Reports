import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ar } from './locales/ar';
import { en } from './locales/en';

// Initialize i18next
const initI18n = async () => {
  try {
    await i18n
      .use(initReactI18next)
      .init({
        resources: {
          ar: {
            translation: ar,
          },
          en: {
            translation: en,
          },
        },
        lng: localStorage.getItem('language') || 'ar', // Default to Arabic
        fallbackLng: 'ar',

        interpolation: {
          escapeValue: false, // React already escapes values
        },

        // React specific options
        react: {
          useSuspense: false,
        },

        // Namespace configuration
        defaultNS: 'translation',
        ns: ['translation'],

        // Additional options to prevent warnings
        initImmediate: false,
        load: 'languageOnly',

        // Debug mode for development
        debug: false,
      });

    console.log('i18next initialized successfully');
  } catch (error) {
    console.error('i18next initialization failed:', error);
  }
};

// Initialize immediately
initI18n();

export default i18n;
