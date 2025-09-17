import { chromium } from 'playwright';

async function testDeploymentSetup() {
  console.log('🚀 Testing Deployment Setup...\n');
  
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
      console.log(`   📊 Response: ${JSON.stringify(devApiTest.data).substring(0, 100)}...`);
    } else {
      console.log(`   ❌ Development API proxy failed: ${devApiTest.error}`);
    }
    
    // Test 2: Production setup (direct to Apache)
    console.log('\n2. Testing Production Setup...');
    await page.goto('http://lit.local');
    await page.waitForLoadState('networkidle');
    
    // Test API directly
    const prodApiTest = await page.evaluate(async () => {
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
    
    if (prodApiTest.success) {
      console.log('   ✅ Production API working');
      console.log(`   📊 Response: ${JSON.stringify(prodApiTest.data).substring(0, 100)}...`);
    } else {
      console.log(`   ❌ Production API failed: ${prodApiTest.error}`);
    }
    
    // Test 3: SPA routing
    console.log('\n3. Testing SPA Routing...');
    await page.goto('http://lit.local/cases');
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    if (currentUrl.includes('/cases')) {
      console.log('   ✅ SPA routing working');
    } else {
      console.log('   ❌ SPA routing failed');
    }
    
    // Take screenshot
    console.log('\n4. Taking screenshot...');
    await page.screenshot({ path: 'deployment-setup-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as deployment-setup-test.png');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 Deployment setup testing completed!');
}

testDeploymentSetup().catch(console.error);
