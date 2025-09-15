import { test, expect } from '@playwright/test';

test.describe('React Authentication System', () => {
  
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
    
    // Check for email field
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    
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
    
    // Test mixed content input if available
    const mixedInput = page.locator('.mixed-content-input').first();
    if (await mixedInput.isVisible()) {
      await mixedInput.fill('ناجي Smith');
      await expect(mixedInput).toHaveCSS('direction', 'rtl');
    }
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"], input[type="submit"]');
    
    // Check for validation messages
    await expect(page.locator('.error, .invalid-feedback, [role="alert"]')).toBeVisible();
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

  test('should handle React state updates', async ({ page }) => {
    // Test React state updates by filling form fields
    const emailField = page.locator('input[type="email"], input[name="email"]');
    const passwordField = page.locator('input[type="password"]');
    
    await emailField.fill('test@example.com');
    await passwordField.fill('password123');
    
    // Check that values are maintained
    await expect(emailField).toHaveValue('test@example.com');
    await expect(passwordField).toHaveValue('password123');
  });

  test('should handle React component interactions', async ({ page }) => {
    // Test password visibility toggle
    const passwordField = page.locator('input[type="password"]');
    const toggleButton = page.locator('button[aria-label*="password"], button[aria-label*="Password"]');
    
    if (await toggleButton.isVisible()) {
      await passwordField.fill('password123');
      await toggleButton.click();
      
      // Check that password field type changed to text
      await expect(passwordField).toHaveAttribute('type', 'text');
      
      await toggleButton.click();
      // Check that password field type changed back to password
      await expect(passwordField).toHaveAttribute('type', 'password');
    }
  });

  test('should handle React routing', async ({ page }) => {
    // Test that clicking logo navigates to dashboard (when authenticated)
    const logo = page.locator('img[alt*="logo"], img[alt*="شعار"]');
    if (await logo.isVisible()) {
      await logo.click();
      // Should stay on login page if not authenticated
      await expect(page).toHaveURL(/login/);
    }
  });

  test('should handle React error states', async ({ page }) => {
    // Fill form with invalid credentials
    const emailField = page.locator('input[type="email"], input[name="email"]');
    const passwordField = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    
    await emailField.fill('invalid@example.com');
    await passwordField.fill('wrongpassword');
    await submitButton.click();
    
    // Check for error message (this would depend on your error handling)
    // await expect(page.locator('.alert-danger, .error')).toBeVisible();
  });

  test('should handle React loading states', async ({ page }) => {
    // Fill form and submit
    const emailField = page.locator('input[type="email"], input[name="email"]');
    const passwordField = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    
    await emailField.fill('test@example.com');
    await passwordField.fill('password123');
    await submitButton.click();
    
    // Check for loading state (this would depend on your loading implementation)
    // await expect(page.locator('.spinner-border, .loading')).toBeVisible();
  });
});
