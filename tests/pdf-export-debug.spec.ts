import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('PDF Export Debug', () => {
  test('Debug PDF Export Frontend Issues', async ({ page }) => {
    console.log('🔍 Debugging PDF export frontend issues...');

    // Capture console logs and errors
    page.on('console', (msg) => {
      console.log(`🖥️  Console ${msg.type()}: ${msg.text()}`);
    });

    page.on('pageerror', (error) => {
      console.log(`❌ Page error: ${error.message}`);
    });

    // Navigate and login
    await page.goto(BASE_URL);
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Navigate to Clients page
    await page.click('a[href="/clients"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if clients data is loaded
    const clientCount = await page.locator('tbody tr').count();
    console.log(`📊 Found ${clientCount} client rows`);

    // Check export dropdown state
    const exportDropdown = page.locator('button').filter({ hasText: 'تصدير' });
    const isDropdownDisabled = await exportDropdown.getAttribute('disabled');
    console.log(`🔘 Export dropdown disabled: ${isDropdownDisabled !== null}`);

    if (isDropdownDisabled) {
      console.log('❌ Export dropdown is disabled - likely no data available');
      return;
    }

    // Intercept all network requests
    const networkCalls = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/')) {
        networkCalls.push(`📡 Request: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', (response) => {
      if (response.url().includes('/api/')) {
        networkCalls.push(`📡 Response: ${response.status()} ${response.url()}`);
      }
    });

    // Click dropdown
    await exportDropdown.click();
    await page.waitForTimeout(500);
    console.log('✅ Clicked export dropdown');

    // Check if PDF option is clickable
    const pdfOption = page.locator('a.dropdown-item').filter({ hasText: 'تصدير PDF' });
    await expect(pdfOption).toBeVisible();

    const pdfOptionClass = await pdfOption.getAttribute('class');
    console.log(`🔘 PDF option classes: ${pdfOptionClass}`);

    // Click PDF option with console monitoring
    console.log('🖱️  Clicking PDF export option...');
    await pdfOption.click();

    // Wait and check for any network activity
    await page.waitForTimeout(5000);

    console.log('📡 Network calls made:');
    networkCalls.forEach((call) => console.log(call));

    // Check for any toast messages or alerts
    const toastMessages = await page.locator('.toast, .alert, [role="alert"]').count();
    if (toastMessages > 0) {
      const toastText = await page.locator('.toast, .alert, [role="alert"]').first().textContent();
      console.log(`🍞 Toast/Alert message: ${toastText}`);
    }

    // Check browser console for export-related messages
    await page.evaluate(() => {
      console.log('🔍 Export function state check...');
      // Check if exportToPDF function exists
      if (typeof window.exportToPDF !== 'undefined') {
        console.log('✅ exportToPDF function exists globally');
      } else {
        console.log('❌ exportToPDF function not found globally');
      }
    });

    console.log('🔍 Debug test completed');
  });

  test('Check Data Availability', async ({ page }) => {
    console.log('📊 Checking data availability for export...');

    await page.goto(BASE_URL);
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Navigate to Clients page
    await page.click('a[href="/clients"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check table data
    const hasTable = (await page.locator('table').count()) > 0;
    const rowCount = await page.locator('tbody tr').count();
    const hasNoDataMessage = (await page.locator(':has-text("لا يوجد عملاء")').count()) > 0;

    console.log(`📋 Has table: ${hasTable}`);
    console.log(`📊 Row count: ${rowCount}`);
    console.log(`🚫 No data message: ${hasNoDataMessage}`);

    // Check export button state
    const exportButton = page.locator('button').filter({ hasText: 'تصدير' });
    const isDisabled = await exportButton.getAttribute('disabled');
    console.log(`🔘 Export button disabled: ${isDisabled !== null}`);

    if (rowCount === 0) {
      console.log('❌ No client data available for export');
    } else {
      console.log(`✅ ${rowCount} clients available for export`);
    }
  });
});
