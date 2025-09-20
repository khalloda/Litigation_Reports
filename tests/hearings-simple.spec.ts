import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test.setTimeout(120000); // 2 minutes total timeout

test('Simple hearing page test', async ({ page }) => {
  console.log('🔍 Starting simple test...');

  // Set page timeout
  page.setDefaultTimeout(30000);

  try {
    console.log(`🌐 Navigating to ${BASE_URL}/hearings...`);

    // Navigate with simpler options
    await page.goto(`${BASE_URL}/hearings`);

    console.log('✅ Navigation completed');

    // Wait for any content to load
    await page.waitForLoadState('domcontentloaded');
    console.log('📄 DOM content loaded');

    // Take immediate screenshot
    await page.screenshot({ path: 'test-results/simple-initial.png', fullPage: true });
    console.log('📸 Initial screenshot taken');

    // Check for basic page elements
    const pageTitle = await page.title();
    console.log(`📄 Page title: "${pageTitle}"`);

    // Check if there's any hearings content
    const h2Elements = await page.locator('h2').count();
    console.log(`Found ${h2Elements} h2 elements`);

    if (h2Elements > 0) {
      const h2Text = await page.locator('h2').first().textContent();
      console.log(`First h2 text: "${h2Text}"`);

      if (h2Text?.includes('إدارة الجلسات')) {
        console.log('✅ Found hearings management header');

        // Look for add button with a simple selector
        const addButtons = await page.locator('button:has-text("إضافة جلسة")').count();
        console.log(`Found ${addButtons} add buttons`);

        if (addButtons > 0) {
          console.log('✅ Found add hearing button');

          // Click the button
          await page.locator('button:has-text("إضافة جلسة")').first().click();
          console.log('🖱️ Clicked add button');

          // Wait and check for modal
          await page.waitForTimeout(3000);
          const modals = await page.locator('.modal').count();
          console.log(`Found ${modals} modal elements`);

          if (modals > 0) {
            console.log('✅ Modal appeared');
            await page.screenshot({ path: 'test-results/simple-modal.png' });

            // Check for form fields
            const caseSelects = await page.locator('select').count();
            const dateInputs = await page.locator('input[type="datetime-local"]').count();
            const textareas = await page.locator('textarea').count();

            console.log(`Found ${caseSelects} select elements`);
            console.log(`Found ${dateInputs} datetime inputs`);
            console.log(`Found ${textareas} textarea elements`);

            if (caseSelects > 0 && dateInputs > 0) {
              console.log('✅ Form elements found - hearing creation form is working!');
            } else {
              console.log('❌ Form elements missing');
            }
          } else {
            console.log('❌ No modal appeared');
          }
        } else {
          console.log('❌ Add hearing button not found');
        }
      } else {
        console.log('❓ Page header does not match expected hearings page');
      }
    } else {
      console.log('❌ No h2 elements found');
    }

  } catch (error) {
    console.error('❌ Test error:', error);
    await page.screenshot({ path: 'test-results/simple-error.png', fullPage: true });
    throw error;
  }
});