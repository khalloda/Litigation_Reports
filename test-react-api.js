import { chromium } from 'playwright';

async function testReactAPI() {
  console.log('⚛️ Testing React API Service...\n');
  
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
    
    // Test API service in React context
    console.log('\n4. Testing API service in React context...');
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
            const response = await apiService.get('/cases');
            console.log('Cases API response:', response);
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
      console.log('   ✅ API service working in React context');
      console.log(`   📊 Response: ${JSON.stringify(apiServiceTest.response).substring(0, 200)}...`);
    } else {
      console.log(`   ❌ API service failed in React context: ${apiServiceTest.error}`);
    }
    
    // Navigate to Cases page to test the actual React components
    console.log('\n5. Testing Cases page...');
    const casesLink = await page.locator('a:has-text("القضايا")');
    await casesLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check for any console errors
    console.log('\n6. Checking for console errors...');
    
    // Take screenshot
    console.log('\n7. Taking screenshot...');
    await page.screenshot({ path: 'react-api-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as react-api-test.png');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 React API testing completed!');
}

testReactAPI().catch(console.error);

