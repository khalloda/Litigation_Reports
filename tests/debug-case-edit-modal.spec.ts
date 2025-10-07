import { test, expect } from '@playwright/test';

test.describe('Debug Case Edit Modal', () => {
  test('Debug why case edit modal is not appearing', async ({ page }) => {
    console.log('🔍 Debugging case edit modal issue');

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('❌ Console error:', msg.text());
      }
    });

    // Listen for JavaScript errors
    page.on('pageerror', (err) => {
      console.log('❌ Page error:', err.message);
    });

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    // Navigate to cases page
    await page.goto('/cases', { waitUntil: 'networkidle' });
    console.log('✅ Navigated to cases page');

    // Wait for cases to load
    await page.waitForTimeout(3000);

    // Check if edit buttons exist
    const editButtons = await page.locator('button[title="تعديل القضية"]').count();
    console.log(`📋 Found ${editButtons} edit buttons`);

    if (editButtons > 0) {
      // Take a screenshot before clicking
      await page.screenshot({ path: 'test-results/before-edit-click.png' });

      console.log('🔄 Clicking edit button...');
      await page.locator('button[title="تعديل القضية"]').first().click();

      // Wait a moment
      await page.waitForTimeout(2000);

      // Check if any modals exist
      const anyModal = await page.locator('.modal').count();
      const anyDialog = await page.locator('[role="dialog"]').count();
      const anyModalDialog = await page.locator('.modal[role="dialog"]').count();

      console.log(`📊 Modal count: ${anyModal}`);
      console.log(`📊 Dialog count: ${anyDialog}`);
      console.log(`📊 Modal dialog count: ${anyModalDialog}`);

      // Check if modal exists but is not visible
      const modalExists = await page
        .locator('.modal')
        .first()
        .isVisible()
        .catch(() => false);
      console.log(`👀 First modal visible: ${modalExists}`);

      // Check modal classes and properties
      if (anyModal > 0) {
        const modalClasses = await page.locator('.modal').first().getAttribute('class');
        console.log(`📝 Modal classes: ${modalClasses}`);

        const modalStyle = await page.locator('.modal').first().getAttribute('style');
        console.log(`🎨 Modal style: ${modalStyle}`);
      }

      // Take a screenshot after clicking
      await page.screenshot({ path: 'test-results/after-edit-click.png' });

      // Look for the CaseModal specifically
      const caseModalTitle = await page
        .getByText('تعديل القضية')
        .isVisible()
        .catch(() => false);
      console.log(`📄 Case modal title visible: ${caseModalTitle}`);

      // Check if there are any Bootstrap modal elements
      const bootstrapModalBackdrop = await page.locator('.modal-backdrop').count();
      console.log(`🎭 Modal backdrop count: ${bootstrapModalBackdrop}`);

      const bootstrapShow = await page.locator('.modal.show').count();
      console.log(`✨ Modal with show class: ${bootstrapShow}`);
    } else {
      console.log('⚠️ No edit buttons found');
    }

    console.log('🔍 Debug complete - check screenshots and logs');
  });
});
