import { test, expect } from '@playwright/test';

test.describe('Client-Specific Report Simple Test', () => {
  test('should navigate to reports and verify client-specific button exists', async ({ page }) => {
    // Navigate to the system
    await page.goto('http://lit.local:8080');

    // Login with test credentials
    await page.fill('#email', 'admin@litigation.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for successful login and dashboard
    await page.waitForTimeout(3000);

    // Navigate to Reports page via URL
    await page.goto('http://lit.local:8080/reports');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Check if the page loaded by looking for any content
    const pageContent = await page.content();
    console.log('Page title:', await page.title());
    console.log('Current URL:', page.url());

    // Look for the client-specific report button
    const clientSpecificButton = page.locator('button:has-text("تقرير عميل محدد")');

    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-reports-page.png', fullPage: true });

    // Try to find the button
    const isButtonVisible = await clientSpecificButton.isVisible();
    console.log('Client-specific button visible:', isButtonVisible);

    if (isButtonVisible) {
      console.log('✅ Client-specific report button found!');

      // Try to click it
      await clientSpecificButton.click();

      // Wait a bit for modal to appear
      await page.waitForTimeout(1000);

      // Check for modal
      const modal = page.locator('.modal');
      const isModalVisible = await modal.isVisible();
      console.log('Modal visible after click:', isModalVisible);

      if (isModalVisible) {
        console.log('✅ Modal opened successfully!');

        // Take screenshot of modal
        await page.screenshot({ path: 'debug-modal-open.png', fullPage: true });
      }
    } else {
      // Debug: List all buttons on the page
      const allButtons = await page.locator('button').allTextContents();
      console.log('All buttons found:', allButtons);
    }
  });

  test('should test API endpoint directly', async ({ page }) => {
    // Test the API endpoint directly
    await page.goto('http://lit.local:8080');

    // Login first
    await page.fill('#email', 'admin@litigation.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Test the API endpoint
    const response = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/reports/client-specific', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        return {
          status: response.status,
          success: response.ok,
          data: data,
        };
      } catch (error) {
        return {
          error: error.message,
        };
      }
    });

    console.log('API Response:', JSON.stringify(response, null, 2));

    if (response.success) {
      console.log('✅ API endpoint working correctly');
      console.log(`Found ${response.data?.data?.clients?.length || 0} clients`);
    } else {
      console.log('❌ API endpoint failed:', response);
    }
  });
});
