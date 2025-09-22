<?php
/**
 * Validator Class
 * 
 * Handles input validation and sanitization.
 */

class Validator {
    private $data;
    private $rules;
    private $errors = [];
    private $messages = [];
    
    public function __construct($data = [], $rules = []) {
        $this->data = $data;
        $this->rules = $rules;
        $this->messages = $this->getDefaultMessages();
    }
    
    public function validate($data = null, $rules = null) {
        if ($data !== null) {
            $this->data = $data;
        }
        
        if ($rules !== null) {
            $this->rules = $rules;
        }
        
        $this->errors = [];
        
        foreach ($this->rules as $field => $fieldRules) {
            $this->validateField($field, $fieldRules);
        }
        
        return empty($this->errors);
    }
    
    private function validateField($field, $rules) {
        $value = $this->getValue($field);
        $rules = is_string($rules) ? explode('|', $rules) : $rules;
        
        foreach ($rules as $rule) {
            $this->applyRule($field, $value, $rule);
        }
    }
    
    private function applyRule($field, $value, $rule) {
        $parts = explode(':', $rule);
        $ruleName = $parts[0];
        $ruleValue = isset($parts[1]) ? $parts[1] : null;
        
        switch ($ruleName) {
            case 'required':
                if (empty($value) && $value !== '0') {
                    $this->addError($field, 'required');
                }
                break;
                
            case 'email':
                if (!empty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $this->addError($field, 'email');
                }
                break;
                
            case 'numeric':
                if (!empty($value) && !is_numeric($value)) {
                    $this->addError($field, 'numeric');
                }
                break;
                
            case 'integer':
                if (!empty($value) && !filter_var($value, FILTER_VALIDATE_INT)) {
                    $this->addError($field, 'integer');
                }
                break;
                
            case 'min':
                if (!empty($value) && strlen($value) < $ruleValue) {
                    $this->addError($field, 'min', ['min' => $ruleValue]);
                }
                break;
                
            case 'max':
                if (!empty($value) && strlen($value) > $ruleValue) {
                    $this->addError($field, 'max', ['max' => $ruleValue]);
                }
                break;
                
            case 'min_value':
                if (!empty($value) && $value < $ruleValue) {
                    $this->addError($field, 'min_value', ['min' => $ruleValue]);
                }
                break;
                
            case 'max_value':
                if (!empty($value) && $value > $ruleValue) {
                    $this->addError($field, 'max_value', ['max' => $ruleValue]);
                }
                break;
                
            case 'in':
                $allowedValues = explode(',', $ruleValue);
                if (!empty($value) && !in_array($value, $allowedValues)) {
                    $this->addError($field, 'in', ['values' => implode(', ', $allowedValues)]);
                }
                break;
                
            case 'not_in':
                $forbiddenValues = explode(',', $ruleValue);
                if (!empty($value) && in_array($value, $forbiddenValues)) {
                    $this->addError($field, 'not_in', ['values' => implode(', ', $forbiddenValues)]);
                }
                break;
                
            case 'regex':
                if (!empty($value) && !preg_match($ruleValue, $value)) {
                    $this->addError($field, 'regex');
                }
                break;
                
            case 'date':
                if (!empty($value) && !strtotime($value)) {
                    $this->addError($field, 'date');
                }
                break;
                
            case 'date_format':
                if (!empty($value)) {
                    $date = DateTime::createFromFormat($ruleValue, $value);
                    if (!$date || $date->format($ruleValue) !== $value) {
                        $this->addError($field, 'date_format', ['format' => $ruleValue]);
                    }
                }
                break;
                
            case 'before':
                if (!empty($value) && strtotime($value) >= strtotime($ruleValue)) {
                    $this->addError($field, 'before', ['date' => $ruleValue]);
                }
                break;
                
            case 'after':
                if (!empty($value) && strtotime($value) <= strtotime($ruleValue)) {
                    $this->addError($field, 'after', ['date' => $ruleValue]);
                }
                break;
                
            case 'url':
                if (!empty($value) && !filter_var($value, FILTER_VALIDATE_URL)) {
                    $this->addError($field, 'url');
                }
                break;
                
            case 'ip':
                if (!empty($value) && !filter_var($value, FILTER_VALIDATE_IP)) {
                    $this->addError($field, 'ip');
                }
                break;
                
            case 'phone':
                if (!empty($value) && !preg_match('/^[\+]?[0-9\s\-\(\)]{10,}$/', $value)) {
                    $this->addError($field, 'phone');
                }
                break;
                
            case 'arabic_text':
                if (!empty($value) && !preg_match('/[\x{0600}-\x{06FF}]/u', $value)) {
                    $this->addError($field, 'arabic_text');
                }
                break;
                
            case 'english_text':
                if (!empty($value) && !preg_match('/^[a-zA-Z\s]+$/', $value)) {
                    $this->addError($field, 'english_text');
                }
                break;
                
            case 'mixed_content':
                // Allow both Arabic and English text
                if (!empty($value) && !preg_match('/^[\x{0600}-\x{06FF}a-zA-Z\s]+$/u', $value)) {
                    $this->addError($field, 'mixed_content');
                }
                break;
                
            case 'unique':
                $this->validateUnique($field, $value, $ruleValue);
                break;
                
            case 'exists':
                $this->validateExists($field, $value, $ruleValue);
                break;
                
            case 'confirmed':
                $confirmationField = $field . '_confirmation';
                if ($value !== $this->getValue($confirmationField)) {
                    $this->addError($field, 'confirmed');
                }
                break;
                
            case 'different':
                if ($value === $this->getValue($ruleValue)) {
                    $this->addError($field, 'different', ['other' => $ruleValue]);
                }
                break;
                
            case 'same':
                if ($value !== $this->getValue($ruleValue)) {
                    $this->addError($field, 'same', ['other' => $ruleValue]);
                }
                break;
                
            case 'file':
                if (!empty($value) && !isset($_FILES[$field])) {
                    $this->addError($field, 'file');
                }
                break;
                
            case 'image':
                if (!empty($value) && isset($_FILES[$field])) {
                    $file = $_FILES[$field];
                    $imageInfo = getimagesize($file['tmp_name']);
                    if (!$imageInfo) {
                        $this->addError($field, 'image');
                    }
                }
                break;
                
            case 'mimes':
                if (!empty($value) && isset($_FILES[$field])) {
                    $file = $_FILES[$field];
                    $allowedMimes = explode(',', $ruleValue);
                    $fileMime = mime_content_type($file['tmp_name']);
                    if (!in_array($fileMime, $allowedMimes)) {
                        $this->addError($field, 'mimes', ['types' => $ruleValue]);
                    }
                }
                break;
                
            case 'max_file_size':
                if (!empty($value) && isset($_FILES[$field])) {
                    $file = $_FILES[$field];
                    $maxSize = $ruleValue * 1024; // Convert KB to bytes
                    if ($file['size'] > $maxSize) {
                        $this->addError($field, 'max_file_size', ['size' => $ruleValue]);
                    }
                }
                break;
        }
    }
    
    private function validateUnique($field, $value, $rule) {
        if (empty($value)) {
            return;
        }
        
        $parts = explode(',', $rule);
        $table = $parts[0];
        $column = $parts[1] ?? $field;
        $ignoreId = $parts[2] ?? null;
        
        $db = Database::getInstance();
        $sql = "SELECT COUNT(*) as count FROM {$table} WHERE {$column} = :value";
        $params = ['value' => $value];
        
        if ($ignoreId) {
            $sql .= " AND id != :ignore_id";
            $params['ignore_id'] = $ignoreId;
        }
        
        $result = $db->fetch($sql, $params);
        
        if ($result['count'] > 0) {
            $this->addError($field, 'unique', ['table' => $table, 'column' => $column]);
        }
    }
    
    private function validateExists($field, $value, $rule) {
        if (empty($value)) {
            return;
        }
        
        $parts = explode(',', $rule);
        $table = $parts[0];
        $column = $parts[1] ?? $field;
        
        $db = Database::getInstance();
        $sql = "SELECT COUNT(*) as count FROM {$table} WHERE {$column} = :value";
        $result = $db->fetch($sql, ['value' => $value]);
        
        if ($result['count'] === 0) {
            $this->addError($field, 'exists', ['table' => $table, 'column' => $column]);
        }
    }
    
    private function getValue($field) {
        $keys = explode('.', $field);
        $value = $this->data;
        
        foreach ($keys as $key) {
            if (is_array($value) && isset($value[$key])) {
                $value = $value[$key];
            } else {
                return null;
            }
        }
        
        return $value;
    }
    
    private function addError($field, $rule, $params = []) {
        $message = $this->messages[$rule] ?? "The {$field} field is invalid.";
        
        // Replace placeholders
        foreach ($params as $key => $value) {
            $message = str_replace(":{$key}", $value, $message);
        }
        
        $this->errors[$field][] = $message;
    }
    
    public function errors() {
        return $this->errors;
    }
    
    public function hasErrors() {
        return !empty($this->errors);
    }
    
    public function getFirstError($field = null) {
        if ($field) {
            return isset($this->errors[$field]) ? $this->errors[$field][0] : null;
        }
        
        foreach ($this->errors as $fieldErrors) {
            return $fieldErrors[0];
        }
        
        return null;
    }
    
    public function getErrorsForField($field) {
        return $this->errors[$field] ?? [];
    }
    
    private function getDefaultMessages() {
        return [
            'required' => 'هذا الحقل مطلوب',
            'email' => 'يجب أن يكون عنوان بريد إلكتروني صحيح',
            'numeric' => 'يجب أن يكون رقم',
            'integer' => 'يجب أن يكون رقم صحيح',
            'min' => 'يجب أن يكون على الأقل :min حرف',
            'max' => 'يجب أن يكون على الأكثر :max حرف',
            'min_value' => 'يجب أن يكون على الأقل :min',
            'max_value' => 'يجب أن يكون على الأكثر :max',
            'in' => 'يجب أن يكون واحد من: :values',
            'not_in' => 'يجب ألا يكون واحد من: :values',
            'regex' => 'التنسيق غير صحيح',
            'date' => 'يجب أن يكون تاريخ صحيح',
            'date_format' => 'يجب أن يكون بتنسيق: :format',
            'before' => 'يجب أن يكون قبل :date',
            'after' => 'يجب أن يكون بعد :date',
            'url' => 'يجب أن يكون رابط صحيح',
            'ip' => 'يجب أن يكون عنوان IP صحيح',
            'phone' => 'يجب أن يكون رقم هاتف صحيح',
            'arabic_text' => 'يجب أن يحتوي على نص عربي',
            'english_text' => 'يجب أن يحتوي على نص إنجليزي',
            'mixed_content' => 'يجب أن يحتوي على نص عربي أو إنجليزي',
            'unique' => 'هذه القيمة مستخدمة بالفعل',
            'exists' => 'هذه القيمة غير موجودة',
            'confirmed' => 'التأكيد غير متطابق',
            'different' => 'يجب أن يكون مختلف عن :other',
            'same' => 'يجب أن يكون مطابق لـ :other',
            'file' => 'يجب أن يكون ملف',
            'image' => 'يجب أن يكون صورة',
            'mimes' => 'يجب أن يكون من الأنواع: :types',
            'max_file_size' => 'يجب أن يكون حجم الملف أقل من :size كيلوبايت'
        ];
    }
    
    public function setMessages($messages) {
        $this->messages = array_merge($this->messages, $messages);
    }
    
    public function sanitize($data = null) {
        if ($data === null) {
            $data = $this->data;
        }
        
        $sanitized = [];
        
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $sanitized[$key] = htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
            } elseif (is_array($value)) {
                $sanitized[$key] = $this->sanitize($value);
            } else {
                $sanitized[$key] = $value;
            }
        }
        
        return $sanitized;
    }
}
