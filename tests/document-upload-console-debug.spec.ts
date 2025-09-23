import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://lit.local:8080';

test.describe('Document Upload Console Debug', () => {
  test('check console logs during upload', async ({ page }) => {
    console.log('🔍 Debugging upload with console logs...');

    // Capture all console messages
    page.on('console', msg => {
      console.log(`[${msg.type()}] ${msg.text()}`);
    });

    // Capture dialogs
    page.on('dialog', dialog => {
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
    const testFilePath = path.join(process.cwd(), 'console-debug-upload.txt');
    fs.writeFileSync(testFilePath, 'Console debugging test file');

    try {
      // Click upload button
      const uploadButton = page.locator('button:has-text("رفع مستند جديد")');
      await uploadButton.click();
      await page.waitForTimeout(2000);

      // Fill form
      const titleInput = page.locator('input[type="text"]').first();
      await titleInput.fill('Console Debug Test');
      await page.waitForTimeout(1000);

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(testFilePath);
      await page.waitForTimeout(1000);

      console.log('🚀 About to click submit button...');

      // Click submit
      const submitButton = page.locator('button:has-text("رفع المستند")');
      await submitButton.click();

      // Wait for logs
      await page.waitForTimeout(5000);

      console.log('✅ Upload attempt completed');

    } finally {
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    }
  });
});