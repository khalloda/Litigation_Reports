/**
 * Export utilities for CSV, Excel and PDF functionality
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
  key: string;
  label: string;
  transform?: (value: any) => string;
}

export interface ExportOptions {
  filename?: string;
  columns?: ExportColumn[];
  title?: string;
}

/**
 * Export data to CSV format with improved Arabic text support
 */
export const exportToCSV = (data: any[], options: ExportOptions = {}) => {
  if (!data || data.length === 0) {
    alert('لا توجد بيانات للتصدير');
    return;
  }

  const { filename = `export_${new Date().toISOString().split('T')[0]}`, columns, title } = options;

  // Determine columns to export
  const exportColumns = columns || Object.keys(data[0]).map(key => ({ key, label: key }));

  // Build CSV content with proper Arabic text handling
  const csvRows: string[] = [];

  // Add title if provided
  if (title) {
    csvRows.push(`"${title}"`);
    csvRows.push(''); // Empty row
  }

  // Add headers
  const headers = exportColumns.map(col => `"${col.label}"`);
  csvRows.push(headers.join(','));

  // Add data rows
  data.forEach(row => {
    const values = exportColumns.map(col => {
      let value = row[col.key];

      // Apply transformation if provided
      if (col.transform) {
        value = col.transform(value);
      }

      // Handle null/undefined values
      if (value === null || value === undefined) {
        value = '';
      }

      // Convert to string and properly escape for CSV
      const stringValue = String(value).replace(/\r?\n/g, ' '); // Replace newlines with spaces

      // Always quote values to ensure Arabic text is preserved
      return `"${stringValue.replace(/"/g, '""')}"`;
    });

    csvRows.push(values.join(','));
  });

  const csvContent = csvRows.join('\r\n'); // Use CRLF for better compatibility

  // Create blob with UTF-8 BOM for proper Arabic text display
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;'
  });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export data to Excel format with improved Arabic text support
 */
export const exportToExcel = (data: any[], options: ExportOptions = {}) => {
  if (!data || data.length === 0) {
    alert('لا توجد بيانات للتصدير');
    return;
  }

  const { filename = `export_${new Date().toISOString().split('T')[0]}`, columns, title } = options;

  // Determine columns to export
  const exportColumns = columns || Object.keys(data[0]).map(key => ({ key, label: key }));

  try {
    // Build Excel content with proper Arabic text handling
    const excelRows: string[] = [];

    // Add title if provided
    if (title) {
      excelRows.push(title);
      excelRows.push(''); // Empty row
    }

    // Add headers
    const headers = exportColumns.map(col => col.label);
    excelRows.push(headers.join('\t'));

    // Add data rows
    data.forEach(row => {
      const values = exportColumns.map(col => {
        let value = row[col.key];

        // Apply transformation if provided
        if (col.transform) {
          value = col.transform(value);
        }

        // Handle null/undefined values
        if (value === null || value === undefined) {
          return '';
        }

        // Properly handle Arabic text and special characters
        return String(value).replace(/\r?\n/g, ' ').replace(/\t/g, ' ');
      });

      excelRows.push(values.join('\t'));
    });

    const excelContent = excelRows.join('\r\n');

    // Create blob with UTF-8 BOM for proper Arabic text display
    const blob = new Blob(['\uFEFF' + excelContent], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (err) {
    console.error('Excel export error:', err);
    // Fallback to CSV if Excel export fails
    exportToCSV(data, options);
  }
};

/**
 * Format date for export
 */
export const formatDateForExport = (dateString: string): string => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('ar-EG');
  } catch {
    return dateString;
  }
};

/**
 * Format currency for export
 */
export const formatCurrencyForExport = (amount: number, currency = 'EGP'): string => {
  if (amount === null || amount === undefined) return '';
  try {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch {
    return String(amount);
  }
};

/**
 * Format boolean for export (Arabic)
 */
export const formatBooleanForExport = (value: boolean): string => {
  if (value === null || value === undefined) return '';
  return value ? 'نعم' : 'لا';
};

/**
 * Export data to PDF format with server-side Arabic text support
 */
export const exportToPDF = async (data: any[], options: ExportOptions = {}) => {
  if (!data || data.length === 0) {
    alert('لا توجد بيانات للتصدير');
    return;
  }

  const { filename = `export_${new Date().toISOString().split('T')[0]}`, columns, title } = options;

  // Determine columns to export
  const exportColumns = columns || Object.keys(data[0]).map(key => ({ key, label: key }));

  try {
    // Prepare data for server-side PDF generation
    const pdfData = {
      data: data,
      columns: exportColumns,
      title: title || 'تقرير',
      filename: filename
    };

    console.log('Generating PDF with Chrome Headless for perfect Arabic support...');

    // Call backend API for PDF generation (Chrome-based)
    const response = await fetch('/backend/api/export/pdf-chrome.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pdfData)
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Check if response is JSON (error) or PDF
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      // Error response
      const errorData = await response.json();
      throw new Error(errorData.message || 'Server error');
    }

    // Success - handle PDF download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('PDF export completed successfully with Chrome Headless');

  } catch (err) {
    console.error('Chrome PDF export error:', err);

    // Fallback to client-side PDF generation
    console.log('Falling back to client-side PDF generation...');
    try {
      await exportToPDFClientSide(data, options);
    } catch (clientErr) {
      console.error('Client-side PDF export also failed:', clientErr);
      alert('حدث خطأ في تصدير PDF، سيتم تصدير CSV بدلاً من ذلك');
      // Final fallback to CSV
      exportToCSV(data, options);
    }
  }
};

/**
 * Client-side PDF generation fallback (original implementation)
 */
const exportToPDFClientSide = async (data: any[], options: ExportOptions = {}) => {
  const { filename = `export_${new Date().toISOString().split('T')[0]}`, columns, title } = options;
  const exportColumns = columns || Object.keys(data[0]).map(key => ({ key, label: key }));

  // Create new PDF document
  const doc = new jsPDF({
    orientation: exportColumns.length > 4 ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add title if provided
  if (title) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const pageWidth = doc.internal.pageSize.width;
    doc.text(String(title), pageWidth / 2, 20, {
      align: 'center',
      maxWidth: pageWidth - 40
    });
  }

  // Prepare table data
  const tableHeaders = exportColumns.map(col => String(col.label));
  const tableData = data.map(row =>
    exportColumns.map(col => {
      let value = row[col.key];

      // Apply transformation if provided
      if (col.transform) {
        value = col.transform(value);
      }

      // Handle null/undefined values
      if (value === null || value === undefined) {
        return '';
      }

      return String(value);
    })
  );

  // Add table to PDF
  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: title ? 35 : 20,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      halign: 'center',
      valign: 'middle',
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255],
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 10
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    },
    margin: { top: 15, right: 15, bottom: 20, left: 15 },
    theme: 'striped'
  });

  // Save the PDF
  doc.save(`${filename}.pdf`);
};

/**
 * Common export columns for different entities
 */
export const EXPORT_COLUMNS = {
  clients: [
    { key: 'id', label: 'المعرف' },
    { key: 'client_name_ar', label: 'اسم العميل (عربي)' },
    { key: 'client_name_en', label: 'اسم العميل (إنجليزي)' },
    { key: 'client_type', label: 'نوع العميل' },
    { key: 'phone', label: 'رقم الهاتف' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'status', label: 'الحالة' },
    { key: 'created_at', label: 'تاريخ التسجيل', transform: formatDateForExport },
  ],
  cases: [
    { key: 'id', label: 'المعرف' },
    { key: 'matter_id', label: 'رقم القضية' },
    { key: 'matter_ar', label: 'عنوان القضية (عربي)' },
    { key: 'matter_en', label: 'عنوان القضية (إنجليزي)' },
    { key: 'matter_category', label: 'نوع القضية' },
    { key: 'matter_status', label: 'حالة القضية' },
    { key: 'matter_court', label: 'المحكمة' },
    { key: 'created_at', label: 'تاريخ الإنشاء', transform: formatDateForExport },
  ],
  hearings: [
    { key: 'id', label: 'المعرف' },
    { key: 'hearing_date', label: 'تاريخ الجلسة', transform: formatDateForExport },
    { key: 'hearing_type', label: 'نوع الجلسة' },
    { key: 'hearing_result', label: 'نتيجة الجلسة' },
    { key: 'case_number', label: 'رقم القضية' },
    { key: 'case_title_ar', label: 'عنوان القضية' },
    { key: 'court_name', label: 'المحكمة' },
    { key: 'created_at', label: 'تاريخ الإنشاء', transform: formatDateForExport },
  ],
  invoices: [
    { key: 'id', label: 'المعرف' },
    { key: 'invoice_number', label: 'رقم الفاتورة' },
    { key: 'invoice_date', label: 'تاريخ الفاتورة', transform: formatDateForExport },
    { key: 'amount', label: 'المبلغ', transform: (value: number) => formatCurrencyForExport(value) },
    { key: 'currency', label: 'العملة' },
    { key: 'invoice_type', label: 'نوع الفاتورة' },
    { key: 'invoice_status', label: 'حالة الفاتورة' },
    { key: 'payment_date', label: 'تاريخ الدفع', transform: formatDateForExport },
    { key: 'created_at', label: 'تاريخ الإنشاء', transform: formatDateForExport },
  ],
  lawyers: [
    { key: 'id', label: 'المعرف' },
    { key: 'name_ar', label: 'اسم المحامي (عربي)' },
    { key: 'name_en', label: 'اسم المحامي (إنجليزي)' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'phone', label: 'رقم الهاتف' },
    { key: 'specialization', label: 'التخصص' },
    { key: 'license_number', label: 'رقم الترخيص' },
    { key: 'is_active', label: 'نشط', transform: formatBooleanForExport },
    { key: 'created_at', label: 'تاريخ التسجيل', transform: formatDateForExport },
  ],
  documents: [
    { key: 'id', label: 'المعرف' },
    { key: 'title', label: 'عنوان المستند' },
    { key: 'document_type', label: 'نوع المستند' },
    { key: 'case_number', label: 'رقم القضية' },
    { key: 'file_name', label: 'اسم الملف' },
    { key: 'file_size', label: 'حجم الملف' },
    { key: 'uploaded_by', label: 'رفع بواسطة' },
    { key: 'created_at', label: 'تاريخ الرفع', transform: formatDateForExport },
  ],
};