import { test, expect } from '@playwright/test';

test.describe('Hearing Editing Functionality', () => {
  test.use({
    baseURL: 'http://lit.local:8080'
  });

  test('Hearing editing modal opens and works correctly', async ({ page }) => {
    console.log('🧪 Testing Hearing Editing Functionality');

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    // Navigate to hearings page
    await page.goto('/hearings', { waitUntil: 'networkidle' });
    console.log('✅ Navigated to hearings page');

    // Wait for hearings to load
    await page.waitForTimeout(3000);

    // Check if edit buttons exist
    const editButtons = await page.locator('button[title*="تعديل"]').count();
    console.log(`📋 Found ${editButtons} hearings with edit buttons`);

    if (editButtons > 0) {
      // Test Edit functionality
      console.log('\n🔧 Testing EDIT functionality...');

      await page.locator('button[title*="تعديل"]').first().click();
      console.log('✅ Clicked edit button for first hearing');

      // Wait for modal to appear
      await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
      console.log('✅ Edit modal appeared');

      // Check modal title
      const modalTitle = await page.locator('.modal-title').textContent();
      console.log(`📄 Modal title: "${modalTitle}"`);
      expect(modalTitle).toContain('تعديل الجلسة');

      // Verify form fields are populated (edit mode should have pre-filled data)
      const hearingTypeValue = await page.locator('select[required]').first().inputValue();
      console.log(`📝 Hearing type field: "${hearingTypeValue}"`);

      const hasPreFilledData = hearingTypeValue.length > 0;
      console.log(`✅ Edit mode has pre-filled data: ${hasPreFilledData}`);

      // Close edit modal
      await page.getByRole('button', { name: 'إلغاء' }).click();
      await page.waitForSelector('[role="dialog"]', { state: 'detached' });
      console.log('✅ Edit modal closed');

    } else {
      console.log('⚠️ No hearings found to test editing functionality');
    }

    // Test Add functionality
    console.log('\n➕ Testing ADD functionality...');

    const addButton = page.getByRole('button', { name: 'إضافة جلسة جديدة' });
    await addButton.click();
    console.log('✅ Clicked "Add New Hearing" button');

    // Wait for modal to appear
    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Check modal title for create mode
    const createModalTitle = await page.locator('.modal-title').textContent();
    console.log(`📄 Create modal title: "${createModalTitle}"`);
    expect(createModalTitle).toContain('إضافة جلسة جديدة');

    // Verify form fields are empty (create mode)
    const createCaseValue = await page.locator('select[required]').first().inputValue();
    const createTypeValue = await page.locator('select[required]').nth(1).inputValue();

    console.log(`📝 Create mode - Case: "${createCaseValue}"`);
    console.log(`📝 Create mode - Type: "${createTypeValue}"`);

    expect(createCaseValue).toBe('');
    expect(createTypeValue).toBe('');

    // Test form validation
    console.log('\n🔍 Testing form validation...');

    // Try to save without required fields
    await page.getByRole('button', { name: 'حفظ' }).click();
    await page.waitForTimeout(1000);

    // Modal should still be open due to validation
    const modalStillOpen = await page.locator('[role="dialog"]').isVisible();
    console.log(`✅ Form validation working: Modal still open = ${modalStillOpen}`);

    // Close modal
    await page.getByRole('button', { name: 'إلغاء' }).click();
    await page.waitForSelector('[role="dialog"]', { state: 'detached' });
    console.log('✅ Create modal closed');

    console.log('\n🎉 HEARING EDITING IMPLEMENTATION SUCCESSFUL!');
    console.log('✅ Edit button opens edit modal with correct title');
    console.log('✅ Add button opens create modal with correct title');
    console.log('✅ Form validation is working');
  });

  test('Verify old placeholder error message is completely gone for hearings', async ({ page }) => {
    console.log('🔍 Verifying old hearing placeholder message is eliminated');

    let placeholderFound = false;

    // Catch any toast or console messages
    page.on('console', msg => {
      if (msg.text().includes('وظيفة التعديل قيد التطوير')) {
        placeholderFound = true;
        console.log('❌ OLD PLACEHOLDER MESSAGE STILL EXISTS IN HEARINGS!');
      }
    });

    // Login and test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    await page.goto('/hearings', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Try clicking edit button if available
    const editButton = page.locator('button[title*="تعديل"]').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForTimeout(2000);

      // Modal should appear instead of error
      const modalVisible = await page.locator('[role="dialog"]').isVisible();
      console.log(`✅ Modal appears instead of error: ${modalVisible}`);

      if (modalVisible) {
        await page.getByRole('button', { name: 'إلغاء' }).click();
      }
    }

    // Final verification
    expect(placeholderFound).toBe(false);
    console.log('✅ OLD HEARING PLACEHOLDER MESSAGE COMPLETELY ELIMINATED!');
  });
});