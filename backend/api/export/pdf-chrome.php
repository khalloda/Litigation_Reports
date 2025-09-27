<?php
/**
 * PDF Export API using Puppeteer for perfect Arabic support
 *
 * This endpoint generates PDF files using Puppeteer with superior
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

    // Create temp directory if it doesn't exist
    $tempDir = __DIR__ . '/../../temp';
    if (!file_exists($tempDir)) {
        mkdir($tempDir, 0755, true);
    }

    // Path to Node.js PDF generator script
    $pdfGeneratorPath = __DIR__ . '/../../pdf-generator.js';

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
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 30px;
                border-bottom: 3px solid #2c5f2d;
                padding-bottom: 15px;
                min-height: 80px;
            }

            .logo-section {
                flex: 0 0 auto;
                margin-left: 20px;
            }

            .logo {
                max-height: 60px;
                max-width: 120px;
                object-fit: contain;
            }

            .title-section {
                flex: 1;
                text-align: center;
            }

            .title {
                font-size: 22px;
                font-weight: bold;
                color: #000000;
                margin: 0;
                padding: 10px 0;
            }

            .subtitle {
                font-size: 14px;
                color: #2c5f2d;
                margin: 5px 0 0 0;
                font-weight: 500;
            }

            .table-container {
                width: 100%;
                overflow-x: auto;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin: 0;
                font-size: 10px;
                background: white;
                border: 1px solid #ddd;
                table-layout: fixed;
            }

            th {
                background: linear-gradient(135deg, #2c5f2d 0%, #1e4220 100%);
                color: #d4af37;
                padding: 8px 4px;
                text-align: center;
                border: 1px solid #1e4220;
                font-weight: bold;
                font-size: 10px;
                white-space: normal;
                word-wrap: break-word;
                overflow: hidden;
                text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
            }

            td {
                padding: 6px 4px;
                border: 1px solid #ddd;
                text-align: center;
                vertical-align: middle;
                word-wrap: break-word;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 9px;
                color: #000000;
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
                color: #2c5f2d;
                font-weight: bold;
            }

            .status-inactive {
                color: #8b4513;
                font-weight: bold;
            }

            .footer {
                margin-top: 30px;
                padding-top: 15px;
                border-top: 2px solid #2c5f2d;
                text-align: center;
                font-size: 10px;
                color: #000000;
                background: linear-gradient(90deg, rgba(44,95,45,0.1) 0%, rgba(212,175,55,0.1) 100%);
                padding: 15px;
            }

            .export-info {
                margin-bottom: 10px;
                font-size: 10px;
                color: #2c5f2d;
                font-weight: 500;
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

    // Add header with logo
    $logoPath = __DIR__ . '/../../public/arabic_green_gold_logo.png';
    $logoBase64 = '';

    // Convert logo to base64 for embedding in PDF
    if (file_exists($logoPath)) {
        $logoData = file_get_contents($logoPath);
        $logoBase64 = 'data:image/png;base64,' . base64_encode($logoData);
    }

    $html .= '<div class="header">';
    $html .= '<div class="logo-section">';
    if ($logoBase64) {
        $html .= '<img src="' . $logoBase64 . '" alt="شعار الشركة" class="logo" />';
    } else {
        $html .= '<div class="logo-placeholder" style="width: 120px; height: 60px; border: 2px solid #2c5f2d; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #2c5f2d;">شعار الشركة</div>';
    }
    $html .= '</div>';
    $html .= '<div class="title-section">';
    $html .= '<h1 class="title">' . htmlspecialchars($title) . '</h1>';
    $html .= '<p class="subtitle">تم إنشاء هذا التقرير بتاريخ ' . date('Y-m-d H:i:s') . '</p>';
    $html .= '</div>';
    $html .= '<div style="flex: 0 0 auto; width: 120px;"></div>'; // Balance the layout
    $html .= '</div>';

    // Add export info
    $html .= '<div class="export-info">';
    $html .= 'عدد السجلات: ' . count($data) . ' | ';
    $html .= 'عدد الأعمدة: ' . count($columns);
    $html .= '</div>';

    // Calculate dynamic column width and font adjustments based on column count
    $columnCount = count($columns);
    $dynamicStyles = '';

    if ($columnCount > 8) {
        // Many columns: smaller font and padding
        $dynamicStyles = '
            <style>
                th, td { font-size: 8px !important; padding: 4px 2px !important; }
                th { color: #d4af37 !important; background: linear-gradient(135deg, #2c5f2d 0%, #1e4220 100%) !important; }
                td { color: #000000 !important; }
                .title { font-size: 18px !important; }
            </style>';
    } elseif ($columnCount > 5) {
        // Medium columns: slightly smaller
        $dynamicStyles = '
            <style>
                th, td { font-size: 9px !important; padding: 5px 3px !important; }
                th { color: #d4af37 !important; background: linear-gradient(135deg, #2c5f2d 0%, #1e4220 100%) !important; }
                td { color: #000000 !important; }
                .title { font-size: 20px !important; }
            </style>';
    }

    $html .= $dynamicStyles;

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
    $html .= '<p><strong>مكتب سري الدين وشركاه مستشارون قانونيون</strong></p>';
    $html .= '<p>نظام إدارة القضايا القانونية - ' . date('Y') . ' | هذا التقرير تم إنشاؤه تلقائياً بواسطة النظام</p>';
    $html .= '</div>';

    $html .= '</body></html>';

    // Create temporary PDF file path
    $tempPdf = $tempDir . '/' . uniqid('pdf_export_') . '.pdf';

    // Prepare data for Puppeteer script
    $puppeteerData = [
        'html' => $html,
        'filename' => $tempPdf
    ];

    // Write Puppeteer input to temporary JSON file to avoid command line escaping issues
    $tempJson = $tempDir . '/' . uniqid('pdf_input_') . '.json';
    if (!file_put_contents($tempJson, json_encode($puppeteerData, JSON_UNESCAPED_UNICODE))) {
        throw new Exception('Failed to create temporary JSON input file');
    }

    // Build Node.js command for PDF generation using stdin
    $command = 'cat "' . $tempJson . '" | node "' . $pdfGeneratorPath . '" 2>&1';

    // Execute Puppeteer command
    $output = [];
    $returnCode = 0;
    exec($command, $output, $returnCode);

    // Check if PDF was generated successfully
    if ($returnCode !== 0 || !file_exists($tempPdf)) {
        $errorMsg = 'PDF generation failed. Puppeteer output: ' . implode(' ', $output);
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

    // Validate PDF structure and attachment block format
    $validatorPath = __DIR__ . '/../../pdf-validator.js';
    $validationCommand = 'node "' . $validatorPath . '" "' . $tempPdf . '" 2>&1';
    $validationOutput = [];
    $validationReturnCode = 0;
    exec($validationCommand, $validationOutput, $validationReturnCode);

    if ($validationReturnCode !== 0) {
        $errorMsg = 'PDF validation failed: ' . implode(' ', $validationOutput);
        error_log($errorMsg);
        if (file_exists($tempPdf)) {
            unlink($tempPdf);
        }
        throw new Exception($errorMsg);
    }

    // Log successful validation
    $validationResult = implode(' ', $validationOutput);
    error_log('PDF validation passed: ' . $validationResult);

    // Set headers for PDF download
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="' . $filename . '.pdf"');
    header('Content-Length: ' . $pdfSize);
    header('Cache-Control: no-cache, must-revalidate');
    header('Pragma: no-cache');

    // Output PDF content
    readfile($tempPdf);

    // Clean up temporary files
    unlink($tempPdf);
    if (file_exists($tempJson)) {
        unlink($tempJson);
    }

    // Log success
    error_log('PDF export completed successfully: ' . $filename . '.pdf (' . $pdfSize . ' bytes)');

} catch (Exception $e) {
    error_log('Puppeteer PDF Export Error: ' . $e->getMessage());

    // Clean up any remaining temp files
    if (isset($tempPdf) && file_exists($tempPdf)) {
        unlink($tempPdf);
    }
    if (isset($tempJson) && file_exists($tempJson)) {
        unlink($tempJson);
    }

    http_response_code(500);
    echo json_encode([
        'error' => 'PDF generation failed',
        'message' => $e->getMessage()
    ]);
}
?>