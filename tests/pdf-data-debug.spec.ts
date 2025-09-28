import { test, expect } from '@playwright/test';

test.describe('PDF Data Flow Debug', () => {
  test('should intercept and analyze exact data passed to PDF generator', async ({ page }) => {
    console.log('🔍 DEBUGGING: Exact data flow to PDF generator');

    // Login first
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
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    for (let i = 0; i < checkboxCount; i++) {
      await checkboxes.nth(i).check();
    }

    // Set date range
    const dateFromInput = page.locator('input[type="date"]').first();
    const dateToInput = page.locator('input[type="date"]').last();
    await dateFromInput.fill('2025-09-01');
    await dateToInput.fill('2025-10-31');

    // Intercept the PDF generation request to see exactly what data is sent
    let pdfRequestData = null;

    page.on('request', async (request) => {
      if (request.url().includes('/api/export/pdf-chrome') && request.method() === 'POST') {
        try {
          const postData = request.postData();
          if (postData) {
            pdfRequestData = JSON.parse(postData);

            console.log('\n📡 ===== PDF GENERATION REQUEST INTERCEPTED =====');
            console.log('Request URL:', request.url());
            console.log('Request Method:', request.method());

            console.log('\n📊 PDF Request Data Structure:');
            console.log('  - data: array length =', pdfRequestData.data?.length || 0);
            console.log('  - columns: array length =', pdfRequestData.columns?.length || 0);
            console.log('  - title:', pdfRequestData.title || 'N/A');
            console.log('  - filename:', pdfRequestData.filename || 'N/A');

            if (pdfRequestData.data && pdfRequestData.data.length > 0) {
              console.log('\n🔍 First hearing data object:');
              const firstHearing = pdfRequestData.data[0];
              console.log('Keys in data:', Object.keys(firstHearing));

              Object.keys(firstHearing).forEach(key => {
                const value = firstHearing[key];
                const hasValue = value !== null && value !== undefined && value !== '';
                console.log(`  ${key}: ${hasValue ? '"' + String(value).substring(0, 30) + (String(value).length > 30 ? '...' : '') + '"' : 'EMPTY'}`);
              });
            }

            if (pdfRequestData.columns && pdfRequestData.columns.length > 0) {
              console.log('\n🏷️  Column mapping for PDF:');
              pdfRequestData.columns.forEach((col, index) => {
                console.log(`  ${index + 1}. key: "${col.key}" -> label: "${col.label}"`);
              });
            }

            // Cross-check data keys vs column keys
            if (pdfRequestData.data && pdfRequestData.data.length > 0 && pdfRequestData.columns) {
              console.log('\n🔗 KEY MATCHING ANALYSIS:');
              const dataKeys = Object.keys(pdfRequestData.data[0]);
              const columnKeys = pdfRequestData.columns.map(col => col.key);

              columnKeys.forEach(colKey => {
                const hasDataKey = dataKeys.includes(colKey);
                const dataValue = pdfRequestData.data[0][colKey];
                const hasValue = dataValue !== null && dataValue !== undefined && dataValue !== '';

                console.log(`  "${colKey}": ${hasDataKey ? '✅ KEY MATCH' : '❌ KEY MISSING'} ${hasValue ? '✅ HAS DATA' : '⚪ EMPTY'}`);

                if (hasDataKey && hasValue) {
                  console.log(`    Value: "${String(dataValue).substring(0, 50)}${String(dataValue).length > 50 ? '...' : ''}"`);
                } else if (!hasDataKey) {
                  console.log(`    Available keys: ${dataKeys.join(', ')}`);
                }
              });
            }
          }
        } catch (e) {
          console.log('Error parsing PDF request data:', e.message);
        }
      }
    });

    // Generate report
    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await generateButton.click();
    await page.waitForTimeout(5000);

    if (pdfRequestData) {
      console.log('\n🎯 ===== DIAGNOSIS =====');
      if (pdfRequestData.data && pdfRequestData.data.length > 0) {
        const firstData = pdfRequestData.data[0];
        const expectedColumns = ['hearing_date', 'hearing_type', 'hearing_result', 'matter_court', 'court_notes', 'lawyer_notes', 'next_hearing'];

        console.log('Expected columns vs actual data:');
        expectedColumns.forEach(expected => {
          const hasKey = Object.keys(firstData).includes(expected);
          const value = firstData[expected];
          const hasValue = value !== null && value !== undefined && value !== '';

          if (!hasKey) {
            console.log(`❌ MISSING: "${expected}" not found in data`);
          } else if (!hasValue) {
            console.log(`⚪ EMPTY: "${expected}" exists but has no value`);
          } else {
            console.log(`✅ GOOD: "${expected}" has value "${String(value).substring(0, 30)}${String(value).length > 30 ? '...' : ''}"`);
          }
        });
      }
    } else {
      console.log('❌ No PDF request data captured');
    }

    console.log('\n🎉 PDF Data Debug Test COMPLETED');
  });
});