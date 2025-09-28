import { test, expect } from '@playwright/test';

test.describe('Debug Column Creation', () => {
  test('should show what ClientSpecificReportModal creates', async ({ page }) => {
    console.log('🔍 DEBUGGING: ClientSpecificReportModal column creation');

    // Monitor browser console
    page.on('console', (msg) => {
      if (msg.text().includes('ClientSpecificReportModal Debug') ||
          msg.text().includes('Processing:') ||
          msg.text().includes('selectedColumns') ||
          msg.text().includes('exportColumns')) {
        console.log('BROWSER:', msg.text());
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
    await page.waitForFunction(() => document.querySelectorAll('.spinner-border').length === 0, { timeout: 10000 });

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

    // Select only a few specific columns to make debugging easier
    const checkboxes = page.locator('input[type="checkbox"]');
    const firstThree = Math.min(3, await checkboxes.count());

    for (let i = 0; i < firstThree; i++) {
      await checkboxes.nth(i).check();
    }
    console.log(`✅ Selected first ${firstThree} columns only`);

    // Set date range
    const dateFromInput = page.locator('input[type="date"]').first();
    const dateToInput = page.locator('input[type="date"]').last();
    await dateFromInput.fill('2025-09-01');
    await dateToInput.fill('2025-10-31');

    // Generate report to trigger the debug logging
    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await generateButton.click();
    await page.waitForTimeout(3000);

    console.log('🎉 Column Creation Debug Test COMPLETED');
  });
});