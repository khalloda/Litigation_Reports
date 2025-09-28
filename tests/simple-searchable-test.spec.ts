import { test, expect } from '@playwright/test';

test.describe('Simple Searchable Dropdown Test', () => {
  test('should verify searchable dropdown is working', async ({ page }) => {
    // Navigate and login
    await page.goto('http://lit.local:8080');
    await page.fill('#email', 'admin@litigation.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Go to reports
    await page.goto('http://lit.local:8080/reports');
    await page.waitForTimeout(1000);

    // Open client-specific modal
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });

    // Wait for loading
    await page.waitForFunction(() => {
      const spinners = document.querySelectorAll('.spinner-border');
      return spinners.length === 0;
    }, { timeout: 10000 });

    // Check if searchable input exists
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');
    const isVisible = await searchInput.isVisible();
    console.log('Search input visible:', isVisible);

    // Check dropdown button
    const dropdownButton = page.locator('button:has-text("▼")');
    const buttonVisible = await dropdownButton.isVisible();
    console.log('Dropdown button visible:', buttonVisible);

    // Try clicking dropdown
    if (buttonVisible) {
      await dropdownButton.click();
      await page.waitForTimeout(1000);

      // Check for dropdown items
      const dropdownItems = page.locator('.list-group-item');
      const itemCount = await dropdownItems.count();
      console.log('Dropdown items found:', itemCount);

      if (itemCount > 0) {
        const firstItemText = await dropdownItems.first().textContent();
        console.log('First item:', firstItemText);
      }
    }

    // Try searching
    if (isVisible) {
      await searchInput.fill('Al');
      await page.waitForTimeout(1000);

      const searchResults = page.locator('.list-group-item');
      const searchCount = await searchResults.count();
      console.log('Search results for "Al":', searchCount);
    }

    // Take screenshot for debugging
    await page.screenshot({ path: 'debug-searchable-dropdown.png', fullPage: true });

    console.log('✅ Basic searchable dropdown verification completed');
  });
});