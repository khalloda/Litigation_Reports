<?php
/**
 * PDF Export API using Chrome Headless for perfect Arabic support
 *
 * This endpoint generates PDF files using Chrome headless for superior
 * Arabic text rendering and modern CSS support
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    $data = $input['data'] ?? [];
    $columns = $input['columns'] ?? [];
    $title = $input['title'] ?? 'تقرير';
    $filename = $input['filename'] ?? 'export_' . date('Y-m-d');

    if (empty($data)) {
        throw new Exception('No data provided for export');
    }

    // Chrome executable path for Windows
    $chromePath = '"C:\Program Files\Google\Chrome\Application\chrome.exe"';

    // Create temp directory if it doesn't exist
    $tempDir = __DIR__ . '/../../temp';
    if (!file_exists($tempDir)) {
        mkdir($tempDir, 0755, true);
    }

    // Generate HTML content with excellent Arabic styling for Chrome
    $html = '<!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>' . htmlspecialchars($title) . '</title>
        <style>
            @page {
                size: A4;
                margin: 15mm;
            }

            * {
                box-sizing: border-box;
            }

            body {
                font-family: "Segoe UI", Tahoma, Arial, sans-serif;
                direction: rtl;
                text-align: right;
                font-size: 12px;
                margin: 0;
                padding: 0;
                background: white;
                color: #333;
                line-height: 1.4;
            }

            .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 3px solid #428bca;
                padding-bottom: 15px;
            }

            .title {
                font-size: 22px;
                font-weight: bold;
                color: #2c3e50;
                margin: 0;
                padding: 10px 0;
            }

            .subtitle {
                font-size: 14px;
                color: #7f8c8d;
                margin: 5px 0 0 0;
            }

            .table-container {
                width: 100%;
                overflow-x: auto;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin: 0;
                font-size: 11px;
                background: white;
                border: 1px solid #ddd;
            }

            th {
                background: linear-gradient(135deg, #428bca 0%, #357abd 100%);
                color: white;
                padding: 12px 8px;
                text-align: center;
                border: 1px solid #357abd;
                font-weight: bold;
                font-size: 12px;
                white-space: nowrap;
            }

            td {
                padding: 10px 8px;
                border: 1px solid #ddd;
                text-align: center;
                vertical-align: middle;
                word-wrap: break-word;
                max-width: 200px;
            }

            tr:nth-child(even) {
                background-color: #f8f9fa;
            }

            tr:hover {
                background-color: #e9ecef;
            }

            .english {
                direction: ltr;
                text-align: left;
                font-family: "Courier New", monospace;
            }

            .number {
                direction: ltr;
                text-align: center;
                font-family: "Courier New", monospace;
                font-weight: bold;
            }

            .status-active {
                color: #28a745;
                font-weight: bold;
            }

            .status-inactive {
                color: #dc3545;
                font-weight: bold;
            }

            .footer {
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #ddd;
                text-align: center;
                font-size: 10px;
                color: #6c757d;
            }

            .export-info {
                margin-bottom: 10px;
                font-size: 10px;
                color: #6c757d;
            }

            /* Print specific styles */
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                .header {
                    break-inside: avoid;
                }

                tr {
                    break-inside: avoid;
                }

                th {
                    break-after: avoid;
                }
            }
        </style>
    </head>
    <body>';

    // Add header
    $html .= '<div class="header">';
    $html .= '<h1 class="title">' . htmlspecialchars($title) . '</h1>';
    $html .= '<p class="subtitle">تم إنشاء هذا التقرير بتاريخ ' . date('Y-m-d H:i:s') . '</p>';
    $html .= '</div>';

    // Add export info
    $html .= '<div class="export-info">';
    $html .= 'عدد السجلات: ' . count($data) . ' | ';
    $html .= 'عدد الأعمدة: ' . count($columns);
    $html .= '</div>';

    // Build table
    $html .= '<div class="table-container">';
    $html .= '<table>';

    // Table headers
    $html .= '<thead><tr>';
    foreach ($columns as $column) {
        $label = isset($column['label']) ? $column['label'] : $column['key'];
        $html .= '<th>' . htmlspecialchars($label) . '</th>';
    }
    $html .= '</tr></thead>';

    // Table body
    $html .= '<tbody>';
    foreach ($data as $row) {
        $html .= '<tr>';
        foreach ($columns as $column) {
            $key = $column['key'];
            $value = $row[$key] ?? '';

            // Apply transformation if provided
            if (isset($column['transform']) && is_callable($column['transform'])) {
                $value = call_user_func($column['transform'], $value);
            }

            // Format based on data type and add appropriate CSS classes
            $cellClass = '';
            $processedValue = htmlspecialchars($value);

            // Check for status values
            if (in_array(strtolower($value), ['نشط', 'active', 'مفعل'])) {
                $cellClass = 'status-active';
            } elseif (in_array(strtolower($value), ['غير نشط', 'inactive', 'معطل'])) {
                $cellClass = 'status-inactive';
            }
            // Check for numbers
            elseif (is_numeric($value)) {
                $cellClass = 'number';
            }
            // Check for English text (basic detection)
            elseif (preg_match('/^[a-zA-Z0-9\s\-_.@]+$/', $value)) {
                $cellClass = 'english';
            }

            $html .= '<td class="' . $cellClass . '">' . $processedValue . '</td>';
        }
        $html .= '</tr>';
    }
    $html .= '</tbody></table>';
    $html .= '</div>';

    // Add footer
    $html .= '<div class="footer">';
    $html .= '<p>نظام إدارة القضايا القانونية - ' . date('Y') . '</p>';
    $html .= '<p>هذا التقرير تم إنشاؤه تلقائياً بواسطة النظام</p>';
    $html .= '</div>';

    $html .= '</body></html>';

    // Create temporary HTML file
    $tempHtml = $tempDir . '/' . uniqid('pdf_export_') . '.html';
    $tempPdf = $tempDir . '/' . uniqid('pdf_export_') . '.pdf';

    // Write HTML to temp file
    if (!file_put_contents($tempHtml, $html)) {
        throw new Exception('Failed to create temporary HTML file');
    }

    // Build Chrome command for PDF generation
    $htmlPath = str_replace('/', '\\', realpath($tempHtml));
    $pdfPath = str_replace('/', '\\', realpath(dirname($tempPdf)) . '/' . basename($tempPdf));

    // Use file:// protocol for local file access
    $htmlUrl = 'file:///' . str_replace('\\', '/', $htmlPath);

    $command = $chromePath . ' --headless --disable-gpu --disable-software-rasterizer --disable-dev-shm-usage --no-sandbox --print-to-pdf="' . $pdfPath . '" "' . $htmlUrl . '" 2>&1';

    // Execute Chrome command
    $output = [];
    $returnCode = 0;
    exec($command, $output, $returnCode);

    // Clean up HTML file immediately
    if (file_exists($tempHtml)) {
        unlink($tempHtml);
    }

    // Check if PDF was generated successfully
    if ($returnCode !== 0 || !file_exists($tempPdf)) {
        $errorMsg = 'PDF generation failed. Chrome output: ' . implode(' ', $output);
        error_log($errorMsg);
        throw new Exception($errorMsg);
    }

    // Verify PDF file is not empty
    $pdfSize = filesize($tempPdf);
    if ($pdfSize < 1000) { // Less than 1KB is likely an error
        error_log('Generated PDF is too small: ' . $pdfSize . ' bytes');
        if (file_exists($tempPdf)) {
            unlink($tempPdf);
        }
        throw new Exception('Generated PDF appears to be corrupted or empty');
    }

    // Set headers for PDF download
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="' . $filename . '.pdf"');
    header('Content-Length: ' . $pdfSize);
    header('Cache-Control: no-cache, must-revalidate');
    header('Pragma: no-cache');

    // Output PDF content
    readfile($tempPdf);

    // Clean up PDF file
    unlink($tempPdf);

    // Log success
    error_log('PDF export completed successfully: ' . $filename . '.pdf (' . $pdfSize . ' bytes)');

} catch (Exception $e) {
    error_log('Chrome PDF Export Error: ' . $e->getMessage());

    // Clean up any remaining temp files
    if (isset($tempHtml) && file_exists($tempHtml)) {
        unlink($tempHtml);
    }
    if (isset($tempPdf) && file_exists($tempPdf)) {
        unlink($tempPdf);
    }

    http_response_code(500);
    echo json_encode([
        'error' => 'PDF generation failed',
        'message' => $e->getMessage()
    ]);
}
?>