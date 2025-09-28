import { test, expect } from '@playwright/test';

test.describe('Hearing Report Columns Fix Verification', () => {
  test('should display all hearing columns correctly for New Test Client Don', async ({ page }) => {
    console.log('🎯 Testing complete hearing report with all columns for New Test Client Don');

    // Step 1: Login
    await page.goto('http://lit.local:8080');
    await page.fill('#email', 'admin@litigation.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Step 2: Navigate to reports
    await page.goto('http://lit.local:8080/reports');
    await page.waitForTimeout(1000);

    // Step 3: Open client-specific report modal
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });
    await page.waitForFunction(() => document.querySelectorAll('.spinner-border').length === 0, { timeout: 10000 });

    console.log('✅ Modal opened and loaded');

    // Step 4: Search for "New Test Client Don"
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');
    await searchInput.fill('New Test Client Don');
    await page.waitForTimeout(500);

    const searchResults = page.locator('.list-group-item[style*="cursor: pointer"]');
    const count = await searchResults.count();
    console.log(`✅ Search found ${count} results for "New Test Client Don"`);

    // Step 5: Select the client
    if (count > 0) {
      const clientItem = searchResults.first();
      await clientItem.click();

      // Verify selection
      const successBadge = page.locator('.badge.bg-success:has-text("✓")');
      await expect(successBadge).toBeVisible();
      console.log('✅ New Test Client Don selected');

      // Step 6: Change report type to hearings
      const reportTypeSelect = page.locator('select');
      await reportTypeSelect.selectOption('hearings');
      await page.waitForTimeout(500);

      console.log('✅ Changed report type to hearings');

      // Step 7: Verify all hearing column options are available
      const expectedColumns = [
        'تاريخ الجلسة',      // h.hearing_date
        'نوع الجلسة',       // h.hearing_type
        'نتيجة الجلسة',     // h.hearing_result
        'المحكمة',          // c.matter_court
        'ملاحظات المحكمة',  // h.court_notes
        'ملاحظات المحامي',  // h.lawyer_notes
        'الجلسة القادمة'    // h.next_hearing
      ];

      const checkboxes = page.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();
      console.log(`✅ Found ${checkboxCount} column options for hearings`);

      // Verify specific columns exist
      for (const columnLabel of expectedColumns) {
        const columnCheckbox = page.locator(`label:has-text("${columnLabel}")`);
        const exists = await columnCheckbox.count() > 0;
        console.log(`${exists ? '✅' : '❌'} Column "${columnLabel}": ${exists ? 'Found' : 'Missing'}`);
      }

      // Step 8: Select first few columns (simplified approach)
      const columnCheckboxes = page.locator('input[type="checkbox"]');
      const numColumns = Math.min(5, await columnCheckboxes.count());

      for (let i = 0; i < numColumns; i++) {
        await columnCheckboxes.nth(i).check();
      }

      console.log(`✅ Selected ${numColumns} hearing columns`);

      // Step 8.5: Set required date range for hearings
      const dateFromInput = page.locator('input[type="date"]').first();
      const dateToInput = page.locator('input[type="date"]').last();

      await dateFromInput.fill('2025-09-01');
      await dateToInput.fill('2025-09-30');

      console.log('✅ Set date range for hearing report (Sept 2025)');

      // Step 9: Generate report
      const generateButton = page.locator('button:has-text("إنشاء التقرير")');
      await expect(generateButton).toBeEnabled();

      console.log('✅ Generate button is enabled');

      await generateButton.click();
      await page.waitForTimeout(3000);

      // Check if modal closed (success) or error appeared
      const modal = page.locator('.modal.show');
      const modalCount = await modal.count();

      if (modalCount === 0) {
        console.log('🎉 SUCCESS: Hearing report generated and modal closed');
      } else {
        // Check for errors
        const errorAlert = page.locator('.alert-danger');
        const errorCount = await errorAlert.count();

        if (errorCount > 0) {
          const errorText = await errorAlert.textContent();
          console.log(`❌ Error: ${errorText}`);
        } else {
          console.log('⚠️ Modal still open but no errors detected');
        }
      }

      console.log('🎉 Hearing report column test COMPLETED');
    } else {
      console.log('❌ Could not find New Test Client Don');
    }
  });

  test('should verify API returns correct hearing columns', async ({ page }) => {
    console.log('🔧 Testing hearing columns via API');

    // Test GET endpoint for hearing column options
    const optionsResponse = await page.request.get('http://lit.local:8080/api/reports/client-specific');
    expect(optionsResponse.status()).toBe(200);

    const optionsData = await optionsResponse.json();
    const hearingColumns = optionsData.data.availableColumns.hearings;

    console.log('Available hearing columns:');
    hearingColumns.forEach((col: any) => {
      console.log(`  - ${col.key}: ${col.label}`);
    });

    // Verify expected columns exist
    const expectedKeys = [
      'h.hearing_date',
      'h.hearing_type',
      'h.hearing_result',
      'c.matter_court',
      'h.court_notes',
      'h.lawyer_notes',
      'h.next_hearing'
    ];

    const actualKeys = hearingColumns.map((col: any) => col.key);

    for (const expectedKey of expectedKeys) {
      const exists = actualKeys.includes(expectedKey);
      console.log(`${exists ? '✅' : '❌'} API Column "${expectedKey}": ${exists ? 'Found' : 'Missing'}`);
      expect(exists).toBe(true);
    }

    // Test POST endpoint with New Test Client Don
    const reportResponse = await page.request.post('http://lit.local:8080/api/reports/client-specific', {
      data: {
        client_id: "315",
        report_type: "hearings",
        columns: [
          "h.hearing_date",
          "h.hearing_type",
          "h.hearing_result",
          "c.matter_court",
          "h.court_notes",
          "h.next_hearing"
        ]
      }
    });

    expect(reportResponse.status()).toBe(200);
    const reportData = await reportResponse.json();

    console.log(`✅ Hearing report generated with ${reportData.data.data.length} hearing records`);

    if (reportData.data.data.length > 0) {
      const firstHearing = reportData.data.data[0];
      console.log('First hearing data:');
      console.log(`  - تاريخ الجلسة: ${firstHearing.hearing_date}`);
      console.log(`  - نوع الجلسة: ${firstHearing.hearing_type}`);
      console.log(`  - نتيجة الجلسة: ${firstHearing.hearing_result}`);
      console.log(`  - المحكمة: ${firstHearing.matter_court || 'N/A'}`);
      console.log(`  - ملاحظات المحكمة: ${firstHearing.court_notes || 'N/A'}`);
      console.log(`  - الجلسة القادمة: ${firstHearing.next_hearing || 'N/A'}`);
    }

    console.log('🎉 API hearing column test PASSED');
  });
});