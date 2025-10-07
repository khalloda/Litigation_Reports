import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://lit.local:8080';

test.describe('Document Upload Final Test', () => {
  test('should upload document successfully with proper Content-Type', async ({ page }) => {
    console.log('🔬 Final test: Document upload with proper Content-Type...');

    // Track console messages
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      const message = `[${msg.type()}] ${msg.text()}`;
      consoleLogs.push(message);
      if (msg.type() === 'error' || message.includes('Upload') || message.includes('API')) {
        console.log(message);
      }
    });

    // Track API requests to /api/documents POST
    const uploadRequests: any[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/documents') && request.method() === 'POST') {
        uploadRequests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          contentType: request.headers()['content-type'] || 'not-set',
        });
        console.log('📤 UPLOAD REQUEST DETECTED:', {
          method: request.method(),
          url: request.url(),
          contentType: request.headers()['content-type'],
        });
      }
    });

    // Track API responses
    let uploadResponse: any = null;
    page.on('response', (response) => {
      if (response.url().includes('/api/documents') && response.request().method() === 'POST') {
        console.log('📥 UPLOAD RESPONSE:', response.status(), response.url());
        response
          .json()
          .then((data) => {
            uploadResponse = data;
            console.log('📥 UPLOAD RESPONSE DATA:', data);
          })
          .catch(() => {});
      }
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

    // Navigate to Documents
    await page.goto(`${BASE_URL}/documents`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Create test file
    const testFilePath = path.join(process.cwd(), 'final-test-upload.txt');
    const testContent = `Test upload file - ${Date.now()}\\nThis file tests the upload functionality.`;
    fs.writeFileSync(testFilePath, testContent);

    try {
      // Click upload button
      const uploadButton = page.locator('button:has-text("رفع مستند جديد")');
      await uploadButton.click();
      await page.waitForTimeout(2000);

      // Verify modal opened
      const modal = await page.locator('.modal:visible').count();
      console.log(`📋 Upload modal opened: ${modal > 0}`);
      expect(modal, 'Upload modal should open').toBeGreaterThan(0);

      // Fill title - use the exact selector from the code
      const titleInput = page.locator('input[type="text"]').first();
      await titleInput.fill('Final Test Upload Document');
      console.log('📝 Title filled: "Final Test Upload Document"');

      // Fill description
      const descriptionTextarea = page.locator('textarea').first();
      await descriptionTextarea.fill(
        'This is a test upload to verify the functionality is working'
      );
      console.log('📝 Description filled');

      // Select file
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(testFilePath);
      console.log('📎 File selected:', testFilePath);

      // Wait a moment for state to update
      await page.waitForTimeout(1000);

      // Submit the form
      const submitButton = page.locator('button:has-text("رفع المستند")');
      console.log('🚀 Clicking submit button...');
      await submitButton.click();

      // Wait for the upload to complete
      console.log('⏳ Waiting for upload to complete...');
      await page.waitForTimeout(10000);

      // Check if modal closed (indicates success)
      const modalAfterUpload = await page.locator('.modal:visible').count();
      console.log(`📋 Modal still visible after upload: ${modalAfterUpload > 0}`);

      // Check for upload request
      console.log(`📤 Upload requests made: ${uploadRequests.length}`);

      if (uploadRequests.length > 0) {
        const request = uploadRequests[0];
        console.log('📤 Upload request details:', request);

        // Verify Content-Type
        expect(
          request.contentType,
          'Content-Type should include multipart/form-data with boundary'
        ).toMatch(/^multipart\/form-data; boundary=/);

        console.log('✅ Content-Type header is correct!');
      } else {
        console.log('❌ No upload request was made');

        // Print console logs to debug
        console.log('Console logs for debugging:');
        consoleLogs.forEach((log) => {
          if (log.includes('Upload') || log.includes('error') || log.includes('alert')) {
            console.log('  ', log);
          }
        });
      }

      // Check for upload response
      if (uploadResponse) {
        console.log('📥 Upload response received:', uploadResponse.success ? 'SUCCESS' : 'FAILED');
        if (uploadResponse.success) {
          console.log('✅ Upload completed successfully!');
        } else {
          console.log('❌ Upload failed:', uploadResponse.error || uploadResponse.message);
        }
      }

      // Assertions
      expect(uploadRequests.length, 'Should have made upload request').toBeGreaterThan(0);
      if (uploadResponse) {
        expect(uploadResponse.success, 'Upload should be successful').toBe(true);
      }
      expect(modalAfterUpload, 'Modal should close after successful upload').toBe(0);
    } finally {
      // Clean up test file
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
        console.log('🧹 Test file cleaned up');
      }
    }

    console.log('✅ Upload test completed!');
  });
});
