import { test, expect } from '@playwright/test';

test.describe('Debug Hearing Edit Modal', () => {
  test('Debug hearing edit modal opening', async ({ page }) => {
    console.log('🐛 DEBUGGING: Hearing edit modal opening');

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    // Navigate to hearings page
    await page.goto('/hearings', { waitUntil: 'networkidle' });
    console.log('✅ Navigated to hearings page');

    await page.waitForTimeout(3000);

    // Check what edit buttons exist
    const editButtons = await page.locator('button[title*="تعديل"]').all();
    console.log(`📋 Found ${editButtons.length} edit buttons`);

    if (editButtons.length > 0) {
      console.log('🔧 Clicking first edit button...');

      // Listen for any console errors
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          console.log('❌ Console Error:', msg.text());
        }
      });

      // Click edit button
      await editButtons[0].click();
      console.log('✅ Clicked edit button');

      // Wait a bit to see what happens
      await page.waitForTimeout(2000);

      // Check if any modal appeared
      const modals = await page.locator('.modal').all();
      console.log(`📋 Found ${modals.length} modals after click`);

      const visibleModals = await page.locator('.modal:visible').all();
      console.log(`👁️ Found ${visibleModals.length} visible modals`);

      if (visibleModals.length > 0) {
        const modalTitle = await visibleModals[0].locator('.modal-title').textContent();
        console.log(`📄 Modal title: "${modalTitle}"`);
      }

      // Check if role="dialog" exists
      const dialogElements = await page.locator('[role="dialog"]').all();
      console.log(`🗣️ Found ${dialogElements.length} dialog elements`);

      const visibleDialogs = await page.locator('[role="dialog"]:visible').all();
      console.log(`👁️ Found ${visibleDialogs.length} visible dialog elements`);

      if (visibleDialogs.length > 0) {
        const dialogTitle = await visibleDialogs[0].locator('.modal-title').textContent();
        console.log(`📄 Dialog title: "${dialogTitle}"`);
      }

      // Take a screenshot for debugging
      await page.screenshot({ path: 'debug-hearing-edit.png', fullPage: true });
      console.log('📸 Screenshot saved as debug-hearing-edit.png');
    } else {
      console.log('⚠️ No edit buttons found');
    }
  });
});
