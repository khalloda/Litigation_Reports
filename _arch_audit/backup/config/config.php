<?php
/**
 * Application Configuration
 * 
 * This file contains all configuration settings for the litigation management system.
 */

// Application settings
define('APP_NAME', 'Litigation Management System');
define('APP_VERSION', '1.0.0');
define('APP_ENV', $_ENV['APP_ENV'] ?? 'development');
define('APP_DEBUG', $_ENV['APP_DEBUG'] ?? true);
define('APP_URL', $_ENV['APP_URL'] ?? 'http://localhost:8000');

// Database settings
define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
define('DB_PORT', $_ENV['DB_PORT'] ?? '3306');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'litigation_db');
define('DB_USER', $_ENV['DB_USER'] ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? '1234');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATION', 'utf8mb4_unicode_ci');

// Security settings
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'your-secret-key-change-in-production');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRY', 3600); // 1 hour
define('BCRYPT_ROUNDS', 12);

// Session settings
define('SESSION_LIFETIME', 3600); // 1 hour
define('SESSION_NAME', 'LITIGATION_SESSION');

// File upload settings
define('UPLOAD_MAX_SIZE', 50 * 1024 * 1024); // 50MB
define('UPLOAD_ALLOWED_TYPES', ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif']);
define('UPLOAD_PATH', __DIR__ . '/../uploads/');

// Email settings
define('SMTP_HOST', $_ENV['SMTP_HOST'] ?? 'localhost');
define('SMTP_PORT', $_ENV['SMTP_PORT'] ?? 587);
define('SMTP_USER', $_ENV['SMTP_USER'] ?? '');
define('SMTP_PASS', $_ENV['SMTP_PASS'] ?? '');
define('SMTP_FROM_EMAIL', $_ENV['SMTP_FROM_EMAIL'] ?? 'noreply@litigation.com');
define('SMTP_FROM_NAME', $_ENV['SMTP_FROM_NAME'] ?? 'Litigation Management System');

// Pagination settings
define('DEFAULT_PAGE_SIZE', 20);
define('MAX_PAGE_SIZE', 100);

// Cache settings
define('CACHE_ENABLED', true);
define('CACHE_PATH', __DIR__ . '/../cache/');
define('CACHE_LIFETIME', 3600); // 1 hour

// Logging settings
define('LOG_ENABLED', true);
define('LOG_PATH', __DIR__ . '/../logs/');
define('LOG_LEVEL', APP_DEBUG ? 'DEBUG' : 'INFO');

// RTL and localization settings
define('DEFAULT_LANGUAGE', 'ar');
define('DEFAULT_LOCALE', 'ar_SA');
define('SUPPORTED_LANGUAGES', ['ar', 'en']);
define('DEFAULT_TIMEZONE', 'Asia/Riyadh');

// API settings
define('API_VERSION', 'v1');
define('API_RATE_LIMIT', 1000); // requests per hour
define('API_RATE_LIMIT_WINDOW', 3600); // 1 hour

// Business settings
define('DEFAULT_CURRENCY', 'EGP');
define('SUPPORTED_CURRENCIES', ['EGP', 'USD']);
define('VAT_RATE', 0.14); // 14% VAT

// Court settings
define('DEFAULT_COURT_SYSTEM', 'Egyptian');
define('SUPPORTED_COURT_SYSTEMS', ['Egyptian', 'Saudi', 'UAE']);

// User role permissions
define('USER_ROLES', [
    'super_admin' => [
        'name' => 'Super Admin',
        'permissions' => 91
    ],
    'admin' => [
        'name' => 'Admin',
        'permissions' => 84
    ],
    'lawyer' => [
        'name' => 'Lawyer',
        'permissions' => 52
    ],
    'staff' => [
        'name' => 'Staff',
        'permissions' => 52
    ]
]);

// Case statuses
define('CASE_STATUSES', [
    'active' => 'سارية',
    'closed' => 'منتهية',
    'suspended' => 'معلقة'
]);

// Case categories
define('CASE_CATEGORIES', [
    'civil' => 'مدني',
    'criminal' => 'جنائي',
    'commercial' => 'تجاري',
    'administrative' => 'إداري'
]);

// Case priorities
define('CASE_PRIORITIES', [
    'high' => 'عالي',
    'medium' => 'متوسط',
    'low' => 'منخفض'
]);

// Hearing outcomes
define('HEARING_OUTCOMES', [
    'for' => 'صالح',
    'against' => 'ضد',
    'adjourned' => 'مؤجل',
    'settled' => 'متصالح'
]);

// Invoice statuses
define('INVOICE_STATUSES', [
    'draft' => 'مسودة',
    'sent' => 'مرسل',
    'paid' => 'مدفوع',
    'overdue' => 'متأخر',
    'cancelled' => 'ملغي'
]);

// Invoice types
define('INVOICE_TYPES', [
    'legal_fees' => 'أتعاب قانونية',
    'expenses' => 'مصروفات',
    'court_costs' => 'تكاليف المحكمة'
]);

// Attendance types
define('ATTENDANCE_TYPES', [
    'office' => 'في المكتب',
    'court' => 'في المحكمة',
    'client_meeting' => 'اجتماع عميل',
    'admin_work' => 'عمل إداري',
    'vacation' => 'إجازة',
    'sick_leave' => 'إجازة مرضية'
]);

// Error messages
define('ERROR_MESSAGES', [
    'UNAUTHORIZED' => 'غير مصرح بالوصول',
    'FORBIDDEN' => 'ممنوع الوصول',
    'NOT_FOUND' => 'غير موجود',
    'VALIDATION_ERROR' => 'خطأ في التحقق',
    'DATABASE_ERROR' => 'خطأ في قاعدة البيانات',
    'FILE_UPLOAD_ERROR' => 'خطأ في رفع الملف',
    'EMAIL_ERROR' => 'خطأ في إرسال البريد الإلكتروني',
    'INVALID_CREDENTIALS' => 'بيانات الدخول غير صحيحة',
    'ACCOUNT_DISABLED' => 'الحساب معطل',
    'SESSION_EXPIRED' => 'انتهت صلاحية الجلسة'
]);

// Success messages
define('SUCCESS_MESSAGES', [
    'LOGIN_SUCCESS' => 'تم تسجيل الدخول بنجاح',
    'LOGOUT_SUCCESS' => 'تم تسجيل الخروج بنجاح',
    'CREATED' => 'تم الإنشاء بنجاح',
    'UPDATED' => 'تم التحديث بنجاح',
    'DELETED' => 'تم الحذف بنجاح',
    'EMAIL_SENT' => 'تم إرسال البريد الإلكتروني بنجاح',
    'FILE_UPLOADED' => 'تم رفع الملف بنجاح'
]);

// Development helpers
if (APP_DEBUG) {
    // Enable error reporting
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    
    // Enable query logging
    define('LOG_QUERIES', true);
} else {
    // Disable error reporting in production
    error_reporting(0);
    ini_set('display_errors', 0);
    
    // Disable query logging
    define('LOG_QUERIES', false);
}

// Create necessary directories
$directories = [
    UPLOAD_PATH,
    CACHE_PATH,
    LOG_PATH
];

foreach ($directories as $directory) {
    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }
}

// Set default timezone
date_default_timezone_set(DEFAULT_TIMEZONE);

// Set locale
setlocale(LC_ALL, DEFAULT_LOCALE);

// Set session configuration (only if session not already started)
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.name', SESSION_NAME);
    ini_set('session.gc_maxlifetime', SESSION_LIFETIME);
    ini_set('session.cookie_lifetime', SESSION_LIFETIME);
}
