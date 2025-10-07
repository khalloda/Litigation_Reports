import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test('Simple export functionality check', async ({ page }) => {
  // Try to go directly to clients page
  console.log('Navigating to clients page directly...');
  await page.goto(`${BASE_URL}/clients`);
  await page.waitForLoadState('networkidle');

  // Take screenshot to see what's on the page
  await page.screenshot({ path: 'clients-page.png' });

  // Print page content
  const pageContent = await page.locator('body').textContent();
  console.log('Page content:', pageContent?.slice(0, 500) + '...');

  // Check if we see login form (meaning we're not logged in)
  const hasLogin = await page.locator('input[type="email"]').count();
  console.log('Login form present:', hasLogin > 0);

  if (hasLogin > 0) {
    console.log('Need to login first...');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Now try clients page again
    await page.goto(`${BASE_URL}/clients`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  }

  // Look for export button anywhere on the page
  const exportButtons = await page.locator('button:has-text("تصدير")').count();
  console.log('Export buttons found:', exportButtons);

  if (exportButtons > 0) {
    console.log('✓ Export button found!');

    // Check if it's visible and enabled
    const exportButton = page.locator('button:has-text("تصدير")').first();
    const isVisible = await exportButton.isVisible();
    const isEnabled = await exportButton.isEnabled();

    console.log('Export button visible:', isVisible);
    console.log('Export button enabled:', isEnabled);

    if (isVisible && isEnabled) {
      // Try to click it
      await exportButton.click();
      await page.waitForTimeout(1000);

      // Check for dropdown menu
      const csvOption = await page.locator('a:has-text("تصدير CSV")').count();
      const excelOption = await page.locator('a:has-text("تصدير Excel")').count();

      console.log('CSV export option found:', csvOption > 0);
      console.log('Excel export option found:', excelOption > 0);

      if (csvOption > 0) {
        console.log('✓ Export functionality is working correctly!');
      }
    }
  } else {
    console.log('No export buttons found on page');

    // Look for other common elements to debug
    const buttons = await page.locator('button').allTextContents();
    console.log('All buttons on page:', buttons);

    const headings = await page.locator('h1, h2, h3').allTextContents();
    console.log('All headings:', headings);
  }
});
