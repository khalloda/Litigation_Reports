<?php
/**
 * PDF Export API using mPDF for better Arabic support
 *
 * This endpoint generates PDF files with proper Arabic text rendering
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

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/database.php';

use Mpdf\Mpdf;

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

    // Create mPDF instance with Arabic support
    $mpdf = new Mpdf([
        'mode' => 'utf-8',
        'format' => 'A4',
        'orientation' => count($columns) > 6 ? 'L' : 'P',
        'margin_left' => 15,
        'margin_right' => 15,
        'margin_top' => 20,
        'margin_bottom' => 20,
        'default_font' => 'dejavusans', // Supports Arabic
        'direction' => 'rtl', // Right-to-left for Arabic
        'tempDir' => __DIR__ . '/../../temp'
    ]);

    // Set CSS for proper Arabic display
    $css = '
    <style>
    body {
        font-family: "DejaVu Sans", sans-serif;
        direction: rtl;
        text-align: right;
        font-size: 12px;
    }
    .title {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
        color: #2c3e50;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 0 auto;
        font-size: 10px;
    }
    th {
        background-color: #428bca;
        color: white;
        padding: 8px;
        text-align: center;
        border: 1px solid #ddd;
        font-weight: bold;
    }
    td {
        padding: 6px 8px;
        border: 1px solid #ddd;
        text-align: center;
        vertical-align: middle;
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
    }
    .number {
        direction: ltr;
        text-align: center;
    }
    </style>
    ';

    // Start building HTML content
    $html = $css . '<div class="title">' . htmlspecialchars($title) . '</div>';

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

            // Apply transformation if provided
            if (isset($column['transform']) && is_callable($column['transform'])) {
                $value = call_user_func($column['transform'], $value);
            }

            // Format based on data type
            $cellClass = '';
            if (is_numeric($value) || preg_match('/^\d/', $value)) {
                $cellClass = 'number';
            } elseif (preg_match('/[a-zA-Z]/', $value) && !preg_match('/[\u0600-\u06FF]/', $value)) {
                $cellClass = 'english';
            }

            $html .= '<td class="' . $cellClass . '">' . htmlspecialchars($value) . '</td>';
        }
        $html .= '</tr>';
    }
    $html .= '</tbody></table>';

    // Add footer with page numbers
    $html .= '<div style="position: fixed; bottom: 10px; left: 0; right: 0; text-align: center; font-size: 8px;">';
    $html .= 'صفحة {PAGENO} من {nb} | Page {PAGENO} of {nb}';
    $html .= '</div>';

    // Write HTML to PDF
    $mpdf->WriteHTML($html);

    // Set the filename for download
    $pdfFilename = $filename . '.pdf';

    // Output PDF for download
    $mpdf->Output($pdfFilename, 'D'); // 'D' for download

} catch (Exception $e) {
    error_log('PDF Export Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'PDF generation failed',
        'message' => $e->getMessage()
    ]);
}
?>