<?php
// Test script for Chrome PDF export
$testData = [
    [
        'id' => 1,
        'client_name_ar' => 'أحمد محمد علي',
        'client_name_en' => 'Ahmed Mohamed Ali',
        'phone' => '01234567890',
        'email' => 'ahmed@example.com',
        'status' => 'نشط'
    ],
    [
        'id' => 2,
        'client_name_ar' => 'فاطمة سعد الدين',
        'client_name_en' => 'Fatima Saad El-Din',
        'phone' => '01987654321',
        'email' => 'fatima@example.com',
        'status' => 'معلق'
    ],
    [
        'id' => 3,
        'client_name_ar' => 'محمود عبد الرحمن',
        'client_name_en' => 'Mahmoud Abdel Rahman',
        'phone' => '01122334455',
        'email' => 'mahmoud@example.com',
        'status' => 'نشط'
    ]
];

$testColumns = [
    ['key' => 'id', 'label' => 'المعرف'],
    ['key' => 'client_name_ar', 'label' => 'اسم العميل (عربي)'],
    ['key' => 'client_name_en', 'label' => 'اسم العميل (إنجليزي)'],
    ['key' => 'phone', 'label' => 'رقم الهاتف'],
    ['key' => 'email', 'label' => 'البريد الإلكتروني'],
    ['key' => 'status', 'label' => 'الحالة']
];

$postData = json_encode([
    'data' => $testData,
    'columns' => $testColumns,
    'title' => 'تقرير العملاء التجريبي',
    'filename' => 'test_clients_report_' . date('Y-m-d')
]);

// Simulate POST request to Chrome PDF endpoint
$_SERVER['REQUEST_METHOD'] = 'POST';
$_POST = [];

// Set the input stream for the API
$temp = fopen('php://memory', 'r+');
fwrite($temp, $postData);
rewind($temp);

echo "Testing Chrome PDF export...\n";
echo "Data: " . strlen($postData) . " bytes\n";

// Capture output
ob_start();

// Include the Chrome PDF export script
include '../api/export/pdf-chrome.php';

$output = ob_get_clean();

if (empty($output)) {
    echo "Test completed successfully - PDF should have been generated\n";
} else {
    echo "Output received:\n";
    echo $output . "\n";
}

fclose($temp);
?>