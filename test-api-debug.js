import { chromium } from 'playwright';

async function testAPIDebug() {
  console.log('🔍 Debugging API Service Issues...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen to console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ CONSOLE ERROR:', msg.text());
    } else if (msg.type() === 'warning') {
      console.log('⚠️  CONSOLE WARNING:', msg.text());
    } else {
      console.log('ℹ️  CONSOLE:', msg.text());
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
    
    // Navigate to Cases page to trigger the API calls
    console.log('4. Navigating to Cases page...');
    const casesLink = await page.locator('a:has-text("القضايا")');
    await casesLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check what's in the browser console
    console.log('\n5. Checking browser console for errors...');
    
    // Test if we can access the API service from the browser
    const apiServiceTest = await page.evaluate(() => {
      // Try to access the API service from different ways
      const results = {
        windowApiService: typeof window.apiService,
        globalApiService: typeof globalThis.apiService,
        apiServiceImport: 'Not accessible from evaluate'
      };
      
      // Try to access from the React app
      try {
        const reactRoot = document.querySelector('#root');
        if (reactRoot && reactRoot._reactInternalFiber) {
          results.reactRoot = 'Found';
        }
      } catch (e) {
        results.reactRoot = 'Not accessible';
      }
      
      return results;
    });
    
    console.log('   📊 API Service accessibility:', apiServiceTest);
    
    // Check if there are any module loading errors
    const moduleErrors = await page.evaluate(() => {
      const errors = [];
      const scripts = document.querySelectorAll('script[type="module"]');
      scripts.forEach(script => {
        if (script.src) {
          errors.push(`Script: ${script.src}`);
        }
      });
      return errors;
    });
    
    console.log('   📊 Module scripts:', moduleErrors);
    
    // Check localStorage
    const localStorage = await page.evaluate(() => {
      const items = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        items[key] = window.localStorage.getItem(key);
      }
      return items;
    });
    
    console.log('   📊 LocalStorage:', localStorage);
    
    // Check if the API service is available in the global scope
    const globalScope = await page.evaluate(() => {
      const globals = Object.keys(window).filter(key => 
        key.includes('api') || key.includes('Api') || key.includes('API')
      );
      return globals;
    });
    
    console.log('   📊 Global API-related objects:', globalScope);
    
    // Take screenshot
    console.log('\n6. Taking screenshot...');
    await page.screenshot({ path: 'api-debug-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as api-debug-test.png');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 API Debug testing completed!');
}

testAPIDebug().catch(console.error);

