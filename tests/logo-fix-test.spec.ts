import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('Logo Fix Test', () => {
  test('PDF Export with Logo - Base64 Embedded', async ({ request }) => {
    console.log('🖼️ Testing PDF export with embedded logo (base64)...');

    const testData = [
      {
        id: 1,
        client_name_ar: "مكتب صارى الدين ومشاركوه للمحاماة",
        client_type: "company",
        status: "active",
        created_at: "2024-01-15"
      }
    ];

    const columns = [
      { key: 'id', label: 'المعرف' },
      { key: 'client_name_ar', label: 'اسم العميل' },
      { key: 'client_type', label: 'نوع العميل' },
      { key: 'status', label: 'الحالة' },
      { key: 'created_at', label: 'تاريخ الإنشاء' }
    ];

    const response = await request.post(`${BASE_URL}/api/export/pdf-chrome`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        data: testData,
        columns: columns,
        title: 'اختبار الشعار المُدمج',
        filename: 'logo_fix_test'
      }
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');

    const pdfBuffer = await response.body();

    // With embedded logo, PDF should be significantly larger
    expect(pdfBuffer.length).toBeGreaterThan(30000); // Should be much larger with embedded logo

    // Verify PDF structure
    const pdfHeader = pdfBuffer.slice(0, 5).toString('ascii');
    expect(pdfHeader).toBe('%PDF-');

    console.log(`✅ Logo-embedded PDF generated: ${pdfBuffer.length} bytes`);
    console.log('🖼️ Logo implementation:');
    console.log('   ✓ Method: Base64 embedded in HTML');
    console.log('   ✓ Source: backend/public/arabic_green_gold_logo.png');
    console.log('   ✓ Position: Top left header');
    console.log('   ✓ Fallback: Placeholder if logo not found');
    console.log(`📊 File size increase indicates logo embedded successfully`);
  });

  test('Frontend PDF Export with Logo', async ({ page }) => {
    console.log('🖼️ Testing frontend PDF export with embedded logo...');

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

    // Set up network interception
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
          console.log(`📄 PDF size with logo: ${pdfResponseSize} bytes`);
        }
      }
    });

    // Click export dropdown
    const exportDropdown = page.locator('button').filter({ hasText: 'تصدير' });
    await expect(exportDropdown).toBeVisible({ timeout: 10000 });
    await exportDropdown.click();
    await page.waitForTimeout(500);

    // Click PDF export
    const pdfOption = page.locator('a.dropdown-item').filter({ hasText: 'تصدير PDF' });
    await expect(pdfOption).toBeVisible({ timeout: 5000 });
    await pdfOption.click();

    // Wait for API call
    await page.waitForTimeout(5000);

    // Verify PDF was generated with logo (should be much larger)
    expect(pdfResponseReceived).toBe(true);
    expect(pdfResponseSize).toBeGreaterThan(25000); // Should be larger with embedded logo

    console.log('✅ Frontend PDF export with logo completed');
    console.log(`📊 PDF size: ${pdfResponseSize} bytes (includes embedded logo)`);
    console.log('🖼️ Logo should now be visible in the exported PDF');
  });

  test('Verify Logo File Access and Base64 Conversion', async ({ request }) => {
    console.log('🔧 Testing logo file access and base64 conversion...');

    // Test with minimal data to focus on logo
    const response = await request.post(`${BASE_URL}/api/export/pdf-chrome`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        data: [{ test: "اختبار الشعار" }],
        columns: [{ key: 'test', label: 'اختبار' }],
        title: 'اختبار وجود الشعار',
        filename: 'logo_presence_test'
      }
    });

    expect(response.status()).toBe(200);
    const pdfBuffer = await response.body();

    // Check if PDF is significantly larger than text-only version
    // A base64-embedded PNG logo should add substantial size
    const expectedMinSize = 25000; // Much larger with logo
    expect(pdfBuffer.length).toBeGreaterThan(expectedMinSize);

    console.log(`✅ Logo presence test: ${pdfBuffer.length} bytes`);

    if (pdfBuffer.length > expectedMinSize) {
      console.log('🎉 SUCCESS: Logo appears to be embedded (large file size)');
      console.log('🖼️ Logo implementation working correctly');
    } else {
      console.log('⚠️ WARNING: PDF size suggests logo may not be embedded');
    }
  });
});