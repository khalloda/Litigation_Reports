import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test.describe('Login Fix Verification', () => {
  test('should successfully login through frontend with real credentials', async ({ page }) => {
    console.log('🔐 Testing login fix...');

    // Navigate to the application
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    console.log('📱 Application loaded');

    // Take screenshot of initial page
    await page.screenshot({ path: 'test-results/login-fix-01-initial.png' });

    // Check if we have a login form
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const loginButton = page.locator('button[type="submit"], .btn-primary');

    await expect(emailInput).toBeVisible({ timeout: 10000 });
    console.log('📝 Login form detected');

    // Fill in credentials
    await emailInput.fill('admin@litigation.com');
    await passwordInput.fill('admin123');

    console.log('🔑 Credentials entered');

    // Take screenshot before login
    await page.screenshot({ path: 'test-results/login-fix-02-before-login.png' });

    // Monitor network requests to see API calls
    const apiRequests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiRequests.push(`${request.method()} ${request.url()}`);
        console.log(`📡 API Request: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        console.log(`📡 API Response: ${response.status()} ${response.url()}`);
      }
    });

    // Attempt login
    await loginButton.click();

    // Wait for navigation or success
    await page.waitForTimeout(5000);

    console.log('⏳ Waiting for login response...');

    // Take screenshot after login attempt
    await page.screenshot({ path: 'test-results/login-fix-03-after-login.png' });

    // Check for success indicators
    const hasNavigation = await page.locator('.navbar, .sidebar, nav, [role="navigation"]').count() > 0;
    const hasErrorMessage = await page.locator('.alert-danger, .error, .text-danger').count() > 0;
    const hasLoginForm = await emailInput.isVisible();

    console.log(`🧭 Navigation found: ${hasNavigation}`);
    console.log(`❌ Error messages: ${hasErrorMessage}`);
    console.log(`📝 Still showing login form: ${hasLoginForm}`);

    // Check API requests
    console.log(`📡 Total API requests made: ${apiRequests.length}`);
    apiRequests.forEach(req => console.log(`   - ${req}`));

    // Verify login success
    if (hasNavigation && !hasLoginForm) {
      console.log('✅ Login successful - user is in the application');

      // Try to access a protected page
      const clientsLink = page.locator('a:has-text("Clients"), a:has-text("العملاء")').first();
      if (await clientsLink.isVisible()) {
        await clientsLink.click();
        await page.waitForTimeout(3000);

        // Take screenshot of clients page
        await page.screenshot({ path: 'test-results/login-fix-04-clients-page.png', fullPage: true });

        // Check if we see real data
        const hasData = await page.locator('table, .card, .list-group-item').count() > 0;
        console.log(`📊 Data elements found: ${hasData}`);

        if (hasData) {
          console.log('✅ Real data is loading in the application');
        }
      }

    } else if (hasErrorMessage) {
      console.log('❌ Login failed with error message');
      const errorText = await page.locator('.alert-danger, .error, .text-danger').first().textContent();
      console.log(`Error: ${errorText}`);
    } else if (hasLoginForm) {
      console.log('⚠️ Still showing login form - login may have failed silently');
    } else {
      console.log('❓ Unclear state after login attempt');
    }

    // Final verification
    const isLoggedIn = hasNavigation && !hasLoginForm && !hasErrorMessage;
    expect(isLoggedIn, 'Should be logged in successfully').toBe(true);

    console.log('🎉 Login fix verification completed!');
  });
});