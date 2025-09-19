import { chromium } from 'playwright';

async function testReactAuthFlow() {
  console.log('🔐 Testing React Authentication Flow...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to the React app
    console.log('1. Navigating to React app...');
    await page.goto('http://lit.local:3001');
    await page.waitForLoadState('networkidle');
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      } else if (msg.text().includes('API') || msg.text().includes('auth') || msg.text().includes('token')) {
        console.log('🔍 Console Log:', msg.text());
      }
    });
    
    // Check if we're on login page or dashboard
    console.log('\n2. Checking current page state...');
    const pageState = await page.evaluate(() => {
      const loginForm = document.querySelector('form');
      const dashboard = document.querySelector('.dashboard, [class*="dashboard"]');
      const errorMessages = document.querySelectorAll('.alert-danger, .error, [class*="error"]');
      
      return {
        hasLoginForm: !!loginForm,
        hasDashboard: !!dashboard,
        errorCount: errorMessages.length,
        errorTexts: Array.from(errorMessages).map(el => el.textContent),
        currentUrl: window.location.href
      };
    });
    
    console.log('   📊 Page State:');
    console.log(`      URL: ${pageState.currentUrl}`);
    console.log(`      Login Form: ${pageState.hasLoginForm ? 'Found' : 'Not found'}`);
    console.log(`      Dashboard: ${pageState.hasDashboard ? 'Found' : 'Not found'}`);
    console.log(`      Errors: ${pageState.errorCount}`);
    if (pageState.errorTexts.length > 0) {
      console.log(`      Error Texts: ${pageState.errorTexts.join(', ')}`);
    }
    
    // If on login page, try to login
    if (pageState.hasLoginForm) {
      console.log('\n3. Attempting login...');
      
      // Fill login form
      await page.fill('input[type="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Check if login was successful
      const afterLogin = await page.evaluate(() => {
        const dashboard = document.querySelector('.dashboard, [class*="dashboard"]');
        const errorMessages = document.querySelectorAll('.alert-danger, .error, [class*="error"]');
        const token = localStorage.getItem('auth_token');
        
        return {
          hasDashboard: !!dashboard,
          errorCount: errorMessages.length,
          errorTexts: Array.from(errorMessages).map(el => el.textContent),
          hasToken: !!token,
          tokenPreview: token ? token.substring(0, 20) + '...' : null,
          currentUrl: window.location.href
        };
      });
      
      console.log('   📊 After Login:');
      console.log(`      URL: ${afterLogin.currentUrl}`);
      console.log(`      Dashboard: ${afterLogin.hasDashboard ? 'Found' : 'Not found'}`);
      console.log(`      Token: ${afterLogin.hasToken ? 'Found' : 'Not found'}`);
      if (afterLogin.tokenPreview) {
        console.log(`      Token Preview: ${afterLogin.tokenPreview}`);
      }
      console.log(`      Errors: ${afterLogin.errorCount}`);
      if (afterLogin.errorTexts.length > 0) {
        console.log(`      Error Texts: ${afterLogin.errorTexts.join(', ')}`);
      }
    }
    
    // Test API calls after authentication
    console.log('\n4. Testing authenticated API calls...');
    const apiTest = await page.evaluate(async () => {
      const results = {};
      
      // Test cases endpoint
      try {
        const response = await fetch('/api/cases');
        const data = await response.json();
        results.cases = {
          success: true,
          status: response.status,
          dataCount: data.data?.data?.length || 0,
          hasData: !!(data.data?.data?.length > 0)
        };
      } catch (error) {
        results.cases = {
          success: false,
          error: error.message
        };
      }
      
      // Test clients endpoint
      try {
        const response = await fetch('/api/clients');
        const data = await response.json();
        results.clients = {
          success: true,
          status: response.status,
          dataCount: data.data?.data?.length || 0,
          hasData: !!(data.data?.data?.length > 0)
        };
      } catch (error) {
        results.clients = {
          success: false,
          error: error.message
        };
      }
      
      // Test hearings endpoint
      try {
        const response = await fetch('/api/hearings');
        const data = await response.json();
        results.hearings = {
          success: true,
          status: response.status,
          dataCount: data.data?.data?.length || 0,
          hasData: !!(data.data?.data?.length > 0)
        };
      } catch (error) {
        results.hearings = {
          success: false,
          error: error.message
        };
      }
      
      return results;
    });
    
    console.log('   📊 API Test Results:');
    Object.entries(apiTest).forEach(([endpoint, result]) => {
      if (result.success) {
        console.log(`      ✅ ${endpoint}: Status ${result.status}, Count: ${result.dataCount}, Has Data: ${result.hasData}`);
      } else {
        console.log(`      ❌ ${endpoint}: ${result.error}`);
      }
    });
    
    // Check for any error messages on the page
    console.log('\n5. Checking for error messages...');
    const errorCheck = await page.evaluate(() => {
      const errorMessages = document.querySelectorAll('.alert-danger, .error, [class*="error"], [class*="failed"]');
      const failedMessages = document.querySelectorAll('*');
      const failedTexts = [];
      
      failedMessages.forEach(el => {
        if (el.textContent && el.textContent.includes('Failed to load')) {
          failedTexts.push(el.textContent.trim());
        }
      });
      
      return {
        errorCount: errorMessages.length,
        errorTexts: Array.from(errorMessages).map(el => el.textContent.trim()),
        failedCount: failedTexts.length,
        failedTexts: failedTexts
      };
    });
    
    console.log('   📊 Error Check Results:');
    console.log(`      Error Messages: ${errorCheck.errorCount}`);
    if (errorCheck.errorTexts.length > 0) {
      console.log(`      Error Texts: ${errorCheck.errorTexts.join(', ')}`);
    }
    console.log(`      Failed Messages: ${errorCheck.failedCount}`);
    if (errorCheck.failedTexts.length > 0) {
      console.log(`      Failed Texts: ${errorCheck.failedTexts.join(', ')}`);
    }
    
    // Take screenshot
    console.log('\n6. Taking screenshot...');
    await page.screenshot({ path: 'react-auth-flow-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as react-auth-flow-test.png');
    
  } catch (error) {
    console.error('❌ Error during authentication flow test:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 React authentication flow testing completed!');
}

testReactAuthFlow().catch(console.error);
