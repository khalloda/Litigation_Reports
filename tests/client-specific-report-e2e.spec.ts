import { test, expect } from '@playwright/test';

test.describe('Client-Specific Report End-to-End Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate and login with correct credentials
    await page.goto('http://lit.local:8080');
    await page.fill('#email', 'admin@litigation.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Navigate to reports page
    await page.goto('http://lit.local:8080/reports');
    await page.waitForTimeout(1000);
  });

  test('should complete full client-specific report workflow with searchable dropdown', async ({
    page,
  }) => {
    console.log('🎯 Starting complete client-specific report workflow test');

    // Step 1: Open client-specific report modal
    console.log('📋 Step 1: Opening client-specific report modal');
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });

    // Wait for data loading
    await page.waitForFunction(
      () => {
        const spinners = document.querySelectorAll('.spinner-border');
        return spinners.length === 0;
      },
      { timeout: 10000 }
    );

    console.log('✅ Modal opened and data loaded');

    // Step 2: Test searchable dropdown functionality
    console.log('📋 Step 2: Testing searchable dropdown');

    // Verify search input exists
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');
    await expect(searchInput).toBeVisible();

    // Open dropdown to see initial 20 clients
    const dropdownButton = page.locator('button:has-text("▼")');
    await dropdownButton.click();
    await page.waitForTimeout(500);

    const initialItems = page.locator('.list-group-item[style*="cursor: pointer"]');
    const initialCount = await initialItems.count();
    console.log(`✅ Initial dropdown shows ${initialCount} clients`);
    expect(initialCount).toBeGreaterThan(15);
    expect(initialCount).toBeLessThanOrEqual(25);

    // Step 3: Test search functionality
    console.log('📋 Step 3: Testing search functionality');

    // Search for clients with "Al" (common in Arabic names)
    await searchInput.fill('Al');
    await page.waitForTimeout(500);

    const searchResults = page.locator('.list-group-item[style*="cursor: pointer"]');
    const searchCount = await searchResults.count();
    console.log(`✅ Search for "Al" returned ${searchCount} results`);
    expect(searchCount).toBeGreaterThan(5);

    // Step 4: Select a client
    console.log('📋 Step 4: Selecting a client');

    const firstResult = searchResults.first();
    const clientText = await firstResult.textContent();
    await firstResult.click();

    // Verify dropdown closes and selection is confirmed
    const dropdown = page.locator('.position-absolute.w-100.bg-white.border');
    await expect(dropdown).toBeHidden();

    const successBadge = page.locator('.badge.bg-success:has-text("✓")');
    await expect(successBadge).toBeVisible();

    console.log(`✅ Client selected: ${clientText?.substring(0, 50)}...`);

    // Step 5: Configure report options
    console.log('📋 Step 5: Configuring report options');

    // Select report type (cases is default)
    const reportTypeSelect = page.locator('select');
    await expect(reportTypeSelect).toBeVisible();

    // Select some columns
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    console.log(`✅ Found ${checkboxCount} column options`);

    // Select first 3 checkboxes
    for (let i = 0; i < Math.min(3, checkboxCount); i++) {
      await checkboxes.nth(i).check();
    }

    console.log('✅ Selected report columns');

    // Step 6: Verify generate button is enabled
    console.log('📋 Step 6: Verifying generate button');

    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await expect(generateButton).toBeEnabled();

    console.log('✅ Generate button is enabled');

    // Step 7: Test report generation (without actually downloading)
    console.log('📋 Step 7: Testing report generation workflow');

    // Click generate button and verify loading state
    await generateButton.click();

    // Check for loading state
    const loadingSpinner = page.locator('.spinner-border');
    if ((await loadingSpinner.count()) > 0) {
      console.log('✅ Loading state detected');

      // Wait for completion (modal should close on success)
      await page.waitForFunction(
        () => {
          const modals = document.querySelectorAll('.modal.show');
          return modals.length === 0;
        },
        { timeout: 30000 }
      );

      console.log('✅ Report generation completed - modal closed');
    } else {
      console.log('⚠️ No loading spinner detected - report may have generated instantly');
    }

    console.log('🎉 Complete client-specific report workflow test PASSED');
  });

  test('should handle client search edge cases', async ({ page }) => {
    console.log('🎯 Testing client search edge cases');

    // Open modal
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });
    await page.waitForFunction(() => document.querySelectorAll('.spinner-border').length === 0, {
      timeout: 10000,
    });

    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');

    // Test 1: Search by ID
    console.log('📋 Testing ID search');
    await searchInput.fill('1');
    await page.waitForTimeout(500);

    const idResults = page.locator('.list-group-item[style*="cursor: pointer"]');
    const idCount = await idResults.count();
    console.log(`✅ ID search "1" found ${idCount} results`);
    expect(idCount).toBeGreaterThan(3);

    // Test 2: No results case
    console.log('📋 Testing no results case');
    await searchInput.clear();
    await searchInput.fill('xyz999notfound');
    await page.waitForTimeout(500);

    const noResults = page.locator('text=لا توجد نتائج للبحث');
    await expect(noResults).toBeVisible();
    console.log('✅ No results message displayed correctly');

    // Test 3: Clear search
    console.log('📋 Testing search clear');
    await searchInput.clear();
    await page.waitForTimeout(500);

    const dropdownButton = page.locator('button:has-text("▼")');
    await dropdownButton.click();
    await page.waitForTimeout(500);

    const clearedResults = page.locator('.list-group-item[style*="cursor: pointer"]');
    const clearedCount = await clearedResults.count();
    console.log(`✅ After clearing search: ${clearedCount} results shown`);
    expect(clearedCount).toBeGreaterThan(15);

    console.log('🎉 Client search edge cases test PASSED');
  });

  test('should maintain proper RTL text alignment', async ({ page }) => {
    console.log('🎯 Testing RTL text alignment');

    // Open modal
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });
    await page.waitForFunction(() => document.querySelectorAll('.spinner-border').length === 0, {
      timeout: 10000,
    });

    // Check search input alignment
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');
    const inputAlign = await searchInput.evaluate((el) => window.getComputedStyle(el).textAlign);
    console.log(`✅ Search input text alignment: ${inputAlign}`);
    expect(inputAlign).toBe('right');

    // Open dropdown and check item alignment
    const dropdownButton = page.locator('button:has-text("▼")');
    await dropdownButton.click();
    await page.waitForTimeout(500);

    const firstItem = page.locator('.list-group-item[style*="cursor: pointer"]').first();
    const itemAlign = await firstItem.evaluate((el) => window.getComputedStyle(el).textAlign);
    console.log(`✅ Dropdown item text alignment: ${itemAlign}`);
    expect(itemAlign).toBe('right');

    console.log('🎉 RTL text alignment test PASSED');
  });
});
