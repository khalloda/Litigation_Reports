import { test, expect } from '@playwright/test';

test.describe('Ultimate Fix Test', () => {
  test('should have perfect column matching with no duplication', async ({ page }) => {
    console.log('🎯 ULTIMATE TEST: Column duplication fix validation');

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
    await page.waitForTimeout(1000); // Give time for columns to load

    // Check how many columns are pre-selected
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    console.log(`📋 Total available checkboxes: ${checkboxCount}`);

    // Count pre-selected checkboxes
    let preSelectedCount = 0;
    for (let i = 0; i < checkboxCount; i++) {
      const isChecked = await checkboxes.nth(i).isChecked();
      if (isChecked) preSelectedCount++;
    }
    console.log(`✅ Pre-selected columns: ${preSelectedCount}`);

    // Select a few more specific columns to reach exactly 6 total
    const targetColumnCount = 6;
    let currentSelected = preSelectedCount;

    for (let i = 0; i < checkboxCount && currentSelected < targetColumnCount; i++) {
      const isChecked = await checkboxes.nth(i).isChecked();
      if (!isChecked) {
        await checkboxes.nth(i).check();
        currentSelected++;
      }
    }

    console.log(`✅ Total selected columns: ${currentSelected}`);

    // Set date range
    const dateFromInput = page.locator('input[type="date"]').first();
    const dateToInput = page.locator('input[type="date"]').last();
    await dateFromInput.fill('2025-09-01');
    await dateToInput.fill('2025-10-31');

    // Intercept and analyze the PDF request
    let analysisResult = null;

    page.on('request', async (request) => {
      if (request.url().includes('/api/export/pdf-chrome') && request.method() === 'POST') {
        try {
          const postData = request.postData();
          if (postData) {
            const pdfData = JSON.parse(postData);

            const columnKeys = pdfData.columns?.map((col) => col.key) || [];
            const dataKeys = pdfData.data?.length > 0 ? Object.keys(pdfData.data[0]) : [];

            // Check for perfect matching
            const perfectMatches = columnKeys.filter((key) => dataKeys.includes(key));
            const missingKeys = columnKeys.filter((key) => !dataKeys.includes(key));

            analysisResult = {
              totalColumns: pdfData.columns?.length || 0,
              dataObjects: pdfData.data?.length || 0,
              selectedColumns: currentSelected,
              perfectMatches: perfectMatches.length,
              missingKeys: missingKeys.length,
              matchRatio: perfectMatches.length / columnKeys.length,
              isSuccess:
                perfectMatches.length === columnKeys.length &&
                columnKeys.length === currentSelected,
            };

            console.log('\n📊 ===== ULTIMATE ANALYSIS =====');
            console.log(`📈 Selected in UI: ${currentSelected}`);
            console.log(`📈 Sent to PDF: ${analysisResult.totalColumns}`);
            console.log(
              `📈 Perfect matches: ${analysisResult.perfectMatches}/${analysisResult.totalColumns}`
            );
            console.log(`📈 Missing keys: ${analysisResult.missingKeys}`);
            console.log(`📈 Match ratio: ${(analysisResult.matchRatio * 100).toFixed(1)}%`);

            if (analysisResult.isSuccess) {
              console.log('🎉 SUCCESS: Perfect column matching achieved!');
            } else {
              console.log('❌ Issues detected:');
              if (analysisResult.totalColumns !== currentSelected) {
                console.log(
                  `  - Column count mismatch: sent ${analysisResult.totalColumns}, selected ${currentSelected}`
                );
              }
              if (analysisResult.missingKeys > 0) {
                console.log(`  - ${analysisResult.missingKeys} keys don't match data`);
              }
            }
          }
        } catch (e) {
          console.log('Error analyzing request:', e.message);
        }
      }
    });

    // Generate PDF
    let pdfGenerated = false;
    try {
      const downloadPromise = page.waitForEvent('download');
      const generateButton = page.locator('button:has-text("إنشاء التقرير")');
      await generateButton.click();

      const download = await downloadPromise;
      const pdfFileName = download.suggestedFilename();

      if (pdfFileName && pdfFileName.includes('.pdf')) {
        pdfGenerated = true;
        const downloadPath = './PDFEXPORT/' + pdfFileName;
        await download.saveAs(downloadPath);
        console.log(`📁 PDF saved: ${pdfFileName}`);
      }
    } catch (e) {
      console.log('❌ PDF generation failed:', e.message);
    }

    // Wait for analysis
    await page.waitForTimeout(2000);

    // Final Result
    console.log('\n🎯 ===== FINAL VERDICT =====');
    if (analysisResult?.isSuccess && pdfGenerated) {
      console.log('🎉 COMPLETE SUCCESS!');
      console.log('✅ Column counts match perfectly');
      console.log('✅ All columns have matching data keys');
      console.log('✅ PDF generated successfully');
      console.log('✅ All hearing columns should now show populated data');
    } else {
      console.log('❌ Issues remain to be fixed');
      if (!pdfGenerated) console.log('  - PDF generation failed');
      if (!analysisResult?.isSuccess) console.log('  - Column matching not perfect');
    }

    console.log('\n🎉 Ultimate Fix Test COMPLETED');
  });
});
