import { test, expect } from '@playwright/test';

test('Simple reports page test', async ({ page }) => {
  console.log('📊 Testing reports page...');

  // Navigate and login
  await page.goto('/');
  await page.waitForURL('**/login');
  await page.fill('input[type="email"]', 'admin@litigation.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');

  // Navigate to reports
  await page.goto('/reports');
  await page.waitForLoadState('domcontentloaded');
  console.log('📄 Reports page loaded');

  // Wait a bit for loading
  await page.waitForTimeout(3000);

  // Check if the page has the title
  const pageTitle = page.locator('h1, h2, h3').first();
  if (await pageTitle.isVisible()) {
    const title = await pageTitle.textContent();
    console.log('📋 Page title:', title);
  }

  // Look for report cards
  const reportCards = page.locator('.card');
  const cardCount = await reportCards.count();
  console.log('📊 Found', cardCount, 'report cards');

  // Click the first client report button if available
  const viewButtons = page.locator('button:has-text("عرض")');
  const buttonCount = await viewButtons.count();
  console.log('🔘 Found', buttonCount, 'view buttons');

  if (buttonCount > 0) {
    await viewButtons.first().click();
    console.log('🖱️ Clicked first view button');

    // Wait for any modal or response
    await page.waitForTimeout(2000);

    // Check if modal appeared
    const modal = page.locator('.modal.show');
    if (await modal.isVisible()) {
      console.log('✅ Modal opened successfully');
    } else {
      console.log('❌ No modal visible');
    }
  }

  await page.screenshot({ path: 'reports-simple-debug.png' });
});