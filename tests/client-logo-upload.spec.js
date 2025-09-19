import { test, expect } from '@playwright/test';
import path from 'path';
import { LoginHelpers } from './helpers/login-helpers.js';
import { ClientHelpers } from './helpers/client-helpers.js';

const loginHelpers = new LoginHelpers();
const clientHelpers = new ClientHelpers();

test.describe('Client Logo Upload Test', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await loginHelpers.login(page, 'admin@litigation.com', 'admin123');
    await page.waitForURL('**/dashboard');

    // Navigate to clients page
    await page.click('[data-testid="nav-clients"]');
    await page.waitForURL('**/clients');
  });

  test('should upload logo file to existing client "Sarieldin and Partners"', async ({ page }) => {
    console.log('Starting logo upload test for Sarieldin and Partners...');
    
    // First, check if the client exists
    const clientExists = await clientHelpers.verifyClientExists(page, 'Sarieldin and Partners');
    
    if (!clientExists) {
      console.log('Client not found, creating it first...');
      
      // Create the client first
      const clientData = {
        nameAr: 'Sarieldin and Partners',
        nameEn: 'Sarieldin and Partners',
        type: 'company',
        serviceType: 'cash',
        status: 'active',
        contactLawyer: 'Test Lawyer',
        phone: '+966501234567',
        email: 'sarieldin@example.com',
        addressAr: 'الرياض، المملكة العربية السعودية',
        addressEn: 'Riyadh, Saudi Arabia',
        notesAr: 'شركة محاماة',
        notesEn: 'Law firm'
      };
      
      await clientHelpers.createClient(page, clientData);
      console.log('Client created successfully');
    }
    
    // Now edit the client to add logo
    console.log('Editing client to add logo...');
    
    // Find the client row and click edit
    const clientRow = page.locator('tr:has-text("Sarieldin and Partners")');
    await expect(clientRow).toBeVisible({ timeout: 10000 });
    
    const editButton = clientRow.locator('[data-testid="edit-client"]');
    await expect(editButton).toBeVisible({ timeout: 10000 });
    await editButton.click();
    
    // Wait for modal to open
    await page.waitForSelector('.modal', { timeout: 10000 });
    console.log('Edit modal opened');
    
    // Find the file input
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible({ timeout: 10000 });
    console.log('File input found');
    
    // Get the path to the logo file
    const logoPath = path.resolve(__dirname, '..', 'logo', 'emblem_green_gold.png');
    console.log('Uploading logo file:', logoPath);
    
    // Upload the file
    await fileInput.setInputFiles(logoPath);
    console.log('File uploaded to input');
    
    // Wait for file to be processed and preview to appear
    await page.waitForTimeout(2000);
    
    // Check if file preview is shown
    const filePreview = page.locator('img[src*="blob:"], .logo-preview, .file-preview');
    if (await filePreview.count() > 0) {
      console.log('File preview shown successfully');
    } else {
      console.log('No file preview found');
    }
    
    // Look for save button
    console.log('Looking for save button...');
    const saveButton = page.locator('button:has-text("Save"), .btn-primary:has-text("Save"), button[type="submit"]');
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
    await page.screenshot({ path: 'client-logo-upload-test.png', fullPage: true });
    console.log('Screenshot saved as client-logo-upload-test.png');
  });
  
  test('should create new client with logo upload', async ({ page }) => {
    console.log('Testing logo upload with new client creation...');
    
    const clientData = {
      nameAr: 'Test Client with Logo',
      nameEn: 'Test Client with Logo',
      type: 'company',
      serviceType: 'cash',
      status: 'active',
      contactLawyer: 'Test Lawyer',
      phone: '+966501234567',
      email: 'test@example.com',
      addressAr: 'الرياض، المملكة العربية السعودية',
      addressEn: 'Riyadh, Saudi Arabia',
      notesAr: 'عميل تجريبي',
      notesEn: 'Test client',
      logoPath: path.resolve(__dirname, '..', 'logo', 'emblem_green_gold.png')
    };
    
    await clientHelpers.createClient(page, clientData);
    console.log('Client with logo created successfully');
    
    // Verify the client appears in the list
    await expect(page.locator('text=Test Client with Logo')).toBeVisible();
  });
  
  test('should handle file upload validation', async ({ page }) => {
    console.log('Testing file upload validation...');
    
    // Test with invalid file type
    await clientHelpers.testLogoValidation(
      page, 
      path.resolve(__dirname, 'fixtures', 'invalid-file.txt'), 
      true // should fail
    );
    
    console.log('File validation test completed');
  });
});
