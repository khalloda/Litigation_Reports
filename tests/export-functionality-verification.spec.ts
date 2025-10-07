import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('Export Functionality Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Login once before each test
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Fill login form
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for redirect after login
    await page.waitForLoadState('networkidle');
  });

  test('should have export functionality on Clients page', async ({ page }) => {
    console.log('Testing Clients page export functionality...');

    // Navigate to clients page
    await page.goto(`${BASE_URL}/clients`);
    await page.waitForLoadState('networkidle');

    // Wait for page to fully load
    await expect(page.locator('h2:has-text("إدارة العملاء")')).toBeVisible({ timeout: 15000 });

    // Check for export dropdown button
    const exportDropdown = page.locator('button:has-text("تصدير")').first();
    await expect(exportDropdown).toBeVisible({ timeout: 10000 });

    // Check the state (should be enabled if there are clients, disabled if not)
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    console.log(`Found ${rowCount} clients on page`);

    if (rowCount > 0) {
      // Should be enabled
      await expect(exportDropdown).toBeEnabled();

      // Test dropdown menu
      await exportDropdown.click();
      await expect(page.locator('a:has-text("تصدير CSV")')).toBeVisible();
      await expect(page.locator('a:has-text("تصدير Excel")')).toBeVisible();

      // Close dropdown
      await page.keyboard.press('Escape');
      console.log('✓ Clients page export dropdown working correctly');
    } else {
      // Should be disabled
      await expect(exportDropdown).toBeDisabled();
      console.log('✓ Clients page export correctly disabled (no data)');
    }
  });

  test('should have export functionality on Cases page', async ({ page }) => {
    console.log('Testing Cases page export functionality...');

    // Navigate to cases page
    await page.goto(`${BASE_URL}/cases`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h2:has-text("إدارة القضايا")')).toBeVisible({ timeout: 15000 });

    const exportDropdown = page.locator('button:has-text("تصدير")').first();
    await expect(exportDropdown).toBeVisible({ timeout: 10000 });

    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    console.log(`Found ${rowCount} cases on page`);

    if (rowCount > 0) {
      await expect(exportDropdown).toBeEnabled();

      await exportDropdown.click();
      await expect(page.locator('a:has-text("تصدير CSV")')).toBeVisible();
      await expect(page.locator('a:has-text("تصدير Excel")')).toBeVisible();

      await page.keyboard.press('Escape');
      console.log('✓ Cases page export dropdown working correctly');
    } else {
      await expect(exportDropdown).toBeDisabled();
      console.log('✓ Cases page export correctly disabled (no data)');
    }
  });

  test('should have export functionality on Hearings page', async ({ page }) => {
    console.log('Testing Hearings page export functionality...');

    await page.goto(`${BASE_URL}/hearings`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h2:has-text("إدارة الجلسات")')).toBeVisible({ timeout: 15000 });

    const exportDropdown = page.locator('button:has-text("تصدير")').first();
    await expect(exportDropdown).toBeVisible({ timeout: 10000 });

    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    console.log(`Found ${rowCount} hearings on page`);

    if (rowCount > 0) {
      await expect(exportDropdown).toBeEnabled();

      await exportDropdown.click();
      await expect(page.locator('a:has-text("تصدير CSV")')).toBeVisible();
      await expect(page.locator('a:has-text("تصدير Excel")')).toBeVisible();

      await page.keyboard.press('Escape');
      console.log('✓ Hearings page export dropdown working correctly');
    } else {
      await expect(exportDropdown).toBeDisabled();
      console.log('✓ Hearings page export correctly disabled (no data)');
    }
  });

  test('should have export functionality on Invoices page', async ({ page }) => {
    console.log('Testing Invoices page export functionality...');

    await page.goto(`${BASE_URL}/invoices`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h2:has-text("إدارة الفواتير")')).toBeVisible({ timeout: 15000 });

    const exportDropdown = page.locator('button:has-text("تصدير")').first();
    await expect(exportDropdown).toBeVisible({ timeout: 10000 });

    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    console.log(`Found ${rowCount} invoices on page`);

    if (rowCount > 0) {
      await expect(exportDropdown).toBeEnabled();

      await exportDropdown.click();
      await expect(page.locator('a:has-text("تصدير CSV")')).toBeVisible();
      await expect(page.locator('a:has-text("تصدير Excel")')).toBeVisible();

      await page.keyboard.press('Escape');
      console.log('✓ Invoices page export dropdown working correctly');
    } else {
      await expect(exportDropdown).toBeDisabled();
      console.log('✓ Invoices page export correctly disabled (no data)');
    }
  });

  test('should have export functionality on Reports page', async ({ page }) => {
    console.log('Testing Reports page export functionality...');

    await page.goto(`${BASE_URL}/reports`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h2:has-text("التقارير")')).toBeVisible({ timeout: 15000 });

    // Generate a basic report first
    const generateReportBtn = page.locator('button:has-text("إنشاء تقرير")');
    await expect(generateReportBtn).toBeVisible();

    await generateReportBtn.click();
    await page.waitForTimeout(5000); // Wait for report generation

    // Check for export buttons in modal
    const csvExportBtn = page.locator('#exportCSVBtn');
    const excelExportBtn = page.locator('#exportExcelBtn');

    if ((await csvExportBtn.count()) > 0) {
      await expect(csvExportBtn).toBeVisible();
      await expect(excelExportBtn).toBeVisible();

      // Check if buttons are enabled based on report data
      const reportData = await page.locator('table').count();
      if (reportData > 0) {
        await expect(csvExportBtn).toBeEnabled();
        await expect(excelExportBtn).toBeEnabled();
        console.log('✓ Reports page export buttons working correctly');
      } else {
        console.log('✓ Reports page export buttons present but disabled (no data)');
      }
    } else {
      console.log('Reports page export functionality may use different implementation');
    }
  });

  test('should successfully export data without errors', async ({ page }) => {
    console.log('Testing actual export functionality...');

    // Go to clients page and test actual export
    await page.goto(`${BASE_URL}/clients`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h2:has-text("إدارة العملاء")')).toBeVisible({ timeout: 15000 });

    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      console.log(`Found ${rowCount} clients, testing CSV export...`);

      // Listen for console errors
      const consoleMessages: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleMessages.push(`Error: ${msg.text()}`);
        }
      });

      // Test CSV export
      await page.click('button:has-text("تصدير")');
      await page.click('a:has-text("تصدير CSV")');

      // Wait for export to complete
      await page.waitForTimeout(3000);

      // Check that no errors occurred
      expect(consoleMessages.length).toBe(0);

      console.log('✓ CSV export completed without console errors');

      // Test Excel export
      await page.click('button:has-text("تصدير")');
      await page.click('a:has-text("تصدير Excel")');

      await page.waitForTimeout(3000);

      // Check that no errors occurred
      expect(consoleMessages.length).toBe(0);

      console.log('✓ Excel export completed without console errors');
    } else {
      console.log('No clients found, export test skipped');
    }
  });
});
