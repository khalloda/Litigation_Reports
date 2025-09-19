const { test, expect } = require('@playwright/test');

test.describe('Simple Pages Verification', () => {

  test('should check that pages load without Coming Soon message', async ({ page }) => {
    const testUrls = [
      'http://lit.local/clients',
      'http://lit.local/cases',
      'http://lit.local/hearings',
      'http://lit.local/reports'
    ];

    for (const url of testUrls) {
      console.log(`Testing ${url}...`);

      await page.goto(url);
      await page.waitForLoadState('networkidle', { timeout: 10000 });

      // Check that we don't see "Coming Soon" message
      const comingSoonVisible = await page.locator('text=Coming Soon').isVisible().catch(() => false);

      if (comingSoonVisible) {
        console.log(`❌ ${url} still shows "Coming Soon"`);
        throw new Error(`Page ${url} still shows "Coming Soon" message`);
      } else {
        console.log(`✅ ${url} loaded successfully (no "Coming Soon" message)`);
      }

      // Check for basic content
      const hasContent = await page.locator('h1, h2, h3').count() > 0;

      if (hasContent) {
        console.log(`✅ ${url} has content headers`);
      } else {
        console.log(`⚠️ ${url} may not have loaded properly`);
      }
    }
  });

  test('should verify specific page content', async ({ page }) => {
    // Test Clients page
    await page.goto('http://lit.local/clients');
    await page.waitForLoadState('networkidle');

    const clientsPageHasCorrectContent = await page.locator('text=إدارة العملاء').isVisible().catch(() => false) ||
                                       await page.locator('text=Clients').isVisible().catch(() => false) ||
                                       await page.locator('text=Client').isVisible().catch(() => false);

    expect(clientsPageHasCorrectContent).toBe(true);
    console.log('✅ Clients page has correct content');

    // Test Cases page
    await page.goto('http://lit.local/cases');
    await page.waitForLoadState('networkidle');

    const casesPageHasCorrectContent = await page.locator('text=إدارة القضايا').isVisible().catch(() => false) ||
                                     await page.locator('text=Cases').isVisible().catch(() => false) ||
                                     await page.locator('text=Case').isVisible().catch(() => false);

    expect(casesPageHasCorrectContent).toBe(true);
    console.log('✅ Cases page has correct content');

    // Test Hearings page
    await page.goto('http://lit.local/hearings');
    await page.waitForLoadState('networkidle');

    const hearingsPageHasCorrectContent = await page.locator('text=إدارة الجلسات').isVisible().catch(() => false) ||
                                        await page.locator('text=Hearings').isVisible().catch(() => false) ||
                                        await page.locator('text=Hearing').isVisible().catch(() => false);

    expect(hearingsPageHasCorrectContent).toBe(true);
    console.log('✅ Hearings page has correct content');

    // Test Reports page
    await page.goto('http://lit.local/reports');
    await page.waitForLoadState('networkidle');

    const reportsPageHasCorrectContent = await page.locator('text=التقارير').isVisible().catch(() => false) ||
                                       await page.locator('text=Reports').isVisible().catch(() => false) ||
                                       await page.locator('text=Dashboard').isVisible().catch(() => false);

    expect(reportsPageHasCorrectContent).toBe(true);
    console.log('✅ Reports page has correct content');
  });
});