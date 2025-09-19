import { chromium } from 'playwright';

async function testDeploymentComplete() {
  console.log('🚀 Testing Complete Deployment Setup...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Test 1: Development setup (React dev server with proxy)
    console.log('1. Testing Development Setup...');
    await page.goto('http://lit.local:3001');
    await page.waitForLoadState('networkidle');
    
    // Test API proxy
    const devApiTest = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/ping');
        const data = await response.json();
        return {
          success: true,
          status: response.status,
          data: data
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    if (devApiTest.success) {
      console.log('   ✅ Development API proxy working');
      console.log(`   📊 Status: ${devApiTest.status}`);
      console.log(`   📊 Response: ${JSON.stringify(devApiTest.data).substring(0, 100)}...`);
    } else {
      console.log(`   ❌ Development API proxy failed: ${devApiTest.error}`);
    }
    
    // Test 2: Login functionality
    console.log('\n2. Testing Login Functionality...');
    const loginForm = await page.locator('form').first();
    if (await loginForm.isVisible()) {
      await page.fill('input[type="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Check if login was successful
      const dashboardVisible = await page.locator('.dashboard').isVisible();
      if (dashboardVisible) {
        console.log('   ✅ Login successful - Dashboard visible');
      } else {
        console.log('   ❌ Login failed - Dashboard not visible');
      }
    } else {
      console.log('   ❌ Login form not found');
    }
    
    // Test 3: API endpoints after login
    console.log('\n3. Testing API Endpoints After Login...');
    const apiEndpointsTest = await page.evaluate(async () => {
      const results = {};
      
      // Test cases endpoint
      try {
        const response = await fetch('/api/cases?page=1&limit=10');
        const data = await response.json();
        results.cases = {
          success: true,
          status: response.status,
          dataCount: data.data?.data?.length || 0
        };
      } catch (error) {
        results.cases = {
          success: false,
          error: error.message
        };
      }
      
      // Test clients endpoint
      try {
        const response = await fetch('/api/clients?page=1&limit=10');
        const data = await response.json();
        results.clients = {
          success: true,
          status: response.status,
          dataCount: data.data?.data?.length || 0
        };
      } catch (error) {
        results.clients = {
          success: false,
          error: error.message
        };
      }
      
      // Test hearings endpoint
      try {
        const response = await fetch('/api/hearings?page=1&limit=10');
        const data = await response.json();
        results.hearings = {
          success: true,
          status: response.status,
          dataCount: data.data?.data?.length || 0
        };
      } catch (error) {
        results.hearings = {
          success: false,
          error: error.message
        };
      }
      
      return results;
    });
    
    console.log('   📊 API Endpoints Test Results:');
    Object.entries(apiEndpointsTest).forEach(([endpoint, result]) => {
      if (result.success) {
        console.log(`      ✅ ${endpoint}: Status ${result.status}, Data count: ${result.dataCount}`);
      } else {
        console.log(`      ❌ ${endpoint}: ${result.error}`);
      }
    });
    
    // Test 4: Navigation between pages
    console.log('\n4. Testing Navigation...');
    const navigationTest = await page.evaluate(async () => {
      const results = {};
      
      // Test Cases page
      try {
        const casesLink = document.querySelector('a[href*="cases"]');
        if (casesLink) {
          casesLink.click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          results.cases = {
            success: true,
            url: window.location.href
          };
        } else {
          results.cases = {
            success: false,
            error: 'Cases link not found'
          };
        }
      } catch (error) {
        results.cases = {
          success: false,
          error: error.message
        };
      }
      
      return results;
    });
    
    if (navigationTest.cases.success) {
      console.log('   ✅ Navigation working');
      console.log(`   📊 Current URL: ${navigationTest.cases.url}`);
    } else {
      console.log(`   ❌ Navigation failed: ${navigationTest.cases.error}`);
    }
    
    // Test 5: Production build test
    console.log('\n5. Testing Production Build...');
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
    
    const productionTest = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/ping');
        const data = await response.json();
        return {
          success: true,
          status: response.status,
          data: data
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    if (productionTest.success) {
      console.log('   ✅ Production build working');
      console.log(`   📊 Status: ${productionTest.status}`);
      console.log(`   📊 Response: ${JSON.stringify(productionTest.data).substring(0, 100)}...`);
    } else {
      console.log(`   ❌ Production build failed: ${productionTest.error}`);
    }
    
    // Take screenshot
    console.log('\n6. Taking screenshot...');
    await page.screenshot({ path: 'deployment-complete-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as deployment-complete-test.png');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 Complete deployment testing finished!');
}

testDeploymentComplete().catch(console.error);
