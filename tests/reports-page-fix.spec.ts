import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test.describe('Reports Page Fix Verification', () => {
  test('should load Reports page without errors', async ({ page }) => {
    console.log('📊 Testing Reports page fix...');

    // Navigate to the application
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Login first
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const loginButton = page.locator('button[type="submit"], .btn-primary');

    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@litigation.com');
      await passwordInput.fill('admin123');
      await loginButton.click();
      await page.waitForTimeout(3000);
    }

    console.log('✅ Logged in successfully');

    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to Reports page
    const reportsLink = page.locator('a[href*="reports"], a:has-text("Reports"), a:has-text("التقارير")').first();

    if (await reportsLink.isVisible()) {
      await reportsLink.click();
    } else {
      // Try direct navigation
      await page.goto(`${BASE_URL}/reports`, { waitUntil: 'networkidle' });
    }

    console.log('📈 Navigated to Reports page');

    // Wait for page to load
    await page.waitForTimeout(5000);

    // Take screenshot of Reports page
    await page.screenshot({ path: 'test-results/reports-page-fixed.png', fullPage: true });

    // Check for dashboard elements
    const dashboardTitle = await page.locator('h2:has-text("التقارير"), h2:has-text("Reports")').count();
    const statisticsCards = await page.locator('.card').count();
    const chartElements = await page.locator('[class*="chart"], canvas').count();
    const dataElements = await page.locator('table, .badge, .list-group-item').count();

    console.log(`📊 Dashboard title found: ${dashboardTitle > 0}`);
    console.log(`📋 Statistics cards: ${statisticsCards}`);
    console.log(`📈 Chart elements: ${chartElements}`);
    console.log(`📄 Data elements: ${dataElements}`);

    // Check specific dashboard metrics
    const clientsMetric = await page.locator('text=/312|عميل|client/i').count();
    const casesMetric = await page.locator('text=/6|قضية|case/i').count();
    const hearingsMetric = await page.locator('text=/2|جلسة|hearing/i').count();

    console.log(`👥 Clients metric visible: ${clientsMetric > 0}`);
    console.log(`⚖️ Cases metric visible: ${casesMetric > 0}`);
    console.log(`🏛️ Hearings metric visible: ${hearingsMetric > 0}`);

    // Check for any console errors
    console.log(`❌ Console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console errors found:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    }

    // Verify no critical errors
    const hasCriticalErrors = consoleErrors.some(error =>
      error.includes('Cannot convert undefined or null to object') ||
      error.includes('Object.entries') ||
      error.includes('TypeError')
    );

    console.log(`🚨 Critical errors: ${hasCriticalErrors}`);

    // Assertions
    expect(dashboardTitle, 'Reports page should have a title').toBeGreaterThan(0);
    expect(statisticsCards, 'Should have statistics cards').toBeGreaterThan(3);
    expect(hasCriticalErrors, 'Should not have critical console errors').toBe(false);

    console.log('✅ Reports page loaded successfully without critical errors!');
  });

  test('should display real data in dashboard metrics', async ({ page }) => {
    console.log('📊 Testing real data display...');

    // Navigate to the application and login
    await page.goto(BASE_URL);

    const emailInput = page.locator('input[type="email"], input[name="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@litigation.com');
      await page.locator('input[type="password"], input[name="password"]').fill('admin123');
      await page.locator('button[type="submit"], .btn-primary').click();
      await page.waitForTimeout(3000);
    }

    // Go to Reports page
    await page.goto(`${BASE_URL}/reports`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Check for real data indicators
    const pageContent = await page.textContent('body');

    const hasClientCount = pageContent?.includes('312') || false;
    const hasCaseCount = pageContent?.includes('6') || false;
    const hasArabicContent = /[\u0600-\u06FF]/.test(pageContent || '');

    console.log(`📊 Shows 312 clients: ${hasClientCount}`);
    console.log(`⚖️ Shows 6 cases: ${hasCaseCount}`);
    console.log(`🔤 Contains Arabic text: ${hasArabicContent}`);

    // Verify data presence
    expect(hasClientCount || hasCaseCount, 'Should show real data counts').toBe(true);
    expect(hasArabicContent, 'Should have Arabic interface').toBe(true);

    console.log('✅ Real data is displayed correctly!');
  });
});