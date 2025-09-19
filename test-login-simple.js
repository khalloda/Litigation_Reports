import { test, expect } from '@playwright/test';

test('Simple Login Test', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://lit.local:3001/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot of the login page
  await page.screenshot({ path: 'simple-login-page.png' });
  
  // Check if we're on the login page
  await expect(page.locator('h2.card-title')).toContainText('نظام إدارة التقاضي');
  
  // Fill in the login form
  await page.fill('input[type="email"]', 'admin@litigation.com');
  await page.fill('input[type="password"]', 'admin123');
  
  // Take a screenshot before clicking login
  await page.screenshot({ path: 'simple-login-form-filled.png' });
  
  // Listen for console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  // Listen for network requests
  page.on('request', request => console.log('REQUEST:', request.method(), request.url()));
  page.on('response', response => console.log('RESPONSE:', response.status(), response.url()));
  
  // Click the login button
  await page.click('button[type="submit"]');
  
  // Wait a bit for any response
  await page.waitForTimeout(5000);
  
  // Take a screenshot after login attempt
  await page.screenshot({ path: 'simple-after-login-attempt.png' });
  
  // Check what's on the page now
  const pageContent = await page.content();
  console.log('Page content after login attempt:');
  console.log(pageContent.substring(0, 1000)); // First 1000 characters
  
  // Check if we're still on login page or moved to dashboard
  const isLoginPage = await page.locator('h2.card-title').isVisible();
  const isDashboard = await page.locator('h1.h3').isVisible();
  
  console.log('Is still on login page:', isLoginPage);
  console.log('Is on dashboard:', isDashboard);
  
  if (isDashboard) {
    console.log('✅ Login successful - Dashboard loaded!');
  } else if (isLoginPage) {
    console.log('❌ Login failed - Still on login page');
    // Check for any error messages
    const errorElements = await page.locator('.alert-danger').count();
    console.log('Number of error elements:', errorElements);
    if (errorElements > 0) {
      const errorText = await page.locator('.alert-danger').first().textContent();
      console.log('Error message:', errorText);
    }
  } else {
    console.log('❓ Unknown state - neither login page nor dashboard');
  }
});
