import { test, expect } from '@playwright/test';

test.describe('Debug Login Test', () => {
  test('should debug login and navigation issues', async ({ page }) => {
    console.log('Starting debug login test...');
    
    // Listen for console messages
    page.on('console', msg => {
      console.log(`Browser console ${msg.type()}: ${msg.text()}`);
    });
    
    // Listen for network requests
    page.on('request', request => {
      console.log(`Request: ${request.method()} ${request.url()}`);
    });
    
    // Listen for network responses
    page.on('response', response => {
      console.log(`Response: ${response.status()} ${response.url()}`);
    });
    
    // Navigate to the application
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    console.log('Page loaded');
    
    // Take a screenshot of the initial page
    await page.screenshot({ path: 'debug-initial-page.png', fullPage: true });
    console.log('Initial page screenshot saved');
    
    // Check if we're on login page
    const loginForm = page.locator('form, input[type="email"], input[type="password"]');
    if (await loginForm.count() > 0) {
      console.log('Login form detected');
      
      // Fill login form
      await page.fill('input[type="email"], input[name="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"], input[name="password"]', 'admin123');
      
      // Take screenshot before login
      await page.screenshot({ path: 'debug-before-login.png', fullPage: true });
      console.log('Before login screenshot saved');
      
      // Click login button
      await page.click('button[type="submit"], .btn-primary, button:has-text("Login")');
      
      // Wait for login to complete
      await page.waitForLoadState('networkidle');
      console.log('Login attempt completed');
      
      // Take screenshot after login
      await page.screenshot({ path: 'debug-after-login.png', fullPage: true });
      console.log('After login screenshot saved');
      
      // Check current URL
      const currentUrl = page.url();
      console.log('Current URL after login:', currentUrl);
      
      // Check if we're redirected to dashboard or clients
      if (currentUrl.includes('/dashboard') || currentUrl.includes('/clients')) {
        console.log('Successfully redirected after login');
      } else {
        console.log('Not redirected to expected page');
      }
      
      // Try to navigate to clients page
      console.log('Attempting to navigate to clients page...');
      await page.goto('http://localhost:3001/clients');
      await page.waitForLoadState('networkidle');
      
      // Take screenshot of clients page
      await page.screenshot({ path: 'debug-clients-page.png', fullPage: true });
      console.log('Clients page screenshot saved');
      
      // Check what's on the clients page
      const pageTitle = await page.title();
      console.log('Page title:', pageTitle);
      
      // Check for any error messages
      const errorMessages = page.locator('.alert-danger, .error, .text-danger');
      if (await errorMessages.count() > 0) {
        console.log('Error messages found:');
        for (let i = 0; i < await errorMessages.count(); i++) {
          const errorText = await errorMessages.nth(i).textContent();
          console.log(`Error ${i + 1}: ${errorText}`);
        }
      }
      
      // Check for any success messages
      const successMessages = page.locator('.alert-success, .success, .text-success');
      if (await successMessages.count() > 0) {
        console.log('Success messages found:');
        for (let i = 0; i < await successMessages.count(); i++) {
          const successText = await successMessages.nth(i).textContent();
          console.log(`Success ${i + 1}: ${successText}`);
        }
      }
      
      // List all buttons on the page
      const allButtons = page.locator('button');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} buttons on the page:`);
      for (let i = 0; i < buttonCount; i++) {
        const button = allButtons.nth(i);
        const text = await button.textContent();
        const isVisible = await button.isVisible();
        console.log(`Button ${i}: "${text}" (visible: ${isVisible})`);
      }
      
      // List all links on the page
      const allLinks = page.locator('a');
      const linkCount = await allLinks.count();
      console.log(`Found ${linkCount} links on the page:`);
      for (let i = 0; i < linkCount; i++) {
        const link = allLinks.nth(i);
        const text = await link.textContent();
        const href = await link.getAttribute('href');
        const isVisible = await link.isVisible();
        console.log(`Link ${i}: "${text}" -> "${href}" (visible: ${isVisible})`);
      }
      
    } else {
      console.log('No login form found');
    }
  });
});

