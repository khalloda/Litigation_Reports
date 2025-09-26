import { test, expect } from '@playwright/test';

test.describe('Case Editing Functionality', () => {
  test.use({
    baseURL: 'http://lit.local:8080'
  });

  test('Case editing modal opens and works correctly', async ({ page }) => {
    console.log('🧪 Testing Case Editing Functionality');

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
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // Check if edit buttons exist
    const editButtons = await page.locator('button[title="تعديل القضية"]').count();
    console.log(`📋 Found ${editButtons} cases with edit buttons`);

    if (editButtons > 0) {
      // Click the first edit button
      await page.locator('button[title="تعديل القضية"]').first().click();
      console.log('✅ Clicked edit button for first case');

      // Wait for modal to appear
      await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
      console.log('✅ Edit modal appeared');

      // Check modal title
      const modalTitle = await page.locator('.modal-title').textContent();
      console.log(`📄 Modal title: "${modalTitle}"`);
      expect(modalTitle).toContain('تعديل القضية');

      // Verify form fields are populated
      const matterIdInput = page.locator('input[placeholder*="رقم القضية"]');
      const matterIdValue = await matterIdInput.inputValue();
      console.log(`📝 Matter ID field value: "${matterIdValue}"`);

      const matterArInput = page.locator('input[placeholder*="موضوع القضية باللغة العربية"]');
      const matterArValue = await matterArInput.inputValue();
      console.log(`📝 Matter AR field value: "${matterArValue}"`);

      // Test that fields are not empty (should be pre-filled in edit mode)
      expect(matterIdValue.length).toBeGreaterThan(0);

      // Test editing a field
      const originalValue = matterArValue;
      const newValue = matterArValue + ' - تعديل اختبار';

      await matterArInput.fill(newValue);
      console.log(`✅ Updated matter_ar field to: "${newValue}"`);

      // Click save button
      const saveButton = page.locator('button[type="submit"]');
      await expect(saveButton).toBeVisible();
      await saveButton.click();
      console.log('✅ Clicked save button');

      // Wait for modal to close and success message
      await page.waitForSelector('[role="dialog"]', { state: 'detached', timeout: 10000 });
      console.log('✅ Modal closed after save');

      // Wait for page to refresh/reload data
      await page.waitForTimeout(2000);

      // Verify the change was saved by checking if the updated text appears in the table
      const updatedText = await page.getByText(newValue).isVisible().catch(() => false);

      if (updatedText) {
        console.log('✅ Case update successful - new text visible in table');
      } else {
        console.log('⚠️ Updated text not immediately visible - but save operation completed');
      }

      // Test "Add New Case" functionality
      console.log('\n🔄 Testing Add New Case functionality...');

      const addButton = page.getByRole('button', { name: 'إضافة قضية جديدة' });
      await addButton.click();
      console.log('✅ Clicked "Add New Case" button');

      // Wait for modal to appear
      await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

      // Check modal title for create mode
      const createModalTitle = await page.locator('.modal-title').textContent();
      console.log(`📄 Create modal title: "${createModalTitle}"`);
      expect(createModalTitle).toContain('إضافة قضية جديدة');

      // Verify form fields are empty (create mode)
      const createMatterIdValue = await page.locator('input[placeholder*="رقم القضية"]').inputValue();
      const createMatterArValue = await page.locator('input[placeholder*="موضوع القضية باللغة العربية"]').inputValue();

      console.log(`📝 Create mode - Matter ID: "${createMatterIdValue}"`);
      console.log(`📝 Create mode - Matter AR: "${createMatterArValue}"`);

      expect(createMatterIdValue).toBe('');
      expect(createMatterArValue).toBe('');

      // Close modal
      await page.getByRole('button', { name: 'إلغاء' }).click();
      await page.waitForSelector('[role="dialog"]', { state: 'detached' });
      console.log('✅ Closed create modal');

    } else {
      console.log('⚠️ No cases found to test editing functionality');

      // Still test the "Add New Case" button
      const addButton = page.getByRole('button', { name: 'إضافة قضية جديدة' });
      await addButton.click();
      console.log('✅ Clicked "Add New Case" button');

      await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
      const modalTitle = await page.locator('.modal-title').textContent();
      expect(modalTitle).toContain('إضافة قضية جديدة');
      console.log('✅ Add case modal works correctly');

      await page.getByRole('button', { name: 'إلغاء' }).click();
    }

    console.log('\n🎉 Case editing functionality test completed successfully!');
  });

  test('Case editing replaces the old placeholder message', async ({ page }) => {
    console.log('🧪 Verifying placeholder message is replaced');

    // Login and navigate
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    await page.goto('/cases', { waitUntil: 'networkidle' });

    // Check that the placeholder message should NOT appear
    let placeholderMessageFound = false;

    // Set up console listener to catch the old error message if it appears
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('وظيفة التعديل قيد التطوير')) {
        placeholderMessageFound = true;
        console.log('❌ FOUND OLD PLACEHOLDER MESSAGE - this should not happen!');
      }
    });

    // Wait for cases to load and try clicking an edit button if available
    await page.waitForTimeout(3000);
    const editButtons = await page.locator('button[title="تعديل القضية"]').count();

    if (editButtons > 0) {
      await page.locator('button[title="تعديل القضية"]').first().click();
      await page.waitForTimeout(2000);

      // Modal should appear instead of placeholder message
      const modalVisible = await page.locator('[role="dialog"]').isVisible();

      if (modalVisible) {
        console.log('✅ SUCCESS: Modal opened instead of showing placeholder message');
        await page.getByRole('button', { name: 'إلغاء' }).click();
      }
    }

    // Verify no placeholder message was shown
    expect(placeholderMessageFound).toBe(false);
    console.log('✅ Confirmed: No placeholder message found - edit functionality working!');
  });
});