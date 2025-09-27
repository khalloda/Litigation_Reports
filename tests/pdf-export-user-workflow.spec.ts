import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('PDF Export User Workflow', () => {
  test('End-to-End PDF Export from Clients Page', async ({ page }) => {
    console.log('🧪 Testing complete user workflow for PDF export...');

    // Navigate to application
    await page.goto(BASE_URL);

    // Login
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for successful login and navigation
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Navigate to Clients page
    await page.click('a[href="/clients"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Look for export dropdown button
    const exportDropdown = page.locator('button').filter({ hasText: 'تصدير' });
    await expect(exportDropdown).toBeVisible({ timeout: 10000 });

    console.log('✅ Found export dropdown on Clients page');

    // Click the dropdown to open it
    await exportDropdown.click();
    await page.waitForTimeout(500);

    // Set up download promise before clicking PDF option
    const downloadPromise = page.waitForDownload({ timeout: 30000 });

    // Click PDF export option in dropdown
    const pdfOption = page.locator('a.dropdown-item').filter({ hasText: 'تصدير PDF' });
    await expect(pdfOption).toBeVisible({ timeout: 5000 });
    await pdfOption.click();

    // Wait for download
    const download = await downloadPromise;

    // Verify download
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);

    // Save and verify the file
    const downloadPath = `./temp/test-client-export-${Date.now()}.pdf`;
    await download.saveAs(downloadPath);

    console.log(`✅ PDF download completed: ${download.suggestedFilename()}`);
    console.log(`✅ File saved to: ${downloadPath}`);

    // Verify file exists and has content
    const fs = require('fs');
    const stats = fs.statSync(downloadPath);
    expect(stats.size).toBeGreaterThan(5000); // Should be substantial PDF

    // Verify it's a real PDF file
    const buffer = fs.readFileSync(downloadPath);
    const pdfHeader = buffer.slice(0, 5).toString('ascii');
    expect(pdfHeader).toBe('%PDF-');

    console.log(`✅ Verified real PDF file: ${stats.size} bytes`);

    // Clean up
    fs.unlinkSync(downloadPath);

    console.log('✅ Complete user workflow test passed');
  });

  test('PDF Export Button Availability Check', async ({ page }) => {
    console.log('🧪 Checking PDF export button availability...');

    await page.goto(BASE_URL);

    // Login
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check Clients page
    await page.click('a[href="/clients"]');
    await page.waitForLoadState('networkidle');

    const clientsExportDropdown = await page.locator('button').filter({ hasText: 'تصدير' }).count();
    console.log(`📊 Clients page: ${clientsExportDropdown} export dropdown found`);

    // Check Reports page
    await page.click('a[href="/reports"]');
    await page.waitForLoadState('networkidle');

    const reportsExportDropdown = await page.locator('button').filter({ hasText: 'تصدير' }).count();
    console.log(`📊 Reports page: ${reportsExportDropdown} export dropdown found`);

    // Check Cases page
    await page.click('a[href="/cases"]');
    await page.waitForLoadState('networkidle');

    const casesExportDropdown = await page.locator('button').filter({ hasText: 'تصدير' }).count();
    console.log(`📊 Cases page: ${casesExportDropdown} export dropdown found`);

    expect(clientsExportDropdown).toBeGreaterThan(0);
    console.log('✅ Export buttons availability check completed');
  });
});