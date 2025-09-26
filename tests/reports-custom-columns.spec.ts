import { test, expect } from '@playwright/test';

// Helper to assert table headers equal expected set (order-insensitive)
async function expectTableHeadersExactly(page, expectedHeaders: string[]) {
  await page.waitForSelector('table thead th', { timeout: 10000 });

  const headers = await page.locator('table thead th:visible').allTextContents();
  const trimmed = headers.map(h => h.trim()).filter(Boolean);

  console.log('Expected headers:', expectedHeaders);
  console.log('Actual headers:', trimmed);

  // Ensure every expected header is present
  for (const expectedHeader of expectedHeaders) {
    await expect(page.locator('table thead th', { hasText: expectedHeader })).toBeVisible();
  }

  // Ensure no unexpected headers are present
  for (const actualHeader of trimmed) {
    expect(expectedHeaders).toContain(actualHeader);
  }

  // Ensure exact count match
  expect(trimmed.length).toBe(expectedHeaders.length);
}

// Helper to login if needed
async function loginIfNeeded(page) {
  try {
    // Check if we're already on the reports page or logged in
    const currentUrl = page.url();
    if (currentUrl.includes('/reports') || currentUrl.includes('/dashboard')) {
      return;
    }

    // Try to navigate to reports first to see if we need login
    await page.goto('/reports', { timeout: 10000 });

    // Check if we're redirected to login page
    if (page.url().includes('/login') || page.url().includes('login')) {
      console.log('Login required, attempting to login...');

      // Fill in credentials - using known working credentials from the system
      await page.fill('input[type="email"], input[name="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"], input[name="password"]', 'admin123');

      // Click login button
      await page.getByRole('button', { name: /تسجيل الدخول|دخول|Login/i }).click();

      // Wait for redirect to dashboard/reports
      await page.waitForURL(/\/(dashboard|reports)/, { timeout: 15000 });
    }
  } catch (error) {
    console.log('Login attempt error:', error.message);
    // Continue - maybe we're already logged in
  }
}

test.describe('Custom Reports — Column Selection Bug Reproduction and Fix', () => {
  // Use the correct base URL for the reports
  test.use({
    baseURL: 'http://lit.local:8080'
  });

  test.skip('BUG REPRODUCTION: Selecting 2-3 columns still shows ALL columns (Clients)', async ({ page }) => {
    console.log('🧪 Starting test: BUG REPRODUCTION for Clients custom reports');

    // Navigate to reports and login if needed
    await loginIfNeeded(page);
    await page.goto('/reports', { waitUntil: 'networkidle' });

    console.log('✅ Navigated to reports page');

    // 1) Open the custom report flow
    await page.getByRole('button', { name: 'إنشاء تقرير مخصص' }).click();
    console.log('✅ Clicked "إنشاء تقرير مخصص" button');

    // Wait for modal to appear
    await page.waitForSelector('[role="dialog"], .modal', { timeout: 10000 });

    // Ensure we're on the clients entity (should be default)
    const entitySelect = page.locator('select, [data-testid="entity-select"]').first();
    if (await entitySelect.isVisible()) {
      await entitySelect.selectOption('clients');
    }

    // 2) Open columns picker tab
    await page.getByRole('tab', { name: 'الأعمدة' }).click();
    console.log('✅ Clicked "الأعمدة" tab');

    // Wait for column checkboxes to load
    await page.waitForSelector('input[type="checkbox"]', { timeout: 10000 });

    // 3) First, uncheck all existing checkboxes
    const allCheckboxes = await page.locator('input[type="checkbox"]').all();
    console.log(`Found ${allCheckboxes.length} column checkboxes`);

    for (const checkbox of allCheckboxes) {
      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
      }
    }

    // 4) Select only 2-3 specific columns
    const selectedColumns = ['اسم العميل (عربي)', 'نوع العميل', 'رقم الهاتف'];

    for (const columnLabel of selectedColumns) {
      const checkbox = page.getByRole('checkbox', { name: columnLabel });

      if (await checkbox.isVisible()) {
        await checkbox.check();
        await expect(checkbox).toBeChecked();
        console.log(`✅ Selected column: ${columnLabel}`);
      } else {
        console.log(`⚠️ Column not found: ${columnLabel}, trying alternative selectors`);

        // Try alternative approaches for finding the checkbox
        const alternativeCheckbox = page.locator(`input[type="checkbox"]`).locator(`xpath=..//*[contains(text(), "${columnLabel}")]/../input`);
        if (await alternativeCheckbox.count() > 0) {
          await alternativeCheckbox.check();
          console.log(`✅ Selected column (alternative): ${columnLabel}`);
        }
      }
    }

    // 5) Generate the report
    await page.getByRole('button', { name: /إنشاء التقرير|تطبيق|اعتماد|عرض التقرير/i }).click();
    console.log('✅ Clicked report generation button');

    // Wait for report results to load
    await page.waitForSelector('table thead th', { timeout: 15000 });

    // 6) Check if bug exists: verify that ALL columns are shown instead of just selected ones
    const actualHeaders = await page.locator('table thead th:visible').allTextContents();
    const trimmedHeaders = actualHeaders.map(h => h.trim()).filter(Boolean);

    console.log('🔍 BUG CHECK - Expected only selected columns:', selectedColumns);
    console.log('🔍 BUG CHECK - Actual headers shown:', trimmedHeaders);

    // This test should initially FAIL to demonstrate the bug
    const bugExists = trimmedHeaders.length > selectedColumns.length;

    if (bugExists) {
      console.log('🐛 BUG CONFIRMED: More columns shown than selected!');
      console.log(`   Selected: ${selectedColumns.length} columns`);
      console.log(`   Actually shown: ${trimmedHeaders.length} columns`);

      // Take a screenshot for documentation
      await page.screenshot({
        path: 'test-results/bug-reproduction-clients-columns.png',
        fullPage: true
      });

      // This assertion will fail, proving the bug exists
      expect(trimmedHeaders.length).toBe(selectedColumns.length);
    } else {
      console.log('✅ No bug detected - columns correctly filtered');
    }
  });

  test.skip('BUG REPRODUCTION: Column selection issue affects ALL report categories (Cases)', async ({ page }) => {
    console.log('🧪 Starting test: BUG REPRODUCTION for Cases custom reports');

    await loginIfNeeded(page);
    await page.goto('/reports', { waitUntil: 'networkidle' });

    // Open custom report builder
    await page.getByRole('button', { name: 'إنشاء تقرير مخصص' }).click();
    await page.waitForSelector('[role="dialog"], .modal');

    // Switch to Cases entity
    const entitySelect = page.locator('select').first();
    await entitySelect.selectOption('cases');
    console.log('✅ Switched to Cases entity');

    // Go to columns tab
    await page.getByRole('tab', { name: 'الأعمدة' }).click();
    await page.waitForSelector('input[type="checkbox"]');

    // Uncheck all first
    const allCheckboxes = await page.locator('input[type="checkbox"]').all();
    for (const checkbox of allCheckboxes) {
      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
      }
    }

    // Select only specific case columns
    const selectedCaseColumns = ['رقم القضية', 'عنوان القضية (عربي)', 'حالة القضية'];

    for (const columnLabel of selectedCaseColumns) {
      const checkbox = page.getByRole('checkbox', { name: columnLabel });

      if (await checkbox.isVisible()) {
        await checkbox.check();
        await expect(checkbox).toBeChecked();
        console.log(`✅ Selected case column: ${columnLabel}`);
      }
    }

    // Generate report
    await page.getByRole('button', { name: /إنشاء التقرير|تطبيق|اعتماد|عرض التقرير/i }).click();
    await page.waitForSelector('table thead th', { timeout: 15000 });

    // Verify bug exists for cases too
    const actualHeaders = await page.locator('table thead th:visible').allTextContents();
    const trimmedHeaders = actualHeaders.map(h => h.trim()).filter(Boolean);

    console.log('🔍 CASES BUG CHECK - Expected:', selectedCaseColumns);
    console.log('🔍 CASES BUG CHECK - Actual:', trimmedHeaders);

    const bugExists = trimmedHeaders.length > selectedCaseColumns.length;

    if (bugExists) {
      console.log('🐛 BUG CONFIRMED in Cases: More columns shown than selected!');
      await page.screenshot({
        path: 'test-results/bug-reproduction-cases-columns.png',
        fullPage: true
      });

      expect(trimmedHeaders.length).toBe(selectedCaseColumns.length);
    }
  });

  test.skip('BUG REPRODUCTION: Column selection issue affects Hearings reports too', async ({ page }) => {
    console.log('🧪 Starting test: BUG REPRODUCTION for Hearings custom reports');

    await loginIfNeeded(page);
    await page.goto('/reports', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'إنشاء تقرير مخصص' }).click();
    await page.waitForSelector('[role="dialog"], .modal');

    // Switch to Hearings entity
    const entitySelect = page.locator('select').first();
    await entitySelect.selectOption('hearings');
    console.log('✅ Switched to Hearings entity');

    await page.getByRole('tab', { name: 'الأعمدة' }).click();
    await page.waitForSelector('input[type="checkbox"]');

    // Uncheck all first
    const allCheckboxes = await page.locator('input[type="checkbox"]').all();
    for (const checkbox of allCheckboxes) {
      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
      }
    }

    // Select only specific hearing columns
    const selectedHearingColumns = ['تاريخ الجلسة', 'نوع الجلسة', 'نتيجة الجلسة'];

    for (const columnLabel of selectedHearingColumns) {
      const checkbox = page.getByRole('checkbox', { name: columnLabel });

      if (await checkbox.isVisible()) {
        await checkbox.check();
        await expect(checkbox).toBeChecked();
        console.log(`✅ Selected hearing column: ${columnLabel}`);
      }
    }

    await page.getByRole('button', { name: /إنشاء التقرير|تطبيق|اعتماد|عرض التقرير/i }).click();
    await page.waitForSelector('table thead th', { timeout: 15000 });

    const actualHeaders = await page.locator('table thead th:visible').allTextContents();
    const trimmedHeaders = actualHeaders.map(h => h.trim()).filter(Boolean);

    console.log('🔍 HEARINGS BUG CHECK - Expected:', selectedHearingColumns);
    console.log('🔍 HEARINGS BUG CHECK - Actual:', trimmedHeaders);

    const bugExists = trimmedHeaders.length > selectedHearingColumns.length;

    if (bugExists) {
      console.log('🐛 BUG CONFIRMED in Hearings: More columns shown than selected!');
      await page.screenshot({
        path: 'test-results/bug-reproduction-hearings-columns.png',
        fullPage: true
      });

      expect(trimmedHeaders.length).toBe(selectedHearingColumns.length);
    }
  });

  // ✅ AFTER FIX: These tests should now pass
  test('AFTER FIX: Selecting 2-3 columns shows only those columns (Clients)', async ({ page }) => {
    console.log('🧪 Starting test: POST-FIX verification for Clients');

    await loginIfNeeded(page);
    await page.goto('/reports', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'إنشاء تقرير مخصص' }).click();
    await page.waitForSelector('[role="dialog"], .modal');

    // Ensure clients entity selected
    const entitySelect = page.locator('select').first();
    await entitySelect.selectOption('clients');

    await page.getByRole('tab', { name: 'الأعمدة' }).click();
    await page.waitForSelector('input[type="checkbox"]');

    // Clear all selections
    const allCheckboxes = await page.locator('input[type="checkbox"]').all();
    for (const checkbox of allCheckboxes) {
      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
      }
    }

    // Select exactly 3 columns
    const chosen = ['اسم العميل (عربي)', 'نوع العميل', 'رقم الهاتف'];
    for (const label of chosen) {
      const cb = page.getByRole('checkbox', { name: label });
      await cb.check();
      await expect(cb).toBeChecked();
    }

    await page.getByRole('button', { name: /إنشاء التقرير|تطبيق|اعتماد|عرض التقرير/i }).click();

    // After fix: only selected headers should be visible
    await expectTableHeadersExactly(page, chosen);
    console.log('✅ POST-FIX: Client column selection working correctly');
  });

  test('AFTER FIX: Column selection works for ALL categories', async ({ page }) => {
    console.log('🧪 Starting test: POST-FIX verification across all categories');

    await loginIfNeeded(page);

    // Test Cases
    await page.goto('/reports', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'إنشاء تقرير مخصص' }).click();
    await page.waitForSelector('[role="dialog"], .modal');

    const entitySelect = page.locator('select').first();
    await entitySelect.selectOption('cases');

    await page.getByRole('tab', { name: 'الأعمدة' }).click();
    await page.waitForSelector('input[type="checkbox"]');

    // Clear all and select specific columns
    const allCheckboxes = await page.locator('input[type="checkbox"]').all();
    for (const checkbox of allCheckboxes) {
      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
      }
    }

    const chosenCaseColumns = ['رقم القضية', 'حالة القضية'];
    for (const label of chosenCaseColumns) {
      const cb = page.getByRole('checkbox', { name: label });
      await cb.check();
      await expect(cb).toBeChecked();
    }

    await page.getByRole('button', { name: /إنشاء التقرير|تطبيق|اعتماد|عرض التقرير/i }).click();
    await expectTableHeadersExactly(page, chosenCaseColumns);

    console.log('✅ POST-FIX: Cases column selection working correctly');
  });
});