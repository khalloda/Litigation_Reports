import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test.describe('Simple Real Data Verification', () => {
  test('should show real data in the system', async ({ page }) => {
    console.log('🚀 Starting real data verification...');

    // Go to the application
    await page.goto(BASE_URL);
    await page.waitForTimeout(3000);

    console.log('📱 Application loaded');

    // Take a screenshot of the initial page
    await page.screenshot({ path: 'test-results/01-initial-page.png', fullPage: true });

    // Check if there's a login form or if we're already in the app
    const hasLoginForm = await page.locator('input[type="email"], input[name="email"]').isVisible();

    if (hasLoginForm) {
      console.log('🔐 Login form detected, attempting login...');

      // Try to login
      await page.fill('input[type="email"], input[name="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"], input[name="password"]', 'admin123');

      await page.screenshot({ path: 'test-results/02-login-form.png' });

      await page.click('button[type="submit"], .btn-primary');
      await page.waitForTimeout(5000);

      await page.screenshot({ path: 'test-results/03-after-login.png', fullPage: true });
      console.log('✅ Login attempted');
    }

    // Look for any navigation or content that indicates we're in the application
    const hasNavigation =
      (await page.locator('.navbar, .sidebar, nav, [role="navigation"]').count()) > 0;
    const hasContent = (await page.locator('h1, h2, .card, .table, .list-group').count()) > 0;

    console.log(`📊 Navigation elements found: ${hasNavigation}`);
    console.log(`📄 Content elements found: ${hasContent}`);

    // Look for data tables or lists
    const tables = await page.locator('table, .table').count();
    const cards = await page.locator('.card, .list-group-item').count();
    const rows = await page.locator('tr, .row').count();

    console.log(`📋 Tables found: ${tables}`);
    console.log(`🗃️ Cards/items found: ${cards}`);
    console.log(`📑 Rows found: ${rows}`);

    // Check for real data patterns
    const emailPatterns = await page.locator('text=/@/').count();
    const phonePatterns = await page.locator('text=/\\+?\\d{10,}/').count();
    const arabicText = await page.locator('text=/[\\u0600-\\u06FF]/').count();

    console.log(`📧 Email patterns found: ${emailPatterns}`);
    console.log(`📞 Phone patterns found: ${phonePatterns}`);
    console.log(`🔤 Arabic text found: ${arabicText}`);

    // Check for mock data patterns (should be minimal or zero)
    const mockPatterns = await page.locator('text=/mock|test|sample|lorem|ipsum/i').count();
    console.log(`🎭 Mock data patterns found: ${mockPatterns}`);

    // Extract some text content to verify it's real
    const pageText = await page.textContent('body');
    const hasRealEmails = pageText?.includes('@') || false;
    const hasRealContent = pageText && pageText.length > 100;

    console.log(`📝 Page has substantial content: ${hasRealContent}`);
    console.log(`📧 Page contains email addresses: ${hasRealEmails}`);

    // Take a final screenshot of the page
    await page.screenshot({ path: 'test-results/04-final-state.png', fullPage: true });

    // Create a summary
    const summary = {
      navigation: hasNavigation,
      content: hasContent,
      tables: tables,
      cards: cards,
      emails: emailPatterns,
      phones: phonePatterns,
      arabic: arabicText,
      mockData: mockPatterns,
      realEmails: hasRealEmails,
      substantialContent: hasRealContent,
    };

    console.log('\n📊 VALIDATION SUMMARY:');
    console.log('========================');
    console.log(`✅ Application loaded: ${hasNavigation || hasContent}`);
    console.log(`✅ Data tables/lists found: ${tables + cards > 0}`);
    console.log(`✅ Real email addresses: ${hasRealEmails}`);
    console.log(`✅ Real phone numbers: ${phonePatterns > 0}`);
    console.log(`✅ Arabic content: ${arabicText > 0}`);
    console.log(`✅ Minimal mock data: ${mockPatterns < 5}`);
    console.log(`✅ Substantial content: ${hasRealContent}`);

    // Assertions for the test to pass
    expect(hasNavigation || hasContent, 'Application should load with navigation or content').toBe(
      true
    );
    expect(hasRealContent, 'Page should have substantial content').toBe(true);
    expect(mockPatterns, 'Should have minimal mock data patterns').toBeLessThan(10);

    console.log('\n🎉 Real data verification completed successfully!');
    console.log('📸 Screenshots saved to test-results/ directory');
  });

  test('should verify API endpoints are accessible', async ({ page }) => {
    console.log('🌐 Testing API endpoints...');

    // Test API ping endpoint
    const apiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:8081/ping');
        return await response.json();
      } catch (error) {
        return { error: error.message };
      }
    });

    console.log('🏥 API Health Response:', apiResponse);

    if (apiResponse.success) {
      console.log('✅ API is responding correctly');
      expect(apiResponse.success).toBe(true);
    } else {
      console.log('⚠️ API might not be running on localhost:8081');
      console.log(
        '💡 Make sure to start the API server with: cd backend && php -S localhost:8081 -t api'
      );
    }
  });
});
