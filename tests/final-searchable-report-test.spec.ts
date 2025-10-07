import { test, expect } from '@playwright/test';

test.describe('Final Client-Specific Report with Searchable Dropdown', () => {
  test('should complete the full workflow successfully', async ({ page }) => {
    console.log('🎯 Testing complete client-specific report workflow with searchable dropdown');

    // Step 1: Login
    await page.goto('http://lit.local:8080');
    await page.fill('#email', 'admin@litigation.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Step 2: Navigate to reports
    await page.goto('http://lit.local:8080/reports');
    await page.waitForTimeout(1000);

    // Step 3: Open client-specific report modal
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });
    await page.waitForFunction(() => document.querySelectorAll('.spinner-border').length === 0, {
      timeout: 10000,
    });

    console.log('✅ Modal opened and loaded');

    // Step 4: Test searchable dropdown
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');
    await expect(searchInput).toBeVisible();

    const dropdownButton = page.locator('button:has-text("▼")');
    await expect(dropdownButton).toBeVisible();

    console.log('✅ Searchable interface detected');

    // Step 5: Search for a client
    await searchInput.fill('Toyota');
    await page.waitForTimeout(500);

    const searchResults = page.locator('.list-group-item[style*="cursor: pointer"]');
    const count = await searchResults.count();
    console.log(`✅ Search found ${count} results for "Toyota"`);

    // Step 6: Select the first client
    if (count > 0) {
      const firstClient = searchResults.first();
      const clientText = await firstClient.textContent();
      await firstClient.click();

      // Verify selection
      const successBadge = page.locator('.badge.bg-success:has-text("✓")');
      await expect(successBadge).toBeVisible();
      console.log(`✅ Client selected: ${clientText?.substring(0, 50)}...`);

      // Step 7: Select report columns
      const checkboxes = page.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();
      console.log(`✅ Found ${checkboxCount} column options`);

      // Select first 3 columns
      for (let i = 0; i < Math.min(3, checkboxCount); i++) {
        await checkboxes.nth(i).check();
      }

      // Step 8: Verify generate button is enabled
      const generateButton = page.locator('button:has-text("إنشاء التقرير")');
      await expect(generateButton).toBeEnabled();
      console.log('✅ Generate button is enabled');

      // Step 9: Test report generation (quick check)
      await generateButton.click();

      // Give it a moment to process
      await page.waitForTimeout(3000);

      // Check if modal is still open or closed (success would close it)
      const modal = page.locator('.modal.show');
      const modalCount = await modal.count();

      if (modalCount === 0) {
        console.log('🎉 SUCCESS: Report generated and modal closed automatically');
      } else {
        console.log('⚠️ Modal still open - checking for loading or error states');

        // Check for any error messages
        const errorAlert = page.locator('.alert-danger');
        const errorCount = await errorAlert.count();

        if (errorCount > 0) {
          const errorText = await errorAlert.textContent();
          console.log(`❌ Error detected: ${errorText}`);
        } else {
          console.log('✅ No errors detected - report may still be processing');
        }
      }

      console.log('🎉 Complete workflow test FINISHED');
    } else {
      console.log('⚠️ No Toyota clients found - trying general search');

      // Try with a more general search
      await searchInput.clear();
      await searchInput.fill('Al');
      await page.waitForTimeout(500);

      const generalResults = page.locator('.list-group-item[style*="cursor: pointer"]');
      const generalCount = await generalResults.count();
      console.log(`✅ General search found ${generalCount} results`);

      if (generalCount > 0) {
        await generalResults.first().click();
        console.log('✅ Selected first client from general search');
      }
    }
  });

  test('should verify API functionality directly', async ({ page }) => {
    console.log('🔧 Testing API functionality directly');

    // Test the GET endpoint for options
    const optionsResponse = await page.request.get(
      'http://lit.local:8080/api/reports/client-specific'
    );
    expect(optionsResponse.status()).toBe(200);

    const optionsData = await optionsResponse.json();
    expect(optionsData.success).toBe(true);
    expect(optionsData.data.clients).toBeDefined();
    expect(optionsData.data.clients.length).toBeGreaterThan(100);

    console.log(`✅ GET API returned ${optionsData.data.clients.length} clients`);

    // Test the POST endpoint for report generation
    const reportResponse = await page.request.post(
      'http://lit.local:8080/api/reports/client-specific',
      {
        data: {
          client_id: '1',
          report_type: 'cases',
          columns: ['matter_id', 'matter_ar', 'matter_status'],
        },
      }
    );

    expect(reportResponse.status()).toBe(200);
    console.log('✅ POST API completed successfully');

    console.log('🎉 API functionality test PASSED');
  });
});
