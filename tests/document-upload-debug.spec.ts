import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://lit.local:8080';

test.describe('Document Upload Debug', () => {
  test('debug upload functionality step by step', async ({ page }) => {
    console.log('🔍 Debugging document upload functionality...');

    // Enable verbose console logging
    page.on('console', msg => {
      console.log(`[${msg.type()}] ${msg.text()}`);
    });

    // Monitor all network requests
    page.on('request', request => {
      if (request.url().includes('/api')) {
        console.log(`📤 API Request: ${request.method()} ${request.url()}`);
        console.log(`   Headers:`, request.headers());
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api')) {
        console.log(`📥 API Response: ${response.status()} ${response.url()}`);
      }
    });

    // Navigate and login
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@litigation.com');
      await page.locator('input[type="password"], input[name="password"]').fill('admin123');
      await page.locator('button[type="submit"], .btn-primary').click();
      await page.waitForTimeout(3000);
    }

    console.log('✅ Logged in successfully');

    // Navigate to Documents page
    await page.goto(`${BASE_URL}/documents`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('📄 Navigated to Documents page');

    // Check page content
    const pageContent = await page.textContent('body');
    console.log('📄 Page contains upload button:', pageContent?.includes('رفع مستند جديد') || pageContent?.includes('Upload'));

    // Look for upload button
    const uploadButtons = await page.locator('button').all();
    console.log(`🔘 Found ${uploadButtons.length} buttons on page`);

    for (let i = 0; i < uploadButtons.length; i++) {
      const buttonText = await uploadButtons[i].textContent();
      console.log(`  Button ${i}: "${buttonText}"`);
    }

    // Click upload button
    const uploadButton = page.locator('button:has-text("رفع مستند جديد"), button:has-text("Upload")').first();
    const uploadButtonVisible = await uploadButton.isVisible();
    console.log(`📤 Upload button visible: ${uploadButtonVisible}`);

    if (uploadButtonVisible) {
      await uploadButton.click();
      await page.waitForTimeout(2000);

      // Check if modal opened
      const modal = await page.locator('.modal').count();
      const visibleModal = await page.locator('.modal:visible').count();
      console.log(`📋 Total modals: ${modal}, Visible modals: ${visibleModal}`);

      if (visibleModal > 0) {
        // Create test file
        const testFilePath = path.join(process.cwd(), 'debug-upload.txt');
        fs.writeFileSync(testFilePath, 'Debug test file content');

        // Fill form
        const titleInput = page.locator('input[placeholder*="عنوان"], input[name*="title"]').first();
        const titleVisible = await titleInput.isVisible();
        console.log(`📝 Title input visible: ${titleVisible}`);

        if (titleVisible) {
          await titleInput.fill('Debug Test Upload');
          console.log('📝 Title filled');
        }

        // File input
        const fileInput = page.locator('input[type="file"]');
        const fileInputCount = await fileInput.count();
        console.log(`📎 File inputs found: ${fileInputCount}`);

        if (fileInputCount > 0) {
          await fileInput.setInputFiles(testFilePath);
          console.log('📎 File selected');
        }

        // Submit button
        const submitButtons = await page.locator('.modal button').all();
        console.log(`🔘 Modal buttons found: ${submitButtons.length}`);

        for (let i = 0; i < submitButtons.length; i++) {
          const buttonText = await submitButtons[i].textContent();
          console.log(`  Modal Button ${i}: "${buttonText}"`);
        }

        const submitButton = page.locator('.modal button:has-text("رفع"), .modal button:has-text("Upload")');
        const submitButtonVisible = await submitButton.isVisible();
        console.log(`📤 Submit button visible: ${submitButtonVisible}`);

        if (submitButtonVisible) {
          console.log('🚀 Clicking submit button...');
          await submitButton.click();
          await page.waitForTimeout(5000);

          // Check if modal closed
          const modalAfter = await page.locator('.modal:visible').count();
          console.log(`📋 Modal visible after submit: ${modalAfter}`);
        }

        // Clean up
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    }

    await page.waitForTimeout(2000);
    console.log('🔍 Debug complete');
  });
});