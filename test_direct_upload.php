<?php
require_once 'config/config.php';
require_once 'config/database.php';

echo "=== Testing Direct File Upload Logic ===\n";

// Simulate file upload data
$logoFile = [
    'name' => 'emblem_green_gold.png',
    'type' => 'image/png',
    'tmp_name' => 'logo/emblem_green_gold.png',
    'error' => UPLOAD_ERR_OK,
    'size' => filesize('logo/emblem_green_gold.png')
];

echo "1. File upload data:\n";
print_r($logoFile);

echo "\n2. Testing file upload logic...\n";

if ($logoFile && $logoFile['error'] === UPLOAD_ERR_OK) {
    echo "   File upload validation passed\n";

    $uploadDir = 'uploads/logos/';
    echo "   Upload directory: " . $uploadDir . "\n";

    if (!is_dir($uploadDir)) {
        echo "   Creating upload directory...\n";
        mkdir($uploadDir, 0755, true);
    }

    $fileExtension = pathinfo($logoFile['name'], PATHINFO_EXTENSION);
    $fileName = 'client_' . time() . '_' . uniqid() . '.' . $fileExtension;
    $filePath = $uploadDir . $fileName;

    echo "   Target file path: " . $filePath . "\n";

    // Copy the file (simulating move_uploaded_file)
    if (copy($logoFile['tmp_name'], $filePath)) {
        echo "   File copied successfully to: " . $filePath . "\n";
        echo "   File size: " . filesize($filePath) . " bytes\n";

        // Now test database insertion
        echo "\n3. Testing database insertion...\n";

        $data = [
            'client_name_ar' => 'Test Direct Upload Client',
            'client_name_en' => 'Test Direct Upload Client',
            'client_type' => 'individual',
            'cash_pro_bono' => 'cash',
            'status' => 'active',
            'logo' => $fileName, // This is the key part!
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        try {
            $db = Database::getInstance();
            $clientId = $db->insert('clients', $data);
            echo "   Client created with ID: " . $clientId . "\n";

            // Verify the client was created with logo
            $client = $db->fetch("SELECT * FROM clients WHERE id = :id", ['id' => $clientId]);
            if ($client) {
                echo "   Client verification successful:\n";
                echo "     ID: " . $client['id'] . "\n";
                echo "     Name: " . $client['client_name_en'] . "\n";
                echo "     Logo: " . ($client['logo'] ?: 'NULL') . "\n";

                if ($client['logo']) {
                    echo "   ✅ SUCCESS: Client created with logo!\n";
                } else {
                    echo "   ❌ FAILED: Client created but logo is NULL\n";
                }
            } else {
                echo "   ❌ FAILED: Client verification failed\n";
            }
        } catch (Exception $e) {
            echo "   ❌ Database error: " . $e->getMessage() . "\n";
        }
    } else {
        echo "   ❌ Failed to copy file\n";
    }
} else {
    echo "   ❌ File upload validation failed\n";
    if ($logoFile) {
        echo "   Error code: " . $logoFile['error'] . "\n";
    }
}

echo "\n4. Checking all uploaded files...\n";
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

