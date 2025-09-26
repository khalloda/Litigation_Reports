import { test, expect } from '@playwright/test';

test.describe('Debug Clients and Cases Loading', () => {
  test('Check if clients and cases API calls work', async ({ page }) => {
    console.log('🧪 DEBUGGING: Clients and Cases API loading');

    // Intercept API calls to see what's happening
    const apiCalls: string[] = [];

    page.on('request', request => {
      if (request.url().includes('/api/clients') || request.url().includes('/api/cases')) {
        const call = `📡 API Request: ${request.method()} ${request.url()}`;
        console.log(call);
        apiCalls.push(call);
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api/clients') || response.url().includes('/api/cases')) {
        const call = `📡 API Response: ${response.status()} ${response.url()}`;
        console.log(call);
        apiCalls.push(call);
      }
    });

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    // Navigate to invoices page
    await page.goto('/invoices', { waitUntil: 'networkidle' });
    console.log('✅ Navigated to invoices page');

    await page.waitForTimeout(3000);

    // Click view button to trigger client/case loading
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Wait longer for the async operations to complete
    await page.waitForTimeout(5000);

    // Check if modal is visible
    const modalVisible = await page.locator('[role="dialog"]').isVisible();
    console.log(`📋 Modal visible: ${modalVisible}`);

    if (modalVisible) {
      // Check client dropdown
      const clientSelect = page.locator('[role="dialog"] select').first();
      const clientOptions = await clientSelect.locator('option').count();
      console.log(`👥 Client dropdown options: ${clientOptions}`);

      // Log the actual option texts
      if (clientOptions > 0) {
        const optionTexts = await clientSelect.locator('option').allTextContents();
        console.log(`👥 Client options: ${optionTexts.slice(0, 5)}`); // First 5 options
      }

      // Check case dropdown
      const caseSelect = page.locator('[role="dialog"] select').nth(1);
      const caseOptions = await caseSelect.locator('option').count();
      console.log(`📁 Case dropdown options: ${caseOptions}`);

      // Log the actual option texts
      if (caseOptions > 0) {
        const optionTexts = await caseSelect.locator('option').allTextContents();
        console.log(`📁 Case options: ${optionTexts.slice(0, 5)}`); // First 5 options
      }

      // Check console for any errors
      const messages = await page.evaluate(() => {
        const logs = [];
        return logs;
      });

      // Close modal
      const closeButton = page.getByRole('button', { name: 'إغلاق' });
      await closeButton.click();
    }

    console.log(`\\n📊 Total API calls made: ${apiCalls.length}`);
    for (const call of apiCalls) {
      console.log(`   ${call}`);
    }

    console.log('\\n🔍 Summary:');
    console.log(`   • Clients API called: ${apiCalls.some(call => call.includes('/api/clients'))}`);
    console.log(`   • Cases API called: ${apiCalls.some(call => call.includes('/api/cases'))}`);

    console.log('\\n📊 DEBUG COMPLETE');
  });
});