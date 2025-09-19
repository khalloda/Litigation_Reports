import { test, expect } from '@playwright/test';

test.describe('Create New Client with Logo', () => {
  test('should create a new client with logo upload', async ({ page }) => {
    console.log('Testing create new client with logo...');
    
    // Navigate to application and login
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    await page.locator('input[type="email"]').fill('admin@litigation.com');
    await page.locator('input[type="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();
    
    // Wait for login to complete
    await page.waitForTimeout(3000);
    
    // Navigate to clients page
    const clientsLink = page.locator('a:has-text("العملاء"), [role="button"]:has-text("العملاء")');
    await clientsLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot of clients page
    await page.screenshot({ path: 'test-results/clients-page-for-create.png' });
    console.log('Clients page screenshot saved');
    
    // Look for "Add Client" button
    const addClientButton = page.locator('button:has-text("Add Client"), button:has-text("إضافة عميل"), button:has-text("Add"), button:has-text("إضافة")');
    const addButtonVisible = await addClientButton.isVisible();
    console.log('Add client button visible:', addButtonVisible);
    
    if (addButtonVisible) {
      console.log('Clicking Add Client button...');
      await addClientButton.click();
      await page.waitForTimeout(3000);
      
      // Take screenshot after clicking add button
      await page.screenshot({ path: 'test-results/after-add-client-click.png' });
      console.log('After add client click screenshot saved');
      
      // Check if modal opened
      const modalVisible = await page.locator('.modal, [role="dialog"]').isVisible();
      console.log('Modal visible after add click:', modalVisible);
      
      if (modalVisible) {
        console.log('Modal opened successfully!');
        
        // Fill client form
        console.log('Filling client form...');
        
        // Fill client name fields (use first() to avoid strict mode violation)
        const nameArInput = page.locator('input[placeholder*="اسم العميل"]').first();
        const nameEnInput = page.locator('input[placeholder*="Client Name"], input[placeholder*="الإنجليزية"]').first();
        
        await nameArInput.fill('شركة تجريبية للاختبار');
        console.log('Filled Arabic client name');
        
        await nameEnInput.fill('Test Company for Logo Upload');
        console.log('Filled English client name');
        
        // Look for logo upload area (use specific class to avoid strict mode violation)
        const logoUploadArea = page.locator('.logo-upload-container');
        const uploadAreaVisible = await logoUploadArea.isVisible();
        console.log('Logo upload area visible:', uploadAreaVisible);
        
        if (uploadAreaVisible) {
          console.log('Looking for file input (hidden)...');
          
          // Look for file input (it's hidden but should exist)
          const fileInput = page.locator('input[type="file"]');
          const fileInputExists = await fileInput.count() > 0;
          console.log('File input exists:', fileInputExists);
          
          if (fileInputExists) {
            console.log('Uploading logo file directly to hidden input...');
            await fileInput.setInputFiles('logo/emblem_green_gold.png');
            await page.waitForTimeout(2000);
            
            // Take screenshot after file upload
            await page.screenshot({ path: 'test-results/after-logo-upload-create.png' });
            console.log('After logo upload screenshot saved');
            
            // Check if preview appeared
            const logoPreview = page.locator('img[alt*="logo"], img[alt*="Logo"], img[alt*="عميل"]');
            const previewVisible = await logoPreview.isVisible();
            console.log('Logo preview visible:', previewVisible);
            
            if (previewVisible) {
              const previewSrc = await logoPreview.getAttribute('src');
              console.log('Logo preview src:', previewSrc);
            }
            
            // Look for save button
            const saveButton = page.locator('button:has-text("Save"), button:has-text("حفظ"), button[type="submit"]');
            const saveButtonVisible = await saveButton.isVisible();
            console.log('Save button visible:', saveButtonVisible);
            
            if (saveButtonVisible) {
              console.log('Clicking save button...');
              
              // Take screenshot before save
              await page.screenshot({ path: 'test-results/before-save-create.png' });
              console.log('Before save screenshot saved');
              
              await saveButton.click();
              await page.waitForTimeout(5000);
              
              // Take screenshot after save
              await page.screenshot({ path: 'test-results/after-save-create.png' });
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
              
              // Check if modal closed
              const modalClosed = !(await page.locator('.modal, [role="dialog"]').isVisible());
              console.log('Modal closed after save:', modalClosed);
              
            } else {
              console.log('Save button not found');
            }
          } else {
            console.log('File input not visible after clicking upload area');
          }
        } else {
          console.log('Logo upload area not found in create modal');
        }
      } else {
        console.log('Modal did not open after clicking Add Client button');
        
        // Check what happened
        const currentUrl = page.url();
        console.log('Current URL after add click:', currentUrl);
        
        const bodyText = await page.locator('body').textContent();
        console.log('Page contains "form":', bodyText.includes('form'));
        console.log('Page contains "modal":', bodyText.includes('modal'));
      }
    } else {
      console.log('Add Client button not found');
      
      // List all buttons on the page
      const allButtons = await page.locator('button').all();
      console.log('All buttons on page:', allButtons.length);
      
      for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
        const button = allButtons[i];
        const text = await button.textContent();
        const visible = await button.isVisible();
        console.log(`Button ${i + 1}: "${text}" (visible: ${visible})`);
      }
    }
    
    console.log('Create new client test completed');
  });
});
