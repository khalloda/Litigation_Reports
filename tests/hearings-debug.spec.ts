import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test('Debug - Check hearings page accessibility', async ({ page }) => {
  console.log('🔍 Starting debug test...');

  try {
    console.log(`🌐 Navigating to ${BASE_URL}/hearings...`);

    // Set a longer timeout and try to navigate
    await page.goto(`${BASE_URL}/hearings`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    console.log('✅ Page loaded successfully');

    // Take a screenshot to see what we got
    await page.screenshot({ path: 'test-results/debug-page.png', fullPage: true });
    console.log('📸 Screenshot saved as debug-page.png');

    // Check what's actually on the page
    const title = await page.title();
    console.log(`📄 Page title: "${title}"`);

    const url = page.url();
    console.log(`🔗 Current URL: ${url}`);

    // Look for any text on the page
    const bodyText = await page.locator('body').textContent();
    console.log(`📝 Page content length: ${bodyText?.length || 0} characters`);

    if (bodyText?.includes('إدارة الجلسات')) {
      console.log('✅ Found Arabic text for "Hearings Management"');

      // Look for the add button
      const addButton = page.getByTestId('add-hearing-button');
      const isVisible = await addButton.isVisible().catch(() => false);

      if (isVisible) {
        console.log('✅ Add hearing button found and visible');

        // Try clicking it
        await addButton.click();
        console.log('🖱️ Clicked add hearing button');

        // Wait a bit and check for modal
        await page.waitForTimeout(2000);
        const modalVisible = await page
          .locator('.modal')
          .isVisible()
          .catch(() => false);

        if (modalVisible) {
          console.log('✅ Modal opened successfully');
          await page.screenshot({ path: 'test-results/debug-modal.png' });
          console.log('📸 Modal screenshot saved');
        } else {
          console.log('❌ Modal did not open');
        }
      } else {
        console.log('❌ Add hearing button not found or not visible');
      }
    } else if (bodyText?.includes('login') || bodyText?.includes('تسجيل دخول')) {
      console.log('🔐 Page appears to require authentication');
    } else {
      console.log('❓ Page content does not match expected hearings page');
      console.log('First 200 characters:', bodyText?.substring(0, 200));
    }
  } catch (error) {
    console.error('❌ Error during test:', error);

    // Try to get more info about what went wrong
    try {
      const currentUrl = page.url();
      console.log(`Current URL after error: ${currentUrl}`);

      await page.screenshot({ path: 'test-results/debug-error.png', fullPage: true });
      console.log('📸 Error screenshot saved');
    } catch (screenshotError) {
      console.error('Could not take error screenshot:', screenshotError);
    }

    throw error;
  }
});
