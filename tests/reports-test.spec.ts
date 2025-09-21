import { test, expect } from '@playwright/test';

test('Test monthly client report generation', async ({ page }) => {
  console.log('📊 Testing report generation functionality...');

  // Navigate to the application
  await page.goto('/');
  await page.waitForURL('**/login');

  // Login
  await page.fill('input[type="email"]', 'admin@litigation.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');

  // Wait for successful login
  await page.waitForURL('**/dashboard');
  console.log('✅ Login successful');

  // Navigate to reports page
  await page.goto('/reports');
  await page.waitForLoadState('domcontentloaded');
  console.log('📄 Navigated to reports page');

  // Wait for the page to load
  await page.waitForTimeout(2000);

  // Look for the monthly client report button
  const clientReportButton = page.locator('button:has-text("عرض")').first();
  console.log('🔍 Looking for client report button...');

  if (await clientReportButton.isVisible()) {
    console.log('✅ Client report button found');
    await clientReportButton.click();
    console.log('🖱️ Clicked client report button');

    // Wait for modal or response
    await page.waitForTimeout(3000);

    // Check for any error messages
    const errorMessage = page.locator('.alert-danger, .text-danger');
    if (await errorMessage.isVisible()) {
      const errorText = await errorMessage.textContent();
      console.log('❌ Error found:', errorText);
    }

    // Check for report modal or data
    const reportModal = page.locator('.modal');
    if (await reportModal.isVisible()) {
      console.log('✅ Report modal opened');
    } else {
      console.log('❌ No report modal visible');
    }

  } else {
    console.log('❌ Client report button not found');
  }

  // Take screenshot for debugging
  await page.screenshot({ path: 'reports-test-debug.png' });
  console.log('📸 Screenshot saved');
});