import { chromium } from 'playwright';

async function testAPIResponseDetailed() {
  console.log('🔍 Testing API Response Detailed...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to the frontend
    console.log('1. Navigating to frontend...');
    await page.goto('http://lit.local:3001');
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
    
    // Test the exact API service response that the React component is getting
    console.log('\n4. Testing exact API service response...');
    const detailedTest = await page.evaluate(async () => {
      try {
        const { apiService } = await import('/src/services/api.ts');
        
        // Test the exact same call that the React component makes
        const response = await apiService.get('/cases?page=1&limit=10');
        
        console.log('Full API response:', JSON.stringify(response, null, 2));
        
        // Check the exact structure the React component expects
        const hasSuccess = 'success' in response;
        const hasData = 'data' in response;
        const dataType = typeof response.data;
        const hasNestedData = response.data && 'data' in response.data;
        const hasPagination = response.data && 'pagination' in response.data;
        
        // Check what the React component is actually getting
        const reactExpectedPath = response.data && response.data.data && response.data.data.data;
        const reactExpectedPagination = response.data && response.data.data && response.data.data.pagination;
        
        return {
          success: true,
          response: response,
          structure: {
            hasSuccess,
            hasData,
            dataType,
            hasNestedData,
            hasPagination,
            reactExpectedPath: !!reactExpectedPath,
            reactExpectedPagination: !!reactExpectedPagination,
            actualDataLength: reactExpectedPath ? reactExpectedPath.length : 0,
            actualPaginationKeys: reactExpectedPagination ? Object.keys(reactExpectedPagination) : []
          }
        };
      } catch (error) {
        console.error('Detailed test failed:', error);
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    if (detailedTest.success) {
      console.log('   ✅ API service call successful');
      console.log('   📊 Response Structure Analysis:');
      console.log(`      - Has 'success' field: ${detailedTest.structure.hasSuccess}`);
      console.log(`      - Has 'data' field: ${detailedTest.structure.hasData}`);
      console.log(`      - Data type: ${detailedTest.structure.dataType}`);
      console.log(`      - Has nested 'data' field: ${detailedTest.structure.hasNestedData}`);
      console.log(`      - Has 'pagination' field: ${detailedTest.structure.hasPagination}`);
      console.log(`      - React expected path exists: ${detailedTest.structure.reactExpectedPath}`);
      console.log(`      - React expected pagination exists: ${detailedTest.structure.reactExpectedPagination}`);
      console.log(`      - Actual data length: ${detailedTest.structure.actualDataLength}`);
      console.log(`      - Actual pagination keys: ${detailedTest.structure.actualPaginationKeys.join(', ')}`);
      
      // Show the actual response structure
      console.log('\n   📋 Actual Response Structure:');
      console.log(JSON.stringify(detailedTest.response, null, 2));
    } else {
      console.log(`   ❌ API service call failed: ${detailedTest.error}`);
    }
    
    // Take screenshot
    console.log('\n5. Taking screenshot...');
    await page.screenshot({ path: 'api-response-detailed-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as api-response-detailed-test.png');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 API response detailed testing completed!');
}

testAPIResponseDetailed().catch(console.error);
