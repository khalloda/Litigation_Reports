import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('Reports Page PDF Export - Fixed', () => {
  test('Reports Page PDF Export with Table Data', async ({ page }) => {
    console.log('🧪 Testing Reports page PDF export with data...');

    // Navigate and login
    await page.goto(BASE_URL);
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Navigate to Reports page
    await page.click('a[href="/reports"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Generate a clients report first to have data for export
    const clientsReportButton = page.locator('button').filter({ hasText: 'عرض' }).first();
    await expect(clientsReportButton).toBeVisible({ timeout: 10000 });
    await clientsReportButton.click();

    // Wait for report to load
    await page.waitForTimeout(3000);

    // Check if report modal opened with data
    const reportModal = page.locator('.modal').filter({ hasText: 'تقرير العملاء التفصيلي' });
    await expect(reportModal).toBeVisible({ timeout: 10000 });

    console.log('✅ Report modal opened');

    // Look for export button in the modal
    const exportButton = reportModal.locator('button').filter({ hasText: 'تصدير' });
    await expect(exportButton).toBeVisible({ timeout: 5000 });
    await exportButton.click();

    // Wait for export options modal
    await page.waitForTimeout(1000);

    // Set up network interception to capture PDF API call
    let pdfApiCalled = false;
    let pdfResponse = null;

    page.on('response', async (response) => {
      if (response.url().includes('/api/export/pdf-chrome')) {
        pdfApiCalled = true;
        pdfResponse = response;
        console.log(`📡 PDF API call: ${response.status()} ${response.url()}`);

        const contentType = response.headers()['content-type'];
        console.log(`📝 Content-Type: ${contentType}`);

        if (contentType && contentType.includes('application/pdf')) {
          console.log('✅ PDF response received');
        } else {
          console.log(`❌ Non-PDF response: ${contentType}`);
        }
      }
    });

    // Click PDF export in the export options modal
    const pdfExportButton = page.locator('button').filter({ hasText: 'PDF' }).first();
    await expect(pdfExportButton).toBeVisible({ timeout: 5000 });
    await pdfExportButton.click();

    // Wait for API call
    await page.waitForTimeout(5000);

    // Verify API was called
    expect(pdfApiCalled).toBe(true);
    console.log('✅ PDF export API was called from Reports page');

    // Verify response
    if (pdfResponse) {
      expect(pdfResponse.status()).toBe(200);
      const contentType = pdfResponse.headers()['content-type'];
      expect(contentType).toContain('application/pdf');
      console.log('✅ Reports page PDF export working correctly');
    }

    console.log('✅ Reports page PDF export test completed');
  });

  test('PDF Table Formatting with Many Columns', async ({ request }) => {
    console.log('🧪 Testing PDF table formatting with many columns...');

    // Create test data with many columns to test responsive formatting
    const testDataManyColumns = [
      {
        id: 1,
        client_name_ar: "عميل طويل الاسم جداً",
        client_name_en: "Very Long Client Name",
        client_type: "company",
        status: "active",
        phone: "01234567890",
        email: "client@example.com",
        address_ar: "عنوان طويل في مصر",
        contact_lawyer: "محامي مسؤول",
        created_at: "2024-01-15",
        cases_count: 5
      }
    ];

    // Test with many columns (should trigger responsive formatting)
    const manyColumns = [
      { key: 'id', label: 'المعرف' },
      { key: 'client_name_ar', label: 'اسم العميل (عربي)' },
      { key: 'client_name_en', label: 'اسم العميل (إنجليزي)' },
      { key: 'client_type', label: 'نوع العميل' },
      { key: 'status', label: 'الحالة' },
      { key: 'phone', label: 'رقم الهاتف' },
      { key: 'email', label: 'البريد الإلكتروني' },
      { key: 'address_ar', label: 'العنوان' },
      { key: 'contact_lawyer', label: 'المحامي المسؤول' },
      { key: 'created_at', label: 'تاريخ الإنشاء' },
      { key: 'cases_count', label: 'عدد القضايا' }
    ];

    const response = await request.post(`${BASE_URL}/api/export/pdf-chrome`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        data: testDataManyColumns,
        columns: manyColumns,
        title: 'اختبار التنسيق - أعمدة كثيرة',
        filename: 'table_formatting_test'
      }
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');

    const pdfBuffer = await response.body();
    expect(pdfBuffer.length).toBeGreaterThan(5000);

    // Verify PDF structure
    const pdfHeader = pdfBuffer.slice(0, 5).toString('ascii');
    expect(pdfHeader).toBe('%PDF-');

    console.log(`✅ Many columns PDF test passed: ${pdfBuffer.length} bytes`);
    console.log(`📊 Columns tested: ${manyColumns.length} columns`);
  });

  test('PDF Table Formatting with Medium Columns', async ({ request }) => {
    console.log('🧪 Testing PDF table formatting with medium columns...');

    const testDataMediumColumns = [
      {
        id: 1,
        client_name_ar: "عميل تجريبي",
        client_type: "individual",
        status: "active",
        phone: "01234567890",
        created_at: "2024-01-15"
      }
    ];

    // Test with medium number of columns (6 columns)
    const mediumColumns = [
      { key: 'id', label: 'المعرف' },
      { key: 'client_name_ar', label: 'اسم العميل' },
      { key: 'client_type', label: 'النوع' },
      { key: 'status', label: 'الحالة' },
      { key: 'phone', label: 'الهاتف' },
      { key: 'created_at', label: 'التاريخ' }
    ];

    const response = await request.post(`${BASE_URL}/api/export/pdf-chrome`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        data: testDataMediumColumns,
        columns: mediumColumns,
        title: 'اختبار التنسيق - أعمدة متوسطة',
        filename: 'medium_columns_test'
      }
    });

    expect(response.status()).toBe(200);
    const pdfBuffer = await response.body();
    expect(pdfBuffer.length).toBeGreaterThan(5000);

    console.log(`✅ Medium columns PDF test passed: ${pdfBuffer.length} bytes`);
    console.log(`📊 Columns tested: ${mediumColumns.length} columns`);
  });
});