/**
 * Enhanced Form Input Component
 *
 * Provides form input with validation error display.
 */

import React from 'react';

interface FormInputProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  error?: string;
  className?: string;
  autoComplete?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  type,
  label,
  value,
  onChange,
  required = false,
  placeholder = '',
  dir = 'auto',
  error,
  className = '',
  autoComplete,
}) => {
  const inputClasses = `form-control ${error ? 'is-invalid' : ''} ${className}`;

  return (
    <div className='mb-3'>
      <label htmlFor={id} className='form-label'>
        {label}
        {required && <span className='text-danger ms-1'>*</span>}
      </label>
      <input
        type={type}
        className={inputClasses}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        dir={dir}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <div id={`${id}-error`} className='invalid-feedback error' role='alert' aria-live='polite'>
          {error}
        </div>
      )}
    </div>
  );
};

export default FormInput;
