import { chromium } from 'playwright';

async function testAPIResponseStructure() {
  console.log('🔍 Testing API Response Structure...\n');
  
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
    
    // Test API response structure directly
    console.log('\n4. Testing API response structure...');
    const apiResponseTest = await page.evaluate(async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
          return { success: false, error: 'No token found' };
        }
        
        // Make direct API call
        const response = await fetch('/api/cases?page=1&limit=10', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        return {
          success: true,
          status: response.status,
          responseStructure: {
            hasSuccess: 'success' in data,
            hasData: 'data' in data,
            dataType: typeof data.data,
            hasNestedData: data.data && 'data' in data.data,
            hasPagination: data.data && 'pagination' in data.data,
            dataLength: data.data && data.data.data ? data.data.data.length : 0,
            paginationKeys: data.data && data.data.pagination ? Object.keys(data.data.pagination) : [],
            fullResponse: data
          }
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    if (apiResponseTest.success) {
      console.log(`   ✅ API call successful - Status: ${apiResponseTest.status}`);
      console.log('   📊 Response Structure Analysis:');
      console.log(`      - Has 'success' field: ${apiResponseTest.responseStructure.hasSuccess}`);
      console.log(`      - Has 'data' field: ${apiResponseTest.responseStructure.hasData}`);
      console.log(`      - Data type: ${apiResponseTest.responseStructure.dataType}`);
      console.log(`      - Has nested 'data' field: ${apiResponseTest.responseStructure.hasNestedData}`);
      console.log(`      - Has 'pagination' field: ${apiResponseTest.responseStructure.hasPagination}`);
      console.log(`      - Data array length: ${apiResponseTest.responseStructure.dataLength}`);
      console.log(`      - Pagination keys: ${apiResponseTest.responseStructure.paginationKeys.join(', ')}`);
      
      if (apiResponseTest.responseStructure.dataLength > 0) {
        console.log('   📋 Sample case data:');
        const sampleCase = apiResponseTest.responseStructure.fullResponse.data.data[0];
        console.log(`      - ID: ${sampleCase.id}`);
        console.log(`      - Matter AR: ${sampleCase.matter_ar}`);
        console.log(`      - Matter EN: ${sampleCase.matter_en}`);
        console.log(`      - Client: ${sampleCase.client_name_ar || sampleCase.client_name_en}`);
      }
    } else {
      console.log(`   ❌ API call failed: ${apiResponseTest.error}`);
    }
    
    // Test API service response structure
    console.log('\n5. Testing API service response structure...');
    const apiServiceTest = await page.evaluate(async () => {
      try {
        const { apiService } = await import('/src/services/api.ts');
        const response = await apiService.get('/cases?page=1&limit=10');
        
        return {
          success: true,
          responseStructure: {
            hasSuccess: 'success' in response,
            hasData: 'data' in response,
            dataType: typeof response.data,
            hasNestedData: response.data && 'data' in response.data,
            hasPagination: response.data && 'pagination' in response.data,
            dataLength: response.data && response.data.data ? response.data.data.length : 0,
            fullResponse: response
          }
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    if (apiServiceTest.success) {
      console.log('   ✅ API service call successful');
      console.log('   📊 API Service Response Structure:');
      console.log(`      - Has 'success' field: ${apiServiceTest.responseStructure.hasSuccess}`);
      console.log(`      - Has 'data' field: ${apiServiceTest.responseStructure.hasData}`);
      console.log(`      - Data type: ${apiServiceTest.responseStructure.dataType}`);
      console.log(`      - Has nested 'data' field: ${apiServiceTest.responseStructure.hasNestedData}`);
      console.log(`      - Has 'pagination' field: ${apiServiceTest.responseStructure.hasPagination}`);
      console.log(`      - Data array length: ${apiServiceTest.responseStructure.dataLength}`);
    } else {
      console.log(`   ❌ API service call failed: ${apiServiceTest.error}`);
    }
    
    // Take screenshot
    console.log('\n6. Taking screenshot...');
    await page.screenshot({ path: 'api-response-structure-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as api-response-structure-test.png');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 API response structure testing completed!');
}

testAPIResponseStructure().catch(console.error);
