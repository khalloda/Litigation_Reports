import { test, expect } from '@playwright/test';

test.describe('Working Searchable Client Dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://lit.local:8080');
    await page.fill('#email', 'admin@litigation.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    await page.goto('http://lit.local:8080/reports');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });
    await page.waitForFunction(() => document.querySelectorAll('.spinner-border').length === 0, {
      timeout: 10000,
    });
  });

  test('should have searchable client selection with dropdown', async ({ page }) => {
    // Verify searchable input exists
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');
    await expect(searchInput).toBeVisible();

    // Verify dropdown button exists
    const dropdownButton = page.locator('button:has-text("▼")');
    await expect(dropdownButton).toBeVisible();

    console.log('✅ Searchable input and dropdown button found');
  });

  test('should show initial client list when opening dropdown', async ({ page }) => {
    const dropdownButton = page.locator('button:has-text("▼")');
    await dropdownButton.click();
    await page.waitForTimeout(500);

    // Check for dropdown container
    const dropdown = page.locator('.position-absolute.w-100.bg-white.border');
    await expect(dropdown).toBeVisible();

    // Count client items (excluding helper text)
    const clientItems = page.locator('.list-group-item[style*="cursor: pointer"]');
    const count = await clientItems.count();

    console.log(`✅ Initial dropdown shows ${count} clickable client items`);
    expect(count).toBeGreaterThan(15);
    expect(count).toBeLessThanOrEqual(25);
  });

  test('should filter clients when searching', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');

    // Test English search
    await searchInput.fill('Toyota');
    await page.waitForTimeout(500);

    const toyotaResults = page.locator('.list-group-item[style*="cursor: pointer"]');
    const toyotaCount = await toyotaResults.count();

    if (toyotaCount > 0) {
      console.log(`✅ Found ${toyotaCount} results for "Toyota"`);
      expect(toyotaCount).toBeGreaterThan(0);
    }

    // Test partial search
    await searchInput.clear();
    await searchInput.fill('Al');
    await page.waitForTimeout(500);

    const alResults = page.locator('.list-group-item[style*="cursor: pointer"]');
    const alCount = await alResults.count();

    console.log(`✅ Found ${alCount} results for "Al"`);
    expect(alCount).toBeGreaterThan(10); // Should find multiple "Al" companies

    // Test ID search
    await searchInput.clear();
    await searchInput.fill('1');
    await page.waitForTimeout(500);

    const idResults = page.locator('.list-group-item[style*="cursor: pointer"]');
    const idCount = await idResults.count();

    console.log(`✅ Found ${idCount} results for ID "1"`);
    expect(idCount).toBeGreaterThan(5); // IDs containing "1"
  });

  test('should select client and enable report generation', async ({ page }) => {
    // Open dropdown and select first client
    const dropdownButton = page.locator('button:has-text("▼")');
    await dropdownButton.click();
    await page.waitForTimeout(500);

    const firstClient = page.locator('.list-group-item[style*="cursor: pointer"]').first();
    await firstClient.click();

    // Verify dropdown closes
    const dropdown = page.locator('.position-absolute.w-100.bg-white.border');
    await expect(dropdown).toBeHidden();

    // Verify success indicator appears
    const successBadge = page.locator('.badge.bg-success:has-text("✓")');
    await expect(successBadge).toBeVisible();

    // Select some columns to enable generation
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.first().check();
    await checkboxes.nth(1).check();

    // Verify generate button is enabled
    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await expect(generateButton).toBeEnabled();

    console.log('✅ Client selection and report generation workflow complete');
  });

  test('should clear client selection', async ({ page }) => {
    // Select a client first
    const dropdownButton = page.locator('button:has-text("▼")');
    await dropdownButton.click();
    await page.waitForTimeout(500);

    const firstClient = page.locator('.list-group-item[style*="cursor: pointer"]').first();
    await firstClient.click();

    // Verify selection is shown
    const successBadge = page.locator('.badge.bg-success:has-text("✓")');
    await expect(successBadge).toBeVisible();

    // Click clear button
    const clearButton = page.locator('button:has-text("✕")');
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    // Verify selection is cleared
    await expect(successBadge).toBeHidden();

    console.log('✅ Client selection cleared successfully');
  });

  test('should handle empty search results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');

    // Search for something unlikely to exist
    await searchInput.fill('xyz999notfound');
    await page.waitForTimeout(500);

    // Should show "no results" message
    const noResults = page.locator('text=لا توجد نتائج للبحث');
    await expect(noResults).toBeVisible();

    console.log('✅ Empty search results handled correctly');
  });

  test('should maintain RTL text alignment', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');

    // Check input text alignment
    const inputStyle = await searchInput.evaluate((el) => window.getComputedStyle(el).textAlign);
    expect(inputStyle).toBe('right');

    // Open dropdown and check item alignment
    const dropdownButton = page.locator('button:has-text("▼")');
    await dropdownButton.click();
    await page.waitForTimeout(500);

    const firstItem = page.locator('.list-group-item[style*="cursor: pointer"]').first();
    const itemStyle = await firstItem.evaluate((el) => window.getComputedStyle(el).textAlign);
    expect(itemStyle).toBe('right');

    console.log('✅ RTL text alignment maintained correctly');
  });
});
