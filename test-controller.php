<?php
echo "Testing controller loading...\n";
try {
    require_once 'apps/api/src/controllers/AuthController.php';
    echo "AuthController loaded successfully!\n";
    echo "AuthController class exists: " . (class_exists('AuthController') ? 'Yes' : 'No') . "\n";
} catch (Exception $e) {
    echo "Error loading controller: " . $e->getMessage() . "\n";
}
