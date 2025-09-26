import { test, expect } from '@playwright/test';

test.describe('Debug Network Requests for Invoices', () => {
  test('Monitor network calls during invoices report generation', async ({ page }) => {
    console.log('🔍 Monitoring network requests for invoices');

    // Array to store network requests
    const networkRequests: any[] = [];

    // Listen to all network requests
    page.on('request', request => {
      if (request.url().includes('api') || request.url().includes('report')) {
        console.log(`📤 REQUEST: ${request.method()} ${request.url()}`);
        networkRequests.push({
          type: 'request',
          method: request.method(),
          url: request.url(),
          postData: request.postData()
        });
      }
    });

    // Listen to all network responses
    page.on('response', response => {
      if (response.url().includes('api') || response.url().includes('report')) {
        console.log(`📥 RESPONSE: ${response.status()} ${response.url()}`);
        networkRequests.push({
          type: 'response',
          status: response.status(),
          url: response.url(),
          contentType: response.headers()['content-type']
        });
      }
    });

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    // Navigate to reports
    await page.goto('/reports', { waitUntil: 'networkidle' });
    console.log('📍 On reports page');

    // Open custom report modal
    const customReportButton = page.locator('button').filter({ hasText: 'تقرير مخصص' }).first();
    if (await customReportButton.isVisible()) {
      await customReportButton.click();
      await page.waitForSelector('[role="dialog"], .modal');

      // Switch to invoices
      const entitySelect = page.locator('select').first();
      await entitySelect.selectOption('invoices');
      console.log('✅ Selected invoices entity');

      // Wait for any network requests triggered by entity switch
      await page.waitForTimeout(2000);

      // Go to columns tab
      await page.getByRole('tab', { name: 'الأعمدة' }).click();
      await page.waitForSelector('input[type="checkbox"]', { timeout: 10000 });

      // Select specific columns
      const checkboxes = await page.locator('input[type="checkbox"]').all();

      // Clear all first
      for (const cb of checkboxes) {
        if (await cb.isChecked()) {
          await cb.uncheck();
        }
      }

      // Select first 2
      for (let i = 0; i < Math.min(2, checkboxes.length); i++) {
        await checkboxes[i].check();
      }

      console.log(`✅ Selected columns for invoices`);

      // Generate report - this should trigger the API call
      await page.getByRole('button', { name: /إنشاء التقرير|تطبيق|عرض التقرير/i }).click();

      // Wait for network requests to complete
      await page.waitForTimeout(5000);

      console.log('\n🔍 Network Summary:');
      for (const req of networkRequests) {
        if (req.type === 'request') {
          console.log(`📤 ${req.method} ${req.url}`);
          if (req.postData) {
            console.log(`   Data: ${req.postData.substring(0, 200)}...`);
          }
        } else {
          console.log(`📥 ${req.status} ${req.url} (${req.contentType})`);
        }
      }

      // Check final result
      const hasTable = await page.locator('table').isVisible().catch(() => false);
      console.log(`📊 Table visible: ${hasTable}`);

      if (hasTable) {
        const headers = await page.locator('table thead th:visible').allTextContents();
        console.log(`📊 Headers shown: ${headers.length}`);
        console.log(`📊 Headers: ${headers.map(h => h.trim()).filter(Boolean)}`);
      }

    } else {
      console.log('⚠️ Custom report button not found');
    }
  });
});