<?php

/**
 * Production Environment Configuration
 * This file overrides base configuration for production
 */

return [
    'debug' => false,
    'log_level' => 'ERROR',
    'cache_enabled' => true,
    'api_base_url' => 'https://api.lit.sarieldin.com',
    'database' => [
        'host' => getenv('DB_HOST') ?: 'localhost',
        'port' => getenv('DB_PORT') ?: 3306,
        'database' => getenv('DB_NAME') ?: 'litigation_prod',
        'username' => getenv('DB_USER') ?: 'litigation_user',
        'password' => getenv('DB_PASS') ?: '',
    ],
    'cors' => [
        'allowed_origins' => ['https://lit.sarieldin.com', 'https://www.lit.sarieldin.com'],
        'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
    ],
    'security' => [
        'force_https' => true,
        'hsts_enabled' => true,
        'csp_enabled' => true,
    ],
];
