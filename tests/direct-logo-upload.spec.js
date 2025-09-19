import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Direct Client Logo Upload Test', () => {
  test('should test logo upload by directly navigating to clients page', async ({ page }) => {
    console.log('Starting direct logo upload test...');
    
    // Navigate directly to clients page
    await page.goto('http://localhost:3001/clients');
    await page.waitForLoadState('networkidle');
    console.log('Clients page loaded');
    
    // Check if we need to login first
    const loginForm = page.locator('form, input[type="email"], input[type="password"]');
    if (await loginForm.count() > 0) {
      console.log('Login form detected, attempting to login...');
      
      // Fill login form
      await page.fill('input[type="email"], input[name="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"], input[name="password"]', 'admin123');
      
      // Click login button
      await page.click('button[type="submit"], .btn-primary, button:has-text("Login")');
      
      // Wait for login to complete and redirect
      await page.waitForLoadState('networkidle');
      console.log('Login completed');
    }
    
    // Now we should be on the clients page
    console.log('Looking for add client button...');
    
    // Wait for the page to be fully loaded
    await page.waitForTimeout(2000);
    
    // Look for add client button with multiple selectors
    const addButton = page.locator('button:has-text("Add"), .btn-primary:has-text("Add"), [data-testid="add-client-btn"], button:has-text("إضافة"), button:has-text("Add Client")');
    
    // If not found, try to find any button that might be the add button
    if (await addButton.count() === 0) {
      console.log('Standard add button not found, looking for alternatives...');
      const allButtons = page.locator('button');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} buttons on the page`);
      
      // Take a screenshot to see what's on the page
      await page.screenshot({ path: 'clients-page-debug.png', fullPage: true });
      console.log('Screenshot saved as clients-page-debug.png');
      
      // Try to find any button that might be the add button
      for (let i = 0; i < buttonCount; i++) {
        const button = allButtons.nth(i);
        const text = await button.textContent();
        console.log(`Button ${i}: "${text}"`);
        if (text && (text.includes('Add') || text.includes('إضافة') || text.includes('New'))) {
          console.log(`Found potential add button: "${text}"`);
          await button.click();
          break;
        }
      }
    } else {
      await addButton.first().click();
    }
    
    // Wait for modal to open
    await page.waitForSelector('.modal, [role="dialog"]', { timeout: 10000 });
    console.log('Add client modal opened');
    
    // Fill required fields first
    console.log('Filling required fields...');
    
    // Fill Arabic name (required) - try multiple selectors
    const arabicNameInput = page.locator('input[placeholder*="اسم العميل بالعربية"], input[placeholder*="Arabic client name"], input[name="client_name_ar"], input[data-testid="client-name-ar"]');
    await expect(arabicNameInput).toBeVisible({ timeout: 10000 });
    await arabicNameInput.fill('Sarieldin and Partners');
    console.log('Arabic name filled');
    
    // Fill English name
    const englishNameInput = page.locator('input[placeholder*="اسم العميل بالإنجليزية"], input[placeholder*="English client name"], input[name="client_name_en"], input[data-testid="client-name-en"]');
    if (await englishNameInput.count() > 0) {
      await englishNameInput.fill('Sarieldin and Partners');
      console.log('English name filled');
    }
    
    // Select client type
    const typeSelect = page.locator('select').first();
    await typeSelect.selectOption('company');
    console.log('Client type selected');
    
    // Select service type
    const serviceSelect = page.locator('select').nth(1);
    await serviceSelect.selectOption('cash');
    console.log('Service type selected');
    
    // Select status
    const statusSelect = page.locator('select').nth(2);
    await statusSelect.selectOption('active');
    console.log('Status selected');
    
    // Fill contact lawyer (required)
    const lawyerInput = page.locator('input[placeholder*="المحامي"], input[placeholder*="lawyer"], input[name="contact_lawyer"], input[data-testid="contact-lawyer"]');
    if (await lawyerInput.count() > 0) {
      await lawyerInput.fill('Test Lawyer');
      console.log('Contact lawyer filled');
    }
    
    console.log('Required fields filled');
    
    // Now test logo upload
    console.log('Testing logo upload...');
    
    // Find the file input
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible({ timeout: 10000 });
    console.log('File input found');
    
    // Get the path to the logo file
    const logoPath = path.resolve(process.cwd(), 'logo', 'emblem_green_gold.png');
    console.log('Uploading logo file:', logoPath);
    
    // Upload the file
    await fileInput.setInputFiles(logoPath);
    console.log('File uploaded to input');
    
    // Wait for file to be processed
    await page.waitForTimeout(2000);
    
    // Check if file preview is shown
    const filePreview = page.locator('img[src*="blob:"], .logo-preview, .file-preview, img[alt*="preview"]');
    if (await filePreview.count() > 0) {
      console.log('File preview shown successfully');
    } else {
      console.log('No file preview found');
    }
    
    // Look for save button
    console.log('Looking for save button...');
    const saveButton = page.locator('button:has-text("Save"), .btn-primary:has-text("Save"), button[type="submit"], button:has-text("حفظ")');
    await expect(saveButton).toBeVisible({ timeout: 10000 });
    console.log('Save button found');
    
    // Click save button
    console.log('Clicking save button...');
    await saveButton.click();
    
    // Wait for save operation to complete
    await page.waitForLoadState('networkidle');
    console.log('Save operation completed');
    
    // Check for success message or error
    const successMessage = page.locator('.alert-success, .toast-success, [data-testid="success-message"]');
    const errorMessage = page.locator('.alert-danger, .toast-error, [data-testid="error-message"]');
    
    if (await successMessage.count() > 0) {
      console.log('Success message found:', await successMessage.textContent());
    } else if (await errorMessage.count() > 0) {
      console.log('Error message found:', await errorMessage.textContent());
    } else {
      console.log('No success or error message found');
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
    await page.screenshot({ path: 'direct-logo-upload-test.png', fullPage: true });
    console.log('Screenshot saved as direct-logo-upload-test.png');
  });
});

