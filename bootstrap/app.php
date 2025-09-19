<?php
/**
 * Application Bootstrap
 * 
 * This file initializes the application and sets up the core components.
 */

// Define application constants
define('APP_ROOT', dirname(__DIR__));
define('PUBLIC_PATH', APP_ROOT . '/public');
define('APP_PATH', APP_ROOT . '/app');
define('CONFIG_PATH', APP_ROOT . '/config');
define('DATABASE_PATH', APP_ROOT . '/database');

// Autoloader for classes
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = APP_PATH . '/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    
    if (file_exists($file)) {
        require $file;
    }
});

// Include core classes
require_once APP_PATH . '/Core/App.php';
require_once APP_PATH . '/Core/Router.php';
require_once APP_PATH . '/Core/Request.php';
require_once APP_PATH . '/Core/Response.php';
require_once APP_PATH . '/Core/Database.php';
require_once APP_PATH . '/Core/Auth.php';
require_once APP_PATH . '/Core/Validator.php';

// Load configuration
$config = require CONFIG_PATH . '/app.php';

// Set timezone
date_default_timezone_set($config['timezone'] ?? 'Asia/Riyadh');