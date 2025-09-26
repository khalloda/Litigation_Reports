import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test('Debug login page for export testing', async ({ page }) => {
  console.log('Navigating to login page...');
  await page.goto(`${BASE_URL}/login`);

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Take screenshot to see what's on the page
  await page.screenshot({ path: 'login-debug.png' });

  // Print page title and URL
  const title = await page.title();
  const url = page.url();
  console.log('Page title:', title);
  console.log('Page URL:', url);

  // Print all visible text on the page
  const bodyText = await page.locator('body').textContent();
  console.log('Page content:', bodyText);

  // Check if we're already logged in (redirected to dashboard)
  const isDashboard = await page.locator('h1:has-text("لوحة التحكم")').count();
  const isLogin = await page.locator('h2').count();

  console.log('Dashboard elements found:', isDashboard);
  console.log('H2 elements found:', isLogin);

  if (isDashboard > 0) {
    console.log('Already logged in, going directly to test clients page...');
    await page.click('a[href="/clients"]');
    await expect(page.locator('h2:has-text("إدارة العملاء")')).toBeVisible();

    // Check for export dropdown
    await page.waitForSelector('button:has-text("تصدير")', { timeout: 10000 });
    const exportButton = page.locator('button:has-text("تصدير")').first();
    await expect(exportButton).toBeVisible();

    console.log('Export button found on clients page!');
  } else if (isLogin > 0) {
    // Get all h2 text to see what login elements exist
    const h2Elements = await page.locator('h2').allTextContents();
    console.log('H2 elements text:', h2Elements);

    // Look for login form elements
    const emailInput = await page.locator('input[type="email"]').count();
    const passwordInput = await page.locator('input[type="password"]').count();
    const submitButton = await page.locator('button[type="submit"]').count();

    console.log('Email inputs found:', emailInput);
    console.log('Password inputs found:', passwordInput);
    console.log('Submit buttons found:', submitButton);

    if (emailInput > 0 && passwordInput > 0) {
      console.log('Attempting login...');
      await page.fill('input[type="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');

      await page.waitForLoadState('networkidle');

      // Check if login was successful
      const dashboardExists = await page.locator('h1:has-text("لوحة التحكم")').count();
      if (dashboardExists > 0) {
        console.log('Login successful!');
        // Test clients page export
        await page.click('a[href="/clients"]');
        await expect(page.locator('h2:has-text("إدارة العملاء")')).toBeVisible();

        await page.waitForSelector('button:has-text("تصدير")', { timeout: 10000 });
        const exportButton = page.locator('button:has-text("تصدير")').first();
        await expect(exportButton).toBeVisible();

        console.log('Export functionality verified on clients page!');
      }
    }
  } else {
    console.log('Neither dashboard nor login page detected. Current page content:');
    console.log(bodyText);
  }
});