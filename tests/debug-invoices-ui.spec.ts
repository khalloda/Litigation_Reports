import { test, expect } from '@playwright/test';

test.describe('Debug Invoices UI', () => {
  test.use({
    baseURL: 'http://lit.local:8080'
  });

  async function loginIfNeeded(page) {
    try {
      await page.goto('/reports', { timeout: 10000 });

      if (page.url().includes('/login') || page.url().includes('login')) {
        console.log('Login required, attempting to login...');
        await page.fill('input[type="email"], input[name="email"]', 'admin@litigation.com');
        await page.fill('input[type="password"], input[name="password"]', 'admin123');
        await page.getByRole('button', { name: /تسجيل الدخول|دخول|Login/i }).click();
        await page.waitForURL(/\/(dashboard|reports)/, { timeout: 15000 });
      }
    } catch (error) {
      console.log('Login attempt error:', error.message);
    }
  }

  test('Debug reports page UI state', async ({ page }) => {
    console.log('🔍 Debugging reports page state...');

    await loginIfNeeded(page);
    await page.goto('/reports', { waitUntil: 'networkidle' });

    console.log('📍 Current URL:', page.url());

    // Check if page loaded correctly
    const title = await page.title();
    console.log('📄 Page title:', title);

    // Look for any buttons
    const allButtons = await page.locator('button').all();
    console.log(`🔘 Found ${allButtons.length} buttons`);

    for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
      const buttonText = await allButtons[i].textContent();
      console.log(`   Button ${i+1}: "${buttonText?.trim()}"`);
    }

    // Look for the custom report button specifically
    const customReportButton = page.getByRole('button', { name: 'إنشاء تقرير مخصص' });
    const customReportVisible = await customReportButton.isVisible().catch(() => false);
    console.log('🎯 Custom report button visible:', customReportVisible);

    // Try alternative selectors
    const arabicButtons = await page.locator('button:has-text("تقرير")').all();
    console.log(`🔍 Buttons containing "تقرير": ${arabicButtons.length}`);

    for (let button of arabicButtons) {
      const text = await button.textContent();
      console.log(`   Arabic button: "${text?.trim()}"`);
    }

    // Take screenshot for debugging
    await page.screenshot({
      path: 'test-results/debug-reports-page.png',
      fullPage: true
    });
    console.log('📸 Screenshot saved as debug-reports-page.png');

    // Check for any error messages or loading states
    const errorMessages = await page.locator('.alert, .error, [class*="error"]').all();
    console.log(`❌ Error messages found: ${errorMessages.length}`);

    for (let error of errorMessages) {
      const errorText = await error.textContent();
      console.log(`   Error: "${errorText?.trim()}"`);
    }
  });
});