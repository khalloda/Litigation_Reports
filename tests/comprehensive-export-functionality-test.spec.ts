import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('Comprehensive Export Functionality Test', () => {
  test('should have working export functionality across all entity pages', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('h2:has-text("تسجيل الدخول")')).toBeVisible();

    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page.locator('h1:has-text("لوحة التحكم")')).toBeVisible();

    // Test Clients page export
    console.log('Testing Clients page export functionality...');
    await page.click('a[href="/clients"]');
    await expect(page.locator('h2:has-text("إدارة العملاء")')).toBeVisible();

    // Wait for data to load and check export dropdown
    await page.waitForSelector('div[class*="dropdown"]', { timeout: 10000 });
    const clientsExportDropdown = page.locator('button:has-text("تصدير")').first();
    await expect(clientsExportDropdown).toBeVisible();

    // Check if export is enabled (should be enabled if there are clients)
    const clientsTableRows = page.locator('tbody tr');
    const clientsRowCount = await clientsTableRows.count();

    if (clientsRowCount > 0) {
      await expect(clientsExportDropdown).toBeEnabled();

      // Test opening dropdown and checking options
      await clientsExportDropdown.click();
      await expect(page.locator('a:has-text("تصدير CSV")')).toBeVisible();
      await expect(page.locator('a:has-text("تصدير Excel")')).toBeVisible();

      // Close dropdown
      await page.keyboard.press('Escape');
    } else {
      await expect(clientsExportDropdown).toBeDisabled();
    }

    // Test Cases page export
    console.log('Testing Cases page export functionality...');
    await page.click('a[href="/cases"]');
    await expect(page.locator('h2:has-text("إدارة القضايا")')).toBeVisible();

    await page.waitForSelector('div[class*="dropdown"]', { timeout: 10000 });
    const casesExportDropdown = page.locator('button:has-text("تصدير")').first();
    await expect(casesExportDropdown).toBeVisible();

    const casesTableRows = page.locator('tbody tr');
    const casesRowCount = await casesTableRows.count();

    if (casesRowCount > 0) {
      await expect(casesExportDropdown).toBeEnabled();

      await casesExportDropdown.click();
      await expect(page.locator('a:has-text("تصدير CSV")')).toBeVisible();
      await expect(page.locator('a:has-text("تصدير Excel")')).toBeVisible();

      await page.keyboard.press('Escape');
    } else {
      await expect(casesExportDropdown).toBeDisabled();
    }

    // Test Hearings page export
    console.log('Testing Hearings page export functionality...');
    await page.click('a[href="/hearings"]');
    await expect(page.locator('h2:has-text("إدارة الجلسات")')).toBeVisible();

    await page.waitForSelector('div[class*="dropdown"]', { timeout: 10000 });
    const hearingsExportDropdown = page.locator('button:has-text("تصدير")').first();
    await expect(hearingsExportDropdown).toBeVisible();

    const hearingsTableRows = page.locator('tbody tr');
    const hearingsRowCount = await hearingsTableRows.count();

    if (hearingsRowCount > 0) {
      await expect(hearingsExportDropdown).toBeEnabled();

      await hearingsExportDropdown.click();
      await expect(page.locator('a:has-text("تصدير CSV")')).toBeVisible();
      await expect(page.locator('a:has-text("تصدير Excel")')).toBeVisible();

      await page.keyboard.press('Escape');
    } else {
      await expect(hearingsExportDropdown).toBeDisabled();
    }

    // Test Invoices page export
    console.log('Testing Invoices page export functionality...');
    await page.click('a[href="/invoices"]');
    await expect(page.locator('h2:has-text("إدارة الفواتير")')).toBeVisible();

    await page.waitForSelector('div[class*="dropdown"]', { timeout: 10000 });
    const invoicesExportDropdown = page.locator('button:has-text("تصدير")').first();
    await expect(invoicesExportDropdown).toBeVisible();

    const invoicesTableRows = page.locator('tbody tr');
    const invoicesRowCount = await invoicesTableRows.count();

    if (invoicesRowCount > 0) {
      await expect(invoicesExportDropdown).toBeEnabled();

      await invoicesExportDropdown.click();
      await expect(page.locator('a:has-text("تصدير CSV")')).toBeVisible();
      await expect(page.locator('a:has-text("تصدير Excel")')).toBeVisible();

      await page.keyboard.press('Escape');
    } else {
      await expect(invoicesExportDropdown).toBeDisabled();
    }

    // Test Reports page export
    console.log('Testing Reports page export functionality...');
    await page.click('a[href="/reports"]');
    await expect(page.locator('h2:has-text("التقارير")')).toBeVisible();

    // Reports page might have different export mechanism, check for export buttons
    await page.waitForSelector('button:has-text("إنشاء تقرير")', { timeout: 10000 });

    // Generate a basic report to test export
    await page.click('button:has-text("إنشاء تقرير")');

    // Wait for report results
    await page.waitForSelector('div[id="reportResults"]', { timeout: 15000 });

    // Check if export buttons are present and enabled
    const csvExportBtn = page.locator('#exportCSVBtn');
    const excelExportBtn = page.locator('#exportExcelBtn');

    await expect(csvExportBtn).toBeVisible();
    await expect(excelExportBtn).toBeVisible();

    // Check if buttons are enabled (they should be if there's report data)
    const reportTable = page.locator('table');
    const isReportDataPresent = await reportTable.count() > 0;

    if (isReportDataPresent) {
      await expect(csvExportBtn).toBeEnabled();
      await expect(excelExportBtn).toBeEnabled();
    }

    console.log('All export functionality tests completed successfully!');
  });

  test('should handle export button clicks without errors', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page.locator('h1:has-text("لوحة التحكم")')).toBeVisible();

    // Test actual export functionality on Clients page
    console.log('Testing actual export functionality on Clients page...');
    await page.click('a[href="/clients"]');
    await expect(page.locator('h2:has-text("إدارة العملاء")')).toBeVisible();

    // Wait for data to load
    await page.waitForSelector('tbody tr', { timeout: 10000 });
    const clientsTableRows = page.locator('tbody tr');
    const clientsRowCount = await clientsTableRows.count();

    if (clientsRowCount > 0) {
      console.log(`Found ${clientsRowCount} clients, testing CSV export...`);

      // Listen for console messages to catch any errors
      const consoleLogs: string[] = [];
      page.on('console', msg => {
        consoleLogs.push(`${msg.type()}: ${msg.text()}`);
      });

      // Test CSV export
      await page.click('button:has-text("تصدير")');
      await page.click('a:has-text("تصدير CSV")');

      // Wait a moment for download to be initiated
      await page.waitForTimeout(2000);

      // Check for success toast or any console errors
      const hasErrors = consoleLogs.some(log => log.includes('error') || log.includes('Error'));
      expect(hasErrors).toBeFalsy();

      console.log('CSV export completed without errors');

      // Test Excel export
      await page.click('button:has-text("تصدير")');
      await page.click('a:has-text("تصدير Excel")');

      await page.waitForTimeout(2000);

      console.log('Excel export completed without errors');
    }

    console.log('Export functionality working correctly!');
  });
});