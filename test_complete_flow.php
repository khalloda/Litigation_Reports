<?php
require_once 'config/config.php';
require_once 'src/Core/Request.php';
require_once 'src/Core/Response.php';
require_once 'src/Core/Auth.php';
require_once 'src/Controllers/ClientController.php';
require_once 'src/Models/Client.php';

// Mock authentication - override the existing Auth class
class MockAuth
{
    public static function check()
    {
        return true;
    }
}

// Remove the existing Auth class and replace it
if (class_exists('Auth')) {
    // Clear the class
    $reflection = new ReflectionClass('Auth');
    if ($reflection->isUserDefined()) {
        // Can't remove user-defined classes, so we'll work around it
    }
}

echo "=== Testing Complete Frontend-to-Backend Flow ===\n";

// Simulate the exact request that would come from the frontend
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['CONTENT_TYPE'] = 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW';
$_SERVER['REQUEST_URI'] = '/api/clients';

// Simulate file upload (this is what the frontend sends)
$_FILES = [
    'logo_file' => [
        'name' => 'emblem_green_gold.png',
        'type' => 'image/png',
        'tmp_name' => 'logo/emblem_green_gold.png',
        'error' => UPLOAD_ERR_OK,
        'size' => filesize('logo/emblem_green_gold.png')
    ]
];

// Simulate form data (this is what the frontend sends)
$_POST = [
    'client_name_ar' => 'Test Complete Flow Client',
    'client_name_en' => 'Test Complete Flow Client',
    'client_type' => 'individual',
    'cash_pro_bono' => 'cash',
    'status' => 'active'
];

echo "1. Simulating frontend request...\n";
echo "   Files: " . count($_FILES) . " files\n";
echo "   POST data: " . count($_POST) . " fields\n";

// Create request object
$request = new Request();
echo "2. Request object created\n";
echo "   Method: " . $request->getMethod() . "\n";
echo "   Path: " . $request->getPath() . "\n";

// Check file access
$logoFile = $request->file('logo_file');
echo "3. File access test:\n";
if ($logoFile) {
    echo "   File found: " . $logoFile['name'] . "\n";
    echo "   File size: " . $logoFile['size'] . " bytes\n";
    echo "   File error: " . $logoFile['error'] . "\n";
} else {
    echo "   No file found\n";
}

// Test the controller
echo "4. Testing ClientController...\n";
$controller = new ClientController();

try {
    $response = $controller->store($request);
    echo "   Response received\n";

    if (is_array($response)) {
        echo "   Response type: array\n";
        echo "   Response keys: " . implode(', ', array_keys($response)) . "\n";

        if (isset($response['data'])) {
            echo "   Client ID: " . ($response['data']['id'] ?? 'Not set') . "\n";
            echo "   Client Name: " . ($response['data']['client_name_en'] ?? 'Not set') . "\n";
            echo "   Client Logo: " . ($response['data']['logo'] ?? 'NULL') . "\n";
        }
    } else {
        echo "   Response type: " . gettype($response) . "\n";
        if (method_exists($response, 'getData')) {
            echo "   Response data: " . json_encode($response->getData()) . "\n";
        } else {
            echo "   Response: " . json_encode($response) . "\n";
        }
    }
} catch (Exception $e) {
    echo "   Error: " . $e->getMessage() . "\n";
    echo "   Stack trace: " . $e->getTraceAsString() . "\n";
}

// Check if file was uploaded
echo "5. Checking uploaded files...\n";
$uploadDir = 'uploads/logos/';
if (is_dir($uploadDir)) {
    $files = scandir($uploadDir);
    $uploadedFiles = array_filter($files, function ($file) {
        return $file !== '.' && $file !== '..';
    });

    echo "   Uploaded files: " . count($uploadedFiles) . "\n";
    foreach ($uploadedFiles as $file) {
        echo "   - " . $file . "\n";
    }
} else {
    echo "   Upload directory does not exist\n";
}

// Check database
echo "6. Checking database...\n";
try {
    $db = Database::getInstance();
    $clients = $db->fetchAll("SELECT id, client_name_en, logo FROM clients ORDER BY id DESC LIMIT 3");

    echo "   Recent clients:\n";
    foreach ($clients as $client) {
        echo "   - ID: " . $client['id'] . ", Name: " . $client['client_name_en'] . ", Logo: " . ($client['logo'] ?: 'NULL') . "\n";
    }
} catch (Exception $e) {
    echo "   Database error: " . $e->getMessage() . "\n";
}
