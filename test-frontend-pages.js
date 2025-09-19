import { chromium } from 'playwright';

async function testFrontendPages() {
  console.log('Testing Frontend Management Pages...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the frontend
    console.log('1. Navigating to frontend...');
    await page.goto('http://lit.local:3001');
    await page.waitForLoadState('networkidle');
    
    // Check if login page is shown
    console.log('2. Checking login page...');
    const loginForm = await page.locator('form').first();
    if (await loginForm.isVisible()) {
      console.log('   ✅ Login page is visible');
      
      // Login
      console.log('3. Logging in...');
      await page.fill('input[type="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      
      // Wait for dashboard
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('.navbar', { timeout: 10000 });
      console.log('   ✅ Login successful, dashboard loaded');
    } else {
      console.log('   ✅ Already logged in');
    }
    
    // Check navigation
    console.log('4. Checking navigation...');
    const navbar = await page.locator('.navbar');
    if (await navbar.isVisible()) {
      console.log('   ✅ Navigation bar is visible');
      
      // Check if Cases link exists
      const casesLink = await page.locator('a:has-text("القضايا")');
      if (await casesLink.isVisible()) {
        console.log('   ✅ Cases navigation link is visible');
        
        // Click on Cases
        console.log('5. Testing Cases page...');
        await casesLink.click();
        await page.waitForLoadState('networkidle');
        
        // Check if Cases page loaded
        const casesHeader = await page.locator('h2:has-text("إدارة القضايا")');
        if (await casesHeader.isVisible()) {
          console.log('   ✅ Cases management page loaded successfully');
          
          // Check if cases table is visible
          const casesTable = await page.locator('table');
          if (await casesTable.isVisible()) {
            console.log('   ✅ Cases table is visible');
          } else {
            console.log('   ⚠️  Cases table not visible (might be loading or empty)');
          }
        } else {
          console.log('   ❌ Cases management page did not load');
        }
      } else {
        console.log('   ❌ Cases navigation link not found');
      }
      
      // Check if Clients link exists
      const clientsLink = await page.locator('a:has-text("العملاء")');
      if (await clientsLink.isVisible()) {
        console.log('   ✅ Clients navigation link is visible');
        
        // Click on Clients
        console.log('6. Testing Clients page...');
        await clientsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Check if Clients page loaded
        const clientsHeader = await page.locator('h2:has-text("إدارة العملاء")');
        if (await clientsHeader.isVisible()) {
          console.log('   ✅ Clients management page loaded successfully');
          
          // Check if clients table is visible
          const clientsTable = await page.locator('table');
          if (await clientsTable.isVisible()) {
            console.log('   ✅ Clients table is visible');
          } else {
            console.log('   ⚠️  Clients table not visible (might be loading or empty)');
          }
        } else {
          console.log('   ❌ Clients management page did not load');
        }
      } else {
        console.log('   ❌ Clients navigation link not found');
      }
    } else {
      console.log('   ❌ Navigation bar not found');
    }
    
    // Take a screenshot
    console.log('7. Taking screenshot...');
    await page.screenshot({ path: 'frontend-management-pages.png', fullPage: true });
    console.log('   ✅ Screenshot saved as frontend-management-pages.png');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 Frontend management pages testing completed!');
}

testFrontendPages().catch(console.error);
