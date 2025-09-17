import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

type SupportedLanguage = 'ar' | 'en'

interface UseLanguageReturn {
  currentLanguage: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => void
  toggleLanguage: () => void
  isArabic: boolean
  isEnglish: boolean
}

/**
 * Hook for managing language state and RTL direction
 * Integrates with i18next for internationalization
 */
export function useLanguage(): UseLanguageReturn {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    (localStorage.getItem('language') as SupportedLanguage) || 'ar'
  )

  const setLanguage = useCallback((language: SupportedLanguage) => {
    setCurrentLanguage(language)
    localStorage.setItem('language', language)

    // Only call i18n.changeLanguage if it's available
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(language)
    }

    // Update document language
    document.documentElement.lang = language

    // Trigger custom event for RTL hook to listen to
    window.dispatchEvent(new CustomEvent('languageChange', {
      detail: { language }
    }))
  }, [i18n])

  const toggleLanguage = useCallback(() => {
    const newLanguage = currentLanguage === 'ar' ? 'en' : 'ar'
    setLanguage(newLanguage)
  }, [currentLanguage, setLanguage])

  const isArabic = currentLanguage === 'ar'
  const isEnglish = currentLanguage === 'en'

  // Initialize language on mount
  useEffect(() => {
    if (i18n && typeof i18n.changeLanguage === 'function' && i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage)
    }
  }, [i18n, currentLanguage])

  // Listen for external language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const { language } = event.detail
      if (language !== currentLanguage) {
        setCurrentLanguage(language)
      }
    }

    window.addEventListener('languageChange', handleLanguageChange as EventListener)
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener)
    }
  }, [currentLanguage])

  return {
    currentLanguage,
    setLanguage,
    toggleLanguage,
    isArabic,
    isEnglish
  }
}
