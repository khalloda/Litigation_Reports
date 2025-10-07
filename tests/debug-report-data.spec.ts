import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('Debug Report Data', () => {
  test('should debug what data is actually being received', async ({ page }) => {
    // Navigate and login
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const emailInput = page.locator('input[type="email"], input[name="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@litigation.com');
      await page.locator('input[type="password"], input[name="password"]').fill('admin123');
      await page.locator('button[type="submit"], .btn-primary').click();
      await page.waitForTimeout(3000);
    }

    // Navigate to Reports page
    await page.goto(`${BASE_URL}/reports`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Monitor network responses to see exactly what data is being returned
    const apiResponses: any[] = [];
    page.on('response', async (response) => {
      if (response.url().includes('/api/reports/clients') && response.status() === 200) {
        try {
          const responseData = await response.json();
          apiResponses.push({
            url: response.url(),
            status: response.status(),
            data: responseData,
          });
          console.log('📡 API Response received:');
          console.log('URL:', response.url());
          console.log('Status:', response.status());
          console.log('Response structure:', Object.keys(responseData));
          if (responseData.data) {
            console.log('Data array length:', responseData.data.length);
            if (responseData.data.length > 0) {
              console.log('First data item keys:', Object.keys(responseData.data[0]));
              console.log('First data item sample:', JSON.stringify(responseData.data[0], null, 2));
            }
          }
          if (responseData.summary) {
            console.log('Summary:', JSON.stringify(responseData.summary, null, 2));
          }
          if (responseData.available_columns) {
            console.log('Available columns:', Object.keys(responseData.available_columns));
          }
        } catch (error) {
          console.log('Error parsing response:', error);
        }
      }
    });

    // Click the first view button (clients)
    const clientsViewButton = page.locator('button:has-text("عرض")').first();
    await clientsViewButton.click();
    console.log('🖱️ Clicked Clients View button');

    // Wait for modal and data
    await page.waitForSelector('.modal', { timeout: 10000 });
    await page.waitForTimeout(5000);

    // Debug: Check what's actually in the table HTML
    const tableExists = (await page.locator('.table-responsive table').count()) > 0;
    if (tableExists) {
      console.log('📊 Table HTML structure:');

      // Get table headers
      const headers = await page.locator('table thead th').allTextContents();
      console.log('Table headers:', headers);

      // Get table rows content
      const rows = await page.locator('table tbody tr').count();
      console.log('Number of rows:', rows);

      if (rows > 0) {
        // Get first row content
        const firstRowCells = await page
          .locator('table tbody tr')
          .first()
          .locator('td')
          .allTextContents();
        console.log('First row cells:', firstRowCells);

        // Get the entire table text
        const tableText = await page.locator('table').textContent();
        console.log('Full table text:');
        console.log(tableText);
      }
    }

    // Debug: Check what's in the summary section
    const summaryExists = (await page.locator('h6:has-text("ملخص التقرير")').count()) > 0;
    if (summaryExists) {
      const summarySection = await page
        .locator('.card-body:has(h6:has-text("ملخص التقرير"))')
        .textContent();
      console.log('📊 Summary section content:');
      console.log(summarySection);
    }

    // Take a screenshot
    await page.screenshot({ path: 'test-results/debug-report-data.png', fullPage: true });

    // Log any console errors from the page
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    if (consoleMessages.length > 0) {
      console.log('❌ Console errors:');
      consoleMessages.forEach((msg) => console.log('  -', msg));
    }

    // Verify we got API response data
    expect(apiResponses.length, 'Should have received API response').toBeGreaterThan(0);

    console.log('🔍 Debug test completed. Check console output for details.');
  });
});
