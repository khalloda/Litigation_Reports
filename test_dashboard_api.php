<?php
// Test dashboard API directly
require_once __DIR__ . '/backend/public/config/config.php';
require_once __DIR__ . '/backend/public/config/database.php';
require_once __DIR__ . '/backend/public/src/Controllers/ReportController.php';
require_once __DIR__ . '/backend/public/src/Core/Request.php';

try {
    // Create a mock request object
    $request = new Request();

    // Create ReportController instance
    $controller = new ReportController();

    echo "Testing dashboard API...\n";

    // Call dashboard method
    $result = $controller->dashboard($request);

    echo "Dashboard API result:\n";
    var_dump($result);

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>