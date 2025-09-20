<?php
require_once 'config/config.php';
require_once 'src/Core/Request.php';
require_once 'src/Core/Response.php';
require_once 'src/Core/Auth.php';
require_once 'src/Controllers/ClientController.php';

// Simulate a file upload request
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['CONTENT_TYPE'] = 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW';
$_SERVER['REQUEST_URI'] = '/api/clients';

// Simulate file upload data
$_FILES = [
    'logo_file' => [
        'name' => 'emblem_green_gold.png',
        'type' => 'image/png',
        'tmp_name' => 'logo/emblem_green_gold.png', // Use the actual file
        'error' => UPLOAD_ERR_OK,
        'size' => filesize('logo/emblem_green_gold.png')
    ]
];

// Simulate POST data
$_POST = [
    'client_name_ar' => 'Test Debug Client',
    'client_name_en' => 'Test Debug Client',
    'client_type' => 'individual',
    'cash_pro_bono' => 'cash'
];

// Simulate authentication (bypass for testing)
class MockAuth
{
    public static function check()
    {
        return true;
    }
}

// Replace Auth class temporarily
class_alias('MockAuth', 'Auth');

echo "=== Testing File Upload ===\n";
echo "Files array:\n";
print_r($_FILES);

echo "\nPOST array:\n";
print_r($_POST);

echo "\n=== Testing Request Object ===\n";
$request = new Request();
$logoFile = $request->file('logo_file');
echo "Logo file from request:\n";
print_r($logoFile);

echo "\n=== Testing File Upload Logic ===\n";
if ($logoFile && $logoFile['error'] === UPLOAD_ERR_OK) {
    echo "File upload validation passed\n";

    $uploadDir = 'uploads/logos/';
    echo "Upload directory: " . $uploadDir . "\n";

    if (!is_dir($uploadDir)) {
        echo "Creating upload directory...\n";
        mkdir($uploadDir, 0755, true);
    }

    $fileExtension = pathinfo($logoFile['name'], PATHINFO_EXTENSION);
    $fileName = 'client_' . time() . '_' . uniqid() . '.' . $fileExtension;
    $filePath = $uploadDir . $fileName;

    echo "Target file path: " . $filePath . "\n";

    // Copy the file instead of move_uploaded_file since it's not a real upload
    if (copy($logoFile['tmp_name'], $filePath)) {
        echo "File copied successfully to: " . $filePath . "\n";
        echo "File size: " . filesize($filePath) . " bytes\n";
    } else {
        echo "Failed to copy file\n";
    }
} else {
    echo "File upload validation failed\n";
    if ($logoFile) {
        echo "Error code: " . $logoFile['error'] . "\n";
    }
}

