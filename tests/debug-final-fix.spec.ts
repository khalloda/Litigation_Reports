import { test, expect } from '@playwright/test';

test.describe('Debug Final Fix', () => {
  test('should show exact data flow with new debug logging', async ({ page }) => {
    console.log('🔍 DEBUG: Final fix with comprehensive logging');

    // Capture all console logs
    const consoleLogs = [];
    page.on('console', (msg) => {
      if (
        msg.text().includes('exportToPDF - Final Fix Analysis') ||
        msg.text().includes('columns') ||
        msg.text().includes('final exportColumns')
      ) {
        consoleLogs.push(msg.text());
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
    await page.waitForTimeout(1000);

    // Select exactly 4 specific columns
    const checkboxes = page.locator('input[type="checkbox"]');
    const targetColumns = 4;

    // First, uncheck all
    const totalCheckboxes = await checkboxes.count();
    for (let i = 0; i < totalCheckboxes; i++) {
      const isChecked = await checkboxes.nth(i).isChecked();
      if (isChecked) {
        await checkboxes.nth(i).uncheck();
      }
    }

    // Then check exactly 4
    for (let i = 0; i < Math.min(targetColumns, totalCheckboxes); i++) {
      await checkboxes.nth(i).check();
    }

    console.log(`✅ Selected exactly ${targetColumns} columns`);

    // Set date range
    const dateFromInput = page.locator('input[type="date"]').first();
    const dateToInput = page.locator('input[type="date"]').last();
    await dateFromInput.fill('2025-09-01');
    await dateToInput.fill('2025-10-31');

    // Generate PDF to trigger debug logging
    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await generateButton.click();
    await page.waitForTimeout(5000);

    console.log('\n📊 Browser Console Logs Captured:');
    consoleLogs.forEach((log, index) => {
      console.log(`  ${index + 1}. ${log}`);
    });

    console.log('\n🎉 Debug Final Fix Test COMPLETED');
  });
});
