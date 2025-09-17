import { chromium } from 'playwright';

async function testLoginDirect() {
  console.log('🔐 Testing Login Directly...\n');
  
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
    
    // Test login directly
    console.log('3. Testing login directly...');
    const loginResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'admin@litigation.com',
            password: 'admin123'
          })
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
    });
    
    if (loginResponse.success) {
      console.log(`   ✅ Login successful - Status: ${loginResponse.status}`);
      console.log(`   📊 Response: ${JSON.stringify(loginResponse.data).substring(0, 200)}...`);
      
      if (loginResponse.data && loginResponse.data.success && loginResponse.data.data && loginResponse.data.data.token) {
        console.log('   🔑 Token received from login');
        
        // Test API call with the token
        console.log('4. Testing API call with token...');
        const apiResponse = await page.evaluate(async (token) => {
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
        }, loginResponse.data.data.token);
        
        if (apiResponse.success) {
          console.log(`   ✅ API call successful - Status: ${apiResponse.status}`);
          if (apiResponse.data && apiResponse.data.success) {
            console.log(`   📊 Data count: ${apiResponse.data.data?.data?.length || 0}`);
          }
        } else {
          console.log(`   ❌ API call failed: ${apiResponse.error}`);
        }
      } else {
        console.log('   ❌ No token received from login');
      }
    } else {
      console.log(`   ❌ Login failed: ${loginResponse.error}`);
    }
    
    // Take screenshot
    console.log('\n5. Taking screenshot...');
    await page.screenshot({ path: 'login-direct-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as login-direct-test.png');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 Login direct testing completed!');
}

testLoginDirect().catch(console.error);

