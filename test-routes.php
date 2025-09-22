<?php
echo "Testing routes.php loading...\n";
try {
    require_once 'apps/api/src/routes.php';
    echo "Routes loaded successfully!\n";
    echo "Routes function exists: " . (function_exists('registerRoutes') ? 'Yes' : 'No') . "\n";
} catch (Exception $e) {
    echo "Error loading routes: " . $e->getMessage() . "\n";
}
