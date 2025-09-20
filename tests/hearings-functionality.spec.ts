import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test.setTimeout(120000);

test('Test hearing creation functionality', async ({ page }) => {
  console.log('🎯 Testing hearing creation functionality...');

  // Navigate to hearings page
  await page.goto(`${BASE_URL}/hearings`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000); // Wait for any dynamic content

  // Take initial screenshot
  await page.screenshot({ path: 'test-results/hearings-initial.png', fullPage: true });

  const pageUrl = page.url();
  const pageTitle = await page.title();
  console.log(`📄 Page: ${pageUrl}`);
  console.log(`🏷️ Title: ${pageTitle}`);

  // Check page content
  const bodyText = await page.locator('body').textContent();
  console.log(`📝 Page content (first 300 chars): ${bodyText?.substring(0, 300)}...`);

  // Look for hearings-related content
  const hearingsKeywords = ['جلسات', 'جلسة', 'إدارة الجلسات', 'hearings'];
  const foundKeywords = hearingsKeywords.filter(keyword => bodyText?.includes(keyword));
  console.log(`🔍 Found keywords: ${foundKeywords.join(', ')}`);

  if (foundKeywords.length > 0) {
    console.log('✅ On hearings-related page');

    // Look for add button with multiple strategies
    console.log('🔍 Searching for add hearing button...');

    const buttonStrategies = [
      { name: 'test-id', selector: '[data-testid="add-hearing-button"]' },
      { name: 'arabic-text', selector: 'button:has-text("إضافة جلسة")' },
      { name: 'add-text', selector: 'button:has-text("إضافة")' },
      { name: 'new-text', selector: 'button:has-text("جديد")' },
      { name: 'plus-icon', selector: 'button:has([class*="plus"], [class*="add"])' },
      { name: 'primary-btn', selector: 'button.btn-primary' }
    ];

    let buttonFound = false;
    let workingSelector = '';

    for (const strategy of buttonStrategies) {
      const count = await page.locator(strategy.selector).count();
      console.log(`🔘 Strategy "${strategy.name}" (${strategy.selector}): ${count} buttons`);

      if (count > 0) {
        const buttonText = await page.locator(strategy.selector).first().textContent();
        console.log(`📝 Button text: "${buttonText}"`);

        if (buttonText?.includes('إضافة') || buttonText?.includes('جلسة') || buttonText?.includes('add')) {
          console.log(`✅ Found promising button with strategy: ${strategy.name}`);
          workingSelector = strategy.selector;
          buttonFound = true;
          break;
        }
      }
    }

    if (buttonFound) {
      console.log(`🎯 Clicking button with selector: ${workingSelector}`);

      // Click the button
      await page.locator(workingSelector).first().click();
      await page.waitForTimeout(3000);

      // Take screenshot after clicking
      await page.screenshot({ path: 'test-results/hearings-after-click.png', fullPage: true });

      // Check for modal/dialog/form
      const modalStrategies = [
        { name: 'modal-class', selector: '.modal' },
        { name: 'dialog', selector: '.dialog, dialog' },
        { name: 'popup', selector: '.popup' },
        { name: 'overlay', selector: '.overlay' },
        { name: 'form-modal', selector: '.modal-dialog, .modal-content' }
      ];

      let modalFound = false;
      for (const strategy of modalStrategies) {
        const visible = await page.locator(strategy.selector).isVisible().catch(() => false);
        if (visible) {
          console.log(`✅ Modal found with strategy: ${strategy.name}`);
          modalFound = true;

          // Analyze modal content
          const modalText = await page.locator(strategy.selector).textContent();
          console.log(`📝 Modal content preview: ${modalText?.substring(0, 200)}...`);

          // Look for form elements
          const formFields = {
            selects: await page.locator(`${strategy.selector} select`).count(),
            inputs: await page.locator(`${strategy.selector} input`).count(),
            textareas: await page.locator(`${strategy.selector} textarea`).count(),
            buttons: await page.locator(`${strategy.selector} button`).count()
          };

          console.log(`📋 Form fields found: ${JSON.stringify(formFields)}`);

          if (formFields.selects > 0 || formFields.inputs > 0 || formFields.textareas > 0) {
            console.log('🎉 HEARING CREATION FORM IS ACCESSIBLE!');

            // Try to interact with the form
            console.log('🔧 Testing form interaction...');

            // Look for case selection dropdown
            const caseSelects = await page.locator(`${strategy.selector} select`).count();
            if (caseSelects > 0) {
              console.log(`📋 Found ${caseSelects} select dropdown(s)`);

              const firstSelect = page.locator(`${strategy.selector} select`).first();
              const options = await firstSelect.locator('option').count();
              console.log(`📝 First select has ${options} options`);

              if (options > 1) {
                console.log('🔧 Testing dropdown selection...');
                await firstSelect.selectOption({ index: 1 });
                console.log('✅ Successfully selected dropdown option');
              }
            }

            // Look for date inputs
            const dateInputs = await page.locator(`${strategy.selector} input[type="datetime-local"], ${strategy.selector} input[type="date"]`).count();
            if (dateInputs > 0) {
              console.log(`📅 Found ${dateInputs} date input(s)`);

              const dateInput = page.locator(`${strategy.selector} input[type="datetime-local"], ${strategy.selector} input[type="date"]`).first();
              await dateInput.fill('2025-12-31T10:00');
              console.log('✅ Successfully filled date input');
            }

            // Look for text areas
            const textareas = await page.locator(`${strategy.selector} textarea`).count();
            if (textareas > 0) {
              console.log(`📝 Found ${textareas} textarea(s)`);

              const textarea = page.locator(`${strategy.selector} textarea`).first();
              await textarea.fill('Test hearing notes from Playwright test');
              console.log('✅ Successfully filled textarea');
            }

            // Take screenshot of filled form
            await page.screenshot({ path: 'test-results/hearings-form-filled.png', fullPage: true });

            console.log('🎉 HEARING FORM INTERACTION TEST SUCCESSFUL!');

            // Look for submit button
            const submitButtons = await page.locator(`${strategy.selector} button[type="submit"], ${strategy.selector} button:has-text("إضافة"), ${strategy.selector} button:has-text("حفظ")`).count();
            if (submitButtons > 0) {
              console.log(`💾 Found ${submitButtons} submit button(s) - form is ready for submission`);
            }

          } else {
            console.log('❌ Modal opened but no form fields found');
          }

          break;
        }
      }

      if (!modalFound) {
        console.log('❌ Button clicked but no modal/dialog appeared');

        // Check if page content changed
        const newBodyText = await page.locator('body').textContent();
        if (newBodyText !== bodyText) {
          console.log('📝 Page content changed after click - different interaction pattern');
        } else {
          console.log('📝 Page content unchanged - button might be inactive');
        }
      }

    } else {
      console.log('❌ No suitable add button found');

      // Show all available buttons for debugging
      const allButtons = await page.locator('button').count();
      console.log(`🔘 Total buttons on page: ${allButtons}`);

      if (allButtons > 0) {
        const buttonTexts = await page.locator('button').allTextContents();
        console.log(`🔘 All button texts: ${buttonTexts.join(' | ')}`);
      }
    }

  } else {
    console.log('❌ Not on hearings page or hearings content not found');

    // Check if we need to navigate differently
    const currentContent = bodyText?.substring(0, 500);
    console.log(`📝 Current page content: ${currentContent}`);
  }

  console.log('✅ Hearing functionality test completed');
});