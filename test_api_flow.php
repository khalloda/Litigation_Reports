<?php
require_once 'config/config.php';
require_once 'src/Core/Request.php';
require_once 'src/Core/Response.php';
require_once 'src/Core/Auth.php';
require_once 'src/Controllers/ClientController.php';

// Simulate authentication
class MockAuth
{
    public static function check()
    {
        return true;
    }
}

// Replace Auth class temporarily
if (!class_exists('Auth')) {
    class_alias('MockAuth', 'Auth');
}

echo "=== Testing Complete API Flow ===\n";

// Test 1: Check if we can create a client without file upload
echo "\n1. Testing client creation without file upload...\n";
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['CONTENT_TYPE'] = 'application/json';
$_SERVER['REQUEST_URI'] = '/api/clients';
$_FILES = [];
$_POST = [];

$request = new Request();
$controller = new ClientController();

// Simulate JSON data
$jsonData = [
    'client_name_ar' => 'Test API Client',
    'client_name_en' => 'Test API Client',
    'client_type' => 'individual',
    'cash_pro_bono' => 'cash'
];

// Override the request body parsing
$reflection = new ReflectionClass($request);
$bodyProperty = $reflection->getProperty('body');
$bodyProperty->setAccessible(true);
$bodyProperty->setValue($request, $jsonData);

try {
    $response = $controller->store($request);
    echo "Response: " . json_encode($response) . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

// Test 2: Check if we can create a client with file upload
echo "\n2. Testing client creation with file upload...\n";
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['CONTENT_TYPE'] = 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW';
$_SERVER['REQUEST_URI'] = '/api/clients';

$_FILES = [
    'logo_file' => [
        'name' => 'emblem_green_gold.png',
        'type' => 'image/png',
        'tmp_name' => 'logo/emblem_green_gold.png',
        'error' => UPLOAD_ERR_OK,
        'size' => filesize('logo/emblem_green_gold.png')
    ]
];

$_POST = [
    'client_name_ar' => 'Test API Client with Logo',
    'client_name_en' => 'Test API Client with Logo',
    'client_type' => 'individual',
    'cash_pro_bono' => 'cash'
];

$request = new Request();
$controller = new ClientController();

try {
    $response = $controller->store($request);
    echo "Response: " . json_encode($response) . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

// Check if file was created
echo "\n3. Checking uploaded files...\n";
$uploadDir = 'uploads/logos/';
if (is_dir($uploadDir)) {
    $files = scandir($uploadDir);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            echo "Found file: " . $file . "\n";
        }
    }
} else {
    echo "Upload directory does not exist\n";
}

