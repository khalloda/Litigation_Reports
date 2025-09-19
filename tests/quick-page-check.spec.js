const { test, expect } = require('@playwright/test');

test.describe('Quick Page Verification', () => {

  test('All requested pages should load successfully', async ({ page }) => {
    const testUrls = [
      { url: 'http://lit.local/clients', name: 'Clients' },
      { url: 'http://lit.local/cases', name: 'Cases' },
      { url: 'http://lit.local/hearings', name: 'Hearings' },
      { url: 'http://lit.local/reports', name: 'Reports' }
    ];

    const results = [];

    for (const { url, name } of testUrls) {
      console.log(`Testing ${name} page: ${url}`);

      try {
        // Navigate to page
        const response = await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });

        // Check if page loaded (HTTP 200)
        const status = response.status();
        const success = status === 200;

        // Wait a moment for React to render
        await page.waitForTimeout(2000);

        // Check for "Coming Soon" (should not exist)
        const hasComingSoon = await page.locator('text=Coming Soon').isVisible().catch(() => false);

        // Check for main heading
        const hasHeading = await page.locator('h1, h2').count() > 0;

        // Check for page content
        const hasContent = await page.locator('body').textContent();
        const hasArabic = hasContent.includes('إدارة') || hasContent.includes('العملاء') ||
                         hasContent.includes('القضايا') || hasContent.includes('الجلسات') ||
                         hasContent.includes('التقارير');

        const result = {
          name,
          url,
          httpStatus: status,
          pageLoaded: success,
          noComingSoon: !hasComingSoon,
          hasHeading,
          hasArabicContent: hasArabic,
          success: success && !hasComingSoon && hasHeading
        };

        results.push(result);

        if (result.success) {
          console.log(`✅ ${name} page: PASSED`);
        } else {
          console.log(`❌ ${name} page: FAILED`);
          console.log(`   HTTP Status: ${status}`);
          console.log(`   Has "Coming Soon": ${hasComingSoon}`);
          console.log(`   Has Heading: ${hasHeading}`);
        }

      } catch (error) {
        console.log(`❌ ${name} page: ERROR - ${error.message}`);
        results.push({
          name,
          url,
          success: false,
          error: error.message
        });
      }
    }

    // Summary
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    console.log('\n=== SUMMARY ===');
    console.log(`Successful pages: ${successCount}/${totalCount}`);

    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.name}: ${result.url}`);
    });

    // Expect all pages to be successful
    expect(successCount).toBe(totalCount);
  });
});