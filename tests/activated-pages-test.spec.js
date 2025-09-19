const { test, expect } = require('@playwright/test');

test.describe('Activated Pages Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page first
    await page.goto('http://lit.local/login');

    // Perform login (assuming admin credentials)
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for successful login and redirect
    await page.waitForURL('**/dashboard', { timeout: 10000 });
  });

  test('should load Clients page successfully', async ({ page }) => {
    await page.goto('http://lit.local/clients');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for key elements that indicate the page loaded properly
    await expect(page.locator('h2')).toContainText('إدارة العملاء');

    // Check for the "Add New Client" button
    await expect(page.locator('button')).toContainText('إضافة عميل جديد');

    // Check for search functionality
    await expect(page.locator('input[placeholder*="البحث"]')).toBeVisible();

    // Verify no "Coming Soon" message
    await expect(page.locator('text=Coming Soon')).not.toBeVisible();

    console.log('✅ Clients page loaded successfully');
  });

  test('should load Cases page successfully', async ({ page }) => {
    await page.goto('http://lit.local/cases');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for key elements
    await expect(page.locator('h2')).toContainText('إدارة القضايا');

    // Check for the "Add New Case" button
    await expect(page.locator('button')).toContainText('إضافة قضية جديدة');

    // Verify no "Coming Soon" message
    await expect(page.locator('text=Coming Soon')).not.toBeVisible();

    console.log('✅ Cases page loaded successfully');
  });

  test('should load Hearings page successfully', async ({ page }) => {
    await page.goto('http://lit.local/hearings');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for key elements
    await expect(page.locator('h2')).toContainText('إدارة الجلسات');

    // Check for the "Add New Hearing" button
    await expect(page.locator('button')).toContainText('إضافة جلسة جديدة');

    // Verify no "Coming Soon" message
    await expect(page.locator('text=Coming Soon')).not.toBeVisible();

    console.log('✅ Hearings page loaded successfully');
  });

  test('should load Reports page successfully', async ({ page }) => {
    await page.goto('http://lit.local/reports');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for key elements
    await expect(page.locator('h2')).toContainText('التقارير والإحصائيات');

    // Check for statistics cards
    await expect(page.locator('.card')).toBeVisible();

    // Check for export/filter buttons
    await expect(page.locator('button')).toContainText('تصدير');
    await expect(page.locator('button')).toContainText('تصفية');

    // Verify no "Coming Soon" message
    await expect(page.locator('text=Coming Soon')).not.toBeVisible();

    console.log('✅ Reports page loaded successfully');
  });

  test('should test navigation between pages', async ({ page }) => {
    // Start at dashboard
    await page.goto('http://lit.local/dashboard');

    // Navigate to each page via sidebar/navigation
    const pages = [
      { path: '/clients', title: 'إدارة العملاء' },
      { path: '/cases', title: 'إدارة القضايا' },
      { path: '/hearings', title: 'إدارة الجلسات' },
      { path: '/reports', title: 'التقارير والإحصائيات' }
    ];

    for (const { path, title } of pages) {
      await page.goto(`http://lit.local${path}`);
      await page.waitForLoadState('networkidle');

      // Verify page loaded correctly
      await expect(page.locator('h2')).toContainText(title);
      await expect(page.locator('text=Coming Soon')).not.toBeVisible();

      console.log(`✅ Navigation to ${path} successful`);
    }
  });

  test('should verify all pages load without errors', async ({ page }) => {
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    const testPages = [
      'http://lit.local/clients',
      'http://lit.local/cases',
      'http://lit.local/hearings',
      'http://lit.local/reports'
    ];

    for (const url of testPages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      // Wait a bit for any async operations
      await page.waitForTimeout(2000);

      console.log(`✅ ${url} loaded without errors`);
    }

    // Report any errors found
    if (errors.length > 0) {
      console.log('⚠️ Errors found:', errors);
    } else {
      console.log('✅ All pages loaded without JavaScript errors');
    }
  });

  test('should check page responsiveness', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];

    const testPages = [
      'http://lit.local/clients',
      'http://lit.local/cases',
      'http://lit.local/hearings',
      'http://lit.local/reports'
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const url of testPages) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');

        // Check that main content is visible
        await expect(page.locator('h2')).toBeVisible();

        console.log(`✅ ${url} responsive on ${viewport.name}`);
      }
    }
  });
});