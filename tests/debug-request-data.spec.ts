import { test, expect } from '@playwright/test';

test.describe('Debug Request Data', () => {
  test('should show the exact request data being sent', async ({ page }) => {
    console.log('🔍 DEBUG: Request data analysis');

    let requestData = null;

    // Intercept the PDF request
    page.on('request', async (request) => {
      if (request.url().includes('/api/export/pdf-chrome') && request.method() === 'POST') {
        try {
          const postData = request.postData();
          if (postData) {
            requestData = JSON.parse(postData);
            console.log('\n🔍 === REQUEST DATA ANALYSIS ===');
            console.log('📊 Total columns in request:', requestData.columns?.length || 0);
            console.log('📊 Data objects count:', requestData.data?.length || 0);

            console.log('\n📋 All Columns Sent:');
            requestData.columns?.forEach((col, index) => {
              console.log(`  ${index + 1}. key:"${col.key}" label:"${col.label}"`);
            });

            if (requestData.data?.length > 0) {
              const dataKeys = Object.keys(requestData.data[0]);
              console.log('\n📊 Data Keys Available:');
              dataKeys.forEach((key, index) => {
                console.log(`  ${index + 1}. "${key}"`);
              });

              console.log('\n🔍 Matching Analysis:');
              requestData.columns?.forEach((col, index) => {
                const matches = dataKeys.includes(col.key);
                console.log(`  ${index + 1}. "${col.key}" → ${matches ? '✅ MATCH' : '❌ NO MATCH'}`);
              });
            }
          }
        } catch (e) {
          console.log('Error parsing request data:', e.message);
        }
      }
    });

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
    await page.waitForTimeout(1000);

    // Select only 3 specific columns to make it clear
    const checkboxes = page.locator('input[type="checkbox"]');
    const totalCheckboxes = await checkboxes.count();

    // First, uncheck all
    for (let i = 0; i < totalCheckboxes; i++) {
      const isChecked = await checkboxes.nth(i).isChecked();
      if (isChecked) {
        await checkboxes.nth(i).uncheck();
      }
    }

    // Check exactly 3: hearing_date, hearing_type, hearing_result
    for (let i = 0; i < Math.min(3, totalCheckboxes); i++) {
      await checkboxes.nth(i).check();
    }

    console.log(`✅ Selected exactly 3 columns`);

    // Set date range
    const dateFromInput = page.locator('input[type="date"]').first();
    const dateToInput = page.locator('input[type="date"]').last();
    await dateFromInput.fill('2025-09-01');
    await dateToInput.fill('2025-10-31');

    // Generate PDF
    const generateButton = page.locator('button:has-text("إنشاء التقرير")');
    await generateButton.click();
    await page.waitForTimeout(3000);

    if (requestData) {
      console.log('\n✅ Request data captured successfully');
    } else {
      console.log('\n❌ No request data captured');
    }

    console.log('\n🎉 Request Data Analysis COMPLETED');
  });
});