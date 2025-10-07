import { test, expect } from '@playwright/test';

test.describe('Debug Button Click', () => {
  test('Check what happens when clicking view button', async ({ page }) => {
    console.log('🧪 DEBUGGING: What happens when clicking view button');

    // Capture all console messages
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      const message = `${msg.type()}: ${msg.text()}`;
      console.log(`📋 Console: ${message}`);
      consoleMessages.push(message);
    });

    // Capture page errors
    page.on('pageerror', (error) => {
      console.log(`❌ Page error: ${error.message}`);
      console.log(`❌ Stack: ${error.stack}`);
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

    // Check if there are any invoices in the table
    const invoiceRows = await page.locator('tbody tr').count();
    console.log(`📊 Found ${invoiceRows} invoice rows`);

    if (invoiceRows > 0) {
      // Find the view button more specifically
      const viewButton = page.locator('button[title="View"]').first();
      const buttonExists = await viewButton.count();
      console.log(`🔍 View button exists: ${buttonExists > 0}`);

      if (buttonExists > 0) {
        const buttonVisible = await viewButton.isVisible();
        console.log(`👁️ View button visible: ${buttonVisible}`);

        if (buttonVisible) {
          console.log('🖱️ About to click view button...');
          await viewButton.click();
          console.log('🖱️ Clicked view button');

          // Wait and check for any changes
          await page.waitForTimeout(2000);

          // Check if modal appeared
          const modalVisible = await page.locator('[role="dialog"]').isVisible();
          console.log(`📋 Modal appeared: ${modalVisible}`);

          // Check for console logs that contain our debug messages
          const debugLogs = consoleMessages.filter(
            (msg) => msg.includes('handleViewInvoice called') || msg.includes('Making API calls')
          );
          console.log(`🔍 Found ${debugLogs.length} debug logs`);
          debugLogs.forEach((log) => console.log(`   ${log}`));
        } else {
          console.log('❌ View button not visible');
        }
      } else {
        console.log('❌ View button not found');
      }
    } else {
      console.log('❌ No invoices found in table');
    }

    console.log('\n📊 BUTTON CLICK DEBUG COMPLETE');
  });
});
