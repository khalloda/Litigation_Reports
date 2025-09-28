import { test, expect } from '@playwright/test';

test.describe('Debug Available Columns', () => {
  test('should show exactly what columns are available and selected', async ({ page }) => {
    console.log('🔍 DEBUG: Available columns analysis');

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

    // Change to hearings to load the columns
    const reportTypeSelect = page.locator('select');
    await reportTypeSelect.selectOption('hearings');
    await page.waitForTimeout(2000); // Give time for columns to load

    // Get all checkbox labels to see what's available
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();

    console.log(`📋 Total available checkboxes: ${checkboxCount}`);

    for (let i = 0; i < checkboxCount; i++) {
      const checkbox = checkboxes.nth(i);
      const label = await checkbox.locator('..').textContent(); // Get parent label text
      const id = await checkbox.getAttribute('id');
      const isChecked = await checkbox.isChecked();

      console.log(`  ${i + 1}. [${isChecked ? '✓' : ' '}] ${id} = "${label}"`);
    }

    console.log('\n🎉 Available Columns Analysis COMPLETED');
  });
});