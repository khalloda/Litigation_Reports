import React, { useState, useEffect, useRef } from 'react';
import { FormControl } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRTL } from '@hooks/useRTL';
import { useLanguage } from '@hooks/useLanguage';
import { getTextDirection, hasMixedContent } from '@utils/mixedContent';
import clsx from 'clsx';

interface MixedContentTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  dir?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export function MixedContentTextarea({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
  required = false,
  maxLength,
  rows = 3,
  dir,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: MixedContentTextareaProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const { currentLanguage } = useLanguage();
  const [inputDirection, setInputDirection] = useState<'ltr' | 'rtl' | 'auto'>('auto');
  const [isMixed, setIsMixed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Determine input direction based on content
  useEffect(() => {
    const direction = getTextDirection(value);
    setInputDirection(direction);

    // Check for mixed content
    const hasMixed = hasMixedContent(value);
    setIsMixed(hasMixed);

    // Update textarea attributes
    if (textareaRef.current) {
      textareaRef.current.dir = direction;

      // Add data attributes for styling
      if (hasMixed) {
        textareaRef.current.setAttribute('data-mixed-content', 'true');
      } else {
        textareaRef.current.removeAttribute('data-mixed-content');
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Update direction based on first character
    if (newValue.length > 0) {
      const direction = getTextDirection(newValue);
      setInputDirection(direction);
    }
  };

  const handleFocus = () => {
    if (textareaRef.current) {
      textareaRef.current.setAttribute('data-focused', 'true');
    }
  };

  const handleBlur = () => {
    if (textareaRef.current) {
      textareaRef.current.removeAttribute('data-focused');
    }
  };

  // Get placeholder text based on language
  const getPlaceholder = () => {
    if (placeholder) return placeholder;

    return currentLanguage === 'ar' ? 'أدخل النص هنا...' : 'Enter text here...';
  };

  return (
    <FormControl
      ref={textareaRef}
      as='textarea'
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={getPlaceholder()}
      className={clsx('mixed-content-textarea', isMixed && 'mixed-content', className)}
      disabled={disabled}
      required={required}
      maxLength={maxLength}
      rows={rows}
      dir={inputDirection}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      data-language={currentLanguage}
      data-direction={inputDirection}
    />
  );
}
