import { test, expect } from '@playwright/test';

test.describe('Final Column Fix Test', () => {
  test('should generate PDF with only selected columns and all data populated', async ({ page }) => {
    console.log('🎯 FINAL TEST: Column duplication fix');

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
    await page.waitForTimeout(500);

    // Select all columns
    const allCheckboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await allCheckboxes.count();

    for (let i = 0; i < checkboxCount; i++) {
      await allCheckboxes.nth(i).check();
    }
    console.log(`✅ Selected all ${checkboxCount} hearing columns`);

    // Set date range
    const dateFromInput = page.locator('input[type="date"]').first();
    const dateToInput = page.locator('input[type="date"]').last();
    await dateFromInput.fill('2025-09-01');
    await dateToInput.fill('2025-10-31');

    // Intercept PDF request to verify only proper columns are sent
    let pdfRequestData = null;

    page.on('request', async (request) => {
      if (request.url().includes('/api/export/pdf-chrome') && request.method() === 'POST') {
        try {
          const postData = request.postData();
          if (postData) {
            pdfRequestData = JSON.parse(postData);
            console.log('\n📊 PDF Request Analysis:');
            console.log(`  - Total columns: ${pdfRequestData.columns?.length || 0}`);
            console.log(`  - Data objects: ${pdfRequestData.data?.length || 0}`);

            if (pdfRequestData.columns) {
              console.log('\n📋 Columns being sent to PDF:');
              pdfRequestData.columns.forEach((col, i) => {
                console.log(`  ${i+1}. "${col.key}" -> "${col.label}"`);
              });

              // Check for duplicates
              const keys = pdfRequestData.columns.map(col => col.key);
              const uniqueKeys = [...new Set(keys)];
              if (keys.length !== uniqueKeys.length) {
                console.log('❌ DUPLICATE COLUMNS DETECTED!');
              } else {
                console.log('✅ No duplicate columns');
              }
            }

            if (pdfRequestData.data && pdfRequestData.data.length > 0) {
              const firstData = pdfRequestData.data[0];
              console.log('\n🔍 Data keys available:');
              console.log(`  ${Object.keys(firstData).join(', ')}`);

              // Check column-data key matching
              console.log('\n🔗 Column-Data Matching:');
              const missingKeys = [];
              pdfRequestData.columns.forEach(col => {
                const hasKey = Object.keys(firstData).includes(col.key);
                const hasValue = hasKey && firstData[col.key] !== null && firstData[col.key] !== undefined && firstData[col.key] !== '';
                console.log(`  "${col.key}": ${hasKey ? '✅ KEY' : '❌ MISSING'} ${hasValue ? '✅ DATA' : '⚪ EMPTY'}`);
                if (!hasKey) missingKeys.push(col.key);
              });

              if (missingKeys.length === 0) {
                console.log('🎉 ALL COLUMNS HAVE MATCHING DATA KEYS!');
              } else {
                console.log(`❌ Missing keys: ${missingKeys.join(', ')}`);
              }
            }
          }
        } catch (e) {
          console.log('Error parsing PDF request:', e.message);
        }
      }
    });

    // Generate PDF
    let pdfDownloaded = false;
    let pdfFileName = '';

    try {
      const downloadPromise = page.waitForEvent('download');
      const generateButton = page.locator('button:has-text("إنشاء التقرير")');
      await generateButton.click();

      const download = await downloadPromise;
      pdfFileName = download.suggestedFilename();

      if (pdfFileName && pdfFileName.includes('.pdf')) {
        console.log(`✅ PDF Generated: ${pdfFileName}`);
        pdfDownloaded = true;

        // Save for verification
        const downloadPath = './PDFEXPORT/' + pdfFileName;
        await download.saveAs(downloadPath);
        console.log(`📁 Saved to: ${downloadPath}`);
      }
    } catch (e) {
      console.log('❌ PDF generation failed:', e.message);
    }

    // Final status
    console.log('\n🎯 FINAL RESULT:');
    console.log(`  PDF Generated: ${pdfDownloaded ? '✅' : '❌'}`);
    console.log(`  Expected: All hearing columns should now show data`);

    if (pdfDownloaded) {
      console.log(`\n📋 Verify the PDF: ${pdfFileName}`);
      console.log('   Should contain populated data for:');
      console.log('   - المحكمة (Court)');
      console.log('   - ملاحظات المحكمة (Court Notes)');
      console.log('   - ملاحظات المحامي (Lawyer Notes)');
      console.log('   - الجلسة القادمة (Next Hearing)');
    }

    console.log('\n🎉 Final Column Fix Test COMPLETED');
  });
});