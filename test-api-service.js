import { chromium } from 'playwright';

async function testAPIService() {
  console.log('🔧 Testing API Service Methods...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
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
    
    // Test API service methods directly
    console.log('\n4. Testing API service methods...');
    
    // Test if apiService is available
    const apiServiceAvailable = await page.evaluate(() => {
      return typeof window.apiService !== 'undefined';
    });
    console.log(`   📊 API Service available: ${apiServiceAvailable}`);
    
    // Test token storage
    const tokenInStorage = await page.evaluate(() => {
      return localStorage.getItem('auth_token');
    });
    console.log(`   🔑 Token in localStorage: ${tokenInStorage ? 'Yes' : 'No'}`);
    if (tokenInStorage) {
      console.log(`   🔑 Token preview: ${tokenInStorage.substring(0, 20)}...`);
    }
    
    // Test API service methods
    const apiMethods = await page.evaluate(() => {
      if (typeof window.apiService !== 'undefined') {
        return Object.getOwnPropertyNames(Object.getPrototypeOf(window.apiService))
          .filter(name => name !== 'constructor' && typeof window.apiService[name] === 'function');
      }
      return [];
    });
    console.log(`   📊 Available API methods: ${apiMethods.join(', ')}`);
    
    // Test specific methods
    const hasGetMethod = await page.evaluate(() => {
      return typeof window.apiService?.get === 'function';
    });
    console.log(`   📊 Has get method: ${hasGetMethod}`);
    
    const hasPostMethod = await page.evaluate(() => {
      return typeof window.apiService?.post === 'function';
    });
    console.log(`   📊 Has post method: ${hasPostMethod}`);
    
    // Test API call with authentication
    console.log('\n5. Testing authenticated API call...');
    try {
      const apiResponse = await page.evaluate(async () => {
        if (typeof window.apiService?.get === 'function') {
          try {
            const response = await window.apiService.get('/api/cases');
            return {
              success: true,
              status: 'OK',
              data: response
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
            error: 'API service get method not available'
          };
        }
      });
      
      if (apiResponse.success) {
        console.log('   ✅ API call successful');
        console.log(`   📊 Response data: ${JSON.stringify(apiResponse.data).substring(0, 100)}...`);
      } else {
        console.log(`   ❌ API call failed: ${apiResponse.error}`);
      }
    } catch (error) {
      console.log(`   ❌ API call error: ${error.message}`);
    }
    
    // Test direct fetch with token
    console.log('\n6. Testing direct fetch with token...');
    try {
      const fetchResponse = await page.evaluate(async () => {
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
      
      if (fetchResponse.success) {
        console.log(`   ✅ Direct fetch successful - Status: ${fetchResponse.status}`);
        if (fetchResponse.data && fetchResponse.data.success) {
          console.log(`   📊 Data count: ${fetchResponse.data.data?.data?.length || 0}`);
        }
      } else {
        console.log(`   ❌ Direct fetch failed: ${fetchResponse.error}`);
      }
    } catch (error) {
      console.log(`   ❌ Direct fetch error: ${error.message}`);
    }
    
    // Take screenshot
    console.log('\n7. Taking screenshot...');
    await page.screenshot({ path: 'api-service-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as api-service-test.png');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 API Service testing completed!');
}

testAPIService().catch(console.error);

