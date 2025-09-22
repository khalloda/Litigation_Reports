<?php

/**
 * Testing Environment Configuration
 * This file overrides base configuration for testing
 */

return [
    'debug' => true,
    'log_level' => 'INFO',
    'cache_enabled' => false,
    'api_base_url' => 'http://localhost:3000',
    'database' => [
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'litigation_test',
        'username' => 'root',
        'password' => '',
    ],
    'testing' => [
        'reset_database' => true,
        'seed_database' => true,
        'mock_external_services' => true,
    ],
];
