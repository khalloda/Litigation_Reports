import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://lit.local:8080';

test.describe('Document Upload State Debug', () => {
  test('debug uploadData state values', async ({ page }) => {
    console.log('🔍 Debugging uploadData state values...');

    // Inject JavaScript to monitor uploadData state
    await page.addInitScript(() => {
      window.addEventListener('load', () => {
        // Hook into React DevTools or state if available
        setInterval(() => {
          // Try to find uploadData in the window object or React state
          if (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
            console.log('React internals found - checking state...');
          }
        }, 5000);
      });
    });

    // Capture dialogs
    const dialogs: string[] = [];
    page.on('dialog', dialog => {
      console.log(`🚨 DIALOG: ${dialog.message()}`);
      dialogs.push(dialog.message());
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
    const testFilePath = path.join(process.cwd(), 'state-debug-upload.txt');
    fs.writeFileSync(testFilePath, 'State debugging test file');

    try {
      // Click upload button
      const uploadButton = page.locator('button:has-text("رفع مستند جديد")');
      await uploadButton.click();
      await page.waitForTimeout(2000);

      // Fill form step by step with longer waits
      console.log('📝 Filling title...');
      const titleInput = page.locator('input[type="text"]').first();
      await titleInput.fill('State Debug Test');
      await page.waitForTimeout(2000); // Longer wait for state update

      console.log('📎 Selecting file...');
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(testFilePath);
      await page.waitForTimeout(2000); // Longer wait for state update

      // Use JavaScript to check the actual React state before submitting
      console.log('🔬 Checking uploadData state via JavaScript...');

      // Try to access the component state through the DOM
      const stateInfo = await page.evaluate(() => {
        // Get the title input element
        const titleInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

        return {
          titleInputValue: titleInput?.value || 'not found',
          fileInputValue: fileInput?.value || 'not found',
          fileInputFiles: fileInput?.files?.length || 0,
          fileInputFileName: fileInput?.files?.[0]?.name || 'no file'
        };
      });

      console.log('🔬 DOM State:', stateInfo);

      // Try to trigger onChange events manually to ensure state update
      console.log('🔄 Manually triggering onChange events...');
      await titleInput.click();
      await titleInput.selectText();
      await page.keyboard.type('State Debug Test Manual');
      await page.waitForTimeout(1000);

      await fileInput.setInputFiles(testFilePath);
      await page.waitForTimeout(1000);

      // Try clicking submit
      console.log('🚀 Attempting submit...');
      const submitButton = page.locator('button:has-text("رفع المستند")');
      await submitButton.click();
      await page.waitForTimeout(3000);

      console.log(`🚨 Validation dialogs: ${dialogs.length}`);
      dialogs.forEach(dialog => console.log(`  - ${dialog}`));

      // Check if we can access React component directly
      const reactInfo = await page.evaluate(() => {
        // Look for React fiber nodes
        const titleInput = document.querySelector('input[type="text"]') as any;

        if (titleInput && titleInput._valueTracker) {
          return {
            hasValueTracker: true,
            value: titleInput.value
          };
        }

        // Try to find React components
        const reactKey = Object.keys(titleInput || {}).find(key => key.startsWith('__reactInternalInstance'));

        return {
          hasReactKey: !!reactKey,
          keys: Object.keys(titleInput || {})
        };
      });

      console.log('🔬 React Info:', reactInfo);

    } finally {
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    }

    console.log('🔍 State debug complete');
  });
});