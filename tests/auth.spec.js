import { test, expect } from '@playwright/test';

test.describe('Authentication System', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('should display login page with proper branding', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Login|تسجيل الدخول/);
    
    // Check for law firm logo
    await expect(page.locator('img[alt*="logo"], img[alt*="شعار"]')).toBeVisible();
    
    // Check for language switcher
    await expect(page.locator('[data-testid="language-switcher"], .language-switcher')).toBeVisible();
    
    // Check for login form
    await expect(page.locator('form, [data-testid="login-form"]')).toBeVisible();
    
    // Check for username/email field
    await expect(page.locator('input[type="email"], input[name="email"], input[name="username"]')).toBeVisible();
    
    // Check for password field
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Check for login button
    await expect(page.locator('button[type="submit"], input[type="submit"]')).toBeVisible();
  });

  test('should support RTL layout in Arabic', async ({ page }) => {
    // Switch to Arabic language
    await page.click('[data-testid="language-switcher"] [data-lang="ar"], .language-switcher [data-lang="ar"]');
    await page.waitForLoadState('networkidle');
    
    // Check that page direction is RTL
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Check that Arabic text is displayed
    await expect(page.locator('text=تسجيل الدخول, text=الدخول')).toBeVisible();
    
    // Check that form layout is RTL
    const form = page.locator('form, [data-testid="login-form"]');
    await expect(form).toHaveCSS('text-align', /right|start/);
  });

  test('should handle mixed content in form fields', async ({ page }) => {
    // Test email field (should be LTR)
    const emailField = page.locator('input[type="email"], input[name="email"]');
    await emailField.fill('test@example.com');
    await expect(emailField).toHaveCSS('direction', 'ltr');
    
    // Test password field
    const passwordField = page.locator('input[type="password"]');
    await passwordField.fill('password123');
    
    // Test Arabic text in a text field if available
    const textField = page.locator('input[type="text"]').first();
    if (await textField.isVisible()) {
      await textField.fill('ناجي رمضان');
      await expect(textField).toHaveCSS('direction', 'rtl');
    }
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"], input[type="submit"]');
    
    // Check for validation messages
    await expect(page.locator('.error, .invalid-feedback, [role="alert"]')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    // Fill in valid credentials (these would be test credentials)
    await page.fill('input[type="email"], input[name="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"], input[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL(/dashboard|home/);
    
    // Check that user is logged in
    await expect(page.locator('[data-testid="user-menu"], .user-menu')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('input[type="email"], input[name="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"], input[type="submit"]');
    
    // Check for error message
    await expect(page.locator('.error, .alert-danger, [role="alert"]')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test Tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="password"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"], input[type="submit"]')).toBeFocused();
    
    // Test Enter key submission
    await page.keyboard.press('Enter');
    // Should show validation errors for empty form
    await expect(page.locator('.error, .invalid-feedback, [role="alert"]')).toBeVisible();
  });

  test('should be accessible with screen readers', async ({ page }) => {
    // Check for proper ARIA labels
    await expect(page.locator('input[type="email"], input[name="email"]')).toHaveAttribute('aria-label');
    await expect(page.locator('input[type="password"]')).toHaveAttribute('aria-label');
    
    // Check for form labels
    await expect(page.locator('label')).toBeVisible();
    
    // Check for proper heading structure
    await expect(page.locator('h1, h2')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that login form is still accessible
    await expect(page.locator('form, [data-testid="login-form"]')).toBeVisible();
    
    // Check that logo is still visible
    await expect(page.locator('img[alt*="logo"], img[alt*="شعار"]')).toBeVisible();
    
    // Check that language switcher is accessible
    await expect(page.locator('[data-testid="language-switcher"], .language-switcher')).toBeVisible();
  });

  test('should handle password reset functionality', async ({ page }) => {
    // Look for password reset link
    const resetLink = page.locator('a[href*=reset], a[href*=forgot], text=Reset, text=نسيت كلمة المرور');
    
    if (await resetLink.isVisible()) {
      await resetLink.click();
      
      // Should navigate to password reset page
      await page.waitForURL(/reset|forgot/);
      
      // Check for email input field
      await expect(page.locator('input[type="email"]')).toBeVisible();
    }
  });

  test('should maintain session and remember me functionality', async ({ page }) => {
    // Check for remember me checkbox
    const rememberMe = page.locator('input[type="checkbox"][name*="remember"], input[type="checkbox"][id*="remember"]');
    
    if (await rememberMe.isVisible()) {
      await rememberMe.check();
      await expect(rememberMe).toBeChecked();
    }
  });
});
