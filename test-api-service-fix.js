import { chromium } from 'playwright';

async function testAPIServiceFix() {
  console.log('🔧 Testing API Service Fix...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen to console messages
  page.on('console', msg => {
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
    
    // Test API service directly
    console.log('\n4. Testing API service directly...');
    
    // Check if token is in localStorage
    const token = await page.evaluate(() => {
      return localStorage.getItem('auth_token');
    });
    console.log(`   🔑 Token in localStorage: ${token ? 'Yes' : 'No'}`);
    if (token) {
      console.log(`   🔑 Token preview: ${token.substring(0, 20)}...`);
    }
    
    // Test API service methods
    const apiServiceTest = await page.evaluate(async () => {
      try {
        // Import the API service
        const { apiService } = await import('/src/services/api.ts');
        
        console.log('API Service imported successfully');
        console.log('API Service methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(apiService)));
        
        // Test if get method exists
        const hasGetMethod = typeof apiService.get === 'function';
        console.log('Has get method:', hasGetMethod);
        
        if (hasGetMethod) {
          // Test API call
          try {
            const response = await apiService.get('/api/health');
            console.log('Health check response:', response);
            return {
              success: true,
              response: response
            };
          } catch (error) {
            console.error('API call failed:', error);
            return {
              success: false,
              error: error.message
            };
          }
        } else {
          return {
            success: false,
            error: 'API service get method not available'
          };
        }
      } catch (error) {
        console.error('Import failed:', error);
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    if (apiServiceTest.success) {
      console.log('   ✅ API service working correctly');
      console.log(`   📊 Response: ${JSON.stringify(apiServiceTest.response).substring(0, 100)}...`);
    } else {
      console.log(`   ❌ API service failed: ${apiServiceTest.error}`);
    }
    
    // Test direct fetch with token
    console.log('\n5. Testing direct fetch with token...');
    const fetchTest = await page.evaluate(async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await fetch('/api/cases', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
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
      } else {
        return {
          success: false,
          error: 'No token found'
        };
      }
    });
    
    if (fetchTest.success) {
      console.log(`   ✅ Direct fetch successful - Status: ${fetchTest.status}`);
      if (fetchTest.data && fetchTest.data.success) {
        console.log(`   📊 Data count: ${fetchTest.data.data?.data?.length || 0}`);
      }
    } else {
      console.log(`   ❌ Direct fetch failed: ${fetchTest.error}`);
    }
    
    // Navigate to Cases page to test the actual API calls
    console.log('\n6. Testing Cases page API calls...');
    const casesLink = await page.locator('a:has-text("القضايا")');
    await casesLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check for any console errors
    console.log('\n7. Checking for console errors...');
    
    // Take screenshot
    console.log('\n8. Taking screenshot...');
    await page.screenshot({ path: 'api-service-fix-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as api-service-fix-test.png');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 API Service fix testing completed!');
}

testAPIServiceFix().catch(console.error);

