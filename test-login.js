import { test, expect } from '@playwright/test';

test('Login to Litigation Management System', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://lit.local:3001/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot of the login page
  await page.screenshot({ path: 'login-page.png' });
  
  // Check if we're on the login page
  await expect(page.locator('h2.card-title')).toContainText('نظام إدارة التقاضي');
  await expect(page.locator('p.text-muted')).toContainText('Litigation Management System');
  
  // Fill in the login form
  await page.fill('input[type="email"]', 'admin@litigation.com');
  await page.fill('input[type="password"]', 'admin123');
  
  // Take a screenshot before clicking login
  await page.screenshot({ path: 'login-form-filled.png' });
  
  // Click the login button
  await page.click('button[type="submit"]');
  
  // Wait for the loading spinner to disappear
  await page.waitForSelector('.spinner-border', { state: 'hidden', timeout: 10000 });
  
  // Wait for navigation or loading to complete
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot after login attempt
  await page.screenshot({ path: 'after-login-attempt.png' });
  
  // Check if we're still on login page (login failed) or on dashboard (login succeeded)
  const isStillOnLoginPage = await page.locator('h2.card-title').isVisible();
  
  if (isStillOnLoginPage) {
    // Check for error message
    const errorMessage = await page.locator('.alert-danger').textContent();
    console.log('Login failed with error:', errorMessage);
    throw new Error(`Login failed: ${errorMessage}`);
  }
  
  // Wait for the dashboard to load (check for dashboard elements)
  await page.waitForSelector('h1.h3', { timeout: 10000 });
  
  // Take a screenshot of the dashboard
  await page.screenshot({ path: 'dashboard-after-login.png' });
  
  // Verify we're on the dashboard
  await expect(page.locator('h1.h3')).toContainText('لوحة التحكم');
  
  // Check for user information in the dashboard
  await expect(page.locator('.nav-link.dropdown-toggle')).toContainText('System Administrator');
  
  // Check for the status check component
  await expect(page.locator('.alert-success')).toContainText('النظام يعمل بشكل طبيعي');
  
  // Verify the logout button is present in the DOM
  await expect(page.locator('a:has-text("تسجيل الخروج")')).toBeAttached();
  
  console.log('✅ Login test completed successfully!');
});

test('Login with invalid credentials', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://lit.local:3001/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Fill in invalid credentials
  await page.fill('input[type="email"]', 'invalid@example.com');
  await page.fill('input[type="password"]', 'wrongpassword');
  
  // Click the login button
  await page.click('button[type="submit"]');
  
  // Wait for error message
  await page.waitForSelector('.alert-danger', { timeout: 5000 });
  
  // Take a screenshot of the error
  await page.screenshot({ path: 'login-error.png' });
  
  // Verify error message
  await expect(page.locator('.alert-danger')).toContainText('Invalid email or password');
  
  console.log('✅ Invalid login test completed successfully!');
});
