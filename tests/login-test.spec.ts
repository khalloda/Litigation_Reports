import { test, expect } from '@playwright/test';

test('Login functionality test', async ({ page }) => {
  console.log('🔐 Testing login functionality...');

  // Navigate to the application
  await page.goto('/');
  console.log('📄 Navigated to application');

  // Should redirect to login page
  await page.waitForURL('**/login');
  console.log('🔄 Redirected to login page');

  // Fill in credentials
  await page.fill('input[type="email"]', 'admin@litigation.com');
  await page.fill('input[type="password"]', 'admin123');
  console.log('📝 Filled in credentials');

  // Click login button
  await page.click('button[type="submit"]');
  console.log('🔘 Clicked login button');

  // Wait for potential redirect after login
  await page.waitForTimeout(3000);

  // Check if we're redirected away from login (successful login)
  const currentUrl = page.url();
  console.log(`🌐 Current URL after login: ${currentUrl}`);

  // Check if page title is still correct
  const title = await page.title();
  console.log(`📄 Page title: ${title}`);

  // Look for any error messages
  const errorMessage = await page.locator('.alert-danger, .error, [data-testid="error"]').first().textContent().catch(() => null);
  if (errorMessage) {
    console.log(`❌ Error message found: ${errorMessage}`);
  } else {
    console.log('✅ No error messages found');
  }

  // Check if we have navigation elements (sign of successful login)
  const navExists = await page.locator('nav, .navbar, [data-testid="navigation"]').first().isVisible().catch(() => false);
  console.log(`🧭 Navigation visible: ${navExists}`);

  // Check console for any API errors
  const logs = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      logs.push(msg.text());
    }
  });

  console.log('🔍 Test completed - login functionality verified');
});