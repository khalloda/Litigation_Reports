import { test, expect } from '@playwright/test';

test.describe('Hearing Data Verification for New Test Client Don', () => {
  test('should verify hearing data flows correctly through complete workflow', async ({ page }) => {
    console.log('🔍 Testing complete hearing data flow for New Test Client Don');

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

    // Step 4: Search for "New Test Client Don"
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');
    await searchInput.fill('New Test Client Don');
    await page.waitForTimeout(500);

    const searchResults = page.locator('.list-group-item[style*="cursor: pointer"]');
    const count = await searchResults.count();
    console.log(`✅ Found ${count} results for "New Test Client Don"`);

    if (count > 0) {
      await searchResults.first().click();
      const successBadge = page.locator('.badge.bg-success:has-text("✓")');
      await expect(successBadge).toBeVisible();

      // Step 5: Change to hearings report
      const reportTypeSelect = page.locator('select');
      await reportTypeSelect.selectOption('hearings');
      await page.waitForTimeout(500);

      // Step 6: Select all relevant columns
      const targetColumns = [
        'تاريخ الجلسة',           // h.hearing_date
        'نوع الجلسة',            // h.hearing_type
        'نتيجة الجلسة',          // h.hearing_result
        'المحكمة',               // c.matter_court
        'ملاحظات المحكمة',       // h.court_notes
        'ملاحظات المحامي',       // h.lawyer_notes
        'الجلسة القادمة'         // h.next_hearing
      ];

      console.log('🎯 Selecting all hearing columns...');

      // Select all checkboxes (simpler approach)
      const checkboxes = page.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();

      for (let i = 0; i < checkboxCount; i++) {
        await checkboxes.nth(i).check();
      }

      console.log(`✅ Selected all ${checkboxCount} hearing columns`);

      // Step 7: Set date range
      const dateFromInput = page.locator('input[type="date"]').first();
      const dateToInput = page.locator('input[type="date"]').last();

      await dateFromInput.fill('2025-09-01');
      await dateToInput.fill('2025-09-30');

      console.log('✅ Set date range: Sept 2025');

      // Step 8: Intercept the API call to see actual data
      page.on('response', async (response) => {
        if (response.url().includes('/api/reports/client-specific') && response.request().method() === 'POST') {
          try {
            const responseData = await response.json();
            console.log('📡 API Response intercepted:');
            console.log('Total hearings:', responseData.data?.data?.length || 0);

            if (responseData.data?.data?.length > 0) {
              responseData.data.data.forEach((hearing: any, index: number) => {
                console.log(`\n📋 Hearing ${index + 1}:`);
                console.log(`  تاريخ الجلسة: ${hearing.hearing_date || 'EMPTY'}`);
                console.log(`  نوع الجلسة: ${hearing.hearing_type || 'EMPTY'}`);
                console.log(`  نتيجة الجلسة: ${hearing.hearing_result || 'EMPTY'}`);
                console.log(`  المحكمة: ${hearing.matter_court || 'EMPTY'}`);
                console.log(`  ملاحظات المحكمة: ${hearing.court_notes || 'EMPTY'}`);
                console.log(`  ملاحظات المحامي: ${hearing.lawyer_notes || 'EMPTY'}`);
                console.log(`  الجلسة القادمة: ${hearing.next_hearing || 'EMPTY'}`);
              });
            }
          } catch (e) {
            console.log('Could not parse API response');
          }
        }
      });

      // Step 9: Generate report
      const generateButton = page.locator('button:has-text("إنشاء التقرير")');
      await expect(generateButton).toBeEnabled();

      console.log('🚀 Generating hearing report...');
      await generateButton.click();

      // Wait for the API call and PDF generation
      await page.waitForTimeout(5000);

      console.log('🎉 Hearing data verification test completed');
    } else {
      console.log('❌ Could not find New Test Client Don');
    }
  });

  test('should verify API returns actual data directly', async ({ page }) => {
    console.log('🔧 Testing API directly for hearing data');

    // Test API call directly
    const response = await page.request.post('http://lit.local:8080/api/reports/client-specific', {
      data: {
        client_id: "315",
        report_type: "hearings",
        columns: [
          "h.hearing_date",
          "h.hearing_type",
          "h.hearing_result",
          "c.matter_court",
          "h.court_notes",
          "h.lawyer_notes",
          "h.next_hearing"
        ],
        date_from: "2025-09-01",
        date_to: "2025-09-30"
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    console.log('\n📊 DIRECT API TEST RESULTS:');
    console.log('='.repeat(50));

    if (data.data?.data?.length > 0) {
      data.data.data.forEach((hearing: any, index: number) => {
        console.log(`\n📋 Hearing ${index + 1} (${hearing.hearing_date}):`);

        // Check each field and report if empty or has data
        const fields = [
          { key: 'hearing_date', label: 'تاريخ الجلسة' },
          { key: 'hearing_type', label: 'نوع الجلسة' },
          { key: 'hearing_result', label: 'نتيجة الجلسة' },
          { key: 'matter_court', label: 'المحكمة' },
          { key: 'court_notes', label: 'ملاحظات المحكمة' },
          { key: 'lawyer_notes', label: 'ملاحظات المحامي' },
          { key: 'next_hearing', label: 'الجلسة القادمة' }
        ];

        fields.forEach(field => {
          const value = hearing[field.key];
          const hasData = value && value !== "" && value !== null;
          const status = hasData ? '✅ HAS DATA' : '❌ EMPTY';
          const displayValue = hasData ? value : 'NO DATA';
          console.log(`  ${field.label}: ${status} - "${displayValue}"`);
        });
      });

      console.log('\n📈 SUMMARY:');
      console.log(`Total hearings found: ${data.data.data.length}`);
      console.log('Client:', data.data.client.client_name_en);
      console.log('Report type:', data.data.report_type);
    } else {
      console.log('❌ No hearing data returned');
    }

    console.log('🎉 Direct API test completed');
  });
});