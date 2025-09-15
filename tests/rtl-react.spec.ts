import { test, expect } from '@playwright/test';

test.describe('React RTL and Mixed Content Testing', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should handle RTL layout switching in React', async ({ page }) => {
    // Switch to Arabic
    await page.click('[data-testid="language-switcher"] [data-lang="ar"], .language-switcher [data-lang="ar"]');
    await page.waitForLoadState('networkidle');
    
    // Check that React app direction is RTL
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('.app')).toHaveAttribute('dir', 'rtl');
    
    // Verify Arabic content is displayed
    await expect(page.locator('text=العربية, text=العرب')).toBeVisible();
  });

  test('should handle mixed content in React form components', async ({ page }) => {
    await page.goto('/clients');
    
    // Test mixed content input component
    const mixedInput = page.locator('.mixed-content-input').first();
    if (await mixedInput.isVisible()) {
      // Test Arabic text (should be RTL)
      await mixedInput.fill('ناجي رمضان');
      await expect(mixedInput).toHaveCSS('direction', 'rtl');
      
      // Test English text (should be LTR)
      await mixedInput.fill('John Smith');
      await expect(mixedInput).toHaveCSS('direction', 'ltr');
      
      // Test mixed content (should auto-detect)
      await mixedInput.fill('ناجي Smith');
      // Direction should be determined by first character
      const firstChar = 'ناجي Smith'.charAt(0);
      const isArabic = /[\u0600-\u06FF]/.test(firstChar);
      const expectedDirection = isArabic ? 'rtl' : 'ltr';
      await expect(mixedInput).toHaveCSS('direction', expectedDirection);
    }
  });

  test('should handle React component RTL styling', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check that React components respect RTL styling
    const cards = page.locator('.card');
    if (await cards.count() > 0) {
      const firstCard = cards.first();
      await expect(firstCard).toHaveCSS('text-align', /right|start/);
    }
    
    // Check navigation RTL
    const nav = page.locator('.navbar, .sidebar');
    if (await nav.count() > 0) {
      const firstNav = nav.first();
      await expect(firstNav).toHaveCSS('direction', 'rtl');
    }
  });

  test('should handle React state updates with RTL', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test language switching updates React state
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      
      // Switch to English
      await page.click('[data-lang="en"]');
      await page.waitForLoadState('networkidle');
      
      // Check that React components updated
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
      
      // Switch back to Arabic
      await page.click('[data-lang="ar"]');
      await page.waitForLoadState('networkidle');
      
      // Check that React components updated back to RTL
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    }
  });

  test('should handle React table RTL layout', async ({ page }) => {
    await page.goto('/cases');
    
    // Test server-side paginated table RTL
    const table = page.locator('.server-paginated-table table, .table');
    if (await table.isVisible()) {
      await expect(table).toHaveCSS('direction', 'rtl');
      
      // Check table headers alignment
      const headers = table.locator('th');
      if (await headers.count() > 0) {
        await expect(headers.first()).toHaveCSS('text-align', /right|start/);
      }
    }
  });

  test('should handle React pagination RTL', async ({ page }) => {
    await page.goto('/cases');
    
    // Test pagination RTL
    const pagination = page.locator('.pagination, .table-pagination');
    if (await pagination.isVisible()) {
      await expect(pagination).toHaveCSS('direction', 'rtl');
      
      // Test pagination controls
      const prevButton = pagination.locator('.page-item:first-child');
      const nextButton = pagination.locator('.page-item:last-child');
      
      if (await nextButton.count() > 0) {
        // In RTL, next should be on the left
        await expect(nextButton).toHaveCSS('float', /left|none/);
      }
    }
  });

  test('should handle React modal RTL', async ({ page }) => {
    // Open a modal (this would depend on your app's functionality)
    const modalTrigger = page.locator('[data-bs-toggle="modal"], [data-testid="modal-trigger"]').first();
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click();
      
      const modal = page.locator('.modal, [role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Check modal RTL
      await expect(modal).toHaveCSS('direction', 'rtl');
      
      // Test modal content alignment
      const modalContent = modal.locator('.modal-body');
      if (await modalContent.isVisible()) {
        await expect(modalContent).toHaveCSS('text-align', /right|start/);
      }
      
      // Close modal
      await page.keyboard.press('Escape');
      await expect(modal).toBeHidden();
    }
  });

  test('should handle React dropdown RTL', async ({ page }) => {
    // Test language switcher dropdown RTL
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      
      const dropdown = page.locator('.dropdown-menu, .language-dropdown');
      await expect(dropdown).toBeVisible();
      
      // Check dropdown RTL
      await expect(dropdown).toHaveCSS('direction', 'rtl');
      
      // Check dropdown items alignment
      const dropdownItems = dropdown.locator('.dropdown-item');
      if (await dropdownItems.count() > 0) {
        await expect(dropdownItems.first()).toHaveCSS('text-align', /right|start/);
      }
    }
  });

  test('should handle React toast notifications RTL', async ({ page }) => {
    // Trigger a toast notification (this would depend on your app's functionality)
    // For example, by submitting a form or clicking a button
    
    const notifications = page.locator('.toast, .toast-rtl, [data-testid="notification"]');
    if (await notifications.count() > 0) {
      // Check notification RTL
      await expect(notifications.first()).toHaveCSS('direction', 'rtl');
      
      // Check notification text alignment
      await expect(notifications.first()).toHaveCSS('text-align', /right|start/);
    }
  });

  test('should handle React responsive design RTL', async ({ page }) => {
    // Test mobile RTL
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Check that RTL is maintained on mobile
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Test tablet RTL
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    
    // Check that RTL is maintained on tablet
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Test desktop RTL
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForLoadState('networkidle');
    
    // Check that RTL is maintained on desktop
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('should handle React component lifecycle with RTL', async ({ page }) => {
    // Test that RTL is maintained during React component updates
    await page.goto('/dashboard');
    
    // Check initial RTL state
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Navigate to another page
    await page.goto('/clients');
    await page.waitForLoadState('networkidle');
    
    // Check that RTL is maintained after navigation
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Navigate back
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check that RTL is maintained after navigation back
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('should handle React context updates with RTL', async ({ page }) => {
    // Test that React context updates maintain RTL state
    await page.goto('/dashboard');
    
    // Check initial RTL state
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Switch language (this should trigger React context update)
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      await page.click('[data-lang="en"]');
      await page.waitForLoadState('networkidle');
      
      // Check that React context updated to LTR
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
      
      // Switch back to Arabic
      await languageSwitcher.click();
      await page.click('[data-lang="ar"]');
      await page.waitForLoadState('networkidle');
      
      // Check that React context updated back to RTL
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    }
  });
});
