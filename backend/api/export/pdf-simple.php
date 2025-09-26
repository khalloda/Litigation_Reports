<?php
/**
 * Simple PDF Export API using DomPDF (lightweight alternative)
 * Provides better Arabic support than client-side jsPDF
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

    // Generate HTML content with proper Arabic styling
    $html = '<!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <title>' . htmlspecialchars($title) . '</title>
        <style>
            @page {
                margin: 15mm;
                font-family: "Arial Unicode MS", "Tahoma", sans-serif;
            }
            body {
                font-family: "Arial Unicode MS", "Tahoma", sans-serif;
                direction: rtl;
                text-align: right;
                font-size: 12px;
                margin: 0;
                padding: 20px;
                background: white;
            }
            .title {
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 30px;
                color: #2c3e50;
                border-bottom: 2px solid #428bca;
                padding-bottom: 10px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 0 auto;
                font-size: 11px;
                background: white;
            }
            th {
                background-color: #428bca;
                color: white;
                padding: 12px 8px;
                text-align: center;
                border: 1px solid #ddd;
                font-weight: bold;
                font-size: 12px;
            }
            td {
                padding: 8px;
                border: 1px solid #ddd;
                text-align: center;
                vertical-align: middle;
                word-wrap: break-word;
            }
            tr:nth-child(even) {
                background-color: #f8f9fa;
            }
            .english {
                direction: ltr;
                text-align: left;
            }
            .number {
                direction: ltr;
                text-align: center;
                font-family: monospace;
            }
            .footer {
                position: fixed;
                bottom: 10px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 10px;
                color: #666;
            }
        </style>
    </head>
    <body>';

    $html .= '<div class="title">' . htmlspecialchars($title) . '</div>';

    // Build table
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

            // Format value based on type
            $cellClass = '';
            if (is_numeric($value)) {
                $cellClass = 'number';
            } elseif (preg_match('/^[a-zA-Z0-9\s\-_.@]+$/', $value)) {
                $cellClass = 'english';
            }

            $html .= '<td class="' . $cellClass . '">' . htmlspecialchars($value) . '</td>';
        }
        $html .= '</tr>';
    }
    $html .= '</tbody></table>';

    $html .= '<div class="footer">تم إنشاء هذا التقرير في ' . date('Y-m-d H:i:s') . '</div>';

    $html .= '</body></html>';

    // Set headers for PDF download
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="' . $filename . '.pdf"');
    header('Cache-Control: private, max-age=0, must-revalidate');
    header('Pragma: public');

    // Simple HTML-to-PDF conversion using wkhtmltopdf if available
    // Otherwise, provide HTML for browser's print-to-PDF
    if (exec('which wkhtmltopdf 2>/dev/null')) {
        // Use wkhtmltopdf if available
        $tempHtml = tempnam(sys_get_temp_dir(), 'pdf_export_') . '.html';
        $tempPdf = tempnam(sys_get_temp_dir(), 'pdf_export_') . '.pdf';

        file_put_contents($tempHtml, $html);

        $command = "wkhtmltopdf --page-size A4 --orientation Portrait --margin-top 15mm --margin-bottom 15mm --margin-left 10mm --margin-right 10mm '$tempHtml' '$tempPdf'";
        exec($command, $output, $return_code);

        if ($return_code === 0 && file_exists($tempPdf)) {
            readfile($tempPdf);
            unlink($tempHtml);
            unlink($tempPdf);
        } else {
            throw new Exception('PDF generation failed');
        }
    } else {
        // Fallback: Return HTML for browser print
        header('Content-Type: text/html; charset=utf-8');
        header('Content-Disposition: inline');
        echo $html;
        echo '<script>
            window.onload = function() {
                setTimeout(function() {
                    window.print();
                }, 1000);
            };
        </script>';
    }

} catch (Exception $e) {
    error_log('PDF Export Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'PDF generation failed',
        'message' => $e->getMessage()
    ]);
}
?>