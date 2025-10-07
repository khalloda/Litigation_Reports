import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://lit.local:8080';

test.describe('Document Upload Alert Debug', () => {
  test('debug upload alerts and validation', async ({ page }) => {
    console.log('🔍 Debugging upload alerts and validation...');

    // Capture all dialogs/alerts
    const dialogs: string[] = [];
    page.on('dialog', (dialog) => {
      console.log(`🚨 ALERT/DIALOG: ${dialog.type()} - ${dialog.message()}`);
      dialogs.push(`${dialog.type()}: ${dialog.message()}`);
      dialog.accept(); // Accept the dialog to continue
    });

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`❌ CONSOLE ERROR: ${msg.text()}`);
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
    const testFilePath = path.join(process.cwd(), 'alert-debug-upload.txt');
    fs.writeFileSync(testFilePath, 'Test file for alert debugging');

    try {
      // Click upload button
      const uploadButton = page.locator('button:has-text("رفع مستند جديد")');
      await uploadButton.click();
      await page.waitForTimeout(2000);

      // Test 1: Try submitting without filling anything
      console.log('🧪 Test 1: Submit empty form (should show validation alert)');
      const submitButton = page.locator('button:has-text("رفع المستند")');
      await submitButton.click();
      await page.waitForTimeout(2000);

      console.log(`🚨 Dialogs after empty submit: ${dialogs.length}`);
      dialogs.forEach((dialog) => console.log(`  - ${dialog}`));

      // Test 2: Fill title only (no file)
      console.log('🧪 Test 2: Fill title only, no file (should show validation alert)');
      const titleInput = page.locator('input[type="text"]').first();
      await titleInput.fill('Test Title Only');
      await page.waitForTimeout(1000);

      await submitButton.click();
      await page.waitForTimeout(2000);

      console.log(`🚨 Dialogs after title-only submit: ${dialogs.length}`);
      dialogs.forEach((dialog) => console.log(`  - ${dialog}`));

      // Test 3: Fill file only (no title)
      console.log('🧪 Test 3: Clear title, add file only (should show validation alert)');
      await titleInput.clear();
      await page.waitForTimeout(500);

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(testFilePath);
      await page.waitForTimeout(1000);

      await submitButton.click();
      await page.waitForTimeout(2000);

      console.log(`🚨 Dialogs after file-only submit: ${dialogs.length}`);
      dialogs.forEach((dialog) => console.log(`  - ${dialog}`));

      // Test 4: Fill both title and file (should work)
      console.log('🧪 Test 4: Fill both title and file (should work)');
      await titleInput.fill('Complete Test Upload');
      await page.waitForTimeout(1000);

      // Verify the state by checking values
      const titleValue = await titleInput.inputValue();
      const fileValue = await fileInput.inputValue();

      console.log(`📝 Title value: "${titleValue}"`);
      console.log(`📎 File value: "${fileValue}"`);

      await submitButton.click();
      await page.waitForTimeout(5000);

      console.log(`🚨 Total dialogs during all tests: ${dialogs.length}`);
      dialogs.forEach((dialog) => console.log(`  - ${dialog}`));

      // Check if modal is still open
      const modalOpen = await page.locator('.modal:visible').count();
      console.log(`📋 Modal still open after complete form: ${modalOpen > 0}`);
    } finally {
      // Clean up
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    }

    console.log('🔍 Alert debug complete');
  });
});
