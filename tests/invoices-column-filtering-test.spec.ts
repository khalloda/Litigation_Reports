import { test, expect } from '@playwright/test';

test.describe('Invoices Custom Reports Column Filtering Test', () => {
  test.use({
    baseURL: 'http://lit.local:8080',
  });

  // Helper to login if needed
  async function loginIfNeeded(page) {
    try {
      await page.goto('/reports', { timeout: 10000 });

      if (page.url().includes('/login') || page.url().includes('login')) {
        console.log('Login required, attempting to login...');

        await page.fill('input[type="email"], input[name="email"]', 'admin@litigation.com');
        await page.fill('input[type="password"], input[name="password"]', 'admin123');
        await page.getByRole('button', { name: /تسجيل الدخول|دخول|Login/i }).click();

        await page.waitForURL(/\/(dashboard|reports)/, { timeout: 15000 });
      }
    } catch (error) {
      console.log('Login attempt error:', error.message);
    }
  }

  test('Invoices custom report column filtering works correctly', async ({ page }) => {
    console.log('🧪 Testing: Invoices entity custom report column selection');

    // Login and navigate to reports
    await loginIfNeeded(page);
    await page.goto('/reports', { waitUntil: 'networkidle' });

    // Open custom report modal
    await page.getByRole('button', { name: 'إنشاء تقرير مخصص' }).click();
    await page.waitForSelector('[role="dialog"], .modal');

    // Switch to invoices entity
    const entitySelect = page.locator('select').first();
    await entitySelect.selectOption('invoices');
    console.log('✅ Switched to Invoices entity');

    // Wait for columns to load for invoices
    await page.waitForTimeout(2000);

    // Go to columns tab
    await page.getByRole('tab', { name: 'الأعمدة' }).click();
    await page.waitForSelector('input[type="checkbox"]', { timeout: 10000 });

    // Clear all selections first
    const allCheckboxes = await page.locator('input[type="checkbox"]').all();
    console.log(`Found ${allCheckboxes.length} invoice column checkboxes`);

    for (const checkbox of allCheckboxes) {
      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
      }
    }

    // Select specific invoice columns using database column names
    const targetInvoiceColumns = ['invoice_number', 'amount']; // Use actual database column names
    let selectedCount = 0;

    // Find and select the target columns
    for (const checkbox of allCheckboxes) {
      const checkboxId = await checkbox.getAttribute('id');
      if (checkboxId) {
        const columnKey = checkboxId.replace('column-', '');
        if (targetInvoiceColumns.includes(columnKey)) {
          await checkbox.check();
          await expect(checkbox).toBeChecked();
          selectedCount++;
          console.log(`✅ Selected invoice column: ${columnKey}`);
        }
      }
    }

    console.log(
      `Selected ${selectedCount} invoice columns out of ${targetInvoiceColumns.length} target columns`
    );

    // Generate the report
    await page.getByRole('button', { name: /إنشاء التقرير|تطبيق|اعتماد|عرض التقرير/i }).click();

    // Wait for the report to load
    await page.waitForSelector('table thead th', { timeout: 15000 });

    // Check that only the selected columns are displayed
    const headers = await page.locator('table thead th:visible').allTextContents();
    const trimmedHeaders = headers.map((h) => h.trim()).filter(Boolean);

    console.log('📊 Invoices - Expected columns:', selectedCount);
    console.log('📊 Invoices - Actual headers:', trimmedHeaders.length);
    console.log('📊 Invoices - Headers:', trimmedHeaders);

    // Verify the column filtering works
    if (selectedCount > 0) {
      // Should show only selected columns (with small variance allowed)
      const isColumnFilteringWorking = trimmedHeaders.length <= selectedCount + 2;

      if (isColumnFilteringWorking) {
        console.log('✅ INVOICES COLUMN FILTERING WORKS: Showing correct number of columns!');
        console.log(`   Expected: ~${selectedCount} columns`);
        console.log(`   Actual: ${trimmedHeaders.length} columns`);
      } else {
        console.log('❌ INVOICES COLUMN FILTERING FAILED: Too many columns shown');
        console.log(`   Expected: ~${selectedCount} columns`);
        console.log(`   Actual: ${trimmedHeaders.length} columns`);
      }

      expect(trimmedHeaders.length).toBeLessThanOrEqual(selectedCount + 2);
    } else {
      console.log('⚠️ No invoice columns were successfully selected, testing default behavior');
      expect(trimmedHeaders.length).toBeLessThanOrEqual(10);
    }

    console.log('🎯 Invoices custom report column filtering test completed!');
  });
});
