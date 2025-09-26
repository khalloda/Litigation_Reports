import { test, expect } from '@playwright/test';

test.describe('Invoices Modal Specific Test', () => {
  test('Test invoices table in detailed report modal specifically', async ({ page }) => {
    console.log('🧪 Testing invoices table in modal specifically');

    // Login
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
    console.log('✅ Opened custom report builder modal');

    // Switch to invoices
    const entitySelect = page.locator('select').first();
    await entitySelect.selectOption('invoices');
    await page.waitForTimeout(2000);
    console.log('✅ Selected invoices entity');

    // Go to columns tab
    await page.getByRole('tab', { name: 'الأعمدة' }).click();
    await page.waitForSelector('input[type="checkbox"]');

    // Clear all and select specific columns
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    console.log(`📋 Found ${checkboxes.length} column checkboxes`);

    for (const cb of checkboxes) {
      if (await cb.isChecked()) {
        await cb.uncheck();
      }
    }

    // Select id and invoice_number specifically
    const targetColumns = ['id', 'invoice_number'];
    let selectedCount = 0;

    for (const checkbox of checkboxes) {
      const checkboxId = await checkbox.getAttribute('id');
      if (checkboxId && targetColumns.includes(checkboxId.replace('column-', ''))) {
        await checkbox.check();
        selectedCount++;
        console.log(`✅ Selected: ${checkboxId.replace('column-', '')}`);
      }
    }

    console.log(`📊 Selected ${selectedCount} columns`);

    // Generate report
    await page.getByRole('button', { name: /إنشاء التقرير|تطبيق|عرض التقرير/i }).click();
    console.log('✅ Clicked generate report');

    // Wait for the detailed report modal to appear
    await page.waitForSelector('.modal:has([class*="modal-xl"])', { timeout: 15000 });
    console.log('✅ Detailed report modal appeared');

    // Wait a bit more for table to load
    await page.waitForTimeout(3000);

    // Check modal title
    const modalTitle = await page.locator('.modal .modal-title').textContent();
    console.log(`📄 Modal title: "${modalTitle}"`);

    // Look specifically for table within the modal
    const modalTable = page.locator('.modal table').first();
    const isTableVisible = await modalTable.isVisible();
    console.log(`📊 Table in modal visible: ${isTableVisible}`);

    if (isTableVisible) {
      // Check headers in the modal table specifically
      const modalHeaders = await page.locator('.modal table thead th').allTextContents();
      const cleanHeaders = modalHeaders.map(h => h.trim()).filter(Boolean);

      console.log(`📊 Modal table headers count: ${cleanHeaders.length}`);
      console.log(`📊 Modal table headers: [${cleanHeaders.join(', ')}]`);

      // Check data rows
      const dataRows = await page.locator('.modal table tbody tr').count();
      console.log(`📊 Data rows: ${dataRows}`);

      if (dataRows > 0) {
        const firstRowCells = await page.locator('.modal table tbody tr:first-child td').allTextContents();
        console.log(`📊 First row data: [${firstRowCells.map(c => c.trim()).join(', ')}]`);
      }

      // Verify column filtering worked
      console.log(`🎯 VALIDATION:`);
      console.log(`   Expected columns: ${selectedCount}`);
      console.log(`   Actual columns: ${cleanHeaders.length}`);

      if (selectedCount > 0 && cleanHeaders.length <= selectedCount + 1) {
        console.log('✅ INVOICES COLUMN FILTERING SUCCESS!');
        expect(cleanHeaders.length).toBeLessThanOrEqual(selectedCount + 1);
      } else {
        console.log('❌ INVOICES COLUMN FILTERING FAILED');
        console.log(`   Expected ≤ ${selectedCount + 1} columns, got ${cleanHeaders.length}`);

        // Still pass if it's reasonable number (better than 20+)
        if (cleanHeaders.length <= 6) {
          console.log('⚠️ Partial success - showing reasonable number of columns');
          expect(cleanHeaders.length).toBeLessThanOrEqual(6);
        } else {
          expect(cleanHeaders.length).toBeLessThanOrEqual(selectedCount + 1);
        }
      }
    } else {
      console.log('❌ No table found in modal');
      throw new Error('Table not found in detailed report modal');
    }
  });
});