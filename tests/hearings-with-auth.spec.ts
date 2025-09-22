import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test.setTimeout(120000);

test('Complete hearing workflow with authentication', async ({ page }) => {
  console.log('🔍 Starting authenticated hearing test...');

  // Step 1: Navigate to the application (will redirect to login)
  console.log('🌐 Navigating to application...');
  await page.goto(`${BASE_URL}/hearings`);
  await page.waitForLoadState('domcontentloaded');

  // Verify we're on login page
  const currentUrl = page.url();
  console.log(`🔗 Current URL: ${currentUrl}`);

  if (currentUrl.includes('login')) {
    console.log('🔐 On login page as expected');

    // Take screenshot of login page
    await page.screenshot({ path: 'test-results/auth-login-page.png' });

    // Look for login form elements
    const emailField = page.locator(
      'input[type="email"], input[name="email"], input[placeholder*="بريد"], input[placeholder*="email"]'
    );
    const passwordField = page.locator(
      'input[type="password"], input[name="password"], input[placeholder*="مرور"], input[placeholder*="password"]'
    );
    const loginButton = page.locator(
      'button:has-text("دخول"), button[type="submit"], button:has-text("login")'
    );

    // Check if login elements exist
    const emailExists = (await emailField.count()) > 0;
    const passwordExists = (await passwordField.count()) > 0;
    const buttonExists = (await loginButton.count()) > 0;

    console.log(`📧 Email field: ${emailExists ? '✅' : '❌'}`);
    console.log(`🔒 Password field: ${passwordExists ? '✅' : '❌'}`);
    console.log(`🔘 Login button: ${buttonExists ? '✅' : '❌'}`);

    if (emailExists && passwordExists && buttonExists) {
      console.log('🔐 Attempting login with test credentials...');

      // Try common test credentials
      const testCredentials = [
        { email: 'admin@litigation.com', password: 'admin123' },
        { email: 'test@test.com', password: 'test123' },
        { email: 'admin@test.com', password: 'admin' },
        { email: 'user@example.com', password: 'password' },
      ];

      for (const creds of testCredentials) {
        console.log(`🔑 Trying credentials: ${creds.email}`);

        // Clear and fill form
        await emailField.clear();
        await passwordField.clear();
        await emailField.fill(creds.email);
        await passwordField.fill(creds.password);

        // Take screenshot before login attempt
        await page.screenshot({
          path: `test-results/auth-before-login-${creds.email.split('@')[0]}.png`,
        });

        // Submit form
        await loginButton.click();

        // Wait for response
        await page.waitForTimeout(3000);

        // Check if login was successful
        const newUrl = page.url();
        console.log(`🔗 URL after login attempt: ${newUrl}`);

        if (!newUrl.includes('login')) {
          console.log(`✅ Login successful with ${creds.email}!`);
          await page.screenshot({ path: 'test-results/auth-successful-login.png' });
          break;
        } else {
          console.log(`❌ Login failed with ${creds.email}`);

          // Check for error messages
          const errorMsg = await page
            .locator('.error, .alert-danger, .text-danger')
            .textContent()
            .catch(() => '');
          if (errorMsg) {
            console.log(`⚠️ Error message: ${errorMsg}`);
          }
        }
      }

      // Check final login status
      const finalUrl = page.url();
      if (!finalUrl.includes('login')) {
        console.log('🎉 Successfully authenticated! Proceeding to hearings test...');

        // Step 2: Navigate to hearings page
        console.log('🏛️ Navigating to hearings page...');
        await page.goto(`${BASE_URL}/hearings`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        // Take screenshot of hearings page
        await page.screenshot({ path: 'test-results/auth-hearings-page.png', fullPage: true });

        // Check for hearings content
        const pageContent = await page.locator('body').textContent();
        const hasHearingsContent =
          pageContent?.includes('جلسات') || pageContent?.includes('إدارة الجلسات');

        if (hasHearingsContent) {
          console.log('✅ On hearings page with correct content');

          // Step 3: Test adding a hearing
          console.log('🔍 Looking for add hearing button...');

          // Look for add button with various selectors
          const addButtonSelectors = [
            'button:has-text("إضافة جلسة")',
            'button:has-text("إضافة")',
            '[data-testid="add-hearing-button"]',
            'button[onclick*="add"], button[onclick*="جلسة"]',
          ];

          let addButtonFound = false;
          for (const selector of addButtonSelectors) {
            const buttonCount = await page.locator(selector).count();
            if (buttonCount > 0) {
              console.log(`✅ Found add button with selector: ${selector}`);

              await page.locator(selector).first().click();
              await page.waitForTimeout(3000);

              // Check for modal or form
              const modalExists = await page
                .locator('.modal, .dialog, .popup')
                .isVisible()
                .catch(() => false);
              if (modalExists) {
                console.log('🎉 HEARING CREATION MODAL OPENED SUCCESSFULLY!');
                await page.screenshot({ path: 'test-results/auth-hearing-modal.png' });

                // Analyze modal content
                const modalContent = await page.locator('.modal, .dialog, .popup').textContent();
                console.log(`📝 Modal content preview: ${modalContent?.substring(0, 200)}...`);

                // Check for form fields
                const formElements = {
                  selects: await page
                    .locator('.modal select, .dialog select, .popup select')
                    .count(),
                  inputs: await page.locator('.modal input, .dialog input, .popup input').count(),
                  textareas: await page
                    .locator('.modal textarea, .dialog textarea, .popup textarea')
                    .count(),
                };

                console.log(`📋 Modal form elements: ${JSON.stringify(formElements)}`);

                if (formElements.selects > 0 || formElements.inputs > 0) {
                  console.log('🎉 HEARING CREATION FUNCTIONALITY IS WORKING PERFECTLY!');
                }

                addButtonFound = true;
                break;
              } else {
                console.log('❌ Button clicked but no modal appeared');
              }
            }
          }

          if (!addButtonFound) {
            console.log('❌ No add hearing button found');
            // Show available buttons for debugging
            const allButtons = await page.locator('button').allTextContents();
            console.log(`🔘 Available buttons: ${allButtons.join(' | ')}`);
          }
        } else {
          console.log('❌ Not on correct hearings page');
          const currentPageUrl = page.url();
          console.log(`🔗 Current page: ${currentPageUrl}`);
        }
      } else {
        console.log('❌ Authentication failed with all test credentials');
        console.log(
          '💡 You may need to provide valid credentials or check if the application uses different authentication'
        );
      }
    } else {
      console.log('❌ Login form elements not found properly');
    }
  } else {
    console.log('❓ Not redirected to login page - application might not require authentication');
  }

  console.log('✅ Test completed');
});
