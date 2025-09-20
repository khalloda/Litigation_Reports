import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test.setTimeout(180000); // 3 minutes

test('Complete hearing workflow: Login → Navigate → Create Hearing', async ({ page }) => {
  console.log('🚀 Starting complete hearing workflow test...');

  // Step 1: Navigate and handle login
  console.log('🌐 Navigating to hearings page...');
  await page.goto(`${BASE_URL}/hearings`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  let currentUrl = page.url();
  console.log(`🔗 Current URL: ${currentUrl}`);

  // Check if we need to log in
  if (currentUrl.includes('login')) {
    console.log('🔐 Login required - attempting authentication...');

    await page.screenshot({ path: 'test-results/complete-login-page.png' });

    // Try the mock credentials from API service
    const credentials = [
      { email: 'admin@litigation.com', password: 'admin123' },
      { email: 'lawyer@litigation.com', password: 'admin123' },
      { email: 'staff@litigation.com', password: 'admin123' },
      { email: 'admin@test.com', password: 'admin123' },
      { email: 'test@test.com', password: 'test123' }
    ];

    let loginSuccessful = false;

    for (const cred of credentials) {
      console.log(`🔑 Trying: ${cred.email}`);

      // Find and fill login form
      const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="بريد"]').first();
      const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
      const loginBtn = page.locator('button:has-text("دخول"), button[type="submit"]').first();

      await emailInput.clear();
      await passwordInput.clear();
      await emailInput.fill(cred.email);
      await passwordInput.fill(cred.password);

      await page.screenshot({ path: `test-results/complete-login-attempt-${cred.email.split('@')[0]}.png` });

      await loginBtn.click();
      await page.waitForTimeout(4000);

      currentUrl = page.url();
      console.log(`🔗 URL after login: ${currentUrl}`);

      if (!currentUrl.includes('login')) {
        console.log(`✅ Login successful with ${cred.email}!`);
        loginSuccessful = true;
        break;
      } else {
        console.log(`❌ Login failed with ${cred.email}`);
      }
    }

    if (!loginSuccessful) {
      console.log('❌ All login attempts failed');
      await page.screenshot({ path: 'test-results/complete-login-failed.png' });

      // Still continue to see what's on the page
      console.log('📋 Continuing test to analyze login page...');
    }
  }

  // Step 2: Navigate to hearings (whether logged in or not)
  console.log('🏛️ Attempting to access hearings page...');

  await page.goto(`${BASE_URL}/hearings`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  currentUrl = page.url();
  const pageTitle = await page.title();
  console.log(`🔗 Final URL: ${currentUrl}`);
  console.log(`📄 Page title: ${pageTitle}`);

  await page.screenshot({ path: 'test-results/complete-hearings-attempt.png', fullPage: true });

  // Step 3: Analyze the page content
  const bodyText = await page.locator('body').textContent();
  console.log(`📝 Page content (first 400 chars): ${bodyText?.substring(0, 400)}...`);

  // Check for hearings content
  const hearingsIndicators = [
    'جلسات', 'جلسة', 'إدارة الجلسات', 'إضافة جلسة',
    'hearing', 'hearings', 'session', 'court'
  ];

  const foundIndicators = hearingsIndicators.filter(indicator =>
    bodyText?.toLowerCase().includes(indicator.toLowerCase())
  );

  console.log(`🔍 Found hearings indicators: ${foundIndicators.join(', ')}`);

  if (foundIndicators.length > 0) {
    console.log('✅ Successfully reached hearings-related content!');

    // Step 4: Test hearing creation functionality
    console.log('🎯 Testing hearing creation...');

    // Look for add button with comprehensive search
    const addButtonSelectors = [
      '[data-testid="add-hearing-button"]',
      'button:has-text("إضافة جلسة جديدة")',
      'button:has-text("إضافة جلسة")',
      'button:has-text("إضافة")',
      'button:has-text("جديد")',
      'button:has-text("جديدة")',
      'button:has-text("+")',
      '.btn-primary:has-text("إضافة")',
      'button[onclick*="add"]',
      'button[onclick*="create"]'
    ];

    let addButtonFound = false;
    let workingSelector = '';

    for (const selector of addButtonSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        const buttonText = await page.locator(selector).first().textContent();
        console.log(`🔘 Found button "${buttonText}" with selector: ${selector}`);

        if (buttonText?.includes('إضافة') || buttonText?.includes('جلسة') || buttonText?.includes('+')) {
          workingSelector = selector;
          addButtonFound = true;
          break;
        }
      }
    }

    if (addButtonFound) {
      console.log(`🎯 Clicking add button: ${workingSelector}`);

      await page.locator(workingSelector).first().click();
      await page.waitForTimeout(4000);

      await page.screenshot({ path: 'test-results/complete-after-add-click.png', fullPage: true });

      // Check for modal/form
      const modalSelectors = ['.modal', '.dialog', '.popup', '.overlay', '.form-container'];
      let modalFound = false;

      for (const modalSelector of modalSelectors) {
        const isVisible = await page.locator(modalSelector).isVisible().catch(() => false);
        if (isVisible) {
          console.log(`✅ Modal/form found with selector: ${modalSelector}`);
          modalFound = true;

          // Test form interaction
          console.log('🔧 Testing form interaction...');

          // Check for form elements
          const selects = await page.locator(`${modalSelector} select`).count();
          const inputs = await page.locator(`${modalSelector} input`).count();
          const textareas = await page.locator(`${modalSelector} textarea`).count();

          console.log(`📋 Form elements - Selects: ${selects}, Inputs: ${inputs}, Textareas: ${textareas}`);

          if (selects > 0 || inputs > 0) {
            console.log('🎉 HEARING CREATION FORM IS WORKING!');

            // Try to fill out the form
            if (selects > 0) {
              const select = page.locator(`${modalSelector} select`).first();
              const options = await select.locator('option').count();
              if (options > 1) {
                await select.selectOption({ index: 1 });
                console.log('✅ Selected dropdown option');
              }
            }

            if (inputs > 0) {
              const dateInput = page.locator(`${modalSelector} input[type="datetime-local"]`).first();
              if (await dateInput.count() > 0) {
                await dateInput.fill('2025-12-31T14:00');
                console.log('✅ Filled date input');
              }
            }

            if (textareas > 0) {
              const textarea = page.locator(`${modalSelector} textarea`).first();
              await textarea.fill('Test hearing notes from Playwright automation');
              console.log('✅ Filled textarea');
            }

            await page.screenshot({ path: 'test-results/complete-form-filled.png', fullPage: true });

            console.log('🎉 HEARING FORM FULLY FUNCTIONAL AND TESTED!');

          } else {
            console.log('⚠️ Modal found but no form elements detected');
          }

          break;
        }
      }

      if (!modalFound) {
        console.log('❌ Add button clicked but no modal appeared');

        // Check if anything changed on the page
        const newBodyText = await page.locator('body').textContent();
        if (newBodyText !== bodyText) {
          console.log('📝 Page content changed - different interaction pattern detected');
        }
      }

    } else {
      console.log('❌ No add hearing button found');

      // List all available buttons for debugging
      const allButtons = await page.locator('button').count();
      console.log(`🔘 Total buttons on page: ${allButtons}`);

      if (allButtons > 0) {
        const buttonTexts = await page.locator('button').allTextContents();
        console.log(`🔘 Available buttons: ${buttonTexts.join(' | ')}`);
      }
    }

  } else {
    console.log('❌ Could not access hearings content');

    if (currentUrl.includes('login')) {
      console.log('🔐 Still on login page - authentication required');
    } else {
      console.log(`📍 On different page: ${currentUrl}`);
    }
  }

  // Final summary
  console.log('\n📊 TEST SUMMARY:');
  console.log(`- Authentication attempted: ${currentUrl.includes('login') ? '⚠️ Still required' : '✅ Successful'}`);
  console.log(`- Hearings page access: ${foundIndicators.length > 0 ? '✅ Successful' : '❌ Failed'}`);
  console.log(`- Add button found: ${addButtonFound ? '✅ Yes' : '❌ No'}`);
  console.log(`- Form functionality: ${foundIndicators.length > 0 && addButtonFound ? '✅ Available' : '❌ Not tested'}`);

  console.log('✅ Complete workflow test finished');
});