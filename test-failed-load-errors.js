import { chromium } from 'playwright';

async function testFailedLoadErrors() {
  console.log('🔍 Testing "Failed to load" Errors with Playwright...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to the React app
    console.log('1. Navigating to React app...');
    await page.goto('http://lit.local:3001');
    await page.waitForLoadState('networkidle');
    
    // Enable console logging to capture all messages
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', text);
      } else if (text.includes('Failed') || text.includes('Error') || text.includes('API')) {
        console.log('🔍 Console Log:', text);
      }
    });
    
    // Capture network requests
    const networkRequests = [];
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        networkRequests.push({
          url: request.url(),
          method: request.method(),
          timestamp: new Date().toISOString()
        });
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        const request = networkRequests.find(r => r.url === response.url());
        if (request) {
          request.status = response.status();
          request.statusText = response.statusText();
        }
      }
    });
    
    // Wait for initial load
    await page.waitForTimeout(3000);
    
    // Check for login form and attempt login
    console.log('\n2. Checking for login form...');
    const loginForm = await page.locator('form').first();
    if (await loginForm.isVisible()) {
      console.log('   📝 Login form found, attempting login...');
      
      await page.fill('input[type="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      
      // Wait for login to complete
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    } else {
      console.log('   ℹ️ No login form found, already logged in or different page');
    }
    
    // Check current page state
    console.log('\n3. Checking current page state...');
    const pageState = await page.evaluate(() => {
      const errorMessages = document.querySelectorAll('.alert-danger, .error, [class*="error"]');
      const failedMessages = document.querySelectorAll('*');
      const failedTexts = [];
      
      // Look for "Failed to load" text in any element
      failedMessages.forEach(el => {
        if (el.textContent && el.textContent.includes('Failed to load')) {
          failedTexts.push({
            text: el.textContent.trim(),
            tagName: el.tagName,
            className: el.className,
            id: el.id
          });
        }
      });
      
      // Look for empty data states
      const emptyStates = document.querySelectorAll('[class*="empty"], [class*="no-data"], [class*="no-cases"], [class*="no-clients"], [class*="no-hearings"]');
      const emptyTexts = Array.from(emptyStates).map(el => ({
        text: el.textContent.trim(),
        tagName: el.tagName,
        className: el.className
      }));
      
      return {
        url: window.location.href,
        errorCount: errorMessages.length,
        errorTexts: Array.from(errorMessages).map(el => el.textContent.trim()),
        failedCount: failedTexts.length,
        failedTexts: failedTexts,
        emptyCount: emptyTexts.length,
        emptyTexts: emptyTexts,
        hasToken: !!localStorage.getItem('auth_token')
      };
    });
    
    console.log('   📊 Page State Results:');
    console.log(`      URL: ${pageState.url}`);
    console.log(`      Has Token: ${pageState.hasToken}`);
    console.log(`      Error Messages: ${pageState.errorCount}`);
    if (pageState.errorTexts.length > 0) {
      console.log(`      Error Texts: ${pageState.errorTexts.join(', ')}`);
    }
    console.log(`      Failed Messages: ${pageState.failedCount}`);
    if (pageState.failedTexts.length > 0) {
      pageState.failedTexts.forEach((failed, index) => {
        console.log(`         ${index + 1}. "${failed.text}" (${failed.tagName}.${failed.className})`);
      });
    }
    console.log(`      Empty States: ${pageState.emptyCount}`);
    if (pageState.emptyTexts.length > 0) {
      pageState.emptyTexts.forEach((empty, index) => {
        console.log(`         ${index + 1}. "${empty.text}" (${empty.tagName}.${empty.className})`);
      });
    }
    
    // Test API calls directly
    console.log('\n4. Testing API calls directly...');
    const apiTest = await page.evaluate(async () => {
      const results = {};
      
      // Test cases endpoint
      try {
        console.log('Testing /api/cases...');
        const response = await fetch('/api/cases');
        const data = await response.json();
        results.cases = {
          success: true,
          status: response.status,
          dataCount: data.data?.data?.length || 0,
          hasData: !!(data.data?.data?.length > 0),
          response: data
        };
      } catch (error) {
        console.error('Cases API error:', error);
        results.cases = {
          success: false,
          error: error.message
        };
      }
      
      // Test clients endpoint
      try {
        console.log('Testing /api/clients...');
        const response = await fetch('/api/clients');
        const data = await response.json();
        results.clients = {
          success: true,
          status: response.status,
          dataCount: data.data?.data?.length || 0,
          hasData: !!(data.data?.data?.length > 0),
          response: data
        };
      } catch (error) {
        console.error('Clients API error:', error);
        results.clients = {
          success: false,
          error: error.message
        };
      }
      
      // Test hearings endpoint
      try {
        console.log('Testing /api/hearings...');
        const response = await fetch('/api/hearings');
        const data = await response.json();
        results.hearings = {
          success: true,
          status: response.status,
          dataCount: data.data?.data?.length || 0,
          hasData: !!(data.data?.data?.length > 0),
          response: data
        };
      } catch (error) {
        console.error('Hearings API error:', error);
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
        if (!result.hasData) {
          console.log(`         ⚠️ No data returned for ${endpoint}`);
        }
      } else {
        console.log(`      ❌ ${endpoint}: ${result.error}`);
      }
    });
    
    // Check network requests
    console.log('\n5. Network Request Analysis:');
    console.log(`   📊 Total API Requests: ${networkRequests.length}`);
    networkRequests.forEach((req, index) => {
      console.log(`      ${index + 1}. ${req.method} ${req.url} - Status: ${req.status || 'Pending'}`);
    });
    
    // Navigate to different pages to test
    console.log('\n6. Testing navigation to different pages...');
    
    // Try to navigate to cases page
    try {
      const casesLink = page.locator('a[href*="cases"], [data-testid*="cases"], button:has-text("القضايا"), button:has-text("Cases")').first();
      if (await casesLink.isVisible()) {
        console.log('   📝 Navigating to cases page...');
        await casesLink.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Check for errors after navigation
        const casesPageState = await page.evaluate(() => {
          const errorMessages = document.querySelectorAll('.alert-danger, .error, [class*="error"]');
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
        
        console.log(`      📊 Cases Page State:`);
        console.log(`         Errors: ${casesPageState.errorCount}`);
        if (casesPageState.errorTexts.length > 0) {
          console.log(`         Error Texts: ${casesPageState.errorTexts.join(', ')}`);
        }
        console.log(`         Failed Messages: ${casesPageState.failedCount}`);
        if (casesPageState.failedTexts.length > 0) {
          casesPageState.failedTexts.forEach((failed, index) => {
            console.log(`            ${index + 1}. "${failed}"`);
          });
        }
      } else {
        console.log('   ⚠️ Cases link not found');
      }
    } catch (error) {
      console.log(`   ❌ Error navigating to cases page: ${error.message}`);
    }
    
    // Take screenshot
    console.log('\n7. Taking screenshot...');
    await page.screenshot({ path: 'failed-load-errors-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as failed-load-errors-test.png');
    
    // Get page HTML for analysis
    console.log('\n8. Analyzing page HTML...');
    const pageHTML = await page.content();
    const failedLoadMatches = pageHTML.match(/Failed to load/gi);
    if (failedLoadMatches) {
      console.log(`   📊 Found ${failedLoadMatches.length} "Failed to load" text instances in HTML`);
    } else {
      console.log('   ✅ No "Failed to load" text found in HTML');
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 "Failed to load" errors testing completed!');
}

testFailedLoadErrors().catch(console.error);
