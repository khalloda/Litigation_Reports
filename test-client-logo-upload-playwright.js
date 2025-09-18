const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Client Logo Upload Test', () => {
  test('should upload logo file to existing client "Sarieldin and Partners"', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3001');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if we need to login first
    const loginForm = page.locator('form[data-testid="login-form"], .login-form, input[type="email"]');
    if (await loginForm.count() > 0) {
      console.log('Login form detected, attempting to login...');
      
      // Fill login form
      await page.fill('input[type="email"], input[name="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"], input[name="password"]', 'admin123');
      
      // Click login button
      await page.click('button[type="submit"], .btn-primary');
      
      // Wait for login to complete
      await page.waitForLoadState('networkidle');
    }
    
    // Navigate to clients page
    console.log('Navigating to clients page...');
    await page.click('a[href*="clients"], [data-testid="clients-link"], .nav-link:has-text("Clients")');
    await page.waitForLoadState('networkidle');
    
    // Look for "Sarieldin and Partners" client
    console.log('Looking for "Sarieldin and Partners" client...');
    const clientRow = page.locator('tr, .client-row').filter({ hasText: 'Sarieldin and Partners' });
    
    if (await clientRow.count() === 0) {
      console.log('Client not found, creating a new client first...');
      
      // Click add client button
      await page.click('button:has-text("Add"), .btn-primary:has-text("Add"), [data-testid="add-client"]');
      await page.waitForLoadState('networkidle');
      
      // Fill client form
      await page.fill('input[name="client_name_ar"], [data-testid="client-name-ar"]', 'Sarieldin and Partners');
      await page.fill('input[name="client_name_en"], [data-testid="client-name-en"]', 'Sarieldin and Partners');
      await page.selectOption('select[name="client_type"], [data-testid="client-type"]', 'company');
      await page.selectOption('select[name="cash_pro_bono"], [data-testid="service-type"]', 'cash');
      await page.selectOption('select[name="status"], [data-testid="client-status"]', 'active');
      
      // Save the client first
      await page.click('button:has-text("Save"), .btn-primary:has-text("Save"), [data-testid="save-client"]');
      await page.waitForLoadState('networkidle');
      
      // Wait a moment for the client to be created
      await page.waitForTimeout(2000);
    }
    
    // Now find and edit the client
    console.log('Looking for client to edit...');
    const editButton = page.locator('tr, .client-row')
      .filter({ hasText: 'Sarieldin and Partners' })
      .locator('button:has-text("Edit"), .btn-outline-primary, [data-testid="edit-client"]')
      .first();
    
    await expect(editButton).toBeVisible({ timeout: 10000 });
    await editButton.click();
    
    // Wait for modal to open
    await page.waitForLoadState('networkidle');
    
    // Check if modal is open
    const modal = page.locator('.modal, [role="dialog"], .client-modal');
    await expect(modal).toBeVisible({ timeout: 10000 });
    
    console.log('Modal opened, looking for file input...');
    
    // Find the file input for logo upload
    const fileInput = page.locator('input[type="file"], input[accept*="image"], [data-testid="logo-upload"]');
    await expect(fileInput).toBeVisible({ timeout: 10000 });
    
    // Get the path to the logo file
    const logoPath = path.resolve(__dirname, 'logo', 'emblem_green_gold.png');
    console.log('Uploading logo file:', logoPath);
    
    // Upload the file
    await fileInput.setInputFiles(logoPath);
    
    // Wait for file to be processed
    await page.waitForTimeout(1000);
    
    // Check if file preview is shown
    const filePreview = page.locator('img[src*="blob:"], .logo-preview, .file-preview');
    if (await filePreview.count() > 0) {
      console.log('File preview shown successfully');
    }
    
    // Look for save button
    console.log('Looking for save button...');
    const saveButton = page.locator('button:has-text("Save"), .btn-primary:has-text("Save"), [data-testid="save-client"]');
    await expect(saveButton).toBeVisible({ timeout: 10000 });
    
    // Click save button
    console.log('Clicking save button...');
    await saveButton.click();
    
    // Wait for save operation to complete
    await page.waitForLoadState('networkidle');
    
    // Check for success message or error
    const successMessage = page.locator('.alert-success, .toast-success, [data-testid="success-message"]');
    const errorMessage = page.locator('.alert-danger, .toast-error, [data-testid="error-message"]');
    
    if (await successMessage.count() > 0) {
      console.log('Success message found:', await successMessage.textContent());
    } else if (await errorMessage.count() > 0) {
      console.log('Error message found:', await errorMessage.textContent());
    }
    
    // Wait a moment for any animations
    await page.waitForTimeout(2000);
    
    // Check if modal is closed
    const modalStillOpen = page.locator('.modal.show, [role="dialog"]:not([style*="display: none"])');
    if (await modalStillOpen.count() === 0) {
      console.log('Modal closed successfully');
    } else {
      console.log('Modal is still open');
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'client-logo-upload-test.png', fullPage: true });
    console.log('Screenshot saved as client-logo-upload-test.png');
  });
  
  test('should handle file upload errors gracefully', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Check if we need to login first
    const loginForm = page.locator('form[data-testid="login-form"], .login-form, input[type="email"]');
    if (await loginForm.count() > 0) {
      await page.fill('input[type="email"], input[name="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"], input[name="password"]', 'admin123');
      await page.click('button[type="submit"], .btn-primary');
      await page.waitForLoadState('networkidle');
    }
    
    // Navigate to clients page
    await page.click('a[href*="clients"], [data-testid="clients-link"], .nav-link:has-text("Clients")');
    await page.waitForLoadState('networkidle');
    
    // Click add client button
    await page.click('button:has-text("Add"), .btn-primary:has-text("Add"), [data-testid="add-client"]');
    await page.waitForLoadState('networkidle');
    
    // Try to upload a file that's too large (create a dummy large file)
    const largeFilePath = path.resolve(__dirname, 'test-large-file.txt');
    
    // Create a large file for testing
    const fs = require('fs');
    const largeContent = 'x'.repeat(6 * 1024 * 1024); // 6MB
    fs.writeFileSync(largeFilePath, largeContent);
    
    try {
      const fileInput = page.locator('input[type="file"], input[accept*="image"], [data-testid="logo-upload"]');
      await expect(fileInput).toBeVisible({ timeout: 10000 });
      
      await fileInput.setInputFiles(largeFilePath);
      await page.waitForTimeout(1000);
      
      // Check for file size error
      const errorMessage = page.locator('.alert-danger, .text-danger, [data-testid="file-size-error"]');
      if (await errorMessage.count() > 0) {
        console.log('File size error correctly displayed:', await errorMessage.textContent());
      }
      
    } finally {
      // Clean up the test file
      if (fs.existsSync(largeFilePath)) {
        fs.unlinkSync(largeFilePath);
      }
    }
  });
});

