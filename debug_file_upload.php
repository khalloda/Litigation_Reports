<?php
require_once 'config/config.php';
require_once 'src/Core/Request.php';

echo "=== File Upload Debug ===\n";
echo "Request Method: " . ($_SERVER['REQUEST_METHOD'] ?? 'Not set') . "\n";
echo "Content-Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'Not set') . "\n";
echo "Content-Length: " . ($_SERVER['CONTENT_LENGTH'] ?? 'Not set') . "\n\n";

echo "=== \$_FILES Array ===\n";
if (empty($_FILES)) {
    echo "No files uploaded\n";
} else {
    print_r($_FILES);
}

echo "\n=== \$_POST Array ===\n";
if (empty($_POST)) {
    echo "No POST data\n";
} else {
    print_r($_POST);
}

echo "\n=== Request Object ===\n";
$request = new Request();
echo "Files from Request object:\n";
print_r($request->files());

echo "\n=== Upload Directory Check ===\n";
$uploadDir = 'uploads/logos/';
echo "Upload directory: " . $uploadDir . "\n";
echo "Directory exists: " . (is_dir($uploadDir) ? 'Yes' : 'No') . "\n";
echo "Directory writable: " . (is_writable($uploadDir) ? 'Yes' : 'No') . "\n";

if (is_dir($uploadDir)) {
    echo "Directory contents:\n";
    $files = scandir($uploadDir);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            echo "  - " . $file . "\n";
        }
    }
}

