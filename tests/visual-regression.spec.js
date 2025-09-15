const { test, expect } = require('@playwright/test');
const TestHelpers = require('./utils/test-helpers');

test.describe('Visual Regression Testing', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should match login page screenshot', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match login page in RTL mode', async ({ page }) => {
    await page.goto('/login');
    await helpers.switchLanguage('ar');
    await page.waitForLoadState('networkidle');
    
    // Take RTL login page screenshot
    await expect(page).toHaveScreenshot('login-page-rtl.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match dashboard layout', async ({ page }) => {
    // Login first (you'll need to implement this based on your auth system)
    await page.goto('/login');
    // Add login steps here...
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Take dashboard screenshot
    await expect(page).toHaveScreenshot('dashboard.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match dashboard in RTL mode', async ({ page }) => {
    await page.goto('/dashboard');
    await helpers.switchLanguage('ar');
    await page.waitForLoadState('networkidle');
    
    // Take RTL dashboard screenshot
    await expect(page).toHaveScreenshot('dashboard-rtl.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match client management page', async ({ page }) => {
    await page.goto('/clients');
    await page.waitForLoadState('networkidle');
    
    // Take client management page screenshot
    await expect(page).toHaveScreenshot('clients-page.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match client management page in RTL', async ({ page }) => {
    await page.goto('/clients');
    await helpers.switchLanguage('ar');
    await page.waitForLoadState('networkidle');
    
    // Take RTL client management page screenshot
    await expect(page).toHaveScreenshot('clients-page-rtl.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match case management page', async ({ page }) => {
    await page.goto('/cases');
    await page.waitForLoadState('networkidle');
    
    // Take case management page screenshot
    await expect(page).toHaveScreenshot('cases-page.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match case management page in RTL', async ({ page }) => {
    await page.goto('/cases');
    await helpers.switchLanguage('ar');
    await page.waitForLoadState('networkidle');
    
    // Take RTL case management page screenshot
    await expect(page).toHaveScreenshot('cases-page-rtl.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match responsive design on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take mobile screenshot
    await expect(page).toHaveScreenshot('mobile-home.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match responsive design on tablet', async ({ page }) => {
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take tablet screenshot
    await expect(page).toHaveScreenshot('tablet-home.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match responsive design on desktop', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take desktop screenshot
    await expect(page).toHaveScreenshot('desktop-home.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match form layouts', async ({ page }) => {
    await page.goto('/clients/new');
    await page.waitForLoadState('networkidle');
    
    // Take form screenshot
    await expect(page).toHaveScreenshot('client-form.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match form layouts in RTL', async ({ page }) => {
    await page.goto('/clients/new');
    await helpers.switchLanguage('ar');
    await page.waitForLoadState('networkidle');
    
    // Take RTL form screenshot
    await expect(page).toHaveScreenshot('client-form-rtl.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match data table layouts', async ({ page }) => {
    await page.goto('/cases');
    await page.waitForLoadState('networkidle');
    
    // Wait for table to load
    const table = page.locator('table, [data-testid="data-table"]');
    await expect(table).toBeVisible();
    
    // Take table screenshot
    await expect(table).toHaveScreenshot('cases-table.png', {
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match data table layouts in RTL', async ({ page }) => {
    await page.goto('/cases');
    await helpers.switchLanguage('ar');
    await page.waitForLoadState('networkidle');
    
    // Wait for table to load
    const table = page.locator('table, [data-testid="data-table"]');
    await expect(table).toBeVisible();
    
    // Take RTL table screenshot
    await expect(table).toHaveScreenshot('cases-table-rtl.png', {
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match modal dialogs', async ({ page }) => {
    await page.goto('/clients');
    await page.waitForLoadState('networkidle');
    
    // Open modal
    const modalTrigger = page.locator('[data-bs-toggle="modal"], [data-testid="modal-trigger"]').first();
    if (await modalTrigger.count() > 0) {
      await modalTrigger.click();
      
      const modal = page.locator('.modal, [role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Take modal screenshot
      await expect(modal).toHaveScreenshot('modal-dialog.png', {
        threshold: 0.2,
        animations: 'disabled'
      });
    }
  });

  test('should match modal dialogs in RTL', async ({ page }) => {
    await page.goto('/clients');
    await helpers.switchLanguage('ar');
    await page.waitForLoadState('networkidle');
    
    // Open modal
    const modalTrigger = page.locator('[data-bs-toggle="modal"], [data-testid="modal-trigger"]').first();
    if (await modalTrigger.count() > 0) {
      await modalTrigger.click();
      
      const modal = page.locator('.modal, [role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Take RTL modal screenshot
      await expect(modal).toHaveScreenshot('modal-dialog-rtl.png', {
        threshold: 0.2,
        animations: 'disabled'
      });
    }
  });

  test('should match navigation menus', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const navigation = page.locator('nav, [role="navigation"], .navbar');
    if (await navigation.count() > 0) {
      // Take navigation screenshot
      await expect(navigation.first()).toHaveScreenshot('navigation.png', {
        threshold: 0.2,
        animations: 'disabled'
      });
    }
  });

  test('should match navigation menus in RTL', async ({ page }) => {
    await page.goto('/');
    await helpers.switchLanguage('ar');
    await page.waitForLoadState('networkidle');
    
    const navigation = page.locator('nav, [role="navigation"], .navbar');
    if (await navigation.count() > 0) {
      // Take RTL navigation screenshot
      await expect(navigation.first()).toHaveScreenshot('navigation-rtl.png', {
        threshold: 0.2,
        animations: 'disabled'
      });
    }
  });

  test('should match footer layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const footer = page.locator('footer, [role="contentinfo"]');
    if (await footer.count() > 0) {
      // Take footer screenshot
      await expect(footer.first()).toHaveScreenshot('footer.png', {
        threshold: 0.2,
        animations: 'disabled'
      });
    }
  });

  test('should match footer layout in RTL', async ({ page }) => {
    await page.goto('/');
    await helpers.switchLanguage('ar');
    await page.waitForLoadState('networkidle');
    
    const footer = page.locator('footer, [role="contentinfo"]');
    if (await footer.count() > 0) {
      // Take RTL footer screenshot
      await expect(footer.first()).toHaveScreenshot('footer-rtl.png', {
        threshold: 0.2,
        animations: 'disabled'
      });
    }
  });

  test('should match error page layouts', async ({ page }) => {
    // Navigate to a non-existent page to trigger 404
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
    
    // Take error page screenshot
    await expect(page).toHaveScreenshot('error-404.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match loading states', async ({ page }) => {
    await page.goto('/cases');
    
    // Wait for loading state to appear
    const loadingIndicator = page.locator('.loading, .spinner, [data-testid="loading"]');
    if (await loadingIndicator.count() > 0) {
      await expect(loadingIndicator.first()).toBeVisible();
      
      // Take loading state screenshot
      await expect(loadingIndicator.first()).toHaveScreenshot('loading-state.png', {
        threshold: 0.2,
        animations: 'disabled'
      });
    }
  });

  test('should match notification messages', async ({ page }) => {
    await page.goto('/');
    
    // Trigger a notification (this would depend on your app's functionality)
    // For example, by submitting a form or clicking a button
    
    const notifications = page.locator('.toast, .notification, [data-testid="notification"]');
    if (await notifications.count() > 0) {
      // Take notification screenshot
      await expect(notifications.first()).toHaveScreenshot('notification.png', {
        threshold: 0.2,
        animations: 'disabled'
      });
    }
  });

  test('should match print styles', async ({ page }) => {
    await page.goto('/cases');
    await page.waitForLoadState('networkidle');
    
    // Set print media
    await page.emulateMedia({ media: 'print' });
    
    // Take print layout screenshot
    await expect(page).toHaveScreenshot('print-layout.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match dark mode layout', async ({ page }) => {
    await page.goto('/');
    
    // Toggle dark mode (this would depend on your app's implementation)
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"], .dark-mode-toggle');
    if (await darkModeToggle.count() > 0) {
      await darkModeToggle.click();
      await page.waitForLoadState('networkidle');
      
      // Take dark mode screenshot
      await expect(page).toHaveScreenshot('dark-mode.png', {
        fullPage: true,
        threshold: 0.2,
        animations: 'disabled'
      });
    }
  });

  test('should match high contrast mode', async ({ page }) => {
    await page.goto('/');
    
    // Enable high contrast mode
    await page.emulateMedia({ forcedColors: 'active' });
    await page.waitForLoadState('networkidle');
    
    // Take high contrast screenshot
    await expect(page).toHaveScreenshot('high-contrast.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('should match reduced motion layout', async ({ page }) => {
    await page.goto('/');
    
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForLoadState('networkidle');
    
    // Take reduced motion screenshot
    await expect(page).toHaveScreenshot('reduced-motion.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });
});
