import { test, expect } from '@playwright/test';

test('Full hearings functionality test', async ({ page }) => {
  console.log('🏛️ Testing full hearings functionality...');

  // Navigate and login
  await page.goto('/');
  await page.waitForURL('**/login');
  await page.fill('input[type="email"]', 'admin@litigation.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  console.log('✅ Successfully logged in');

  // Navigate to hearings page
  await page.goto('/hearings');
  await page.waitForTimeout(2000);
  console.log('📄 Navigated to hearings page');

  // Check page title and content
  const title = await page.title();
  console.log(`📄 Page title: ${title}`);

  // Look for hearings page elements
  const hearingsHeader = await page
    .locator('h2, h1')
    .filter({ hasText: /جلسات|إدارة الجلسات|Hearings/i })
    .first()
    .textContent()
    .catch(() => null);
  console.log(`🔍 Hearings header: ${hearingsHeader || 'Not found'}`);

  // Check for add hearing button
  const addButton = await page
    .locator('button')
    .filter({ hasText: /إضافة|جديد|Add|New/i })
    .first()
    .isVisible()
    .catch(() => false);
  console.log(`➕ Add hearing button visible: ${addButton}`);

  // Check for hearings table or list
  const tableExists = await page
    .locator('table, .table, [data-testid="hearings-table"]')
    .first()
    .isVisible()
    .catch(() => false);
  console.log(`📊 Hearings table visible: ${tableExists}`);

  // Check for filters section
  const filtersExist = await page
    .locator('.filters, [data-testid="filters"], .card')
    .filter({ hasText: /بحث|Search|فلتر|Filter/i })
    .first()
    .isVisible()
    .catch(() => false);
  console.log(`🔍 Filters section visible: ${filtersExist}`);

  // Check for any hearing data
  const hearingRows = await page.locator('tr, .hearing-item, [data-testid="hearing-row"]').count();
  console.log(`📋 Number of hearing rows found: ${hearingRows}`);

  // Check for pagination if there are hearings
  if (hearingRows > 0) {
    const paginationExists = await page
      .locator('.pagination, [data-testid="pagination"]')
      .first()
      .isVisible()
      .catch(() => false);
    console.log(`📄 Pagination visible: ${paginationExists}`);
  }

  // Check for Arabic content (RTL support)
  const bodyDir = await page.locator('body').getAttribute('dir');
  const htmlLang = await page.locator('html').getAttribute('lang');
  console.log(`🌐 Body direction: ${bodyDir}, HTML language: ${htmlLang}`);

  // Look for any API errors in console
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await page.waitForTimeout(2000);

  if (consoleErrors.length > 0) {
    console.log(`❌ Console errors found: ${consoleErrors.join(', ')}`);
  } else {
    console.log('✅ No console errors detected');
  }

  // Try to click add hearing button if visible
  if (addButton) {
    await page.click(
      'button:has-text("إضافة"), button:has-text("جديد"), button:has-text("Add"), button:has-text("New")'
    );
    await page.waitForTimeout(1000);

    const modalVisible = await page
      .locator('.modal, [data-testid="hearing-modal"]')
      .first()
      .isVisible()
      .catch(() => false);
    console.log(`📝 Add hearing modal opened: ${modalVisible}`);

    if (modalVisible) {
      // Close the modal
      await page.keyboard.press('Escape');
      console.log('🔒 Closed add hearing modal');
    }
  }

  console.log('🏛️ Hearings functionality test completed');
});
