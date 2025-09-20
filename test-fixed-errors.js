import { chromium } from 'playwright';

async function testFixedErrors() {
  console.log('🔧 Testing Fixed "Failed to load" Errors...\n');
  
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
      const text = msg.text();
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', text);
      } else if (text.includes('Failed') || text.includes('Error') || text.includes('API')) {
        console.log('🔍 Console Log:', text);
      }
    });
    
    // Login first
    console.log('\n2. Logging in...');
    const loginForm = await page.locator('form').first();
    if (await loginForm.isVisible()) {
      await page.fill('input[type="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    }
    
    // Check for error messages
    console.log('\n3. Checking for error messages...');
    const errorCheck = await page.evaluate(() => {
      const errorMessages = document.querySelectorAll('.alert-danger, .error, [class*="error"]');
      const failedElements = [];
      const allElements = document.querySelectorAll('*');
      
      allElements.forEach(el => {
        const text = el.textContent?.trim() || '';
        if (text.includes('Failed to load')) {
          failedElements.push({
            tagName: el.tagName,
            className: el.className,
            text: text
          });
        }
      });
      
      return {
        errorCount: errorMessages.length,
        errorTexts: Array.from(errorMessages).map(el => el.textContent.trim()),
        failedCount: failedElements.length,
        failedElements: failedElements
      };
    });
    
    console.log('   📊 Error Check Results:');
    console.log(`      Error Messages: ${errorCheck.errorCount}`);
    if (errorCheck.errorTexts.length > 0) {
      console.log(`      Error Texts: ${errorCheck.errorTexts.join(', ')}`);
    }
    console.log(`      Failed Messages: ${errorCheck.failedCount}`);
    if (errorCheck.failedElements.length > 0) {
      errorCheck.failedElements.forEach((el, index) => {
        console.log(`         ${index + 1}. ${el.tagName}.${el.className}: "${el.text}"`);
      });
    }
    
    // Test API calls directly
    console.log('\n4. Testing API calls...');
    const apiTest = await page.evaluate(async () => {
      const results = {};
      
      // Test cases endpoint
      try {
        const response = await fetch('/api/cases');
        const data = await response.json();
        results.cases = {
          success: true,
          status: response.status,
          dataCount: data.data?.data?.length || 0,
          hasData: !!(data.data?.data?.length > 0)
        };
      } catch (error) {
        results.cases = {
          success: false,
          error: error.message
        };
      }
      
      // Test clients endpoint
      try {
        const response = await fetch('/api/clients');
        const data = await response.json();
        results.clients = {
          success: true,
          status: response.status,
          dataCount: data.data?.data?.length || 0,
          hasData: !!(data.data?.data?.length > 0)
        };
      } catch (error) {
        results.clients = {
          success: false,
          error: error.message
        };
      }
      
      // Test hearings endpoint
      try {
        const response = await fetch('/api/hearings');
        const data = await response.json();
        results.hearings = {
          success: true,
          status: response.status,
          dataCount: data.data?.data?.length || 0,
          hasData: !!(data.data?.data?.length > 0)
        };
      } catch (error) {
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
      } else {
        console.log(`      ❌ ${endpoint}: ${result.error}`);
      }
    });
    
    // Navigate to different pages to test
    console.log('\n5. Testing navigation...');
    
    // Try to find and click navigation links
    const navTest = await page.evaluate(() => {
      const links = document.querySelectorAll('a, button');
      const navLinks = [];
      
      links.forEach(link => {
        const text = link.textContent?.trim() || '';
        if (text.includes('القضايا') || text.includes('Cases') || 
            text.includes('العملاء') || text.includes('Clients') ||
            text.includes('الجلسات') || text.includes('Hearings')) {
          navLinks.push({
            text: text,
            tagName: link.tagName,
            className: link.className
          });
        }
      });
      
      return navLinks;
    });
    
    console.log(`   📊 Found ${navTest.length} navigation links`);
    navTest.forEach((link, index) => {
      console.log(`      ${index + 1}. ${link.tagName}: "${link.text}"`);
    });
    
    // Try to click on each navigation link
    for (const link of navTest) {
      try {
        console.log(`   📝 Clicking: "${link.text}"`);
        const element = page.locator(`text="${link.text}"`).first();
        if (await element.isVisible()) {
          await element.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);
          
          // Check for errors after navigation
          const afterNav = await page.evaluate(() => {
            const failedElements = [];
            const allElements = document.querySelectorAll('*');
            
            allElements.forEach(el => {
              const text = el.textContent?.trim() || '';
              if (text.includes('Failed to load')) {
                failedElements.push({
                  tagName: el.tagName,
                  className: el.className,
                  text: text
                });
              }
            });
            
            return {
              url: window.location.href,
              failedCount: failedElements.length,
              failedElements: failedElements
            };
          });
          
          console.log(`      📊 After navigation: ${afterNav.failedCount} failed messages`);
          if (afterNav.failedElements.length > 0) {
            afterNav.failedElements.forEach((el, index) => {
              console.log(`         ${index + 1}. ${el.tagName}.${el.className}: "${el.text}"`);
            });
          }
        }
      } catch (error) {
        console.log(`      ❌ Error clicking "${link.text}": ${error.message}`);
      }
    }
    
    // Take screenshot
    console.log('\n6. Taking screenshot...');
    await page.screenshot({ path: 'fixed-errors-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as fixed-errors-test.png');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 Fixed errors testing completed!');
}

testFixedErrors().catch(console.error);
