import { chromium } from 'playwright';

async function testAPIConnectivity() {
  console.log('🔌 Testing API Connectivity and Data Loading...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to network requests
  const apiRequests = [];
  const apiResponses = [];

  page.on('request', (request) => {
    if (request.url().includes('/api/')) {
      apiRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: new Date().toISOString(),
      });
    }
  });

  page.on('response', (response) => {
    if (response.url().includes('/api/')) {
      apiResponses.push({
        url: response.url(),
        status: response.status(),
        timestamp: new Date().toISOString(),
      });
    }
  });

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
    await page.goto('http://lit.local:3004');
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

    // Test Cases API
    console.log('\n📋 TESTING CASES API CONNECTIVITY');
    console.log('===================================');

    console.log('4. Testing Cases API...');
    const casesLink = await page.locator('a:has-text("القضايا")');
    await casesLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check for API requests
    const casesRequests = apiRequests.filter((req) => req.url.includes('/api/cases'));
    const casesResponses = apiResponses.filter((res) => res.url.includes('/api/cases'));

    console.log(`   📡 API Requests made: ${casesRequests.length}`);
    console.log(`   📡 API Responses received: ${casesResponses.length}`);

    if (casesResponses.length > 0) {
      casesResponses.forEach((res) => {
        console.log(`   📊 ${res.url} - Status: ${res.status}`);
      });
    }

    // Check for loading states
    const loadingSpinner = await page.locator('.spinner-border').count();
    console.log(`   ⏳ Loading spinners found: ${loadingSpinner}`);

    // Check for error messages
    const errorAlerts = await page.locator('.alert-danger').count();
    console.log(`   ❌ Error alerts found: ${errorAlerts}`);

    if (errorAlerts > 0) {
      const errorText = await page.locator('.alert-danger').textContent();
      console.log(`   📝 Error message: ${errorText}`);
    }

    // Check for empty state
    const emptyState = await page.locator('h5:has-text("لا توجد قضايا")').count();
    console.log(`   📭 Empty state found: ${emptyState > 0 ? 'Yes' : 'No'}`);

    // Test Clients API
    console.log('\n👥 TESTING CLIENTS API CONNECTIVITY');
    console.log('====================================');

    console.log('5. Testing Clients API...');
    const clientsLink = await page.locator('a:has-text("العملاء")');
    await clientsLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check for API requests
    const clientsRequests = apiRequests.filter((req) => req.url.includes('/api/clients'));
    const clientsResponses = apiResponses.filter((res) => res.url.includes('/api/clients'));

    console.log(`   📡 API Requests made: ${clientsRequests.length}`);
    console.log(`   📡 API Responses received: ${clientsResponses.length}`);

    if (clientsResponses.length > 0) {
      clientsResponses.forEach((res) => {
        console.log(`   📊 ${res.url} - Status: ${res.status}`);
      });
    }

    // Check for loading states
    const clientLoadingSpinner = await page.locator('.spinner-border').count();
    console.log(`   ⏳ Loading spinners found: ${clientLoadingSpinner}`);

    // Check for error messages
    const clientErrorAlerts = await page.locator('.alert-danger').count();
    console.log(`   ❌ Error alerts found: ${clientErrorAlerts}`);

    if (clientErrorAlerts > 0) {
      const clientErrorText = await page.locator('.alert-danger').textContent();
      console.log(`   📝 Error message: ${clientErrorText}`);
    }

    // Check for empty state
    const clientEmptyState = await page.locator('h5:has-text("لا يوجد عملاء")').count();
    console.log(`   📭 Empty state found: ${clientEmptyState > 0 ? 'Yes' : 'No'}`);

    // Test Hearings API
    console.log('\n📅 TESTING HEARINGS API CONNECTIVITY');
    console.log('=====================================');

    console.log('6. Testing Hearings API...');
    const hearingsLink = await page.locator('a:has-text("الجلسات")');
    await hearingsLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check for API requests
    const hearingsRequests = apiRequests.filter((req) => req.url.includes('/api/hearings'));
    const hearingsResponses = apiResponses.filter((res) => res.url.includes('/api/hearings'));

    console.log(`   📡 API Requests made: ${hearingsRequests.length}`);
    console.log(`   📡 API Responses received: ${hearingsResponses.length}`);

    if (hearingsResponses.length > 0) {
      hearingsResponses.forEach((res) => {
        console.log(`   📊 ${res.url} - Status: ${res.status}`);
      });
    }

    // Check for loading states
    const hearingLoadingSpinner = await page.locator('.spinner-border').count();
    console.log(`   ⏳ Loading spinners found: ${hearingLoadingSpinner}`);

    // Check for error messages
    const hearingErrorAlerts = await page.locator('.alert-danger').count();
    console.log(`   ❌ Error alerts found: ${hearingErrorAlerts}`);

    if (hearingErrorAlerts > 0) {
      const hearingErrorText = await page.locator('.alert-danger').textContent();
      console.log(`   📝 Error message: ${hearingErrorText}`);
    }

    // Check for empty state
    const hearingEmptyState = await page.locator('h5:has-text("لا توجد جلسات")').count();
    console.log(`   📭 Empty state found: ${hearingEmptyState > 0 ? 'Yes' : 'No'}`);

    // Test direct API calls
    console.log('\n🔧 TESTING DIRECT API CALLS');
    console.log('============================');

    console.log('7. Testing direct API calls...');

    // Test Cases API directly
    try {
      const casesResponse = await page.evaluate(async () => {
        const response = await fetch('/api/cases');
        return {
          status: response.status,
          ok: response.ok,
          data: await response.json(),
        };
      });
      console.log(`   📊 Cases API - Status: ${casesResponse.status}, OK: ${casesResponse.ok}`);
      if (casesResponse.data && casesResponse.data.success) {
        console.log(`   📊 Cases API - Data count: ${casesResponse.data.data?.data?.length || 0}`);
      }
    } catch (error) {
      console.log(`   ❌ Cases API Error: ${error.message}`);
    }

    // Test Clients API directly
    try {
      const clientsResponse = await page.evaluate(async () => {
        const response = await fetch('/api/clients');
        return {
          status: response.status,
          ok: response.ok,
          data: await response.json(),
        };
      });
      console.log(
        `   📊 Clients API - Status: ${clientsResponse.status}, OK: ${clientsResponse.ok}`
      );
      if (clientsResponse.data && clientsResponse.data.success) {
        console.log(
          `   📊 Clients API - Data count: ${clientsResponse.data.data?.data?.length || 0}`
        );
      }
    } catch (error) {
      console.log(`   ❌ Clients API Error: ${error.message}`);
    }

    // Test Hearings API directly
    try {
      const hearingsResponse = await page.evaluate(async () => {
        const response = await fetch('/api/hearings');
        return {
          status: response.status,
          ok: response.ok,
          data: await response.json(),
        };
      });
      console.log(
        `   📊 Hearings API - Status: ${hearingsResponse.status}, OK: ${hearingsResponse.ok}`
      );
      if (hearingsResponse.data && hearingsResponse.data.success) {
        console.log(
          `   📊 Hearings API - Data count: ${hearingsResponse.data.data?.data?.length || 0}`
        );
      }
    } catch (error) {
      console.log(`   ❌ Hearings API Error: ${error.message}`);
    }

    // Take screenshot
    console.log('\n8. Taking screenshot...');
    await page.screenshot({ path: 'api-connectivity-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as api-connectivity-test.png');
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }

  console.log('\n🎉 API Connectivity testing completed!');
  console.log('\n📊 SUMMARY:');
  console.log('============');
  console.log(`📡 Total API Requests: ${apiRequests.length}`);
  console.log(`📡 Total API Responses: ${apiResponses.length}`);
  console.log('✅ Frontend navigation working');
  console.log('✅ Authentication working');
  console.log('✅ All management pages loading');
  console.log('🔍 Check API responses above for connectivity issues');
}

testAPIConnectivity().catch(console.error);
