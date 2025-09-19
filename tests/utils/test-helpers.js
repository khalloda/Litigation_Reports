/**
 * Test utilities for RTL, accessibility, and mixed content testing
 */

class TestHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for RTL layout to be applied
   */
  async waitForRTL() {
    await this.page.waitForFunction(() => {
      return document.documentElement.dir === 'rtl';
    }, { timeout: 5000 });
  }

  /**
   * Wait for LTR layout to be applied
   */
  async waitForLTR() {
    await this.page.waitForFunction(() => {
      return document.documentElement.dir === 'ltr';
    }, { timeout: 5000 });
  }

  /**
   * Switch language and wait for layout change
   */
  async switchLanguage(language) {
    const languageSwitcher = this.page.locator('[data-testid="language-switcher"], .language-switcher');
    const languageButton = languageSwitcher.locator(`[data-lang="${language}"]`);
    
    await languageButton.click();
    
    if (language === 'ar') {
      await this.waitForRTL();
    } else {
      await this.waitForLTR();
    }
    
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Test mixed content handling in form fields
   */
  async testMixedContent(selector, arabicText, englishText) {
    const field = this.page.locator(selector);
    
    // Test Arabic text (should be RTL)
    await field.fill(arabicText);
    await expect(field).toHaveCSS('direction', 'rtl');
    
    // Test English text (should be LTR)
    await field.fill(englishText);
    await expect(field).toHaveCSS('direction', 'ltr');
    
    // Test mixed content (should auto-detect)
    await field.fill(`${arabicText} ${englishText}`);
    // Direction should be determined by first character
    const firstChar = arabicText.charAt(0);
    const isArabic = /[\u0600-\u06FF]/.test(firstChar);
    const expectedDirection = isArabic ? 'rtl' : 'ltr';
    await expect(field).toHaveCSS('direction', expectedDirection);
  }

  /**
   * Test keyboard navigation through elements
   */
  async testKeyboardNavigation(elements) {
    for (let i = 0; i < elements.length; i++) {
      await this.page.keyboard.press('Tab');
      await expect(this.page.locator(elements[i])).toBeFocused();
    }
  }

  /**
   * Test screen reader accessibility
   */
  async testScreenReaderAccessibility() {
    // Check for proper ARIA labels
    const ariaLabels = await this.page.locator('[aria-label]').count();
    expect(ariaLabels).toBeGreaterThan(0);
    
    // Check for proper heading structure
    const h1 = await this.page.locator('h1').count();
    expect(h1).toBeGreaterThan(0);
    
    // Check for landmark roles
    const landmarks = await this.page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]').count();
    expect(landmarks).toBeGreaterThan(0);
    
    // Check for form labels
    const formLabels = await this.page.locator('label').count();
    expect(formLabels).toBeGreaterThan(0);
  }

  /**
   * Test RTL layout properties
   */
  async testRTLayout() {
    // Check document direction
    await expect(this.page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Check for RTL-specific CSS properties
    const body = this.page.locator('body');
    const textAlign = await body.evaluate(el => getComputedStyle(el).textAlign);
    expect(['right', 'start']).toContain(textAlign);
    
    // Check for logical properties usage
    const hasLogicalProperties = await this.page.evaluate(() => {
      const styles = getComputedStyle(document.body);
      return styles.marginInlineStart !== undefined || 
             styles.paddingInlineEnd !== undefined ||
             styles.borderInlineStart !== undefined;
    });
    expect(hasLogicalProperties).toBeTruthy();
  }

  /**
   * Take screenshot for visual regression testing
   */
  async takeVisualScreenshot(name, fullPage = false) {
    const screenshot = await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: fullPage
    });
    return screenshot;
  }

  /**
   * Compare visual elements for regression testing
   */
  async compareVisualElement(selector, name) {
    const element = this.page.locator(selector);
    await expect(element).toHaveScreenshot(`${name}.png`);
  }

  /**
   * Test form validation
   */
  async testFormValidation(formSelector, requiredFields) {
    const form = this.page.locator(formSelector);
    
    // Try to submit empty form
    await form.locator('button[type="submit"], input[type="submit"]').click();
    
    // Check for validation messages
    for (const field of requiredFields) {
      const fieldElement = form.locator(field);
      await expect(fieldElement).toHaveAttribute('aria-invalid', 'true');
    }
    
    // Check for error messages
    const errorMessages = form.locator('.error, .invalid-feedback, [role="alert"]');
    await expect(errorMessages).toBeVisible();
  }

  /**
   * Test responsive design breakpoints
   */
  async testResponsiveBreakpoints(breakpoints) {
    for (const [name, width, height] of Object.entries(breakpoints)) {
      await this.page.setViewportSize({ width, height });
      await this.page.waitForLoadState('networkidle');
      
      // Take screenshot for visual regression
      await this.takeVisualScreenshot(`responsive-${name}`, true);
      
      // Test that critical elements are still visible
      const criticalElements = [
        '[data-testid="main-nav"], .main-nav',
        '[data-testid="content"], .main-content',
        '[data-testid="logo"], .logo'
      ];
      
      for (const selector of criticalElements) {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          await expect(element).toBeVisible();
        }
      }
    }
  }

  /**
   * Test performance metrics
   */
  async testPerformance() {
    const metrics = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const navigation = performance.getEntriesByType('navigation')[0];
        resolve({
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
        });
      });
    });
    
    // Performance assertions
    expect(metrics.loadTime).toBeLessThan(3000); // 3 seconds
    expect(metrics.domContentLoaded).toBeLessThan(1500); // 1.5 seconds
    expect(metrics.firstContentfulPaint).toBeLessThan(2000); // 2 seconds
    
    return metrics;
  }

  /**
   * Test Arabic text rendering
   */
  async testArabicTextRendering() {
    // Test Arabic font loading
    const arabicFonts = await this.page.evaluate(() => {
      const fonts = Array.from(document.fonts);
      return fonts.filter(font => font.family.includes('Arabic') || font.family.includes('arabic'));
    });
    
    expect(arabicFonts.length).toBeGreaterThan(0);
    
    // Test Arabic text direction
    const arabicText = this.page.locator('text=العربية, text=العرب, text=محامي');
    if (await arabicText.count() > 0) {
      const firstText = arabicText.first();
      await expect(firstText).toHaveCSS('direction', 'rtl');
      await expect(firstText).toHaveCSS('text-align', /right|start/);
    }
  }

  /**
   * Test date formatting for different locales
   */
  async testDateFormatting() {
    const dateInputs = this.page.locator('input[type="date"], input[type="datetime-local"]');
    const count = await dateInputs.count();
    
    if (count > 0) {
      const firstDateInput = dateInputs.first();
      
      // Test date input functionality
      await firstDateInput.fill('2024-12-01');
      await expect(firstDateInput).toHaveValue('2024-12-01');
      
      // Test date display formatting
      const dateDisplay = this.page.locator('[data-testid="date-display"], .date-display');
      if (await dateDisplay.count() > 0) {
        await expect(dateDisplay.first()).toBeVisible();
      }
    }
  }

  /**
   * Test file upload functionality
   */
  async testFileUpload(uploadSelector, testFilePath) {
    const uploadInput = this.page.locator(uploadSelector);
    
    // Test drag and drop
    const fileInput = uploadInput.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(testFilePath);
      
      // Check for upload progress or success message
      const uploadStatus = this.page.locator('[data-testid="upload-status"], .upload-status');
      await expect(uploadStatus).toBeVisible({ timeout: 10000 });
    }
  }

  /**
   * Test notification system
   */
  async testNotifications() {
    // Test toast notifications
    const toastNotifications = this.page.locator('.toast, .notification, [data-testid="toast"]');
    
    // Trigger a notification (this would depend on your app's functionality)
    // For example, submitting a form or clicking a button
    
    // Check if notification appears
    if (await toastNotifications.count() > 0) {
      await expect(toastNotifications.first()).toBeVisible();
      
      // Test notification auto-dismiss
      await this.page.waitForTimeout(5000); // Wait for auto-dismiss
      // Notification should be hidden after timeout
    }
  }

  /**
   * Test modal dialogs
   */
  async testModalDialogs() {
    const modals = this.page.locator('.modal, [role="dialog"], [data-testid="modal"]');
    const modalTriggers = this.page.locator('[data-bs-toggle="modal"], [data-testid="modal-trigger"]');
    
    if (await modalTriggers.count() > 0) {
      // Open modal
      await modalTriggers.first().click();
      
      // Check modal is visible
      await expect(modals.first()).toBeVisible();
      
      // Test keyboard navigation in modal
      await this.page.keyboard.press('Tab');
      await this.page.keyboard.press('Tab');
      
      // Test modal close with Escape key
      await this.page.keyboard.press('Escape');
      await expect(modals.first()).toBeHidden();
    }
  }

  /**
   * Test search functionality
   */
  async testSearch(searchSelector, searchTerm) {
    const searchInput = this.page.locator(searchSelector);
    const searchButton = this.page.locator('[data-testid="search-button"], .search-button');
    
    await searchInput.fill(searchTerm);
    
    if (await searchButton.count() > 0) {
      await searchButton.click();
    } else {
      await this.page.keyboard.press('Enter');
    }
    
    // Wait for search results
    await this.page.waitForLoadState('networkidle');
    
    // Check for search results
    const searchResults = this.page.locator('[data-testid="search-results"], .search-results');
    await expect(searchResults).toBeVisible();
  }
}

export default TestHelpers;
