<?php
/**
 * Health Check Endpoint
 * Simple ping endpoint to verify API is working
 */

require_once __DIR__ . '/_bootstrap.php';

// Simple health check
echo json_encode([
    'success' => true,
    'message' => 'API is healthy',
    'timestamp' => time(),
    'server' => 'Apache/PHP',
    'version' => '1.0.0'
]);
?>
