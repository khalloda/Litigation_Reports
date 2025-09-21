import { test, expect } from '@playwright/test';

test('Detailed client report investigation', async ({ page }) => {
  console.log('🔍 Investigating client reports in detail...');

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
  await page.waitForTimeout(3000);

  console.log('📄 On reports page');

  // Look for the client report section specifically
  const clientSection = page.locator('.card').filter({ hasText: 'العملاء' }).first();
  if (await clientSection.isVisible()) {
    console.log('✅ Found client report section');

    // Look for statistics in the client section
    const clientStats = clientSection.locator('h3, h4, .fs-3, .fs-4');
    const statsCount = await clientStats.count();
    console.log('📊 Found', statsCount, 'stats elements in client section');

    for (let i = 0; i < Math.min(statsCount, 5); i++) {
      const statText = await clientStats.nth(i).textContent();
      console.log(`📈 Stat ${i + 1}:`, statText);
    }

    // Look for the view button in client section
    const clientViewButton = clientSection.locator('button:has-text("عرض")');
    if (await clientViewButton.isVisible()) {
      console.log('🔘 Found client view button');

      // Listen for network requests
      page.on('response', response => {
        if (response.url().includes('/api/reports/clients')) {
          console.log('🌐 API Response:', response.status());
        }
      });

      await clientViewButton.click();
      console.log('🖱️ Clicked client view button');

      // Wait for modal
      await page.waitForTimeout(3000);

      // Check modal content
      const modal = page.locator('.modal.show');
      if (await modal.isVisible()) {
        console.log('✅ Modal opened');

        // Look for data in the modal
        const modalText = await modal.textContent();
        console.log('📄 Modal contains:', modalText?.substring(0, 200) + '...');

        // Look for specific client numbers
        const numbers = modalText?.match(/\d+/g);
        if (numbers) {
          console.log('🔢 Numbers found in modal:', numbers.slice(0, 10));
        }

        // Look for table rows
        const tableRows = modal.locator('tr');
        const rowCount = await tableRows.count();
        console.log('📋 Table rows in modal:', rowCount);

      } else {
        console.log('❌ No modal visible');
      }
    } else {
      console.log('❌ No client view button found');
    }
  } else {
    console.log('❌ No client report section found');
  }

  await page.screenshot({ path: 'reports-detailed-debug.png' });
});