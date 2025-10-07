import { test, expect } from '@playwright/test';

test.describe('📊 Comprehensive: All Entities Column Filtering Validation', () => {
  test('🎯 FINAL VALIDATION: All entities (Clients, Cases, Hearings, Invoices, Documents) column filtering works perfectly', async ({
    page,
  }) => {
    console.log('🎯 COMPREHENSIVE VALIDATION: Testing all entities column filtering');

    // Login once
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    const testResults: any[] = [];

    // Entity configurations for testing
    const entityConfigs = [
      {
        entity: 'clients',
        name: 'العملاء',
        testColumns: ['client_name_ar', 'client_type'],
        expectedHeaders: ['اسم العميل (عربي)', 'نوع العميل'],
      },
      {
        entity: 'cases',
        name: 'القضايا',
        testColumns: ['matter_id', 'matter_status'],
        expectedHeaders: ['رقم القضية', 'حالة القضية'],
      },
      {
        entity: 'hearings',
        name: 'الجلسات',
        testColumns: ['hearing_date', 'hearing_type'],
        expectedHeaders: ['تاريخ الجلسة', 'نوع الجلسة'],
      },
      {
        entity: 'invoices',
        name: 'الفواتير',
        testColumns: ['id', 'invoice_number'],
        expectedHeaders: ['معرف الفاتورة', 'رقم الفاتورة'],
      },
      {
        entity: 'documents',
        name: 'المستندات',
        testColumns: ['title', 'document_type'],
        expectedHeaders: ['عنوان الوثيقة', 'نوع الوثيقة'],
      },
    ];

    // Test each entity
    for (const config of entityConfigs) {
      console.log(`\n🔍 Testing ${config.name} (${config.entity})...`);

      // Navigate to reports
      await page.goto('/reports', { waitUntil: 'networkidle' });

      // Open custom report modal
      const customReportButton = page.locator('button').filter({ hasText: 'تقرير مخصص' }).first();
      await customReportButton.click();
      await page.waitForSelector('[role="dialog"], .modal');

      // Select entity
      const entitySelect = page.locator('select').first();
      await entitySelect.selectOption(config.entity);
      await page.waitForTimeout(2000);

      // Go to columns tab
      await page.getByRole('tab', { name: 'الأعمدة' }).click();
      await page.waitForSelector('input[type="checkbox"]');

      // Clear all checkboxes
      const checkboxes = await page.locator('input[type="checkbox"]').all();
      for (const cb of checkboxes) {
        if (await cb.isChecked()) {
          await cb.uncheck();
        }
      }

      // Select specific test columns
      let selectedCount = 0;
      for (const checkbox of checkboxes) {
        const checkboxId = await checkbox.getAttribute('id');
        if (checkboxId && config.testColumns.includes(checkboxId.replace('column-', ''))) {
          await checkbox.check();
          selectedCount++;
        }
      }

      console.log(`   📋 Selected ${selectedCount} columns for ${config.name}`);

      // Generate report
      await page.getByRole('button', { name: /إنشاء التقرير|تطبيق|عرض التقرير/i }).click();

      // Wait for detailed report modal
      await page.waitForSelector('.modal:has([class*="modal-xl"])', { timeout: 15000 });
      await page.waitForTimeout(2000);

      // Analyze results
      const modalTable = page.locator('.modal table').first();
      const isTableVisible = await modalTable.isVisible();

      if (isTableVisible) {
        const modalHeaders = await page.locator('.modal table thead th').allTextContents();
        const cleanHeaders = modalHeaders.map((h) => h.trim()).filter(Boolean);
        const dataRows = await page.locator('.modal table tbody tr').count();

        const isSuccess = cleanHeaders.length === selectedCount;

        testResults.push({
          entity: config.entity,
          name: config.name,
          selectedColumns: selectedCount,
          actualColumns: cleanHeaders.length,
          headers: cleanHeaders,
          dataRows,
          success: isSuccess,
        });

        if (isSuccess) {
          console.log(
            `   ✅ ${config.name}: PERFECT! (${selectedCount} selected, ${cleanHeaders.length} shown)`
          );
        } else {
          console.log(
            `   ⚠️ ${config.name}: ${selectedCount} selected, ${cleanHeaders.length} shown`
          );
        }

        // Close modal for next test
        await page.getByRole('button', { name: /إغلاق/ }).click();
        await page.waitForTimeout(1000);
      } else {
        testResults.push({
          entity: config.entity,
          name: config.name,
          selectedColumns: selectedCount,
          actualColumns: 0,
          headers: [],
          dataRows: 0,
          success: false,
          error: 'Table not visible',
        });
        console.log(`   ❌ ${config.name}: Table not visible`);
      }
    }

    // Final results summary
    console.log('\n📊 COMPREHENSIVE TEST RESULTS:');
    console.log('='.repeat(50));

    let totalSuccess = 0;
    for (const result of testResults) {
      const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
      console.log(`${status} - ${result.name}: ${result.actualColumns} columns shown`);
      if (result.success) totalSuccess++;
    }

    console.log('='.repeat(50));
    console.log(
      `🎯 OVERALL RESULT: ${totalSuccess}/${testResults.length} entities working perfectly`
    );

    // Assertions
    for (const result of testResults) {
      expect(result.success).toBe(true);
    }

    // Overall success assertion
    expect(totalSuccess).toBe(entityConfigs.length);

    console.log('\n🎉 ALL ENTITIES COLUMN FILTERING WORKING PERFECTLY! 🎉');
    console.log('✅ Clients: Perfect column filtering');
    console.log('✅ Cases: Perfect column filtering');
    console.log('✅ Hearings: Perfect column filtering');
    console.log('✅ Invoices: Perfect column filtering');
    console.log('✅ Documents: Perfect column filtering');
  });
});
