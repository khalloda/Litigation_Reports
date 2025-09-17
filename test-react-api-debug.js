import { chromium } from 'playwright';

async function testReactApiDebug() {
  console.log('🔍 Debugging React API Issues...\n');
  
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
      } else if (msg.text().includes('API') || msg.text().includes('Failed')) {
        console.log('🔍 Console Log:', msg.text());
      }
    });
    
    // Test API call directly in browser context
    console.log('\n2. Testing API call in browser context...');
    const apiTest = await page.evaluate(async () => {
      try {
        console.log('Making API call to /api/cases...');
        const response = await fetch('/api/cases');
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const text = await response.text();
        console.log('Response text length:', text.length);
        console.log('Response text preview:', text.substring(0, 200));
        
        const data = JSON.parse(text);
        console.log('Parsed data:', data);
        
        return {
          success: true,
          status: response.status,
          data: data,
          textLength: text.length
        };
      } catch (error) {
        console.error('API call failed:', error);
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    if (apiTest.success) {
      console.log('   ✅ API call successful');
      console.log(`   📊 Status: ${apiTest.status}`);
      console.log(`   📊 Data length: ${apiTest.textLength} characters`);
      console.log(`   📊 Data preview: ${JSON.stringify(apiTest.data).substring(0, 200)}...`);
    } else {
      console.log(`   ❌ API call failed: ${apiTest.error}`);
    }
    
    // Check if React components are loading
    console.log('\n3. Checking React components...');
    const componentCheck = await page.evaluate(() => {
      const casesSection = document.querySelector('[data-testid="cases-section"]') || 
                          document.querySelector('.cases-section') ||
                          document.querySelector('h1, h2, h3, h4, h5, h6');
      
      const errorMessages = document.querySelectorAll('.alert-danger, .error, [class*="error"]');
      const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"]');
      
      return {
        hasCasesSection: !!casesSection,
        casesSectionText: casesSection ? casesSection.textContent : null,
        errorCount: errorMessages.length,
        errorTexts: Array.from(errorMessages).map(el => el.textContent),
        loadingCount: loadingElements.length
      };
    });
    
    console.log('   📊 Component Check Results:');
    console.log(`      Cases Section: ${componentCheck.hasCasesSection ? 'Found' : 'Not found'}`);
    if (componentCheck.casesSectionText) {
      console.log(`      Section Text: ${componentCheck.casesSectionText.substring(0, 100)}...`);
    }
    console.log(`      Error Messages: ${componentCheck.errorCount}`);
    if (componentCheck.errorTexts.length > 0) {
      console.log(`      Error Texts: ${componentCheck.errorTexts.join(', ')}`);
    }
    console.log(`      Loading Elements: ${componentCheck.loadingCount}`);
    
    // Wait a bit and check again
    console.log('\n4. Waiting for data to load...');
    await page.waitForTimeout(3000);
    
    const finalCheck = await page.evaluate(() => {
      const errorMessages = document.querySelectorAll('.alert-danger, .error, [class*="error"]');
      const dataElements = document.querySelectorAll('[class*="table"], [class*="list"], [class*="card"]');
      
      return {
        errorCount: errorMessages.length,
        errorTexts: Array.from(errorMessages).map(el => el.textContent),
        dataElementCount: dataElements.length
      };
    });
    
    console.log('   📊 Final Check Results:');
    console.log(`      Error Messages: ${finalCheck.errorCount}`);
    if (finalCheck.errorTexts.length > 0) {
      console.log(`      Error Texts: ${finalCheck.errorTexts.join(', ')}`);
    }
    console.log(`      Data Elements: ${finalCheck.dataElementCount}`);
    
    // Take screenshot
    console.log('\n5. Taking screenshot...');
    await page.screenshot({ path: 'react-api-debug-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as react-api-debug-test.png');
    
  } catch (error) {
    console.error('❌ Error during debugging:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 React API debugging completed!');
}

testReactApiDebug().catch(console.error);
