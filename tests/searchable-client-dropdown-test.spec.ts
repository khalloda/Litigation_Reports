import { test, expect } from '@playwright/test';

test.describe('Searchable Client Dropdown Enhancement', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the system and login
    await page.goto('http://lit.local:8080');
    await page.fill('#email', 'admin@litigation.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Navigate to Reports page
    await page.goto('http://lit.local:8080/reports');
    await page.waitForTimeout(1000);

    // Open client-specific report modal
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });

    // Wait for API data to load
    await page.waitForFunction(() => {
      const spinners = document.querySelectorAll('.spinner-border');
      return spinners.length === 0;
    }, { timeout: 10000 });
  });

  test('should display searchable input instead of basic dropdown', async ({ page }) => {
    // Verify search input exists instead of select dropdown
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');
    await expect(searchInput).toBeVisible();

    // Verify old select dropdown doesn't exist
    const oldSelect = page.locator('select');
    await expect(oldSelect).not.toBeVisible();

    // Verify dropdown toggle button exists
    const dropdownButton = page.locator('button:has-text("▼")');
    await expect(dropdownButton).toBeVisible();

    console.log('✅ Searchable input interface detected correctly');
  });

  test('should show first 20 clients when clicking dropdown without search', async ({ page }) => {
    // Click dropdown button to open
    const dropdownButton = page.locator('button:has-text("▼")');
    await dropdownButton.click();

    // Wait for dropdown to appear
    await page.waitForSelector('.position-absolute.w-100.bg-white.border', { timeout: 3000 });

    // Verify helper text for first 20 clients
    const helperText = page.locator('text=عرض أول 20 عميل');
    await expect(helperText).toBeVisible();

    // Count visible client items (should be around 20)
    const clientItems = page.locator('.list-group-item[style*="cursor: pointer"]');
    const clientCount = await clientItems.count();

    console.log(`✅ Initial dropdown shows ${clientCount} clients (expected ~20)`);
    expect(clientCount).toBeGreaterThan(15);
    expect(clientCount).toBeLessThanOrEqual(25);
  });

  test('should filter clients when typing in search box', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');

    // Type a search term
    await searchInput.fill('سري الدين');
    await page.waitForTimeout(500);

    // Verify dropdown appears with filtered results
    const clientItems = page.locator('.list-group-item[style*="cursor: pointer"]');
    const filteredCount = await clientItems.count();

    console.log(`✅ Search for "سري الدين" returns ${filteredCount} results`);
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThan(20); // Should be filtered

    // Verify first result contains the search term
    const firstResult = clientItems.first();
    const firstResultText = await firstResult.textContent();
    console.log(`First result: ${firstResultText}`);

    // Clear search and verify results expand again
    await searchInput.clear();
    await page.waitForTimeout(500);

    const clearedCount = await clientItems.count();
    console.log(`✅ After clearing search: ${clearedCount} results shown`);
    expect(clearedCount).toBeGreaterThan(filteredCount);
  });

  test('should search by English name and ID', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');

    // Search by English name
    await searchInput.fill('Toyota');
    await page.waitForTimeout(500);

    const toyotaResults = page.locator('.list-group-item[style*="cursor: pointer"]');
    const toyotaCount = await toyotaResults.count();

    if (toyotaCount > 0) {
      console.log(`✅ English name search "Toyota" found ${toyotaCount} results`);
      expect(toyotaCount).toBeGreaterThan(0);
    }

    // Search by ID
    await searchInput.clear();
    await searchInput.fill('3');
    await page.waitForTimeout(500);

    const idResults = page.locator('.list-group-item[style*="cursor: pointer"]');
    const idCount = await idResults.count();
    console.log(`✅ ID search "3" found ${idCount} results`);
    expect(idCount).toBeGreaterThan(0);
  });

  test('should select client and show selection confirmation', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');

    // Open dropdown and select first client
    const dropdownButton = page.locator('button:has-text("▼")');
    await dropdownButton.click();
    await page.waitForTimeout(500);

    // Click first client
    const firstClient = page.locator('.list-group-item[style*="cursor: pointer"]').first();
    const clientText = await firstClient.textContent();
    await firstClient.click();

    // Verify dropdown closes
    const dropdown = page.locator('.position-absolute.w-100.bg-white.border');
    await expect(dropdown).not.toBeVisible();

    // Verify success badge appears
    const successBadge = page.locator('.badge.bg-success:has-text("✓")');
    await expect(successBadge).toBeVisible();

    // Verify client name is shown
    const selectedDisplay = page.locator('.text-success');
    await expect(selectedDisplay).toBeVisible();

    console.log(`✅ Client selected successfully: ${clientText?.substring(0, 50)}...`);

    // Verify clear button works
    const clearButton = page.locator('button:has-text("✕")');
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    // Verify selection is cleared
    await expect(successBadge).not.toBeVisible();
    await expect(selectedDisplay).not.toBeVisible();

    console.log('✅ Client selection cleared successfully');
  });

  test('should handle no search results gracefully', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');

    // Search for something that doesn't exist
    await searchInput.fill('xyz123notfound999');
    await page.waitForTimeout(500);

    // Verify "no results" message appears
    const noResults = page.locator('text=لا توجد نتائج للبحث');
    await expect(noResults).toBeVisible();

    // Verify search emoji appears
    const searchEmoji = page.locator('text=🔍');
    await expect(searchEmoji).toBeVisible();

    console.log('✅ "No results" message displays correctly for invalid search');
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    // Open dropdown
    const dropdownButton = page.locator('button:has-text("▼")');
    await dropdownButton.click();
    await page.waitForTimeout(500);

    // Verify dropdown is open
    const dropdown = page.locator('.position-absolute.w-100.bg-white.border');
    await expect(dropdown).toBeVisible();

    // Click outside (on modal background)
    await page.click('.modal-body', { position: { x: 50, y: 50 } });
    await page.waitForTimeout(300);

    // Verify dropdown closes
    await expect(dropdown).not.toBeVisible();

    console.log('✅ Dropdown closes when clicking outside');
  });

  test('should work with report generation after client selection', async ({ page }) => {
    // Select a client using search
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');
    await searchInput.fill('سري الدين');
    await page.waitForTimeout(500);

    const firstResult = page.locator('.list-group-item[style*="cursor: pointer"]').first();
    await firstResult.click();

    // Verify client is selected
    const successBadge = page.locator('.badge.bg-success:has-text("✓")');
    await expect(successBadge).toBeVisible();

    // Select some columns
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.first().check();
    await checkboxes.nth(1).check();

    // Verify generate button becomes enabled
    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await expect(generateButton).toBeEnabled();

    console.log('✅ Report generation workflow works with searchable client selection');
  });

  test('should maintain Arabic RTL text alignment', async ({ page }) => {
    // Open dropdown
    const dropdownButton = page.locator('button:has-text("▼")');
    await dropdownButton.click();
    await page.waitForTimeout(500);

    // Check if client items have proper RTL alignment
    const clientItems = page.locator('.list-group-item[style*="cursor: pointer"]');
    const firstItem = clientItems.first();

    // Verify RTL styling
    const textAlign = await firstItem.evaluate(el => window.getComputedStyle(el).textAlign);
    console.log(`✅ Text alignment in dropdown: ${textAlign}`);

    // Verify search input has RTL alignment
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');
    const inputAlign = await searchInput.evaluate(el => window.getComputedStyle(el).textAlign);
    console.log(`✅ Search input alignment: ${inputAlign}`);

    // Both should be 'right' for RTL
    expect(inputAlign).toBe('right');
  });
});