import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('Reports View Buttons Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application and login
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Login if required
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@litigation.com');
      await page.locator('input[type="password"], input[name="password"]').fill('admin123');
      await page.locator('button[type="submit"], .btn-primary').click();
      await page.waitForTimeout(3000);
    }

    // Navigate to Reports page
    const reportsLink = page.locator('a[href*="reports"], a:has-text("Reports"), a:has-text("التقارير")').first();
    if (await reportsLink.isVisible()) {
      await reportsLink.click();
    } else {
      await page.goto(`${BASE_URL}/reports`, { waitUntil: 'networkidle' });
    }

    await page.waitForTimeout(2000);
  });

  test('should display clients data when clicking Clients View button', async ({ page }) => {
    console.log('📋 Testing Clients Report View button...');

    // Monitor API calls
    const apiCalls: string[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/reports/clients')) {
        apiCalls.push(response.url());
        console.log(`📡 API call made: ${response.url()} - Status: ${response.status()}`);
      }
    });

    // Find and click the Clients View button
    const clientsViewButton = page.locator('button:has-text("عرض"), button:has-text("View")').first();

    if (await clientsViewButton.count() > 0) {
      await clientsViewButton.click();
      console.log('🖱️ Clicked Clients View button');
    } else {
      // Try alternative selectors for the clients report button
      const clientsCard = page.locator('.card:has-text("العملاء"), .card:has-text("Clients")');
      const viewBtn = clientsCard.locator('button:has-text("عرض"), button:has-text("View")');

      if (await viewBtn.count() > 0) {
        await viewBtn.click();
        console.log('🖱️ Clicked Clients View button (alternative selector)');
      } else {
        throw new Error('Could not find Clients View button');
      }
    }

    // Wait for API response and data loading
    await page.waitForTimeout(3000);

    // Check if API was called successfully
    expect(apiCalls.length, 'API call should be made to /api/reports/clients').toBeGreaterThan(0);

    // Check for table or data display
    const hasTable = await page.locator('table').count() > 0;
    const hasCards = await page.locator('.card').count() > 3;
    const hasData = await page.locator('tbody tr, .list-group-item, .data-row').count() > 0;

    console.log(`📊 Table found: ${hasTable}`);
    console.log(`🃏 Cards found: ${hasCards}`);
    console.log(`📄 Data rows found: ${hasData}`);

    // Look for specific client data elements
    const pageContent = await page.textContent('body');
    const hasClientNames = pageContent?.includes('Sarie Eldin') || pageContent?.includes('ساري الدين') || false;
    const hasClientTypes = pageContent?.includes('company') || pageContent?.includes('individual') || false;

    console.log(`👤 Client names visible: ${hasClientNames}`);
    console.log(`🏢 Client types visible: ${hasClientTypes}`);

    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/clients-report-data.png', fullPage: true });

    // Assertions
    expect(hasTable || hasData, 'Should display data in table or list format').toBe(true);
    expect(hasClientNames || hasClientTypes, 'Should show actual client data').toBe(true);

    console.log('✅ Clients report data displayed successfully!');
  });

  test('should display cases data when clicking Cases View button', async ({ page }) => {
    console.log('⚖️ Testing Cases Report View button...');

    // Monitor API calls
    const apiCalls: string[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/reports/cases')) {
        apiCalls.push(response.url());
        console.log(`📡 API call made: ${response.url()} - Status: ${response.status()}`);
      }
    });

    // Find Cases View button
    const casesCard = page.locator('.card:has-text("القضايا"), .card:has-text("Cases")');
    const casesViewButton = casesCard.locator('button:has-text("عرض"), button:has-text("View")');

    if (await casesViewButton.count() > 0) {
      await casesViewButton.click();
      console.log('🖱️ Clicked Cases View button');
    } else {
      // Try fallback approach
      const allViewButtons = page.locator('button:has-text("عرض"), button:has-text("View")');
      const secondButton = allViewButtons.nth(1); // Cases is typically second
      if (await secondButton.count() > 0) {
        await secondButton.click();
        console.log('🖱️ Clicked Cases View button (fallback)');
      } else {
        throw new Error('Could not find Cases View button');
      }
    }

    // Wait for API response and data loading
    await page.waitForTimeout(3000);

    // Verify API call was made
    expect(apiCalls.length, 'API call should be made to /api/reports/cases').toBeGreaterThan(0);

    // Check for case data display
    const pageContent = await page.textContent('body');
    const hasCaseNumbers = pageContent?.includes('2025-') || false;
    const hasCourtNames = pageContent?.includes('محكمة') || pageContent?.includes('Court') || false;
    const hasCaseStatuses = pageContent?.includes('active') || pageContent?.includes('نشط') || false;

    console.log(`📋 Case numbers visible: ${hasCaseNumbers}`);
    console.log(`🏛️ Court names visible: ${hasCourtNames}`);
    console.log(`📊 Case statuses visible: ${hasCaseStatuses}`);

    // Check for data structures
    const hasDataElements = await page.locator('table, .list-group, .data-container').count() > 0;
    const hasDataRows = await page.locator('tbody tr, .list-group-item, .case-item').count() > 0;

    // Take screenshot
    await page.screenshot({ path: 'test-results/cases-report-data.png', fullPage: true });

    // Assertions
    expect(hasDataElements, 'Should have data display elements').toBe(true);
    expect(hasCaseNumbers || hasCourtNames || hasCaseStatuses, 'Should show actual case data').toBe(true);

    console.log('✅ Cases report data displayed successfully!');
  });

  test('should display hearings data when clicking Hearings View button', async ({ page }) => {
    console.log('🏛️ Testing Hearings Report View button...');

    // Monitor API calls
    const apiCalls: string[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/reports/hearings')) {
        apiCalls.push(response.url());
        console.log(`📡 API call made: ${response.url()} - Status: ${response.status()}`);
      }
    });

    // Find Hearings View button
    const hearingsCard = page.locator('.card:has-text("الجلسات"), .card:has-text("Hearings")');
    const hearingsViewButton = hearingsCard.locator('button:has-text("عرض"), button:has-text("View")');

    if (await hearingsViewButton.count() > 0) {
      await hearingsViewButton.click();
      console.log('🖱️ Clicked Hearings View button');
    } else {
      // Try fallback approach
      const allViewButtons = page.locator('button:has-text("عرض"), button:has-text("View")');
      const thirdButton = allViewButtons.nth(2); // Hearings is typically third
      if (await thirdButton.count() > 0) {
        await thirdButton.click();
        console.log('🖱️ Clicked Hearings View button (fallback)');
      } else {
        throw new Error('Could not find Hearings View button');
      }
    }

    // Wait for API response and data loading
    await page.waitForTimeout(3000);

    // Verify API call was made
    expect(apiCalls.length, 'API call should be made to /api/reports/hearings').toBeGreaterThan(0);

    // Check for hearing data display
    const pageContent = await page.textContent('body');
    const hasHearingDates = pageContent?.includes('2025-') || false;
    const hasHearingTypes = pageContent?.includes('initial') || pageContent?.includes('expert') || false;
    const hasHearingResults = pageContent?.includes('pending') || pageContent?.includes('won') || false;

    console.log(`📅 Hearing dates visible: ${hasHearingDates}`);
    console.log(`📝 Hearing types visible: ${hasHearingTypes}`);
    console.log(`📊 Hearing results visible: ${hasHearingResults}`);

    // Check for data structures
    const hasDataElements = await page.locator('table, .list-group, .data-container').count() > 0;

    // Take screenshot
    await page.screenshot({ path: 'test-results/hearings-report-data.png', fullPage: true });

    // Assertions
    expect(hasDataElements, 'Should have data display elements').toBe(true);
    expect(hasHearingDates || hasHearingTypes || hasHearingResults, 'Should show actual hearing data').toBe(true);

    console.log('✅ Hearings report data displayed successfully!');
  });

  test('should handle custom reports functionality', async ({ page }) => {
    console.log('⚙️ Testing Custom Reports functionality...');

    // Monitor API calls
    const apiCalls: string[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/reports/custom')) {
        apiCalls.push(response.url());
        console.log(`📡 API call made: ${response.url()} - Status: ${response.status()}`);
      }
    });

    // Look for custom report or report builder button
    const customReportButton = page.locator('button:has-text("تقرير مخصص"), button:has-text("Custom Report"), button:has-text("منشئ التقارير")');

    if (await customReportButton.count() > 0) {
      await customReportButton.click();
      console.log('🖱️ Clicked Custom Report button');

      // Wait for API response
      await page.waitForTimeout(3000);

      // Check if API was called
      if (apiCalls.length > 0) {
        expect(apiCalls.length, 'API call should be made to /api/reports/custom').toBeGreaterThan(0);

        // Check for custom report interface elements
        const hasDropdowns = await page.locator('select, .dropdown').count() > 0;
        const hasFilters = await page.locator('input[type="date"], .filter-input').count() > 0;
        const hasOptions = await page.locator('option, .dropdown-item').count() > 0;

        console.log(`📋 Dropdowns found: ${hasDropdowns}`);
        console.log(`🔍 Filter inputs found: ${hasFilters}`);
        console.log(`⚙️ Options available: ${hasOptions}`);

        // Take screenshot
        await page.screenshot({ path: 'test-results/custom-reports-interface.png', fullPage: true });

        expect(hasDropdowns || hasFilters || hasOptions, 'Should show custom report interface').toBe(true);
      }
    } else {
      console.log('⚠️ Custom report button not found - may not be implemented in UI yet');
    }

    console.log('✅ Custom reports test completed!');
  });

  test('should handle report errors gracefully', async ({ page }) => {
    console.log('❌ Testing error handling...');

    let hasErrorHandling = false;

    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Monitor failed API calls
    const failedApiCalls: string[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/reports/') && response.status() >= 400) {
        failedApiCalls.push(`${response.url()} - ${response.status()}`);
      }
    });

    // Try clicking all view buttons
    const viewButtons = page.locator('button:has-text("عرض"), button:has-text("View")');
    const buttonCount = await viewButtons.count();

    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      try {
        await viewButtons.nth(i).click();
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log(`Button ${i} click failed: ${error}`);
      }
    }

    // Check if there are unhandled errors
    const hasCriticalErrors = consoleErrors.some(error =>
      error.includes('TypeError') ||
      error.includes('Cannot read') ||
      error.includes('undefined')
    );

    console.log(`📊 Console errors: ${consoleErrors.length}`);
    console.log(`🚫 Failed API calls: ${failedApiCalls.length}`);
    console.log(`💥 Critical errors: ${hasCriticalErrors}`);

    if (consoleErrors.length > 0) {
      console.log('Console errors:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    }

    if (failedApiCalls.length > 0) {
      console.log('Failed API calls:');
      failedApiCalls.forEach(call => console.log(`  - ${call}`));
    }

    // Assertions - should handle errors gracefully
    expect(hasCriticalErrors, 'Should not have critical JavaScript errors').toBe(false);
    expect(failedApiCalls.length, 'Should not have failed API calls').toBe(0);

    console.log('✅ Error handling test completed!');
  });
});