import { test, expect } from '@playwright/test';

test.describe('Comprehensive Login to Logo Upload Flow', () => {
  test('should complete full flow from login to logo upload and client save', async ({ page }) => {
    console.log('Starting comprehensive test...');
    
    // Step 1: Navigate to the application
    console.log('Step 1: Navigating to application...');
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ path: 'test-results/01-initial-page.png' });
    console.log('Initial page screenshot saved');
    
    // Step 2: Check if we're on login page
    console.log('Step 2: Checking login page...');
    const loginForm = page.locator('[data-testid="login-form"]');
    await expect(loginForm).toBeVisible({ timeout: 10000 });
    console.log('Login form found');
    
    // Step 3: Fill login form
    console.log('Step 3: Filling login form...');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');
    
    await emailInput.fill('admin@litigation.com');
    await passwordInput.fill('admin123');
    
    // Take screenshot before login
    await page.screenshot({ path: 'test-results/02-before-login.png' });
    console.log('Before login screenshot saved');
    
    // Step 4: Submit login form
    console.log('Step 4: Submitting login form...');
    await loginButton.click();
    
    // Wait for navigation or response
    await page.waitForTimeout(3000);
    
    // Take screenshot after login attempt
    await page.screenshot({ path: 'test-results/03-after-login.png' });
    console.log('After login screenshot saved');
    
    // Step 5: Check if login was successful
    console.log('Step 5: Checking login success...');
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);
    
    // Check for dashboard or clients page
    const isOnDashboard = currentUrl.includes('/dashboard') || currentUrl.includes('/clients');
    console.log('Is on dashboard/clients page:', isOnDashboard);
    
    if (!isOnDashboard) {
      // Try to navigate to clients page manually
      console.log('Step 6: Manually navigating to clients page...');
      await page.goto('http://localhost:3001/clients');
      await page.waitForLoadState('networkidle');
      
      // Take screenshot of clients page
      await page.screenshot({ path: 'test-results/04-clients-page.png' });
      console.log('Clients page screenshot saved');
    }
    
    // Step 7: Check if we can see clients page
    console.log('Step 7: Checking clients page...');
    const clientsPageTitle = page.locator('h1, h2, h3').first();
    const pageTitle = await clientsPageTitle.textContent();
    console.log('Page title:', pageTitle);
    
    // Look for client management elements
    const addClientButton = page.locator('button:has-text("Add Client"), button:has-text("إضافة عميل")');
    const clientTable = page.locator('table, .table');
    
    console.log('Add client button visible:', await addClientButton.isVisible());
    console.log('Client table visible:', await clientTable.isVisible());
    
    // Step 8: Try to open client modal
    console.log('Step 8: Opening client modal...');
    if (await addClientButton.isVisible()) {
      await addClientButton.click();
      await page.waitForTimeout(2000);
      
      // Take screenshot of modal
      await page.screenshot({ path: 'test-results/05-client-modal.png' });
      console.log('Client modal screenshot saved');
      
      // Step 9: Fill client form
      console.log('Step 9: Filling client form...');
      const clientNameAr = page.locator('input[name="client_name_ar"], input[placeholder*="اسم العميل"]');
      const clientNameEn = page.locator('input[name="client_name_en"], input[placeholder*="Client Name"]');
      
      if (await clientNameAr.isVisible()) {
        await clientNameAr.fill('Sarieldin and Partners');
        console.log('Filled Arabic client name');
      }
      
      if (await clientNameEn.isVisible()) {
        await clientNameEn.fill('Sarieldin and Partners');
        console.log('Filled English client name');
      }
      
      // Step 10: Upload logo file
      console.log('Step 10: Uploading logo file...');
      const fileInput = page.locator('input[type="file"]');
      
      if (await fileInput.isVisible()) {
        // Use the specific logo file mentioned by the user
        await fileInput.setInputFiles('logo/emblem_green_gold.png');
        console.log('Logo file uploaded');
        
        // Wait for preview to appear
        await page.waitForTimeout(2000);
        
        // Take screenshot after file upload
        await page.screenshot({ path: 'test-results/06-after-logo-upload.png' });
        console.log('After logo upload screenshot saved');
        
        // Check if preview appeared
        const logoPreview = page.locator('img[alt*="logo"], img[alt*="Logo"], img[alt*="عميل"]');
        const previewVisible = await logoPreview.isVisible();
        console.log('Logo preview visible:', previewVisible);
      } else {
        console.log('File input not found');
      }
      
      // Step 11: Save client
      console.log('Step 11: Saving client...');
      const saveButton = page.locator('button:has-text("Save"), button:has-text("حفظ"), button[type="submit"]');
      
      if (await saveButton.isVisible()) {
        // Take screenshot before save
        await page.screenshot({ path: 'test-results/07-before-save.png' });
        console.log('Before save screenshot saved');
        
        await saveButton.click();
        console.log('Save button clicked');
        
        // Wait for response
        await page.waitForTimeout(5000);
        
        // Take screenshot after save attempt
        await page.screenshot({ path: 'test-results/08-after-save.png' });
        console.log('After save screenshot saved');
        
        // Check for success/error messages
        const successMessage = page.locator('.alert-success, .toast-success, [class*="success"]');
        const errorMessage = page.locator('.alert-danger, .toast-error, [class*="error"]');
        
        const hasSuccess = await successMessage.isVisible();
        const hasError = await errorMessage.isVisible();
        
        console.log('Success message visible:', hasSuccess);
        console.log('Error message visible:', hasError);
        
        if (hasSuccess) {
          const successText = await successMessage.textContent();
          console.log('Success message:', successText);
        }
        
        if (hasError) {
          const errorText = await errorMessage.textContent();
          console.log('Error message:', errorText);
        }
      } else {
        console.log('Save button not found');
      }
    } else {
      console.log('Add client button not visible - cannot proceed with client creation');
    }
    
    // Step 12: Check browser console for errors
    console.log('Step 12: Checking browser console...');
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
    });
    
    // Wait a bit more to collect console messages
    await page.waitForTimeout(2000);
    
    // Log any console errors
    const errors = consoleLogs.filter(log => log.type === 'error');
    if (errors.length > 0) {
      console.log('Console errors found:');
      errors.forEach(error => {
        console.log(`- ${error.text} (${error.location.url}:${error.location.lineNumber})`);
      });
    }
    
    // Log any console warnings
    const warnings = consoleLogs.filter(log => log.type === 'warning');
    if (warnings.length > 0) {
      console.log('Console warnings found:');
      warnings.forEach(warning => {
        console.log(`- ${warning.text}`);
      });
    }
    
    // Final screenshot
    await page.screenshot({ path: 'test-results/09-final-state.png' });
    console.log('Final state screenshot saved');
    
    console.log('Comprehensive test completed');
  });
});

