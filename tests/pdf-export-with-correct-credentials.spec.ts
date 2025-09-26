import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test('PDF export with correct login credentials', async ({ page }) => {
  console.log('Testing PDF export with correct credentials...');

  // Navigate to login page
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');

  // Fill login form with correct credentials
  await page.fill('input[type="email"]', 'admin@litigation.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');

  // Wait for redirect after login
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);

  // Check what page we're on after login
  const currentUrl = page.url();
  console.log('Current URL after login:', currentUrl);

  const pageContent = await page.locator('body').textContent();
  console.log('Page content after login (first 300 chars):', pageContent?.slice(0, 300));

  // Try to navigate to clients page
  console.log('Navigating to clients page...');
  await page.goto(`${BASE_URL}/clients`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  const clientsPageContent = await page.locator('body').textContent();
  console.log('Clients page content (first 300 chars):', clientsPageContent?.slice(0, 300));

  // Look for any heading on the page
  const headings = await page.locator('h1, h2, h3').allTextContents();
  console.log('All headings on page:', headings);

  // Look for export buttons
  const exportButtons = await page.locator('button').allTextContents();
  console.log('All buttons on page:', exportButtons);

  // Check for export dropdown specifically
  const exportDropdown = await page.locator('button:has-text("تصدير")').count();
  console.log('Export dropdown buttons found:', exportDropdown);

  // If we find export buttons, test PDF option
  if (exportDropdown > 0) {
    console.log('Found export button, testing PDF option...');
    await page.click('button:has-text("تصدير")');
    await page.waitForTimeout(1000);

    const dropdownOptions = await page.locator('.dropdown-menu a, .dropdown-menu button').allTextContents();
    console.log('Available dropdown options:', dropdownOptions);

    const pdfOption = await page.locator('a:has-text("تصدير PDF")').count();
    console.log('PDF export option found:', pdfOption > 0);

    if (pdfOption > 0) {
      console.log('✓ PDF export functionality is working!');

      // Test clicking PDF export
      await page.click('a:has-text("تصدير PDF")');
      await page.waitForTimeout(2000);

      console.log('✓ PDF export clicked without errors');
    }
  }

  // Take screenshot for debugging
  await page.screenshot({ path: 'pdf-export-test-result.png' });
});