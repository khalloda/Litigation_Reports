import { Page, expect } from '@playwright/test';

export class LoginHelpers {
  /**
   * Login with email and password
   */
  async login(page: Page, email: string, password: string): Promise<void> {
    // Navigate to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Fill email field
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await emailInput.fill(email);

    // Fill password field
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(password);

    // Submit the form
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await submitButton.click();

    // Wait for navigation to dashboard or home page
    await page.waitForURL('**/dashboard', { timeout: 10000 });
  }

  /**
   * Login as admin user
   */
  async loginAsAdmin(page: Page): Promise<void> {
    await this.login(page, 'admin@litigation.com', 'password123');
  }

  /**
   * Login as lawyer user
   */
  async loginAsLawyer(page: Page): Promise<void> {
    await this.login(page, 'lawyer@litigation.com', 'password123');
  }

  /**
   * Login as staff user
   */
  async loginAsStaff(page: Page): Promise<void> {
    await this.login(page, 'staff@litigation.com', 'password123');
  }

  /**
   * Logout current user
   */
  async logout(page: Page): Promise<void> {
    // Look for logout button or user menu
    const logoutButton = page.locator('[data-testid="logout"], .logout-btn');
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu');

    if (await userMenu.isVisible()) {
      await userMenu.click();
      await page.locator('[data-testid="logout"], text=تسجيل الخروج, text=Logout').click();
    } else if (await logoutButton.isVisible()) {
      await logoutButton.click();
    }

    // Wait for redirect to login page
    await page.waitForURL('**/login', { timeout: 5000 });
  }

  /**
   * Verify user is logged in
   */
  async verifyLoggedIn(page: Page): Promise<void> {
    // Should be on dashboard or any protected page
    expect(page.url()).not.toContain('/login');

    // Should see user menu or logout button
    const userIndicators = page.locator(
      '[data-testid="user-menu"], [data-testid="logout"], .user-menu, .logout-btn'
    );
    await expect(userIndicators.first()).toBeVisible();
  }

  /**
   * Verify user is logged out
   */
  async verifyLoggedOut(page: Page): Promise<void> {
    // Should be redirected to login page
    expect(page.url()).toContain('/login');

    // Should see login form
    await expect(page.locator('form, [data-testid="login-form"]')).toBeVisible();
  }

  /**
   * Check for authentication errors
   */
  async checkAuthError(page: Page): Promise<boolean> {
    const errorMessages = page.locator('.alert-danger, .error-message, [data-testid="auth-error"]');
    return await errorMessages.isVisible();
  }

  /**
   * Switch language on login page
   */
  async switchLanguage(page: Page, language: 'ar' | 'en'): Promise<void> {
    const languageSwitcher = page.locator(
      `[data-testid="language-switcher"] [data-lang="${language}"], .language-switcher [data-lang="${language}"]`
    );
    await languageSwitcher.click();
    await page.waitForLoadState('networkidle');
  }

  /**
   * Verify RTL layout is active
   */
  async verifyRTLLayout(page: Page): Promise<void> {
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  }

  /**
   * Verify LTR layout is active
   */
  async verifyLTRLayout(page: Page): Promise<void> {
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  }

  /**
   * Fill login form without submitting
   */
  async fillLoginForm(page: Page, email: string, password: string): Promise<void> {
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await emailInput.fill(email);

    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(password);
  }

  /**
   * Submit login form
   */
  async submitLoginForm(page: Page): Promise<void> {
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await submitButton.click();
  }

  /**
   * Test login with invalid credentials
   */
  async testInvalidLogin(page: Page, email: string, password: string): Promise<void> {
    await this.fillLoginForm(page, email, password);
    await this.submitLoginForm(page);

    // Should show error message
    const hasError = await this.checkAuthError(page);
    expect(hasError).toBe(true);

    // Should remain on login page
    expect(page.url()).toContain('/login');
  }

  /**
   * Check if user has specific role permissions
   */
  async verifyUserRole(page: Page, expectedRole: 'admin' | 'lawyer' | 'staff'): Promise<void> {
    // This depends on how role information is displayed in the UI
    // Could be in user menu, dashboard, or data attributes
    const roleIndicator = page.locator(`[data-role="${expectedRole}"], .role-${expectedRole}`);

    if (await roleIndicator.isVisible()) {
      await expect(roleIndicator).toBeVisible();
    } else {
      // Alternative: check what navigation items are available based on role
      switch (expectedRole) {
        case 'admin':
          await expect(
            page.locator('[data-testid="nav-users"], text=إدارة المستخدمين, text=User Management')
          ).toBeVisible();
          break;
        case 'lawyer':
          await expect(
            page.locator('[data-testid="nav-cases"], text=القضايا, text=Cases')
          ).toBeVisible();
          break;
        case 'staff':
          await expect(
            page.locator('[data-testid="nav-clients"], text=العملاء, text=Clients')
          ).toBeVisible();
          break;
      }
    }
  }
}
