import React, { useState, useEffect } from 'react';
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
  error?: string;
  required?: boolean;
  name?: string;
  className?: string;
}

// Native HTML Select Styles
const selectStyles = `
  .lawyer-multiselect {
    min-height: 120px;
    max-height: 200px;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    padding: 8px;
    font-size: 1rem;
    background-color: #fff;
    width: 100%;
    z-index: 10000 !important;
    position: relative;
  }

  .lawyer-multiselect:focus {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    outline: none;
  }

  .lawyer-multiselect option {
    padding: 8px 12px;
    font-size: 0.875rem;
    background-color: #fff;
    color: #495057;
  }

  .lawyer-multiselect option:checked {
    background-color: #0d6efd;
    color: #fff;
  }

  .lawyer-multiselect:disabled {
    background-color: #e9ecef;
    opacity: 0.65;
  }

  .selected-lawyers {
    margin-top: 8px;
  }

  .selected-lawyer-tag {
    display: inline-block;
    background-color: #e9ecef;
    color: #495057;
    padding: 4px 8px;
    margin: 2px;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .selected-lawyer-remove {
    margin-left: 4px;
    cursor: pointer;
    color: #6c757d;
    font-weight: bold;
  }

  .selected-lawyer-remove:hover {
    color: #dc3545;
  }
`;

export const LawyerMultiSelect: React.FC<LawyerMultiSelectProps> = ({
  value,
  onChange,
  placeholder,
  isDisabled = false,
  error,
  required = false,
  name,
  className
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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(event.target.selectedOptions, option => parseInt(option.value));
    const selectedLawyers = lawyers.filter(lawyer => selectedIds.includes(lawyer.value));
    onChange(selectedLawyers);
  };

  const removeLawyer = (lawyerId: number) => {
    const updatedSelection = value.filter(lawyer => lawyer.value !== lawyerId);
    onChange(updatedSelection);
  };

  const defaultPlaceholder = currentLanguage === 'ar'
    ? 'اختر المحامين الحاضرين في الجلسة...'
    : 'Select lawyers attending the hearing...';

  return (
    <div className={className}>
      <style>{selectStyles}</style>

      {loading ? (
        <div className="text-center p-3">
          <span>{currentLanguage === 'ar' ? 'جاري تحميل المحامين...' : 'Loading lawyers...'}</span>
        </div>
      ) : (
        <>
          <select
            className="lawyer-multiselect form-control"
            multiple
            value={value.map(v => v.value.toString())}
            onChange={handleSelectChange}
            disabled={isDisabled}
            name={name}
            size={6}
          >
            {lawyers.length === 0 ? (
              <option disabled>
                {currentLanguage === 'ar' ? 'لا توجد محامين متاحين' : 'No lawyers available'}
              </option>
            ) : (
              lawyers.map(lawyer => (
                <option key={lawyer.value} value={lawyer.value}>
                  {lawyer.label}
                </option>
              ))
            )}
          </select>

          {/* Selected Lawyers Display */}
          {value.length > 0 && (
            <div className="selected-lawyers">
              <small className="text-muted">
                {currentLanguage === 'ar' ? 'المحامون المختارون:' : 'Selected lawyers:'}
              </small>
              <div className="mt-2">
                {value.map(lawyer => (
                  <span key={lawyer.value} className="selected-lawyer-tag">
                    {lawyer.label}
                    <span
                      className="selected-lawyer-remove"
                      onClick={() => removeLawyer(lawyer.value)}
                      title={currentLanguage === 'ar' ? 'إزالة' : 'Remove'}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

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