import { test, expect } from '@playwright/test';
import TestHelpers from './utils/test-helpers.js';

test.describe('RTL and Mixed Content Testing', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should handle RTL layout switching', async ({ page }) => {
    // Test switching to Arabic
    await helpers.switchLanguage('ar');
    await helpers.testRTLayout();
    
    // Verify Arabic content is displayed
    await expect(page.locator('text=العربية, text=العرب')).toBeVisible();
    
    // Test switching back to English
    await helpers.switchLanguage('en');
    await helpers.waitForLTR();
    
    // Verify English content is displayed
    await expect(page.locator('text=English, text=Login')).toBeVisible();
  });

  test('should handle mixed Arabic/English content in forms', async ({ page }) => {
    await helpers.switchLanguage('ar');
    
    // Test client name field with mixed content
    await helpers.testMixedContent(
      'input[name="client_name"], input[name="clientName"]',
      'ناجي رمضان',
      'John Smith'
    );
    
    // Test address field with mixed content
    await helpers.testMixedContent(
      'input[name="address"], textarea[name="address"]',
      'شارع الملك فهد، الرياض',
      '123 Main Street, New York'
    );
    
    // Test email field (should always be LTR)
    const emailField = page.locator('input[type="email"], input[name="email"]');
    if (await emailField.count() > 0) {
      await emailField.fill('test@example.com');
      await expect(emailField).toHaveCSS('direction', 'ltr');
    }
  });

  test('should maintain proper text direction in mixed content', async ({ page }) => {
    await helpers.switchLanguage('ar');
    
    // Test mixed content in text areas
    const textArea = page.locator('textarea[name="description"], textarea[name="notes"]');
    if (await textArea.count() > 0) {
      // Test Arabic-first mixed content
      await textArea.fill('هذا نص بالعربية مع English text');
      await expect(textArea).toHaveCSS('direction', 'rtl');
      
      // Test English-first mixed content
      await textArea.fill('English text with نص عربي');
      await expect(textArea).toHaveCSS('direction', 'ltr');
    }
  });

  test('should handle RTL table layouts', async ({ page }) => {
    await helpers.switchLanguage('ar');
    
    const table = page.locator('table, [data-testid="data-table"]');
    if (await table.count() > 0) {
      // Check table direction
      await expect(table).toHaveCSS('direction', 'rtl');
      
      // Check table alignment
      const tableText = table.locator('td, th').first();
      await expect(tableText).toHaveCSS('text-align', /right|start/);
      
      // Test table sorting with RTL content
      const sortableHeader = table.locator('th[data-sortable], th.sortable').first();
      if (await sortableHeader.count() > 0) {
        await sortableHeader.click();
        await page.waitForLoadState('networkidle');
        
        // Verify sorting works with Arabic content
        const firstRow = table.locator('tbody tr').first();
        await expect(firstRow).toBeVisible();
      }
    }
  });

  test('should handle RTL navigation menus', async ({ page }) => {
    await helpers.switchLanguage('ar');
    
    const nav = page.locator('nav, [role="navigation"], .navbar');
    if (await nav.count() > 0) {
      // Check navigation direction
      await expect(nav).toHaveCSS('direction', 'rtl');
      
      // Test navigation items alignment
      const navItems = nav.locator('a, button');
      const firstItem = navItems.first();
      await expect(firstItem).toHaveCSS('text-align', /right|start/);
      
      // Test dropdown menus in RTL
      const dropdownToggle = nav.locator('[data-bs-toggle="dropdown"], .dropdown-toggle').first();
      if (await dropdownToggle.count() > 0) {
        await dropdownToggle.click();
        
        const dropdown = page.locator('.dropdown-menu, [data-testid="dropdown"]');
        await expect(dropdown).toBeVisible();
        await expect(dropdown).toHaveCSS('direction', 'rtl');
      }
    }
  });

  test('should handle RTL form layouts', async ({ page }) => {
    await helpers.switchLanguage('ar');
    
    const form = page.locator('form');
    if (await form.count() > 0) {
      // Check form direction
      await expect(form).toHaveCSS('direction', 'rtl');
      
      // Test form labels alignment
      const labels = form.locator('label');
      const firstLabel = labels.first();
      if (await firstLabel.count() > 0) {
        await expect(firstLabel).toHaveCSS('text-align', /right|start/);
      }
      
      // Test form buttons alignment
      const buttons = form.locator('button, input[type="submit"]');
      const submitButton = buttons.filter({ hasText: /إرسال|Submit|حفظ|Save/ }).first();
      if (await submitButton.count() > 0) {
        await expect(submitButton).toHaveCSS('float', /right|none/);
      }
    }
  });

  test('should handle Arabic date formatting', async ({ page }) => {
    await helpers.switchLanguage('ar');
    
    // Test date inputs
    const dateInputs = page.locator('input[type="date"], input[type="datetime-local"]');
    if (await dateInputs.count() > 0) {
      const dateInput = dateInputs.first();
      await dateInput.fill('2024-12-01');
      
      // Verify date value
      await expect(dateInput).toHaveValue('2024-12-01');
      
      // Test date display formatting
      const dateDisplay = page.locator('[data-testid="date-display"], .date-display');
      if (await dateDisplay.count() > 0) {
        await expect(dateDisplay.first()).toBeVisible();
      }
    }
  });

  test('should handle Arabic number formatting', async ({ page }) => {
    await helpers.switchLanguage('ar');
    
    // Test number inputs
    const numberInputs = page.locator('input[type="number"], input[name*="amount"], input[name*="price"]');
    if (await numberInputs.count() > 0) {
      const numberInput = numberInputs.first();
      await numberInput.fill('1234.56');
      
      // Verify number value
      await expect(numberInput).toHaveValue('1234.56');
      
      // Test number display formatting
      const numberDisplay = page.locator('[data-testid="number-display"], .number-display');
      if (await numberDisplay.count() > 0) {
        await expect(numberDisplay.first()).toBeVisible();
      }
    }
  });

  test('should handle RTL in modal dialogs', async ({ page }) => {
    await helpers.switchLanguage('ar');
    
    // Open a modal (this would depend on your app's functionality)
    const modalTrigger = page.locator('[data-bs-toggle="modal"], [data-testid="modal-trigger"]').first();
    if (await modalTrigger.count() > 0) {
      await modalTrigger.click();
      
      const modal = page.locator('.modal, [role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Check modal direction
      await expect(modal).toHaveCSS('direction', 'rtl');
      
      // Test modal content alignment
      const modalContent = modal.locator('.modal-body, [data-testid="modal-content"]');
      await expect(modalContent).toHaveCSS('text-align', /right|start/);
      
      // Test modal buttons alignment
      const modalButtons = modal.locator('.modal-footer button, [data-testid="modal-actions"] button');
      if (await modalButtons.count() > 0) {
        await expect(modalButtons.first()).toHaveCSS('float', /right|none/);
      }
      
      // Close modal
      await page.keyboard.press('Escape');
      await expect(modal).toBeHidden();
    }
  });

  test('should handle RTL in data tables with sorting', async ({ page }) => {
    await helpers.switchLanguage('ar');
    
    const table = page.locator('table[data-sortable], [data-testid="sortable-table"]');
    if (await table.count() > 0) {
      // Test column sorting
      const sortableColumns = table.locator('th[data-sortable], th.sortable');
      const columnCount = await sortableColumns.count();
      
      for (let i = 0; i < Math.min(columnCount, 3); i++) {
        const column = sortableColumns.nth(i);
        await column.click();
        await page.waitForLoadState('networkidle');
        
        // Verify sorting indicator
        await expect(column.locator('.sort-indicator, .fa-sort')).toBeVisible();
        
        // Test reverse sorting
        await column.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should handle RTL in pagination controls', async ({ page }) => {
    await helpers.switchLanguage('ar');
    
    const pagination = page.locator('.pagination, [data-testid="pagination"]');
    if (await pagination.count() > 0) {
      // Check pagination direction
      await expect(pagination).toHaveCSS('direction', 'rtl');
      
      // Test pagination controls
      const prevButton = pagination.locator('.page-item:first-child, [data-testid="prev-page"]');
      const nextButton = pagination.locator('.page-item:last-child, [data-testid="next-page"]');
      
      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForLoadState('networkidle');
        
        // Verify page change
        const currentPage = pagination.locator('.page-item.active, [data-testid="current-page"]');
        await expect(currentPage).toBeVisible();
      }
    }
  });

  test('should handle RTL in search functionality', async ({ page }) => {
    await helpers.switchLanguage('ar');
    
    const searchInput = page.locator('input[type="search"], [data-testid="search-input"]');
    if (await searchInput.count() > 0) {
      // Test Arabic search
      await searchInput.fill('محامي');
      await this.page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
      
      // Check search results
      const searchResults = page.locator('[data-testid="search-results"], .search-results');
      if (await searchResults.count() > 0) {
        await expect(searchResults).toBeVisible();
        await expect(searchResults).toHaveCSS('direction', 'rtl');
      }
      
      // Test mixed content search
      await searchInput.fill('محامي lawyer');
      await this.page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    }
  });

  test('should handle RTL in file upload areas', async ({ page }) => {
    await helpers.switchLanguage('ar');
    
    const fileUpload = page.locator('[data-testid="file-upload"], .file-upload, input[type="file"]');
    if (await fileUpload.count() > 0) {
      // Check upload area direction
      await expect(fileUpload).toHaveCSS('direction', 'rtl');
      
      // Test drag and drop area text alignment
      const dropArea = page.locator('.drop-zone, [data-testid="drop-zone"]');
      if (await dropArea.count() > 0) {
        await expect(dropArea).toHaveCSS('text-align', /right|start/);
      }
    }
  });

  test('should handle RTL in notification messages', async ({ page }) => {
    await helpers.switchLanguage('ar');
    
    // Trigger a notification (this would depend on your app's functionality)
    // For example, by submitting a form or clicking a button
    
    const notifications = page.locator('.toast, .notification, [data-testid="notification"]');
    if (await notifications.count() > 0) {
      // Check notification direction
      await expect(notifications.first()).toHaveCSS('direction', 'rtl');
      
      // Check notification text alignment
      await expect(notifications.first()).toHaveCSS('text-align', /right|start/);
    }
  });
});
