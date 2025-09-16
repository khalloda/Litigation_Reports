<?php
/**
 * Production Configuration
 * Litigation Management System
 * 
 * IMPORTANT: Update these settings for your GoDaddy hosting environment
 */

// Database Configuration
// Update these with your actual GoDaddy database credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');  // e.g., 'username_litigation_db'
define('DB_USER', 'your_database_user');  // e.g., 'username_litigation_user'
define('DB_PASS', 'your_database_password');
define('DB_CHARSET', 'utf8mb4');

// Application Configuration
define('APP_ENV', 'production');
define('APP_DEBUG', false);  // Set to true only for debugging
define('APP_URL', 'https://yourdomain.com/litigation');  // Update with your actual domain
define('APP_NAME', 'Litigation Management System');
define('APP_VERSION', '1.0.0');

// Security Settings
define('SESSION_LIFETIME', 3600);        // 1 hour
define('CSRF_TOKEN_LIFETIME', 1800);     // 30 minutes
define('PASSWORD_MIN_LENGTH', 8);
define('LOGIN_MAX_ATTEMPTS', 5);
define('LOGIN_LOCKOUT_TIME', 900);       // 15 minutes

// File Upload Settings
define('UPLOAD_MAX_SIZE', 50 * 1024 * 1024);  // 50MB
define('UPLOAD_PATH', __DIR__ . '/../uploads/');
define('ALLOWED_FILE_TYPES', [
    'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'txt', 'xls', 'xlsx'
]);

// Email Configuration (Optional - for notifications)
define('EMAIL_ENABLED', false);  // Set to true to enable email notifications
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your_email@gmail.com');
define('SMTP_PASSWORD', 'your_app_password');
define('SMTP_FROM_EMAIL', 'your_email@gmail.com');
define('SMTP_FROM_NAME', 'Litigation Management System');
define('SMTP_SECURE', 'tls');

// Logging Configuration
define('LOG_LEVEL', 'ERROR');  // ERROR, WARNING, INFO, DEBUG
define('LOG_FILE', __DIR__ . '/../logs/app.log');
define('LOG_MAX_SIZE', 10 * 1024 * 1024);  // 10MB
define('LOG_MAX_FILES', 5);

// Cache Configuration
define('CACHE_ENABLED', true);
define('CACHE_PATH', __DIR__ . '/../cache/');
define('CACHE_LIFETIME', 3600);  // 1 hour

// Localization Settings
define('DEFAULT_LANGUAGE', 'ar');
define('SUPPORTED_LANGUAGES', ['ar', 'en']);
define('DATE_FORMAT', 'Y-m-d');
define('DATETIME_FORMAT', 'Y-m-d H:i:s');
define('TIMEZONE', 'Africa/Cairo');

// API Configuration
define('API_VERSION', 'v1');
define('API_RATE_LIMIT', 1000);  // requests per hour
define('API_CORS_ENABLED', true);
define('API_CORS_ORIGINS', ['https://yourdomain.com']);

// Backup Configuration
define('BACKUP_ENABLED', true);
define('BACKUP_PATH', __DIR__ . '/../backups/');
define('BACKUP_RETENTION_DAYS', 30);
define('BACKUP_SCHEDULE', 'daily');  // daily, weekly, monthly

// Performance Settings
define('QUERY_CACHE_ENABLED', true);
define('QUERY_CACHE_LIFETIME', 300);  // 5 minutes
define('PAGINATION_DEFAULT_LIMIT', 25);
define('PAGINATION_MAX_LIMIT', 100);

// Feature Flags
define('FEATURE_USER_MANAGEMENT', true);
define('FEATURE_REPORT_GENERATION', true);
define('FEATURE_FILE_UPLOADS', true);
define('FEATURE_EMAIL_NOTIFICATIONS', false);
define('FEATURE_BACKUP_AUTOMATION', true);

// Maintenance Mode
define('MAINTENANCE_MODE', false);
define('MAINTENANCE_MESSAGE', 'System is under maintenance. Please try again later.');

// Security Headers
define('SECURITY_HEADERS_ENABLED', true);
define('CONTENT_SECURITY_POLICY', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");

// Database Connection Options
define('DB_OPTIONS', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
]);

// Error Reporting (Production)
if (APP_DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', LOG_FILE);
}

// Timezone
date_default_timezone_set(TIMEZONE);

// Session Configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_samesite', 'Strict');

// PHP Settings
ini_set('memory_limit', '256M');
ini_set('max_execution_time', 300);
ini_set('max_input_vars', 3000);
ini_set('post_max_size', '64M');
ini_set('upload_max_filesize', '64M');
ini_set('max_file_uploads', 20);

/**
 * Database Connection Function
 */
function getDatabaseConnection() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, DB_OPTIONS);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }
    
    return $pdo;
}

/**
 * Logging Function
 */
function writeLog($level, $message, $context = []) {
    if (!defined('LOG_LEVEL')) {
        return;
    }
    
    $levels = ['DEBUG' => 0, 'INFO' => 1, 'WARNING' => 2, 'ERROR' => 3];
    
    if ($levels[$level] < $levels[LOG_LEVEL]) {
        return;
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $contextStr = !empty($context) ? ' ' . json_encode($context) : '';
    $logEntry = "[$timestamp] [$level] $message$contextStr" . PHP_EOL;
    
    file_put_contents(LOG_FILE, $logEntry, FILE_APPEND | LOCK_EX);
}

/**
 * Security Functions
 */
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function generateCSRFToken() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time();
    }
    
    return $_SESSION['csrf_token'];
}

function validateCSRFToken($token) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['csrf_token']) || !isset($_SESSION['csrf_token_time'])) {
        return false;
    }
    
    if (time() - $_SESSION['csrf_token_time'] > CSRF_TOKEN_LIFETIME) {
        unset($_SESSION['csrf_token'], $_SESSION['csrf_token_time']);
        return false;
    }
    
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Utility Functions
 */
function formatFileSize($bytes) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    
    $bytes /= pow(1024, $pow);
    
    return round($bytes, 2) . ' ' . $units[$pow];
}

function isMaintenanceMode() {
    return MAINTENANCE_MODE && !isset($_SESSION['admin_override']);
}

// Initialize application
if (isMaintenanceMode()) {
    http_response_code(503);
    die(MAINTENANCE_MESSAGE);
}

// Create necessary directories
$directories = [
    dirname(LOG_FILE),
    UPLOAD_PATH,
    CACHE_PATH,
    BACKUP_PATH
];

foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Set security headers
if (SECURITY_HEADERS_ENABLED) {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
}

// Log application start
writeLog('INFO', 'Application started', [
    'version' => APP_VERSION,
    'environment' => APP_ENV,
    'php_version' => PHP_VERSION,
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
]);

?>
