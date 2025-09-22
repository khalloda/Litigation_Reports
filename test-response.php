<?php
echo "Testing Response class...\n";
try {
    require_once 'apps/api/src/core/Response.php';

    echo "Response class loaded successfully!\n";

    // Test creating a response
    $response = Response::success(['test' => 'data'], 'Test message');

    echo "Response created: " . gettype($response) . "\n";
    echo "Response JSON: " . $response->toJson() . "\n";

    echo "✅ Response class working correctly\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
