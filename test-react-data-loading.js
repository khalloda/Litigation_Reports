import { chromium } from 'playwright';

async function testReactDataLoading() {
  console.log('🔍 Testing React Data Loading...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to console messages
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('❌ CONSOLE ERROR:', msg.text());
    } else if (msg.type() === 'warning') {
      console.log('⚠️  CONSOLE WARNING:', msg.text());
    }
  });

  try {
    // Navigate to the frontend
    console.log('1. Navigating to frontend...');
    await page.goto('http://lit.local:3001');
    await page.waitForLoadState('networkidle');

    // Clear any existing session
    console.log('2. Clearing session...');
    await context.clearCookies();
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Login
    console.log('3. Logging in...');
    const loginForm = await page.locator('form').first();
    if (await loginForm.isVisible()) {
      await page.fill('input[type="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      console.log('   ✅ Login successful');
    }

    // Navigate to Cases page
    console.log('\n4. Navigating to Cases page...');
    const casesLink = await page.locator('a:has-text("القضايا")');
    await casesLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check if cases table is visible
    console.log('\n5. Checking cases table visibility...');
    const tableVisible = await page.locator('table').isVisible();
    console.log(`   📊 Table visible: ${tableVisible}`);

    // Check if there are any cases in the table
    const tableRows = await page.locator('table tbody tr').count();
    console.log(`   📊 Table rows: ${tableRows}`);

    // Check if there's an empty state
    const emptyState = await page.locator('.text-muted:has-text("لا توجد قضايا")').isVisible();
    console.log(`   📊 Empty state visible: ${emptyState}`);

    // Check if there are any error messages
    const errorMessage = await page.locator('.alert-danger').isVisible();
    console.log(`   📊 Error message visible: ${errorMessage}`);

    if (errorMessage) {
      const errorText = await page.locator('.alert-danger').textContent();
      console.log(`   📝 Error message: ${errorText}`);
    }

    // Check if there are any loading spinners
    const loadingSpinner = await page.locator('.spinner-border').isVisible();
    console.log(`   📊 Loading spinner visible: ${loadingSpinner}`);

    // Test the API service directly in the React context
    console.log('\n6. Testing API service in React context...');
    const apiTest = await page.evaluate(async () => {
      try {
        const { apiService } = await import('/src/services/api.ts');

        // Check if token is available
        const token = localStorage.getItem('auth_token');
        console.log('Token available:', !!token);

        // Test API call
        const response = await apiService.get('/cases?page=1&limit=10');
        console.log('API response:', response);

        return {
          success: true,
          hasToken: !!token,
          response: response,
        };
      } catch (error) {
        console.error('API test failed:', error);
        return {
          success: false,
          error: error.message,
        };
      }
    });

    if (apiTest.success) {
      console.log(`   ✅ API service working in React context`);
      console.log(`   🔑 Token available: ${apiTest.hasToken}`);
      if (apiTest.response && apiTest.response.success) {
        console.log(`   📊 Data count: ${apiTest.response.data?.data?.length || 0}`);
      }
    } else {
      console.log(`   ❌ API service failed: ${apiTest.error}`);
    }

    // Take screenshot
    console.log('\n7. Taking screenshot...');
    await page.screenshot({ path: 'react-data-loading-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as react-data-loading-test.png');
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }

  console.log('\n🎉 React data loading testing completed!');
}

testReactDataLoading().catch(console.error);
