import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://lit.local:8080';

test.describe('Document Upload Fix Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application and login
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const loginButton = page.locator('button[type="submit"], .btn-primary');

    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@litigation.com');
      await passwordInput.fill('admin123');
      await loginButton.click();
      await page.waitForTimeout(3000);
    }

    console.log('✅ Logged in successfully');
  });

  test('should successfully upload document via frontend', async ({ page }) => {
    console.log('📤 Testing fixed document upload functionality...');

    // Create a test file for upload
    const testFilePath = path.join(process.cwd(), 'test-upload-frontend.txt');
    const testContent = 'This is a test document for frontend upload testing - ' + Date.now();
    fs.writeFileSync(testFilePath, testContent);

    // Monitor network requests
    const uploadRequests: any[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/documents') && request.method() === 'POST') {
        uploadRequests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          contentType: request.headers()['content-type'],
        });
        console.log('📤 Upload request detected:', {
          method: request.method(),
          contentType: request.headers()['content-type'],
        });
      }
    });

    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to Documents page
    await page.goto(`${BASE_URL}/documents`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('📄 Navigated to Documents page');

    // Click upload button to open modal
    const uploadButton = page.locator('button:has-text("رفع مستند جديد"), button:has-text("Upload")').first();
    await uploadButton.click();
    await page.waitForTimeout(2000);

    // Verify modal opened
    const modal = await page.locator('.modal:visible').count();
    console.log(`📋 Upload modal opened: ${modal > 0}`);
    expect(modal, 'Upload modal should open').toBeGreaterThan(0);

    // Fill in the form
    const titleInput = page.locator('input[type="text"]').first();
    await titleInput.fill('Test Upload from Frontend - Fixed');

    const descriptionField = page.locator('textarea').first();
    await descriptionField.fill('Testing the fixed upload functionality');

    // Upload the file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFilePath);

    console.log('📝 Form filled with test data');

    // Submit the form
    const submitButton = page.locator('.modal button:has-text("رفع المستند"), .modal button:has-text("Upload")');
    await submitButton.click();

    // Wait for upload to complete
    await page.waitForTimeout(5000);

    // Check if modal closed (indicates success)
    const modalAfterUpload = await page.locator('.modal:visible').count();
    console.log(`📋 Modal closed after upload: ${modalAfterUpload === 0}`);

    // Check for success indicators
    const documentRows = await page.locator('tbody tr').count();
    console.log(`📄 Document rows after upload: ${documentRows}`);

    // Verify the request was made with correct Content-Type
    expect(uploadRequests.length, 'Should have made upload request').toBeGreaterThan(0);

    if (uploadRequests.length > 0) {
      const uploadRequest = uploadRequests[0];
      console.log('📤 Upload request Content-Type:', uploadRequest.contentType);

      // Verify Content-Type includes multipart/form-data with boundary
      expect(uploadRequest.contentType, 'Should have correct Content-Type with boundary')
        .toMatch(/^multipart\/form-data; boundary=/);
    }

    // Check for console errors
    console.log(`❌ Console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console errors found:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    }

    // Verify no upload-related errors
    const hasUploadErrors = consoleErrors.some(error =>
      error.includes('400') ||
      error.includes('Bad Request') ||
      error.includes('Upload error') ||
      error.includes('multipart/form-data')
    );

    console.log(`🚨 Upload-related errors: ${hasUploadErrors}`);

    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }

    // Assertions
    expect(modalAfterUpload, 'Modal should close after successful upload').toBe(0);
    expect(hasUploadErrors, 'Should not have upload-related errors').toBe(false);
    expect(documentRows, 'Should have documents in the list').toBeGreaterThan(0);

    console.log('✅ Document upload functionality fixed and working correctly!');
  });

  test('should handle upload validation errors properly', async ({ page }) => {
    console.log('⚠️ Testing upload validation error handling...');

    // Navigate to Documents page
    await page.goto(`${BASE_URL}/documents`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Click upload button to open modal
    const uploadButton = page.locator('button:has-text("رفع مستند جديد"), button:has-text("Upload")').first();
    await uploadButton.click();
    await page.waitForTimeout(2000);

    // Try to submit without title or file
    const submitButton = page.locator('.modal button:has-text("رفع المستند"), .modal button:has-text("Upload")');
    await submitButton.click();

    // Should show validation message
    await page.waitForTimeout(2000);

    // Modal should still be open (validation failed)
    const modalStillOpen = await page.locator('.modal:visible').count();
    console.log(`📋 Modal still open after validation error: ${modalStillOpen > 0}`);

    expect(modalStillOpen, 'Modal should remain open when validation fails').toBeGreaterThan(0);

    console.log('✅ Upload validation working correctly!');
  });
});