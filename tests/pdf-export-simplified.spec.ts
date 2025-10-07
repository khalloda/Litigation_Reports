import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('PDF Export User Workflow - Simplified', () => {
  test('PDF Export Dropdown Interaction Test', async ({ page }) => {
    console.log('🧪 Testing PDF export dropdown interaction...');

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

    // Find export dropdown
    const exportDropdown = page.locator('button').filter({ hasText: 'تصدير' });
    await expect(exportDropdown).toBeVisible({ timeout: 10000 });
    console.log('✅ Found export dropdown');

    // Click to open dropdown
    await exportDropdown.click();
    await page.waitForTimeout(500);

    // Find PDF option
    const pdfOption = page.locator('a.dropdown-item').filter({ hasText: 'تصدير PDF' });
    await expect(pdfOption).toBeVisible({ timeout: 5000 });
    console.log('✅ Found PDF export option in dropdown');

    // Set up network interception to capture the API call
    let apiCallMade = false;
    let apiResponse = null;

    page.on('response', async (response) => {
      if (response.url().includes('/api/export/pdf-chrome')) {
        apiCallMade = true;
        apiResponse = response;
        console.log(`📡 API call detected: ${response.status()} ${response.url()}`);

        // Check content type
        const contentType = response.headers()['content-type'];
        console.log(`📝 Content-Type: ${contentType}`);

        if (contentType && contentType.includes('application/pdf')) {
          console.log('✅ Response is PDF content');
        } else {
          console.log(`❌ Response is not PDF: ${contentType}`);
        }
      }
    });

    // Click PDF export
    await pdfOption.click();

    // Wait for the API call
    await page.waitForTimeout(5000);

    // Verify API call was made
    expect(apiCallMade).toBe(true);
    console.log('✅ PDF export API call was triggered');

    // If API response received, verify it
    if (apiResponse) {
      expect(apiResponse.status()).toBe(200);
      const contentType = apiResponse.headers()['content-type'];
      expect(contentType).toContain('application/pdf');
      console.log('✅ API returned valid PDF response');
    }

    console.log('✅ PDF export dropdown interaction test completed');
  });

  test('Direct PDF Export API Call Test', async ({ page, request }) => {
    console.log('🧪 Testing direct PDF export API call...');

    // Test data
    const testData = [
      {
        id: 1,
        client_name_ar: 'عميل اختبار',
        client_name_en: 'Test Client',
        client_type: 'company',
        status: 'active',
        created_at: '2024-01-15',
      },
    ];

    // Make direct API call
    const response = await request.post(`${BASE_URL}/api/export/pdf-chrome`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        data: testData,
        columns: [
          { key: 'id', label: 'المعرف' },
          { key: 'client_name_ar', label: 'اسم العميل' },
          { key: 'client_type', label: 'النوع' },
        ],
        title: 'تقرير العملاء',
        filename: 'clients_test_export',
      },
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');

    const pdfBuffer = await response.body();
    expect(pdfBuffer.length).toBeGreaterThan(5000);

    // Verify PDF structure
    const pdfHeader = pdfBuffer.slice(0, 5).toString('ascii');
    expect(pdfHeader).toBe('%PDF-');

    console.log(`✅ Direct API test passed: ${pdfBuffer.length} bytes`);
  });
});
