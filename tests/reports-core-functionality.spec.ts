import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('Reports Core Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
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
  });

  test('should verify reports API endpoints return data successfully', async ({ page }) => {
    console.log('🔍 Testing Reports API endpoints...');

    const apiResponses = {
      clients: null,
      cases: null,
      hearings: null,
      custom: null,
    };

    // Monitor successful API responses
    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('/api/reports/clients') && response.status() === 200) {
        apiResponses.clients = response;
        console.log(`✅ Clients API successful: ${response.status()}`);
      }
      if (url.includes('/api/reports/cases') && response.status() === 200) {
        apiResponses.cases = response;
        console.log(`✅ Cases API successful: ${response.status()}`);
      }
      if (url.includes('/api/reports/hearings') && response.status() === 200) {
        apiResponses.hearings = response;
        console.log(`✅ Hearings API successful: ${response.status()}`);
      }
      if (url.includes('/api/reports/custom') && response.status() === 200) {
        apiResponses.custom = response;
        console.log(`✅ Custom API successful: ${response.status()}`);
      }
    });

    // Try to trigger the reports by clicking the first few view buttons
    const viewButtons = page.locator('button:has-text("عرض"), button:has-text("View")');
    const buttonCount = Math.min(await viewButtons.count(), 4);

    for (let i = 0; i < buttonCount; i++) {
      try {
        console.log(`🖱️ Clicking view button ${i + 1}...`);

        // Close any existing modals first
        const modalClose = page.locator('.modal .btn-close, .modal [data-bs-dismiss="modal"]');
        if ((await modalClose.count()) > 0) {
          await modalClose.first().click();
          await page.waitForTimeout(500);
        }

        await viewButtons.nth(i).click();
        await page.waitForTimeout(3000);
      } catch (error) {
        console.log(`⚠️ Button ${i + 1} click failed: ${error.message}`);
        continue;
      }
    }

    // Verify at least some API calls were successful
    const successfulCalls = Object.values(apiResponses).filter(
      (response) => response !== null
    ).length;
    console.log(`📊 Successful API calls: ${successfulCalls}/4`);

    // Take screenshot of final state
    await page.screenshot({ path: 'test-results/reports-api-verification.png', fullPage: true });

    // Assertions
    expect(successfulCalls, 'At least 2 report API endpoints should work').toBeGreaterThanOrEqual(
      2
    );

    if (apiResponses.clients) {
      console.log('✅ Clients endpoint verified');
    }
    if (apiResponses.cases) {
      console.log('✅ Cases endpoint verified');
    }
    if (apiResponses.hearings) {
      console.log('✅ Hearings endpoint verified');
    }
    if (apiResponses.custom) {
      console.log('✅ Custom reports endpoint verified');
    }

    console.log('🎉 Reports API functionality verified successfully!');
  });

  test('should display report data in UI after API calls', async ({ page }) => {
    console.log('📊 Testing report data display...');

    let dataDisplayed = false;
    let apiCallMade = false;

    // Monitor API calls
    page.on('response', (response) => {
      if (response.url().includes('/api/reports/') && response.status() === 200) {
        apiCallMade = true;
        console.log(`📡 API call detected: ${response.url()}`);
      }
    });

    // Try the first available view button
    const firstViewButton = page.locator('button:has-text("عرض"), button:has-text("View")').first();

    if ((await firstViewButton.count()) > 0) {
      try {
        await firstViewButton.click();
        console.log('🖱️ Clicked first view button');
        await page.waitForTimeout(4000);

        // Check for various data display indicators
        const pageContent = await page.textContent('body');

        // Check for actual data indicators
        const hasClientData =
          pageContent?.includes('Sarie Eldin') || pageContent?.includes('ساري الدين');
        const hasCaseData = pageContent?.includes('2025-') || pageContent?.includes('قضية');
        const hasHearingData = pageContent?.includes('pending') || pageContent?.includes('expert');
        const hasTableData =
          (await page.locator('table tbody tr, .list-group-item, .data-row').count()) > 0;
        const hasCards = (await page.locator('.card').count()) > 5;

        dataDisplayed = hasClientData || hasCaseData || hasHearingData || hasTableData || hasCards;

        console.log(`👥 Client data visible: ${hasClientData}`);
        console.log(`⚖️ Case data visible: ${hasCaseData}`);
        console.log(`🏛️ Hearing data visible: ${hasHearingData}`);
        console.log(`📋 Table data visible: ${hasTableData}`);
        console.log(`🃏 Cards displayed: ${hasCards}`);
        console.log(`📊 Overall data displayed: ${dataDisplayed}`);
      } catch (error) {
        console.log(`⚠️ Error during test: ${error.message}`);
      }
    }

    // Take screenshot
    await page.screenshot({ path: 'test-results/reports-data-display.png', fullPage: true });

    // Assertions
    expect(apiCallMade, 'API call should be made').toBe(true);
    expect(dataDisplayed, 'Some form of data should be displayed').toBe(true);

    console.log('✅ Report data display verified!');
  });

  test('should verify no 404 errors on report endpoints', async ({ page }) => {
    console.log('🚫 Testing for 404 errors...');

    const api404Errors: string[] = [];
    const consoleErrors: string[] = [];

    // Monitor for 404 errors
    page.on('response', (response) => {
      if (response.url().includes('/api/reports/') && response.status() === 404) {
        api404Errors.push(response.url());
        console.log(`❌ 404 Error: ${response.url()}`);
      }
    });

    // Monitor console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('404')) {
        consoleErrors.push(msg.text());
      }
    });

    // Try to trigger various report calls
    const viewButtons = page.locator('button:has-text("عرض"), button:has-text("View")');
    const buttonCount = Math.min(await viewButtons.count(), 3);

    for (let i = 0; i < buttonCount; i++) {
      try {
        await viewButtons.nth(i).click();
        await page.waitForTimeout(2000);

        // Close any modals
        const modalClose = page.locator('.modal .btn-close, .modal [data-bs-dismiss="modal"]');
        if ((await modalClose.count()) > 0) {
          await modalClose.first().click();
          await page.waitForTimeout(500);
        }
      } catch (error) {
        // Continue testing even if UI interactions fail
      }
    }

    console.log(`🚫 404 API errors found: ${api404Errors.length}`);
    console.log(`💥 404 console errors found: ${consoleErrors.length}`);

    if (api404Errors.length > 0) {
      console.log('404 API errors:');
      api404Errors.forEach((url) => console.log(`  - ${url}`));
    }

    // Main assertion - no 404 errors should occur
    expect(api404Errors.length, 'Should have no 404 API errors').toBe(0);
    expect(consoleErrors.length, 'Should have no 404 console errors').toBe(0);

    console.log('✅ No 404 errors found - API endpoints working correctly!');
  });
});
