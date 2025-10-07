import { test, expect } from '@playwright/test';

test.describe('Export Function Debug', () => {
  test('should check what exportToPDF receives', async ({ page }) => {
    console.log('🔍 DEBUGGING: exportToPDF function input');

    // Monitor console logs from the browser
    page.on('console', (msg) => {
      if (msg.text().includes('exportToPDF Debug')) {
        console.log('BROWSER LOG:', msg.text());
      }
    });

    // Login
    await page.goto('http://lit.local:8080');
    await page.fill('#email', 'admin@litigation.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Navigate to reports
    await page.goto('http://lit.local:8080/reports');
    await page.waitForTimeout(1000);

    // Open client-specific report modal
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });
    await page.waitForFunction(() => document.querySelectorAll('.spinner-border').length === 0, {
      timeout: 10000,
    });

    // Search and select client
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');
    await searchInput.fill('New Test Client Don');
    await page.waitForTimeout(500);

    const searchResults = page.locator('.list-group-item[style*="cursor: pointer"]');
    await searchResults.first().click();
    await page.waitForTimeout(500);

    // Change to hearings
    const reportTypeSelect = page.locator('select');
    await reportTypeSelect.selectOption('hearings');
    await page.waitForTimeout(500);

    // Select all columns to trigger the issue
    const allCheckboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await allCheckboxes.count();

    for (let i = 0; i < checkboxCount; i++) {
      await allCheckboxes.nth(i).check();
    }

    console.log(`✅ Selected all ${checkboxCount} hearing columns`);

    // Set date range
    const dateFromInput = page.locator('input[type="date"]').first();
    const dateToInput = page.locator('input[type="date"]').last();
    await dateFromInput.fill('2025-09-01');
    await dateToInput.fill('2025-10-31');

    // Generate report and wait for console logs
    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await generateButton.click();
    await page.waitForTimeout(5000);

    console.log('🎉 Export Debug Test COMPLETED');
  });
});
