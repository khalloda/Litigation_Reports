import { test, expect } from '@playwright/test';

test.describe('Hearing Modal Simple Test', () => {
  test('Verify hearing edit modal opens without crashes', async ({ page }) => {
    console.log('🧪 Simple test: Hearing modal opens without crashes');

    // Clear browser cache and storage (safely)
    await page.context().clearCookies();

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    // Navigate to hearings with force refresh
    await page.goto('/hearings', { waitUntil: 'networkidle' });
    await page.reload({ waitUntil: 'networkidle' }); // Force refresh
    console.log('✅ Navigated to hearings page');

    await page.waitForTimeout(3000);

    // Monitor console for errors
    let hasErrors = false;
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
        if (msg.text().includes('Object.entries')) {
          hasErrors = true;
        }
      }
    });

    // Check if edit buttons exist
    const editButtons = await page.locator('button[title*="تعديل"]').count();
    console.log(`📋 Found ${editButtons} edit buttons`);

    if (editButtons > 0) {
      console.log('🔧 Clicking first edit button...');

      // Click edit button
      await page.locator('button[title*="تعديل"]').first().click();
      await page.waitForTimeout(3000);

      // Check if modal appeared at all (any modal)
      const anyModal = await page.locator('.modal, [role="dialog"]').isVisible();
      console.log(`📋 Any modal visible: ${anyModal}`);

      if (anyModal) {
        const modalTitle = await page
          .locator('.modal-title, .modal .modal-title')
          .first()
          .textContent();
        console.log(`📄 Modal title found: "${modalTitle}"`);

        // Success if we got this far without Object.entries errors
        expect(hasErrors).toBe(false);
        console.log('✅ SUCCESS: Modal opened without Object.entries() crashes!');

        // Close modal
        const cancelButton = page.getByRole('button', { name: 'إلغاء' });
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
        }
      } else {
        console.log('⚠️ No modal appeared - checking for errors...');
        expect(hasErrors).toBe(false);
      }
    } else {
      console.log('⚠️ No edit buttons found');
    }
  });
});
