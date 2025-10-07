import { test, expect } from '@playwright/test';

test.describe('Debug Timing Issue', () => {
  test('Check if API calls complete before modal shows', async ({ page }) => {
    console.log('🧪 DEBUGGING: API call timing in modal');

    // Track API calls with detailed timing
    const apiCalls: Array<{ call: string; time: number }> = [];
    let startTime = 0;

    page.on('request', (request) => {
      if (request.url().includes('/api/clients') || request.url().includes('/api/cases')) {
        const call = `📡 API Request: ${request.method()} ${request.url()}`;
        console.log(call);
        apiCalls.push({ call, time: Date.now() - startTime });
      }
    });

    page.on('response', (response) => {
      if (response.url().includes('/api/clients') || response.url().includes('/api/cases')) {
        const call = `📡 API Response: ${response.status()} ${response.url()}`;
        console.log(call);
        apiCalls.push({ call, time: Date.now() - startTime });
      }
    });

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    // Navigate to invoices page
    await page.goto('/invoices', { waitUntil: 'networkidle' });
    console.log('✅ Navigated to invoices page');
    await page.waitForTimeout(3000);

    // Start timing from when we click the view button
    startTime = Date.now();
    console.log(`⏰ Starting timer at: ${startTime}`);

    // Click view button
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    console.log(`⏰ Clicked view button at: ${Date.now() - startTime}ms`);

    // Check modal visibility immediately
    await page.waitForTimeout(100);
    const modalVisibleImmediately = await page.locator('[role="dialog"]').isVisible();
    console.log(
      `📋 Modal visible immediately (100ms): ${modalVisibleImmediately} at ${Date.now() - startTime}ms`
    );

    // Check dropdown options immediately if modal is visible
    if (modalVisibleImmediately) {
      const clientOptions = await page
        .locator('[role="dialog"] select')
        .first()
        .locator('option')
        .count();
      const caseOptions = await page
        .locator('[role="dialog"] select')
        .nth(1)
        .locator('option')
        .count();
      console.log(`👥 Client options immediately: ${clientOptions} at ${Date.now() - startTime}ms`);
      console.log(`📁 Case options immediately: ${caseOptions} at ${Date.now() - startTime}ms`);
    }

    // Wait a bit more and check again
    await page.waitForTimeout(2000);
    const modalVisibleAfterWait = await page.locator('[role="dialog"]').isVisible();
    console.log(
      `📋 Modal visible after 2s wait: ${modalVisibleAfterWait} at ${Date.now() - startTime}ms`
    );

    if (modalVisibleAfterWait) {
      const clientOptionsAfter = await page
        .locator('[role="dialog"] select')
        .first()
        .locator('option')
        .count();
      const caseOptionsAfter = await page
        .locator('[role="dialog"] select')
        .nth(1)
        .locator('option')
        .count();
      console.log(
        `👥 Client options after wait: ${clientOptionsAfter} at ${Date.now() - startTime}ms`
      );
      console.log(`📁 Case options after wait: ${caseOptionsAfter} at ${Date.now() - startTime}ms`);

      // Get actual option texts to see what we have
      const clientTexts = await page
        .locator('[role="dialog"] select')
        .first()
        .locator('option')
        .allTextContents();
      const caseTexts = await page
        .locator('[role="dialog"] select')
        .nth(1)
        .locator('option')
        .allTextContents();
      console.log(`👥 Client option texts: ${clientTexts.slice(0, 3)}`);
      console.log(`📁 Case option texts: ${caseTexts.slice(0, 3)}`);

      // Close modal
      const closeButton = page.getByRole('button', { name: 'إغلاق' });
      await closeButton.click();
    }

    // Print timing analysis
    console.log('\n⏰ API Call Timing:');
    for (const apiCall of apiCalls) {
      console.log(`   ${apiCall.time}ms: ${apiCall.call}`);
    }

    console.log('\n📊 TIMING DEBUG COMPLETE');
  });
});
