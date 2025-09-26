import { test, expect } from '@playwright/test';

test.describe('Debug API Response Content', () => {
  test('Capture invoices API response data', async ({ page }) => {
    console.log('🔍 Capturing invoices API response');

    // Store API responses
    const apiResponses: any[] = [];

    // Intercept POST requests to capture response data
    page.on('response', async response => {
      if (response.url().includes('/api/reports/custom') && response.request().method() === 'POST') {
        console.log('📥 Intercepted POST response:', response.status());
        try {
          const data = await response.json();
          apiResponses.push(data);
          console.log('📊 Response data keys:', Object.keys(data));

          if (data.data) {
            console.log('🔍 Data array length:', data.data.length);
            if (data.data.length > 0) {
              console.log('🔍 First row keys:', Object.keys(data.data[0]));
              console.log('🔍 First row:', data.data[0]);
            }
          }

          if (data.config) {
            console.log('⚙️ Config:', data.config);
          }

          if (data.available_columns) {
            console.log('📋 Available columns:', data.available_columns);
          }

        } catch (e) {
          console.log('❌ Failed to parse response:', e);
        }
      }
    });

    // Login and navigate
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    await page.goto('/reports', { waitUntil: 'networkidle' });

    // Open custom report modal
    const customReportButton = page.locator('button').filter({ hasText: 'تقرير مخصص' }).first();
    await customReportButton.click();
    await page.waitForSelector('[role="dialog"], .modal');

    // Switch to invoices
    const entitySelect = page.locator('select').first();
    await entitySelect.selectOption('invoices');
    await page.waitForTimeout(2000);

    // Go to columns and select specific ones
    await page.getByRole('tab', { name: 'الأعمدة' }).click();
    await page.waitForSelector('input[type="checkbox"]');

    const checkboxes = await page.locator('input[type="checkbox"]').all();

    // Clear all first
    for (const cb of checkboxes) {
      if (await cb.isChecked()) {
        await cb.uncheck();
      }
    }

    // Select specific invoice columns by their ID
    const targetColumns = ['id', 'invoice_number'];
    let selectedCount = 0;

    for (const checkbox of checkboxes) {
      const checkboxId = await checkbox.getAttribute('id');
      if (checkboxId) {
        const columnKey = checkboxId.replace('column-', '');
        if (targetColumns.includes(columnKey)) {
          await checkbox.check();
          selectedCount++;
          console.log(`✅ Selected column: ${columnKey}`);
        }
      }
    }

    console.log(`📋 Selected ${selectedCount} columns`);

    // Generate report
    await page.getByRole('button', { name: /إنشاء التقرير|تطبيق|عرض التقرير/i }).click();

    // Wait for response
    await page.waitForTimeout(5000);

    console.log(`📊 Total API responses captured: ${apiResponses.length}`);

    // Check if table appears after API response
    await page.waitForTimeout(2000);
    const tableVisible = await page.locator('table').isVisible().catch(() => false);
    const modalVisible = await page.locator('[role="dialog"], .modal').isVisible().catch(() => false);

    console.log('📊 Final UI state:');
    console.log(`   Table visible: ${tableVisible}`);
    console.log(`   Modal visible: ${modalVisible}`);

    if (tableVisible) {
      const headers = await page.locator('table thead th:visible').allTextContents();
      console.log(`   Headers: ${headers.map(h => h.trim()).filter(Boolean)}`);
    }
  });
});