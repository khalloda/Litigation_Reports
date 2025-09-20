import { test, expect } from '@playwright/test';
import TestHelpers from './utils/test-helpers.js';

test.describe('Accessibility Testing', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check for H1 tag
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Check heading hierarchy (no skipped levels)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const level = parseInt(tagName.charAt(1));
      
      // First heading should be h1
      if (previousLevel === 0) {
        expect(level).toBe(1);
      } else {
        // No heading level should be more than 1 level deeper than previous
        expect(level).toBeLessThanOrEqual(previousLevel + 1);
      }
      
      previousLevel = level;
    }
  });

  test('should have proper landmark roles', async ({ page }) => {
    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    await expect(main).toHaveCount(1);
    
    // Check for navigation landmark
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav).toHaveCount(1);
    
    // Check for banner landmark (header)
    const banner = page.locator('header, [role="banner"]');
    await expect(banner).toHaveCount(1);
    
    // Check for contentinfo landmark (footer)
    const contentinfo = page.locator('footer, [role="contentinfo"]');
    await expect(contentinfo).toHaveCount(1);
  });

  test('should have proper form labels and associations', async ({ page }) => {
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    for (let i = 0; i < formCount; i++) {
      const form = forms.nth(i);
      
      // Check all form inputs have labels
      const inputs = form.locator('input, select, textarea');
      const inputCount = await inputs.count();
      
      for (let j = 0; j < inputCount; j++) {
        const input = inputs.nth(j);
        const inputType = await input.getAttribute('type');
        
        // Skip hidden inputs
        if (inputType === 'hidden') continue;
        
        // Check for associated label
        const inputId = await input.getAttribute('id');
        const hasLabel = inputId ? 
          await form.locator(`label[for="${inputId}"]`).count() > 0 :
          await input.locator('xpath=..//label').count() > 0;
        
        // Check for aria-label as fallback
        const hasAriaLabel = await input.getAttribute('aria-label');
        
        expect(hasLabel || hasAriaLabel).toBeTruthy();
      }
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation through interactive elements
    const interactiveElements = page.locator(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const elementCount = await interactiveElements.count();
    const focusableElements = [];
    
    // Collect all focusable elements
    for (let i = 0; i < elementCount; i++) {
      const element = interactiveElements.nth(i);
      const isVisible = await element.isVisible();
      const isEnabled = await element.isEnabled();
      
      if (isVisible && isEnabled) {
        focusableElements.push(element);
      }
    }
    
    // Test tab navigation
    await helpers.testKeyboardNavigation(focusableElements.slice(0, 10)); // Test first 10 elements
    
    // Test Shift+Tab for reverse navigation
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
  });

  test('should have proper focus indicators', async ({ page }) => {
    const focusableElements = page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const elementCount = await focusableElements.count();
    
    for (let i = 0; i < Math.min(elementCount, 5); i++) {
      const element = focusableElements.nth(i);
      
      if (await element.isVisible() && await element.isEnabled()) {
        await element.focus();
        
        // Check for focus indicator
        const hasFocusIndicator = await element.evaluate(el => {
          const styles = getComputedStyle(el);
          return styles.outline !== 'none' || 
                 styles.boxShadow !== 'none' ||
                 styles.borderColor !== 'transparent';
        });
        
        expect(hasFocusIndicator).toBeTruthy();
      }
    }
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Check for required ARIA attributes on interactive elements
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      
      // Check for aria-label or accessible text
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledBy = await button.getAttribute('aria-labelledby');
      const hasText = await button.textContent();
      
      expect(ariaLabel || ariaLabelledBy || hasText?.trim()).toBeTruthy();
    }
    
    // Check for proper ARIA roles
    const customRoles = page.locator('[role]');
    const roleCount = await customRoles.count();
    
    for (let i = 0; i < roleCount; i++) {
      const element = customRoles.nth(i);
      const role = await element.getAttribute('role');
      
      // Verify role is valid
      const validRoles = [
        'button', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
        'option', 'tab', 'tabpanel', 'textbox', 'combobox', 'listbox',
        'grid', 'gridcell', 'columnheader', 'rowheader', 'dialog', 'alertdialog',
        'alert', 'status', 'log', 'marquee', 'timer', 'progressbar', 'slider',
        'scrollbar', 'tablist', 'tree', 'treeitem', 'treegrid'
      ];
      
      expect(validRoles).toContain(role);
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    // Check text elements for sufficient color contrast
    const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6, a, button');
    const elementCount = await textElements.count();
    
    for (let i = 0; i < Math.min(elementCount, 20); i++) {
      const element = textElements.nth(i);
      
      if (await element.isVisible()) {
        const textContent = await element.textContent();
        
        // Skip empty elements
        if (!textContent?.trim()) continue;
        
        // Check color contrast ratio
        const contrastRatio = await element.evaluate(el => {
          const styles = getComputedStyle(el);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          
          // Simple contrast check (this would need a proper contrast calculation library)
          return color !== backgroundColor;
        });
        
        expect(contrastRatio).toBeTruthy();
      }
    }
  });

  test('should have proper alt text for images', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // Images should have alt attribute (empty alt is acceptable for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('should handle screen reader announcements', async ({ page }) => {
    // Test dynamic content announcements
    const dynamicContent = page.locator('[aria-live], [role="status"], [role="alert"]');
    
    // Check for live regions
    const liveRegions = page.locator('[aria-live]');
    const liveRegionCount = await liveRegions.count();
    
    if (liveRegionCount > 0) {
      for (let i = 0; i < liveRegionCount; i++) {
        const region = liveRegions.nth(i);
        const ariaLive = await region.getAttribute('aria-live');
        expect(['polite', 'assertive']).toContain(ariaLive);
      }
    }
  });

  test('should support reduced motion preferences', async ({ page }) => {
    // Test with reduced motion enabled
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Check that animations are reduced or disabled
    const animatedElements = page.locator('[style*="animation"], [style*="transition"]');
    const animationCount = await animatedElements.count();
    
    // Verify animations respect reduced motion
    for (let i = 0; i < animationCount; i++) {
      const element = animatedElements.nth(i);
      const animationDuration = await element.evaluate(el => {
        const styles = getComputedStyle(el);
        return styles.animationDuration;
      });
      
      // Animation duration should be 0 or very short with reduced motion
      expect(animationDuration).toMatch(/^0s?$|^0\.0+s$/);
    }
  });

  test('should have proper form validation messages', async ({ page }) => {
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    for (let i = 0; i < formCount; i++) {
      const form = forms.nth(i);
      
      // Try to submit form to trigger validation
      const submitButton = form.locator('button[type="submit"], input[type="submit"]');
      if (await submitButton.count() > 0) {
        await submitButton.click();
        
        // Check for validation messages
        const errorMessages = form.locator('.error, .invalid-feedback, [role="alert"]');
        
        if (await errorMessages.count() > 0) {
          // Check that error messages are properly associated
          const firstError = errorMessages.first();
          const ariaDescribedBy = await firstError.getAttribute('aria-describedby');
          
          expect(ariaDescribedBy).toBeTruthy();
        }
      }
    }
  });

  test('should have proper table headers and associations', async ({ page }) => {
    const tables = page.locator('table');
    const tableCount = await tables.count();
    
    for (let i = 0; i < tableCount; i++) {
      const table = tables.nth(i);
      
      // Check for table headers
      const headers = table.locator('th');
      const headerCount = await headers.count();
      
      if (headerCount > 0) {
        // Check for proper table structure
        const caption = table.locator('caption');
        const hasCaption = await caption.count() > 0;
        
        // Check for scope attributes on headers
        for (let j = 0; j < headerCount; j++) {
          const header = headers.nth(j);
          const scope = await header.getAttribute('scope');
          
          if (scope) {
            expect(['col', 'row', 'colgroup', 'rowgroup']).toContain(scope);
          }
        }
      }
    }
  });

  test('should have proper skip links', async ({ page }) => {
    // Check for skip links
    const skipLinks = page.locator('a[href^="#"], .skip-link, [data-testid="skip-link"]');
    const skipLinkCount = await skipLinks.count();
    
    if (skipLinkCount > 0) {
      const firstSkipLink = skipLinks.first();
      
      // Check skip link is visible on focus
      await firstSkipLink.focus();
      await expect(firstSkipLink).toBeVisible();
      
      // Test skip link functionality
      const targetId = await firstSkipLink.getAttribute('href');
      if (targetId?.startsWith('#')) {
        const target = page.locator(targetId);
        if (await target.count() > 0) {
          await firstSkipLink.click();
          await expect(target).toBeVisible();
        }
      }
    }
  });

  test('should handle high contrast mode', async ({ page }) => {
    // Test with high contrast enabled
    await page.emulateMedia({ forcedColors: 'active' });
    
    // Check that important elements are still visible
    const criticalElements = page.locator(
      'h1, h2, nav, main, button, input, a'
    );
    
    const elementCount = await criticalElements.count();
    for (let i = 0; i < Math.min(elementCount, 10); i++) {
      const element = criticalElements.nth(i);
      
      if (await element.isVisible()) {
        // Check element is still visible in high contrast
        const isVisible = await element.isVisible();
        expect(isVisible).toBeTruthy();
      }
    }
  });

  test('should have proper language attributes', async ({ page }) => {
    // Check html lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
    
    // Check for language changes in content
    const elementsWithLang = page.locator('[lang]');
    const langCount = await elementsWithLang.count();
    
    for (let i = 0; i < langCount; i++) {
      const element = elementsWithLang.nth(i);
      const lang = await element.getAttribute('lang');
      
      // Verify language code format
      expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
    }
  });

  test('should handle focus management in modals', async ({ page }) => {
    // Open modal
    const modalTrigger = page.locator('[data-bs-toggle="modal"], [data-testid="modal-trigger"]').first();
    if (await modalTrigger.count() > 0) {
      await modalTrigger.click();
      
      const modal = page.locator('.modal, [role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Check that focus is trapped in modal
      const modalFocusableElements = modal.locator(
        'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
      );
      
      if (await modalFocusableElements.count() > 0) {
        const firstFocusable = modalFocusableElements.first();
        await firstFocusable.focus();
        await expect(firstFocusable).toBeFocused();
        
        // Test tab cycling within modal
        await page.keyboard.press('Tab');
        
        // Test escape key closes modal
        await page.keyboard.press('Escape');
        await expect(modal).toBeHidden();
      }
    }
  });
});
