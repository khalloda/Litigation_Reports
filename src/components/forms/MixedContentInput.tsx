import React, { useState, useEffect, useRef } from 'react'
import { FormControl } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useRTL } from '@hooks/useRTL'
import { useLanguage } from '@hooks/useLanguage'
import { getTextDirection, hasMixedContent, getInputDirection } from '@utils/mixedContent'
import clsx from 'clsx'

interface MixedContentInputProps {
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  maxLength?: number
  'aria-label'?: string
  'aria-describedby'?: string
}

export function MixedContentInput({
  value,
  onChange,
  type = 'text',
  placeholder,
  className,
  disabled = false,
  required = false,
  maxLength,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy
}: MixedContentInputProps) {
  const { t } = useTranslation()
  const { isRTL } = useRTL()
  const { currentLanguage } = useLanguage()
  const [inputDirection, setInputDirection] = useState<'ltr' | 'rtl' | 'auto'>('auto')
  const [isMixed, setIsMixed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Determine input direction based on field type and content
  useEffect(() => {
    const direction = getInputDirection(type, value)
    setInputDirection(direction)
    
    // Check for mixed content
    const hasMixed = hasMixedContent(value)
    setIsMixed(hasMixed)
    
    // Update input attributes
    if (inputRef.current) {
      inputRef.current.dir = direction
      
      // Add data attributes for styling
      if (hasMixed) {
        inputRef.current.setAttribute('data-mixed-content', 'true')
      } else {
        inputRef.current.removeAttribute('data-mixed-content')
      }
    }
  }, [type, value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Update direction based on first character
    if (newValue.length > 0) {
      const direction = getTextDirection(newValue)
      setInputDirection(direction)
    }
  }

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.setAttribute('data-focused', 'true')
    }
  }

  const handleBlur = () => {
    if (inputRef.current) {
      inputRef.current.removeAttribute('data-focused')
    }
  }

  // Get placeholder text based on language
  const getPlaceholder = () => {
    if (placeholder) return placeholder
    
    if (type === 'email') {
      return currentLanguage === 'ar' ? 'example@domain.com' : 'example@domain.com'
    }
    
    if (type === 'tel') {
      return currentLanguage === 'ar' ? '+966501234567' : '+1234567890'
    }
    
    return currentLanguage === 'ar' ? 'أدخل النص هنا...' : 'Enter text here...'
  }

  return (
    <FormControl
      ref={inputRef}
      type={type}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={getPlaceholder()}
      className={clsx(
        'mixed-content-input',
        isMixed && 'mixed-content',
        className
      )}
      disabled={disabled}
      required={required}
      maxLength={maxLength}
      dir={inputDirection}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      data-field-type={type}
      data-language={currentLanguage}
      data-direction={inputDirection}
    />
  )
}
