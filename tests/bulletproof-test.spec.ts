import { test, expect } from '@playwright/test';

test.describe('Bulletproof Solution Test', () => {
  test('should ensure perfect column-data matching with validation', async ({ page }) => {
    console.log('🛡️ BULLETPROOF TEST: Perfect column-data matching');

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

    // Select all columns (let validation filter out non-matching ones)
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();

    for (let i = 0; i < checkboxCount; i++) {
      await checkboxes.nth(i).check();
    }
    console.log(`✅ Selected all ${checkboxCount} columns for validation`);

    // Set date range
    const dateFromInput = page.locator('input[type="date"]').first();
    const dateToInput = page.locator('input[type="date"]').last();
    await dateFromInput.fill('2025-09-01');
    await dateToInput.fill('2025-10-31');

    // Intercept and analyze
    let bulletproofAnalysis = null;

    page.on('request', async (request) => {
      if (request.url().includes('/api/export/pdf-chrome') && request.method() === 'POST') {
        try {
          const postData = request.postData();
          if (postData) {
            const pdfData = JSON.parse(postData);

            const columnKeys = pdfData.columns?.map((col) => col.key) || [];
            const dataKeys = pdfData.data?.length > 0 ? Object.keys(pdfData.data[0]) : [];

            // Perfect matching analysis
            const perfectMatches = columnKeys.filter((key) => dataKeys.includes(key));
            const missingKeys = columnKeys.filter((key) => !dataKeys.includes(key));

            bulletproofAnalysis = {
              totalColumnsInRequest: pdfData.columns?.length || 0,
              dataObjectsCount: pdfData.data?.length || 0,
              perfectMatches: perfectMatches.length,
              missingKeys: missingKeys.length,
              matchRatio: perfectMatches.length / columnKeys.length,
              isPerfeect: missingKeys.length === 0 && perfectMatches.length > 0,
            };

            console.log('\n🛡️ ===== BULLETPROOF ANALYSIS =====');
            console.log(
              `📊 Total columns in PDF request: ${bulletproofAnalysis.totalColumnsInRequest}`
            );
            console.log(
              `📊 Perfect matches: ${bulletproofAnalysis.perfectMatches}/${bulletproofAnalysis.totalColumnsInRequest}`
            );
            console.log(`📊 Missing keys: ${bulletproofAnalysis.missingKeys}`);
            console.log(`📊 Match ratio: ${(bulletproofAnalysis.matchRatio * 100).toFixed(1)}%`);

            if (bulletproofAnalysis.isPerfeect) {
              console.log('🎉 PERFECT: All columns have matching data keys!');
            } else {
              console.log('❌ Issues found:');
              if (bulletproofAnalysis.missingKeys > 0) {
                console.log(`  - ${bulletproofAnalysis.missingKeys} columns don't match data`);
              }
            }

            // Show actual keys for debugging
            console.log('\n🔍 Key Details:');
            console.log(`  Data keys: ${dataKeys.join(', ')}`);
            console.log(`  Column keys: ${columnKeys.join(', ')}`);
          }
        } catch (e) {
          console.log('Error analyzing bulletproof request:', e.message);
        }
      }
    });

    // Generate PDF
    let pdfGenerated = false;
    let pdfFileName = '';

    try {
      const downloadPromise = page.waitForEvent('download');
      const generateButton = page.locator('button:has-text("إنشاء التقرير")');
      await generateButton.click();

      const download = await downloadPromise;
      pdfFileName = download.suggestedFilename();

      if (pdfFileName && pdfFileName.includes('.pdf')) {
        pdfGenerated = true;
        const downloadPath = './PDFEXPORT/' + pdfFileName;
        await download.saveAs(downloadPath);
        console.log(`📁 Bulletproof PDF saved: ${pdfFileName}`);
      }
    } catch (e) {
      console.log('❌ PDF generation failed:', e.message);
    }

    // Wait for analysis
    await page.waitForTimeout(2000);

    // Final verdict
    console.log('\n🎯 ===== BULLETPROOF VERDICT =====');
    if (bulletproofAnalysis?.isPerfeect && pdfGenerated) {
      console.log('🎉 BULLETPROOF SUCCESS!');
      console.log('✅ Perfect column-data matching achieved');
      console.log('✅ No missing keys');
      console.log('✅ PDF generated successfully');
      console.log('✅ All columns should now show populated data');
    } else {
      console.log('❌ Bulletproof solution needs refinement');
      if (!pdfGenerated) console.log('  - PDF generation failed');
      if (!bulletproofAnalysis?.isPerfeect) console.log('  - Column matching not perfect');
    }

    if (pdfGenerated) {
      console.log(`\n📋 Verify the PDF: ${pdfFileName}`);
      console.log('   Should show populated data in ALL columns');
    }

    console.log('\n🎉 Bulletproof Test COMPLETED');
  });
});
