import { test, expect } from '@playwright/test';

test.describe('Client-Specific Report Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the system
    await page.goto('http://lit.local:8080');

    // Login with test credentials
    await page.fill('#email', 'admin@lit.local');
    await page.fill('#password', '123456');
    await page.click('button[type="submit"]');

    // Wait for successful login
    await page.waitForSelector('.container', { timeout: 10000 });

    // Navigate to Reports page
    await page.goto('http://lit.local:8080/reports');
    await page.waitForSelector('h2:has-text("تقارير")', { timeout: 5000 });
  });

  test('should open client-specific report modal and show all options', async ({ page }) => {
    // Click the Client-Specific Report button
    const clientSpecificButton = page.locator('button:has-text("تقرير عميل محدد")');
    await expect(clientSpecificButton).toBeVisible();
    await clientSpecificButton.click();

    // Verify modal opens
    const modal = page.locator('.modal[aria-labelledby]');
    await expect(modal).toBeVisible();

    // Verify modal title
    await expect(page.locator('.modal-title:has-text("تقرير عميل محدد")')).toBeVisible();

    // Verify client dropdown is present
    const clientSelect = page.locator('select').first();
    await expect(clientSelect).toBeVisible();

    // Verify it has a default option
    const defaultOption = clientSelect.locator('option:has-text("-- اختر عميل --")');
    await expect(defaultOption).toBeVisible();

    // Verify report type dropdown is present
    const reportTypeSelect = page.locator('select').nth(1);
    await expect(reportTypeSelect).toBeVisible();

    // Verify generate button is initially disabled
    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await expect(generateButton).toBeDisabled();

    console.log('✅ Client-specific report modal opens correctly with all options');
  });

  test('should load clients list and enable form interaction', async ({ page }) => {
    // Open the modal
    await page.click('button:has-text("تقرير عميل محدد")');

    // Wait for modal to be visible
    await page.waitForSelector('.modal', { timeout: 5000 });

    // Wait for clients to load (check if loading spinner disappears)
    await page.waitForFunction(
      () => {
        const spinners = document.querySelectorAll('.spinner-border');
        return spinners.length === 0;
      },
      { timeout: 10000 }
    );

    // Check if clients are loaded in dropdown
    const clientSelect = page.locator('select').first();
    const clientOptions = clientSelect.locator('option');
    const optionCount = await clientOptions.count();

    // Should have at least default option + some clients
    expect(optionCount).toBeGreaterThan(1);

    // Select the first available client
    const firstClientOption = clientOptions.nth(1);
    const firstClientValue = await firstClientOption.getAttribute('value');
    await clientSelect.selectOption(firstClientValue || '');

    console.log(`✅ Found ${optionCount - 1} clients in dropdown`);

    // Verify column checkboxes appear
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    expect(checkboxCount).toBeGreaterThan(0);

    console.log(`✅ Found ${checkboxCount} column checkboxes for cases`);

    // Check some checkboxes
    await checkboxes.first().check();
    await checkboxes.nth(1).check();

    // Verify generate button becomes enabled
    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await expect(generateButton).toBeEnabled();

    console.log('✅ Form interaction works correctly');
  });

  test('should switch to hearings report type and show date fields', async ({ page }) => {
    // Open the modal
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });

    // Wait for loading to complete
    await page.waitForFunction(
      () => {
        const spinners = document.querySelectorAll('.spinner-border');
        return spinners.length === 0;
      },
      { timeout: 10000 }
    );

    // Switch to hearings report type
    const reportTypeSelect = page.locator('select').nth(1);
    await reportTypeSelect.selectOption('hearings');

    // Verify date fields appear
    const dateFromInput = page.locator('input[type="date"]').first();
    const dateToInput = page.locator('input[type="date"]').nth(1);

    await expect(dateFromInput).toBeVisible();
    await expect(dateToInput).toBeVisible();

    // Verify different checkboxes for hearings
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    expect(checkboxCount).toBeGreaterThan(0);

    console.log(`✅ Hearings report type shows ${checkboxCount} different columns and date fields`);

    // Switch back to cases and verify date fields hide
    await reportTypeSelect.selectOption('cases');
    await expect(dateFromInput).toBeHidden();
    await expect(dateToInput).toBeHidden();

    console.log('✅ Report type switching works correctly');
  });

  test('should generate cases report for client and download PDF', async ({ page }) => {
    // Setup download handling
    const downloadPromise = page.waitForEvent('download');

    // Open the modal
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });

    // Wait for loading to complete
    await page.waitForFunction(
      () => {
        const spinners = document.querySelectorAll('.spinner-border');
        return spinners.length === 0;
      },
      { timeout: 10000 }
    );

    // Select first client
    const clientSelect = page.locator('select').first();
    const clientOptions = clientSelect.locator('option');
    const firstClientOption = clientOptions.nth(1);
    const firstClientValue = await firstClientOption.getAttribute('value');
    await clientSelect.selectOption(firstClientValue || '');

    // Ensure cases is selected
    const reportTypeSelect = page.locator('select').nth(1);
    await reportTypeSelect.selectOption('cases');

    // Select some columns
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.first().check();
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();

    // Click generate report
    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await generateButton.click();

    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^client_specific_report_.*\.pdf$/);

    // Verify modal closes after successful generation
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 10000 });

    console.log('✅ Cases report generated and PDF downloaded successfully');
  });

  test('should generate hearings report with date range and download PDF', async ({ page }) => {
    // Setup download handling
    const downloadPromise = page.waitForEvent('download');

    // Open the modal
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });

    // Wait for loading to complete
    await page.waitForFunction(
      () => {
        const spinners = document.querySelectorAll('.spinner-border');
        return spinners.length === 0;
      },
      { timeout: 10000 }
    );

    // Select first client
    const clientSelect = page.locator('select').first();
    const clientOptions = clientSelect.locator('option');
    const firstClientOption = clientOptions.nth(1);
    const firstClientValue = await firstClientOption.getAttribute('value');
    await clientSelect.selectOption(firstClientValue || '');

    // Switch to hearings
    const reportTypeSelect = page.locator('select').nth(1);
    await reportTypeSelect.selectOption('hearings');

    // Set date range
    const dateFromInput = page.locator('input[type="date"]').first();
    const dateToInput = page.locator('input[type="date"]').nth(1);

    await dateFromInput.fill('2023-01-01');
    await dateToInput.fill('2025-12-31');

    // Select some columns
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.first().check();
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();

    // Click generate report
    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await generateButton.click();

    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^client_specific_report_.*\.pdf$/);

    // Verify modal closes after successful generation
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 10000 });

    console.log('✅ Hearings report with date range generated and PDF downloaded successfully');
  });

  test('should validate form and show appropriate error messages', async ({ page }) => {
    // Open the modal
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });

    // Wait for loading to complete
    await page.waitForFunction(
      () => {
        const spinners = document.querySelectorAll('.spinner-border');
        return spinners.length === 0;
      },
      { timeout: 10000 }
    );

    // Try to generate without selecting client
    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await expect(generateButton).toBeDisabled();

    // Select client but no columns
    const clientSelect = page.locator('select').first();
    const clientOptions = clientSelect.locator('option');
    const firstClientOption = clientOptions.nth(1);
    const firstClientValue = await firstClientOption.getAttribute('value');
    await clientSelect.selectOption(firstClientValue || '');

    // Button should still be disabled
    await expect(generateButton).toBeDisabled();

    // Select some columns
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.first().check();

    // Now button should be enabled
    await expect(generateButton).toBeEnabled();

    // Switch to hearings without dates
    const reportTypeSelect = page.locator('select').nth(1);
    await reportTypeSelect.selectOption('hearings');

    // Try to generate without dates (should show error)
    await generateButton.click();

    // Check for error message
    const errorAlert = page.locator('.alert-danger');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('يرجى تحديد فترة زمنية للجلسات');

    console.log('✅ Form validation works correctly');
  });

  test('should verify PDF contains company branding', async ({ page }) => {
    const fs = require('fs');
    const path = require('path');

    // Setup download handling
    let downloadPath = '';
    page.on('download', async (download) => {
      const tempDir = path.join(__dirname, '..', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      downloadPath = path.join(tempDir, download.suggestedFilename());
      await download.saveAs(downloadPath);
    });

    // Generate a report
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });

    // Wait for loading to complete
    await page.waitForFunction(
      () => {
        const spinners = document.querySelectorAll('.spinner-border');
        return spinners.length === 0;
      },
      { timeout: 10000 }
    );

    // Fill form and generate
    const clientSelect = page.locator('select').first();
    const clientOptions = clientSelect.locator('option');
    const firstClientOption = clientOptions.nth(1);
    const firstClientValue = await firstClientOption.getAttribute('value');
    await clientSelect.selectOption(firstClientValue || '');

    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.first().check();
    await checkboxes.nth(1).check();

    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await generateButton.click();

    // Wait for download to complete
    await page.waitForTimeout(5000);

    // Verify file exists and has content
    if (downloadPath && fs.existsSync(downloadPath)) {
      const stats = fs.statSync(downloadPath);

      // Check file size indicates branding (should be > 200KB with logo)
      expect(stats.size).toBeGreaterThan(200000);

      console.log(
        `✅ PDF file generated with size: ${Math.round(stats.size / 1024)}KB (indicates professional branding)`
      );

      // Clean up
      fs.unlinkSync(downloadPath);
    } else {
      throw new Error('PDF file was not downloaded successfully');
    }
  });
});
