import { chromium } from 'playwright';

async function testHearingsFrontend() {
  console.log('Testing Hearings Frontend Page...\n');
  
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
    
    // Check if login page is shown
    console.log('3. Checking login page...');
    const loginForm = await page.locator('form').first();
    if (await loginForm.isVisible()) {
      console.log('   ✅ Login page is visible');
      
      // Login
      console.log('4. Logging in...');
      await page.fill('input[type="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Check if we're on the dashboard with navigation
      const navbar = await page.locator('.navbar').first();
      if (await navbar.isVisible()) {
        console.log('   ✅ Navigation bar is visible after login');
        
        // Check if Hearings link exists
        const hearingsLink = await page.locator('a:has-text("الجلسات")');
        if (await hearingsLink.isVisible()) {
          console.log('   ✅ Hearings navigation link is visible');
          
          // Click on Hearings
          console.log('5. Testing Hearings page...');
          await hearingsLink.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);
          
          // Check if Hearings page loaded
          const hearingsHeader = await page.locator('h2:has-text("إدارة الجلسات")');
          if (await hearingsHeader.isVisible()) {
            console.log('   ✅ Hearings management page loaded successfully');
            
            // Check for hearings table or loading state
            const hearingsTable = await page.locator('table');
            const loadingSpinner = await page.locator('.spinner-border');
            
            if (await hearingsTable.isVisible()) {
              console.log('   ✅ Hearings table is visible');
              
              // Check if there are any hearings
              const tableRows = await page.locator('table tbody tr').count();
              console.log(`   📊 Table rows found: ${tableRows}`);
              
              if (tableRows > 0) {
                console.log('   ✅ Hearings data is displayed');
              } else {
                console.log('   ⚠️  No hearings data (table is empty)');
              }
            } else if (await loadingSpinner.isVisible()) {
              console.log('   ⚠️  Hearings page is loading...');
            } else {
              console.log('   ⚠️  Hearings table not visible (might be empty or error)');
            }
          } else {
            console.log('   ❌ Hearings management page did not load');
          }
        } else {
          console.log('   ❌ Hearings navigation link not found');
        }
      } else {
        console.log('   ❌ Navigation bar not found after login');
      }
    } else {
      console.log('   ❌ Login page not visible');
    }
    
    // Take a screenshot
    console.log('6. Taking screenshot...');
    await page.screenshot({ path: 'hearings-frontend-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as hearings-frontend-test.png');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 Hearings frontend testing completed!');
}

testHearingsFrontend().catch(console.error);
