import { chromium } from 'playwright';

async function debugFrontend() {
  console.log('Debugging Frontend...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen to console messages
  page.on('console', msg => {
    console.log('CONSOLE:', msg.text());
  });
  
  // Listen to network requests
  page.on('request', request => {
    console.log('REQUEST:', request.method(), request.url());
  });
  
  // Listen to network responses
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('ERROR RESPONSE:', response.status(), response.url());
    }
  });
  
  try {
    console.log('1. Navigating to frontend...');
    await page.goto('http://lit.local:3001');
    await page.waitForLoadState('networkidle');
    
    console.log('2. Getting page content...');
    const bodyText = await page.textContent('body');
    console.log('Body content length:', bodyText.length);
    
    console.log('3. Checking for specific elements...');
    
    // Check for login form
    const loginForm = await page.locator('form').count();
    console.log('Login forms found:', loginForm);
    
    // Check for navigation
    const navbar = await page.locator('.navbar').count();
    console.log('Navbars found:', navbar);
    
    // Check for any h1, h2, h3 elements
    const headings = await page.locator('h1, h2, h3').count();
    console.log('Headings found:', headings);
    
    if (headings > 0) {
      const headingTexts = await page.locator('h1, h2, h3').allTextContents();
      console.log('Heading texts:', headingTexts);
    }
    
    // Check for any buttons
    const buttons = await page.locator('button').count();
    console.log('Buttons found:', buttons);
    
    // Check for any divs with specific classes
    const appDiv = await page.locator('.app').count();
    console.log('App divs found:', appDiv);
    
    const rootDiv = await page.locator('#root').count();
    console.log('Root divs found:', rootDiv);
    
    // Get the HTML content of the root div
    const rootContent = await page.innerHTML('#root');
    console.log('Root content length:', rootContent.length);
    console.log('Root content preview:', rootContent.substring(0, 500));
    
    // Take a screenshot
    await page.screenshot({ path: 'frontend-debug.png', fullPage: true });
    console.log('Screenshot saved as frontend-debug.png');
    
  } catch (error) {
    console.error('❌ Error during debugging:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 Frontend debugging completed!');
}

debugFrontend().catch(console.error);
