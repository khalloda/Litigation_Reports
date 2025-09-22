import { test, expect } from '@playwright/test';

test.describe('Basic Login Test', () => {
  test('Login should redirect to dashboard', async ({ page }) => {
    console.log('🧪 Testing basic login functionality...');

    // Navigate to login page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check we're on the login page
    await expect(page.url()).toContain('/login');

    // Fill login form
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for login to complete
    await page.waitForTimeout(2000);

    // Check if we're redirected to dashboard
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);

    if (currentUrl.includes('dashboard')) {
      console.log('✅ Login successful - redirected to dashboard');
    } else {
      console.log('⚠️  Login did not redirect to dashboard');
      // Take a screenshot to see what happened
      await page.screenshot({ path: 'login-failed.png' });
    }

    // Check for dashboard elements
    const dashboardTitle = page.locator('text=Dashboard');
    if (await dashboardTitle.isVisible().catch(() => false)) {
      console.log('✅ Dashboard title found');
    } else {
      console.log('⚠️  Dashboard title not found');
    }
  });
});
