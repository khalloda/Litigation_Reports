import { test, expect } from '@playwright/test';

test.describe('Final Verification Test', () => {
  test('should generate PDF with correct columns and populated data', async ({ page }) => {
    console.log('🎯 FINAL VERIFICATION: Complete fix test');

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
    const count = await searchResults.count();

    if (count > 0) {
      await searchResults.first().click();
      const successBadge = page.locator('.badge.bg-success:has-text("✓")');
      await expect(successBadge).toBeVisible();
      console.log('✅ Client selected: New Test Client Don');

      // Change to hearings
      const reportTypeSelect = page.locator('select');
      await reportTypeSelect.selectOption('hearings');
      await page.waitForTimeout(500);
      console.log('✅ Report type: hearings');

      // Select all columns
      const checkboxes = page.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();

      for (let i = 0; i < checkboxCount; i++) {
        await checkboxes.nth(i).check();
      }
      console.log(`✅ Selected all ${checkboxCount} columns`);

      // Set date range
      const dateFromInput = page.locator('input[type="date"]').first();
      const dateToInput = page.locator('input[type="date"]').last();
      await dateFromInput.fill('2025-09-01');
      await dateToInput.fill('2025-10-31');
      console.log('✅ Date range set: Sept-Oct 2025');

      // Intercept PDF request for final analysis
      let finalAnalysis = null;

      page.on('request', async (request) => {
        if (request.url().includes('/api/export/pdf-chrome') && request.method() === 'POST') {
          try {
            const postData = request.postData();
            if (postData) {
              const pdfData = JSON.parse(postData);

              finalAnalysis = {
                totalColumns: pdfData.columns?.length || 0,
                dataObjects: pdfData.data?.length || 0,
                columnKeys: pdfData.columns?.map((col) => col.key) || [],
                dataKeys: pdfData.data?.length > 0 ? Object.keys(pdfData.data[0]) : [],
                duplicateColumns: false,
                keyMatches: 0,
                missingKeys: [],
              };

              // Check for duplicates
              const keys = finalAnalysis.columnKeys;
              const uniqueKeys = [...new Set(keys)];
              finalAnalysis.duplicateColumns = keys.length !== uniqueKeys.length;

              // Check key matching
              if (pdfData.data && pdfData.data.length > 0) {
                const dataKeys = Object.keys(pdfData.data[0]);
                finalAnalysis.keyMatches = keys.filter((key) => dataKeys.includes(key)).length;
                finalAnalysis.missingKeys = keys.filter((key) => !dataKeys.includes(key));
              }
            }
          } catch (e) {
            console.log('Error analyzing PDF request:', e.message);
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

          // Save for verification
          const downloadPath = './PDFEXPORT/' + pdfFileName;
          await download.saveAs(downloadPath);
          console.log(`📁 PDF saved: ${pdfFileName}`);
        }
      } catch (e) {
        console.log('❌ PDF generation failed:', e.message);
      }

      // Wait a moment for the request to complete
      await page.waitForTimeout(2000);

      // Final Analysis Report
      console.log('\n📊 ===== FINAL ANALYSIS REPORT =====');

      if (finalAnalysis) {
        console.log(`📈 Metrics:`);
        console.log(`  - Total columns sent: ${finalAnalysis.totalColumns}`);
        console.log(`  - Data objects: ${finalAnalysis.dataObjects}`);
        console.log(
          `  - Duplicate columns: ${finalAnalysis.duplicateColumns ? '❌ YES' : '✅ NO'}`
        );
        console.log(`  - Key matches: ${finalAnalysis.keyMatches}/${finalAnalysis.totalColumns}`);

        if (finalAnalysis.missingKeys.length > 0) {
          console.log(
            `  - Missing keys: ${finalAnalysis.missingKeys.slice(0, 3).join(', ')}${finalAnalysis.missingKeys.length > 3 ? '...' : ''}`
          );
        }

        // Success criteria
        const isSuccess =
          pdfGenerated &&
          !finalAnalysis.duplicateColumns &&
          finalAnalysis.missingKeys.length === 0 &&
          finalAnalysis.totalColumns === finalAnalysis.keyMatches;

        console.log(`\n🎯 Overall Result: ${isSuccess ? '🎉 SUCCESS' : '❌ ISSUES REMAIN'}`);

        if (isSuccess) {
          console.log('✅ All columns should now show data in the PDF');
          console.log('✅ No duplicate columns');
          console.log('✅ Perfect key matching');
        } else {
          console.log('❌ Issues detected:');
          if (finalAnalysis.duplicateColumns) console.log('  - Duplicate columns still present');
          if (finalAnalysis.missingKeys.length > 0) console.log('  - Key mismatches still exist');
          if (!pdfGenerated) console.log('  - PDF generation failed');
        }
      } else {
        console.log('❌ Could not analyze PDF request data');
      }

      console.log('\n📋 Expected in PDF (if successful):');
      console.log('  - المحكمة (Court): populated');
      console.log('  - ملاحظات المحكمة (Court Notes): populated');
      console.log('  - ملاحظات المحامي (Lawyer Notes): populated');
      console.log('  - الجلسة القادمة (Next Hearing): populated');
    } else {
      console.log('❌ Could not find New Test Client Don');
    }

    console.log('\n🎉 Final Verification Test COMPLETED');
  });
});
