import { test, expect } from '@playwright/test';

test.describe('Debug Login Issue', () => {
  test('should debug login process step by step', async ({ page }) => {
    console.log('Starting detailed login debug...');
    
    // Listen to all network requests
    const requests = [];
    const responses = [];
    
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData()
      });
    });
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        headers: response.headers()
      });
    });
    
    // Listen to console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
    });
    
    // Step 1: Navigate to application
    console.log('Step 1: Navigating to application...');
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Step 2: Check initial state
    console.log('Step 2: Checking initial state...');
    const loginForm = page.locator('[data-testid="login-form"]');
    const isLoginFormVisible = await loginForm.isVisible();
    console.log('Login form visible:', isLoginFormVisible);
    
    if (!isLoginFormVisible) {
      console.log('Login form not visible, checking what is visible...');
      const body = await page.locator('body').textContent();
      console.log('Page content preview:', body.substring(0, 200));
    }
    
    // Step 3: Fill login form
    console.log('Step 3: Filling login form...');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');
    
    const emailVisible = await emailInput.isVisible();
    const passwordVisible = await passwordInput.isVisible();
    const buttonVisible = await loginButton.isVisible();
    
    console.log('Email input visible:', emailVisible);
    console.log('Password input visible:', passwordVisible);
    console.log('Login button visible:', buttonVisible);
    
    if (emailVisible && passwordVisible && buttonVisible) {
      await emailInput.fill('admin@litigation.com');
      await passwordInput.fill('admin123');
      
      // Step 4: Submit and monitor
      console.log('Step 4: Submitting login form...');
      await loginButton.click();
      
      // Wait for any network activity
      await page.waitForTimeout(5000);
      
      // Check current state
      const currentUrl = page.url();
      console.log('Current URL after login attempt:', currentUrl);
      
      // Check if still on login page
      const stillOnLogin = await loginForm.isVisible();
      console.log('Still on login page:', stillOnLogin);
      
      // Check for any error messages
      const errorMessages = page.locator('.alert-danger, .error, [class*="error"]');
      const hasErrors = await errorMessages.count();
      console.log('Number of error messages:', hasErrors);
      
      if (hasErrors > 0) {
        for (let i = 0; i < hasErrors; i++) {
          const errorText = await errorMessages.nth(i).textContent();
          console.log(`Error ${i + 1}:`, errorText);
        }
      }
      
      // Check for success messages
      const successMessages = page.locator('.alert-success, .success, [class*="success"]');
      const hasSuccess = await successMessages.count();
      console.log('Number of success messages:', hasSuccess);
      
      if (hasSuccess > 0) {
        for (let i = 0; i < hasSuccess; i++) {
          const successText = await successMessages.nth(i).textContent();
          console.log(`Success ${i + 1}:`, successText);
        }
      }
    }
    
    // Step 5: Analyze network requests
    console.log('Step 5: Analyzing network requests...');
    console.log('Total requests made:', requests.length);
    
    const loginRequests = requests.filter(req => 
      req.url.includes('/auth/login') || 
      req.url.includes('/login') ||
      req.method === 'POST'
    );
    
    console.log('Login-related requests:', loginRequests.length);
    loginRequests.forEach((req, index) => {
      console.log(`Request ${index + 1}:`, {
        url: req.url,
        method: req.method,
        hasPostData: !!req.postData
      });
    });
    
    // Step 6: Analyze responses
    console.log('Step 6: Analyzing responses...');
    console.log('Total responses received:', responses.length);
    
    const loginResponses = responses.filter(resp => 
      resp.url.includes('/auth/login') || 
      resp.url.includes('/login')
    );
    
    console.log('Login-related responses:', loginResponses.length);
    loginResponses.forEach((resp, index) => {
      console.log(`Response ${index + 1}:`, {
        url: resp.url,
        status: resp.status
      });
    });
    
    // Step 7: Analyze console messages
    console.log('Step 7: Analyzing console messages...');
    console.log('Total console messages:', consoleMessages.length);
    
    const errorMessages = consoleMessages.filter(msg => msg.type === 'error');
    const warningMessages = consoleMessages.filter(msg => msg.type === 'warning');
    const logMessages = consoleMessages.filter(msg => msg.type === 'log');
    
    console.log('Console errors:', errorMessages.length);
    errorMessages.forEach((msg, index) => {
      console.log(`Error ${index + 1}:`, msg.text);
    });
    
    console.log('Console warnings:', warningMessages.length);
    warningMessages.forEach((msg, index) => {
      console.log(`Warning ${index + 1}:`, msg.text);
    });
    
    console.log('Console logs:', logMessages.length);
    logMessages.forEach((msg, index) => {
      console.log(`Log ${index + 1}:`, msg.text);
    });
    
    // Step 8: Try manual navigation
    console.log('Step 8: Trying manual navigation...');
    await page.goto('http://localhost:3001/clients');
    await page.waitForLoadState('networkidle');
    
    const clientsUrl = page.url();
    console.log('URL after navigating to clients:', clientsUrl);
    
    // Check if we're redirected back to login
    const redirectedToLogin = clientsUrl.includes('/login') || clientsUrl === 'http://localhost:3001/';
    console.log('Redirected back to login:', redirectedToLogin);
    
    // Take final screenshot
    await page.screenshot({ path: 'test-results/debug-login-final.png' });
    console.log('Final debug screenshot saved');
    
    console.log('Detailed login debug completed');
  });
});

