import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { StylesConfig } from 'react-select';
import { Form } from 'react-bootstrap';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService as api } from '../../services/api';

// TypeScript Interfaces
export interface Lawyer {
  id: number;
  lawyer_name_ar: string;
  lawyer_name_en: string;
  lawyer_email: string;
  is_active: number;
}

export interface LawyerOption {
  value: number;
  label: string;
  data: Lawyer;
}

export interface LawyerMultiSelectProps {
  value: LawyerOption[];
  onChange: (selected: LawyerOption[] | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  maxMenuHeight?: number;
  noOptionsMessage?: (obj: { inputValue: string }) => string;
  loadingMessage?: () => string;
  error?: string;
  required?: boolean;
  name?: string;
  className?: string;
  styles?: StylesConfig<LawyerOption, true>;
}

// Bootstrap Integration Styles
const bootstrapSelectStyles: StylesConfig<LawyerOption, true> = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '38px',
    borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
    boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : 'none',
    '&:hover': {
      borderColor: '#ced4da'
    },
    fontSize: '1rem',
    backgroundColor: '#fff'
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 1070,
    borderRadius: '0.375rem',
    border: '1px solid #ced4da',
    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 1070
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px',
    borderRadius: '0.375rem'
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#0d6efd'
      : state.isFocused
        ? '#f8f9fa'
        : '#fff',
    color: state.isSelected ? '#fff' : '#495057',
    '&:hover': {
      backgroundColor: state.isSelected ? '#0d6efd' : '#f8f9fa'
    },
    fontSize: '0.875rem',
    padding: '8px 12px'
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#e9ecef',
    borderRadius: '0.375rem',
    margin: '2px'
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#495057',
    fontSize: '0.875rem',
    fontWeight: '500'
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#6c757d',
    borderRadius: '0 0.375rem 0.375rem 0',
    '&:hover': {
      backgroundColor: '#dc3545',
      color: 'white'
    }
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#6c757d',
    fontSize: '1rem'
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: '#6c757d',
    fontSize: '0.875rem',
    padding: '8px 12px'
  }),
  loadingMessage: (provided) => ({
    ...provided,
    color: '#6c757d',
    fontSize: '0.875rem',
    padding: '8px 12px'
  }),
  input: (provided) => ({
    ...provided,
    color: '#495057',
    fontSize: '1rem'
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#495057',
    fontSize: '1rem'
  })
};

export const LawyerMultiSelect: React.FC<LawyerMultiSelectProps> = ({
  value,
  onChange,
  placeholder,
  isDisabled = false,
  isLoading = false,
  isSearchable = true,
  isClearable = true,
  maxMenuHeight = 200,
  noOptionsMessage,
  loadingMessage,
  error,
  required = false,
  name,
  className,
  styles
}) => {
  const { currentLanguage } = useLanguage();
  const [lawyers, setLawyers] = useState<LawyerOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Load lawyers on component mount
  useEffect(() => {
    loadLawyers();
  }, []);

  const loadLawyers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lawyers?limit=1000&is_active=1');

      if (response.success && response.data.data) {
        const lawyerOptions: LawyerOption[] = response.data.data.map((lawyer: Lawyer) => ({
          value: lawyer.id,
          label: currentLanguage === 'ar'
            ? `${lawyer.lawyer_name_ar}${lawyer.lawyer_name_en ? ` - ${lawyer.lawyer_name_en}` : ''}`
            : `${lawyer.lawyer_name_en || lawyer.lawyer_name_ar}`,
          data: lawyer
        }));

        setLawyers(lawyerOptions);
      }
    } catch (err) {
      console.error('Error loading lawyers:', err);
      setLawyers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (selectedOptions: any) => {
    onChange(selectedOptions || []);
  };

  const defaultNoOptionsMessage = ({ inputValue }: { inputValue: string }) => {
    if (inputValue) {
      return currentLanguage === 'ar'
        ? `لا توجد نتائج لـ "${inputValue}"`
        : `No results for "${inputValue}"`;
    }
    return currentLanguage === 'ar'
      ? 'لا توجد محامين متاحين'
      : 'No lawyers available';
  };

  const defaultLoadingMessage = () => {
    return currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...';
  };

  const defaultPlaceholder = currentLanguage === 'ar'
    ? 'اختر المحامين...'
    : 'Select lawyers...';

  // Merge custom styles with bootstrap styles
  const mergedStyles = styles ? { ...bootstrapSelectStyles, ...styles } : bootstrapSelectStyles;

  return (
    <div className={className}>
      <Select<LawyerOption, true>
        isMulti
        value={value}
        onChange={handleChange}
        options={lawyers}
        isLoading={loading || isLoading}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        isClearable={isClearable}
        maxMenuHeight={maxMenuHeight}
        placeholder={placeholder || defaultPlaceholder}
        noOptionsMessage={noOptionsMessage || defaultNoOptionsMessage}
        loadingMessage={loadingMessage || defaultLoadingMessage}
        styles={mergedStyles}
        name={name}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        blurInputOnSelect={false}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        classNamePrefix="react-select"
      />

      {/* Error Display */}
      {error && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {error}
        </Form.Control.Feedback>
      )}

      {/* Required Indicator */}
      {required && !value?.length && (
        <Form.Text className="text-danger small">
          {currentLanguage === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required'}
        </Form.Text>
      )}
    </div>
  );
};

export default LawyerMultiSelect;