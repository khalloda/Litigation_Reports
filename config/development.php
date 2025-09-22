<?php

/**
 * Development Environment Configuration
 * This file overrides base configuration for development
 */

return [
    'debug' => true,
    'log_level' => 'DEBUG',
    'cache_enabled' => false,
    'api_base_url' => 'http://localhost:3000',
    'database' => [
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'litigation_dev',
        'username' => 'root',
        'password' => '',
    ],
    'cors' => [
        'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000'],
        'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
    ],
];
