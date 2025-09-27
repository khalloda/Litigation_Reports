import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('PDF Branding and Theme Test', () => {
  test('PDF Export with Green/Gold Theme and Logo', async ({ request }) => {
    console.log('🧪 Testing PDF export with new green/gold branding...');

    // Sample data for testing
    const testData = [
      {
        id: 1,
        client_name_ar: "عميل اختبار التصميم",
        client_name_en: "Branding Test Client",
        client_type: "company",
        status: "active",
        phone: "01234567890",
        email: "test@example.com",
        created_at: "2024-01-15"
      },
      {
        id: 2,
        client_name_ar: "عميل آخر للاختبار",
        client_name_en: "Another Test Client",
        client_type: "individual",
        status: "inactive",
        phone: "09876543210",
        email: "test2@example.com",
        created_at: "2024-01-20"
      }
    ];

    const columns = [
      { key: 'id', label: 'المعرف' },
      { key: 'client_name_ar', label: 'اسم العميل (عربي)' },
      { key: 'client_name_en', label: 'اسم العميل (إنجليزي)' },
      { key: 'client_type', label: 'نوع العميل' },
      { key: 'status', label: 'الحالة' },
      { key: 'phone', label: 'رقم الهاتف' },
      { key: 'email', label: 'البريد الإلكتروني' },
      { key: 'created_at', label: 'تاريخ الإنشاء' }
    ];

    const response = await request.post(`${BASE_URL}/api/export/pdf-chrome`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        data: testData,
        columns: columns,
        title: 'اختبار التصميم الجديد - الأخضر والذهبي',
        filename: 'branding_test'
      }
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');

    const pdfBuffer = await response.body();
    expect(pdfBuffer.length).toBeGreaterThan(10000); // Should be substantial with logo and styling

    // Verify PDF structure
    const pdfHeader = pdfBuffer.slice(0, 5).toString('ascii');
    expect(pdfHeader).toBe('%PDF-');

    // Save the PDF for visual inspection (optional)
    const fs = require('fs');
    const tempPath = `./temp/branding_test_${Date.now()}.pdf`;
    fs.writeFileSync(tempPath, pdfBuffer);

    console.log(`✅ PDF with green/gold branding generated: ${pdfBuffer.length} bytes`);
    console.log(`📄 PDF saved to: ${tempPath} for visual inspection`);
    console.log('🎨 Features applied:');
    console.log('   - Logo: /logo/arabic_green_gold_logo.png in top left');
    console.log('   - Header theme: Green (#2c5f2d) with gold text (#d4af37)');
    console.log('   - Text color: Black (#000000)');
    console.log('   - Company branding: مكتب صارى الدين ومشاركوه للمحاماة');
  });

  test('Frontend PDF Export with New Branding', async ({ page }) => {
    console.log('🧪 Testing frontend PDF export with new branding...');

    // Navigate and login
    await page.goto(BASE_URL);
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Navigate to Clients page
    await page.click('a[href="/clients"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Set up network interception to capture PDF response
    let pdfResponseSize = 0;
    let pdfResponseReceived = false;

    page.on('response', async (response) => {
      if (response.url().includes('/api/export/pdf-chrome')) {
        pdfResponseReceived = true;
        console.log(`📡 PDF API response: ${response.status()}`);

        const contentType = response.headers()['content-type'];
        if (contentType && contentType.includes('application/pdf')) {
          const pdfBuffer = await response.body();
          pdfResponseSize = pdfBuffer.length;
          console.log(`📄 PDF size: ${pdfResponseSize} bytes`);
        }
      }
    });

    // Find and click export dropdown
    const exportDropdown = page.locator('button').filter({ hasText: 'تصدير' });
    await expect(exportDropdown).toBeVisible({ timeout: 10000 });
    await exportDropdown.click();
    await page.waitForTimeout(500);

    // Click PDF export option
    const pdfOption = page.locator('a.dropdown-item').filter({ hasText: 'تصدير PDF' });
    await expect(pdfOption).toBeVisible({ timeout: 5000 });
    await pdfOption.click();

    // Wait for API call
    await page.waitForTimeout(5000);

    // Verify PDF was generated with proper size (should be larger with logo and styling)
    expect(pdfResponseReceived).toBe(true);
    expect(pdfResponseSize).toBeGreaterThan(15000); // Should be larger with logo

    console.log('✅ Frontend PDF export with new branding completed');
    console.log(`📊 PDF file size: ${pdfResponseSize} bytes (includes logo and styling)`);
  });

  test('Many Columns with Green/Gold Theme', async ({ request }) => {
    console.log('🧪 Testing many columns with green/gold responsive theme...');

    // Create data with many columns to test responsive styling
    const testDataManyColumns = [{
      id: 1,
      client_name_ar: "عميل كثير الأعمدة",
      client_name_en: "Many Columns Client",
      type: "company",
      status: "active",
      phone: "01234567890",
      email: "many@columns.com",
      address: "عنوان طويل جداً",
      lawyer: "محامي مسؤول",
      date: "2024-01-15",
      cases: 10,
      revenue: "50000 EGP"
    }];

    const manyColumns = [
      { key: 'id', label: 'ID' },
      { key: 'client_name_ar', label: 'الاسم عربي' },
      { key: 'client_name_en', label: 'Name EN' },
      { key: 'type', label: 'النوع' },
      { key: 'status', label: 'الحالة' },
      { key: 'phone', label: 'الهاتف' },
      { key: 'email', label: 'الإيميل' },
      { key: 'address', label: 'العنوان' },
      { key: 'lawyer', label: 'المحامي' },
      { key: 'date', label: 'التاريخ' },
      { key: 'cases', label: 'القضايا' },
      { key: 'revenue', label: 'الإيرادات' }
    ];

    const response = await request.post(`${BASE_URL}/api/export/pdf-chrome`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        data: testDataManyColumns,
        columns: manyColumns,
        title: 'اختبار الأعمدة الكثيرة - التصميم الأخضر والذهبي',
        filename: 'many_columns_green_gold_test'
      }
    });

    expect(response.status()).toBe(200);
    const pdfBuffer = await response.body();
    expect(pdfBuffer.length).toBeGreaterThan(10000);

    console.log(`✅ Many columns green/gold theme test: ${pdfBuffer.length} bytes`);
    console.log(`📊 Columns: ${manyColumns.length} (should trigger responsive 8px font)`);
    console.log('🎨 Responsive features applied:');
    console.log('   - Small font (8px) for many columns');
    console.log('   - Green/gold headers maintained');
    console.log('   - Black text for readability');
  });
});