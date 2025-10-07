import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://lit.local:8080';

test.describe('Document Upload Corrected Test', () => {
  test('upload document with correct input selectors', async ({ page }) => {
    console.log('✅ Testing upload with CORRECT input selectors...');

    // Track API requests to /api/documents POST
    const uploadRequests: any[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/documents') && request.method() === 'POST') {
        uploadRequests.push({
          url: request.url(),
          method: request.method(),
          contentType: request.headers()['content-type'],
        });
        console.log('📤 UPLOAD REQUEST DETECTED:', {
          method: request.method(),
          contentType: request.headers()['content-type'],
        });
      }
    });

    // Track upload responses
    let uploadResponse: any = null;
    page.on('response', (response) => {
      if (response.url().includes('/api/documents') && response.request().method() === 'POST') {
        console.log('📥 UPLOAD RESPONSE:', response.status());
        response
          .json()
          .then((data) => {
            uploadResponse = data;
            console.log('📥 UPLOAD RESPONSE DATA:', data.success ? 'SUCCESS' : 'FAILED');
          })
          .catch(() => {});
      }
    });

    // Capture console logs from our debug statements
    page.on('console', (msg) => {
      const text = msg.text();
      if (
        text.includes('🚀') ||
        text.includes('📝') ||
        text.includes('📎') ||
        text.includes('✅') ||
        text.includes('❌') ||
        text.includes('📤') ||
        text.includes('📥')
      ) {
        console.log(`[DEBUG] ${text}`);
      }
    });

    // Handle dialogs
    page.on('dialog', (dialog) => {
      console.log(`🚨 DIALOG: ${dialog.message()}`);
      dialog.accept();
    });

    // Login
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@litigation.com');
      await page.locator('input[type="password"], input[name="password"]').fill('admin123');
      await page.locator('button[type="submit"], .btn-primary').click();
      await page.waitForTimeout(3000);
    }

    await page.goto(`${BASE_URL}/documents`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Create test file
    const testFilePath = path.join(process.cwd(), 'corrected-test-upload.txt');
    fs.writeFileSync(testFilePath, 'Test file for corrected upload test');

    try {
      // Click upload button
      const uploadButton = page.locator('button:has-text("رفع مستند جديد")');
      await uploadButton.click();
      await page.waitForTimeout(2000);

      // Verify modal opened
      const modal = await page.locator('.modal:visible').count();
      console.log(`📋 Upload modal opened: ${modal > 0}`);
      expect(modal, 'Upload modal should open').toBeGreaterThan(0);

      // Use SPECIFIC selector for the upload modal title input
      // Target the input that has value={uploadData.title} inside the modal
      const uploadModalTitleInput = page.locator('.modal input[type="text"]').first();
      await uploadModalTitleInput.fill('Corrected Upload Test');
      console.log('📝 Upload modal title filled: "Corrected Upload Test"');

      // Fill description in the modal
      const descriptionTextarea = page.locator('.modal textarea').first();
      await descriptionTextarea.fill('This test uses the correct input selectors');
      console.log('📝 Description filled');

      // Select file
      const fileInput = page.locator('.modal input[type="file"]');
      await fileInput.setInputFiles(testFilePath);
      console.log('📎 File selected');

      // Wait for state updates
      await page.waitForTimeout(2000);

      // Submit the form
      const submitButton = page.locator('.modal button:has-text("رفع المستند")');
      console.log('🚀 Clicking submit button...');
      await submitButton.click();

      // Wait for upload to complete
      await page.waitForTimeout(8000);

      // Check results
      const modalAfterUpload = await page.locator('.modal:visible').count();
      console.log(`📋 Modal still visible after upload: ${modalAfterUpload > 0}`);

      console.log(`📤 Upload requests made: ${uploadRequests.length}`);

      if (uploadRequests.length > 0) {
        const request = uploadRequests[0];
        console.log('📤 Upload request Content-Type:', request.contentType);

        // Verify Content-Type
        expect(
          request.contentType,
          'Content-Type should include multipart/form-data with boundary'
        ).toMatch(/^multipart\/form-data; boundary=/);

        console.log('✅ Content-Type header is correct!');
      }

      if (uploadResponse) {
        console.log('📥 Upload response:', uploadResponse.success ? 'SUCCESS' : 'FAILED');
        if (!uploadResponse.success) {
          console.log('❌ Error:', uploadResponse.error || uploadResponse.message);
        }
      }

      // Assertions
      expect(uploadRequests.length, 'Should have made upload request').toBeGreaterThan(0);
      if (uploadResponse) {
        expect(uploadResponse.success, 'Upload should be successful').toBe(true);
      }
      expect(modalAfterUpload, 'Modal should close after successful upload').toBe(0);

      console.log('✅ Upload test completed successfully!');
    } finally {
      // Clean up test file
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    }
  });
});
