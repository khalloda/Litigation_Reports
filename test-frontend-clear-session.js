import { chromium } from 'playwright';

async function testFrontendWithClearSession() {
  console.log('Testing Frontend Management Pages (with session clear)...\n');

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

        // Check navigation links
        const casesLink = await page.locator('a:has-text("القضايا")');
        const clientsLink = await page.locator('a:has-text("العملاء")');

        if (await casesLink.isVisible()) {
          console.log('   ✅ Cases navigation link is visible');
        } else {
          console.log('   ❌ Cases navigation link not found');
        }

        if (await clientsLink.isVisible()) {
          console.log('   ✅ Clients navigation link is visible');
        } else {
          console.log('   ❌ Clients navigation link not found');
        }

        // Test Cases page
        if (await casesLink.isVisible()) {
          console.log('5. Testing Cases page...');
          await casesLink.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);

          const casesHeader = await page.locator('h2:has-text("إدارة القضايا")');
          if (await casesHeader.isVisible()) {
            console.log('   ✅ Cases management page loaded successfully');

            // Check for cases table or loading state
            const casesTable = await page.locator('table');
            const loadingSpinner = await page.locator('.spinner-border');

            if (await casesTable.isVisible()) {
              console.log('   ✅ Cases table is visible');
            } else if (await loadingSpinner.isVisible()) {
              console.log('   ⚠️  Cases page is loading...');
            } else {
              console.log('   ⚠️  Cases table not visible (might be empty or error)');
            }
          } else {
            console.log('   ❌ Cases management page did not load');
          }
        }

        // Test Clients page
        if (await clientsLink.isVisible()) {
          console.log('6. Testing Clients page...');
          await clientsLink.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);

          const clientsHeader = await page.locator('h2:has-text("إدارة العملاء")');
          if (await clientsHeader.isVisible()) {
            console.log('   ✅ Clients management page loaded successfully');

            // Check for clients table or loading state
            const clientsTable = await page.locator('table');
            const loadingSpinner = await page.locator('.spinner-border');

            if (await clientsTable.isVisible()) {
              console.log('   ✅ Clients table is visible');
            } else if (await loadingSpinner.isVisible()) {
              console.log('   ⚠️  Clients page is loading...');
            } else {
              console.log('   ⚠️  Clients table not visible (might be empty or error)');
            }
          } else {
            console.log('   ❌ Clients management page did not load');
          }
        }
      } else {
        console.log('   ❌ Navigation bar not found after login');
      }
    } else {
      console.log('   ❌ Login page not visible');
    }

    // Take a screenshot
    console.log('7. Taking screenshot...');
    await page.screenshot({ path: 'frontend-management-pages-clear-session.png', fullPage: true });
    console.log('   ✅ Screenshot saved as frontend-management-pages-clear-session.png');
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }

  console.log('\n🎉 Frontend management pages testing completed!');
}

testFrontendWithClearSession().catch(console.error);
