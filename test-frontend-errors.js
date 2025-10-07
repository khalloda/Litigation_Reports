import { chromium } from 'playwright';

async function testFrontendErrors() {
  console.log('Testing Frontend for JavaScript Errors...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  let hasErrors = false;

  // Listen to console messages
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();

    if (type === 'error') {
      console.log('❌ CONSOLE ERROR:', text);
      hasErrors = true;
    } else if (type === 'warning') {
      console.log('⚠️  CONSOLE WARNING:', text);
    } else {
      console.log('ℹ️  CONSOLE:', text);
    }
  });

  // Listen to page errors
  page.on('pageerror', (error) => {
    console.log('❌ PAGE ERROR:', error.message);
    hasErrors = true;
  });

  // Listen to network responses
  page.on('response', (response) => {
    if (response.status() >= 400) {
      console.log('❌ HTTP ERROR:', response.status(), response.url());
      hasErrors = true;
    }
  });

  try {
    console.log('1. Navigating to frontend...');
    await page.goto('http://lit.local:3001');

    console.log('2. Waiting for page to load...');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait a bit more for React to render

    console.log('3. Checking if React app rendered...');
    const rootContent = await page.innerHTML('#root');
    console.log('Root content length:', rootContent.length);

    if (rootContent.length === 0) {
      console.log('❌ React app did not render - root is empty');
      hasErrors = true;
    } else {
      console.log('✅ React app rendered successfully');
      console.log('Root content preview:', rootContent.substring(0, 200));
    }

    // Check for specific React elements
    const reactElements = await page.locator('[data-reactroot], .app, .container').count();
    console.log('React elements found:', reactElements);

    // Take a screenshot
    await page.screenshot({ path: 'frontend-errors.png', fullPage: true });
    console.log('Screenshot saved as frontend-errors.png');
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    hasErrors = true;
  } finally {
    await browser.close();
  }

  if (hasErrors) {
    console.log('\n❌ Frontend has errors - check console output above');
  } else {
    console.log('\n✅ Frontend loaded without errors');
  }

  console.log('\n🎉 Frontend error testing completed!');
}

testFrontendErrors().catch(console.error);
