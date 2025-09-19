import { test, expect } from '@playwright/test';

test.describe('Logo Upload to Existing Client', () => {
  test('should upload logo to existing Sarieldin and Partners client', async ({ page }) => {
    console.log('Testing logo upload to existing client...');
    
    // Navigate to application and login
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    await page.locator('input[type="email"]').fill('admin@litigation.com');
    await page.locator('input[type="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();
    
    // Wait for login to complete
    await page.waitForTimeout(3000);
    
    // Navigate to clients page
    console.log('Navigating to clients page...');
    const clientsLink = page.locator('a:has-text("العملاء"), [role="button"]:has-text("العملاء")');
    await clientsLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot of clients page
    await page.screenshot({ path: 'test-results/clients-page-loaded.png' });
    console.log('Clients page screenshot saved');
    
    // Find the "Sarieldin and Partners" client in the table
    console.log('Looking for Sarieldin and Partners client...');
    const clientRow = page.locator('tr:has-text("Sarieldin and Partners")');
    const clientRowVisible = await clientRow.isVisible();
    console.log('Sarieldin and Partners row visible:', clientRowVisible);
    
    if (clientRowVisible) {
      // Look for edit button in the actions column
      const editButton = clientRow.locator('button:has-text("Edit"), button:has-text("تعديل"), button[title*="Edit"], button[title*="تعديل"]');
      const editButtonVisible = await editButton.isVisible();
      console.log('Edit button visible:', editButtonVisible);
      
      if (editButtonVisible) {
        console.log('Clicking edit button...');
        await editButton.click();
        await page.waitForTimeout(2000);
        
        // Take screenshot of edit modal
        await page.screenshot({ path: 'test-results/client-edit-modal.png' });
        console.log('Client edit modal screenshot saved');
        
        // Look for logo upload area (the clickable div)
        const logoUploadArea = page.locator('.logo-upload-container, [class*="logo-upload"]');
        const uploadAreaVisible = await logoUploadArea.isVisible();
        console.log('Logo upload area visible:', uploadAreaVisible);
        
        if (uploadAreaVisible) {
          console.log('Clicking on logo upload area...');
          await logoUploadArea.click();
          await page.waitForTimeout(1000);
          
          // Now look for the file input (it should be visible after clicking)
          const fileInput = page.locator('input[type="file"]');
          const fileInputVisible = await fileInput.isVisible();
          console.log('File input visible after click:', fileInputVisible);
          
          if (fileInputVisible) {
            console.log('Uploading logo file...');
            await fileInput.setInputFiles('logo/emblem_green_gold.png');
            await page.waitForTimeout(2000);
            
            // Take screenshot after file upload
            await page.screenshot({ path: 'test-results/after-logo-upload.png' });
            console.log('After logo upload screenshot saved');
            
            // Check if preview appeared
            const logoPreview = page.locator('img[alt*="logo"], img[alt*="Logo"], img[alt*="عميل"], img[src*="logo"]');
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
              await page.screenshot({ path: 'test-results/before-save.png' });
              console.log('Before save screenshot saved');
              
              await saveButton.click();
              await page.waitForTimeout(5000);
              
              // Take screenshot after save
              await page.screenshot({ path: 'test-results/after-save.png' });
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
              const modalClosed = !(await fileInput.isVisible());
              console.log('Modal closed after save:', modalClosed);
              
            } else {
              console.log('Save button not found');
            }
          } else {
            console.log('File input not visible after clicking upload area');
          }
        } else {
          console.log('Logo upload area not found in edit modal');
        }
      } else {
        console.log('Edit button not found for Sarieldin and Partners client');
        
        // Try to find any action buttons in the row
        const actionButtons = clientRow.locator('button, [role="button"]');
        const actionButtonCount = await actionButtons.count();
        console.log('Action buttons in row:', actionButtonCount);
        
        for (let i = 0; i < actionButtonCount; i++) {
          const button = actionButtons.nth(i);
          const text = await button.textContent();
          const visible = await button.isVisible();
          console.log(`Action button ${i + 1}: "${text}" (visible: ${visible})`);
        }
      }
    } else {
      console.log('Sarieldin and Partners client not found in table');
      
      // List all clients in the table
      const allRows = page.locator('tbody tr');
      const rowCount = await allRows.count();
      console.log('Total client rows:', rowCount);
      
      for (let i = 0; i < Math.min(rowCount, 5); i++) {
        const row = allRows.nth(i);
        const text = await row.textContent();
        console.log(`Row ${i + 1}:`, text.substring(0, 100));
      }
    }
    
    console.log('Logo upload test completed');
  });
});
