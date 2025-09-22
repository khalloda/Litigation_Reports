import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test.setTimeout(120000);

test('Detailed hearing page analysis', async ({ page }) => {
  console.log('🔍 Starting detailed analysis...');

  await page.goto(`${BASE_URL}/hearings`);
  await page.waitForLoadState('domcontentloaded');

  // Take screenshot
  await page.screenshot({ path: 'test-results/detailed-page.png', fullPage: true });

  // Get page info
  const title = await page.title();
  const url = page.url();
  console.log(`📄 Title: "${title}"`);
  console.log(`🔗 URL: ${url}`);

  // Check for various heading elements
  const h1Count = await page.locator('h1').count();
  const h2Count = await page.locator('h2').count();
  const h3Count = await page.locator('h3').count();
  console.log(`Found ${h1Count} h1, ${h2Count} h2, ${h3Count} h3 elements`);

  // Get all text content to see what's on the page
  const bodyText = await page.locator('body').textContent();
  console.log(`📝 Page content (first 500 chars): ${bodyText?.substring(0, 500)}...`);

  // Look for Arabic text patterns that might indicate hearings content
  const arabicKeywords = [
    'جلسات',
    'جلسة',
    'إدارة',
    'قضايا',
    'محكمة',
    'قضية',
    'إضافة',
    'تعديل',
    'حذف',
    'بحث',
    'تصفية',
    'عرض',
  ];

  const foundKeywords = [];
  for (const keyword of arabicKeywords) {
    if (bodyText?.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }
  console.log(`🔍 Found Arabic keywords: ${foundKeywords.join(', ')}`);

  // Check for buttons
  const buttonCount = await page.locator('button').count();
  console.log(`🔘 Found ${buttonCount} buttons`);

  if (buttonCount > 0) {
    const buttonTexts = await page.locator('button').allTextContents();
    console.log(`🔘 Button texts: ${buttonTexts.join(' | ')}`);

    // Look for add hearing button specifically
    const addHearingButtons = buttonTexts.filter(
      (text) => text.includes('إضافة') && text.includes('جلسة')
    );

    if (addHearingButtons.length > 0) {
      console.log(`✅ Found add hearing button: "${addHearingButtons[0]}"`);

      // Try to click it
      await page.locator('button', { hasText: 'إضافة' }).first().click();
      await page.waitForTimeout(2000);

      // Check for modal
      const modalVisible = await page
        .locator('.modal')
        .isVisible()
        .catch(() => false);
      if (modalVisible) {
        console.log('✅ Modal opened successfully!');
        await page.screenshot({ path: 'test-results/detailed-modal.png' });

        // Analyze modal content
        const modalText = await page.locator('.modal').textContent();
        console.log(`📝 Modal content: ${modalText?.substring(0, 200)}...`);

        // Look for form fields
        const formFields = {
          selects: await page.locator('.modal select').count(),
          inputs: await page.locator('.modal input').count(),
          textareas: await page.locator('.modal textarea').count(),
        };
        console.log(`📋 Form fields: ${JSON.stringify(formFields)}`);

        if (formFields.selects > 0 || formFields.inputs > 0) {
          console.log('✅ HEARING CREATION FORM IS WORKING!');
        }
      } else {
        console.log('❌ Modal did not open');
      }
    } else {
      console.log('❌ No add hearing button found');
    }
  }

  // Check for navigation or sidebar
  const navElements = await page.locator('nav').count();
  const sidebarElements = await page.locator('.sidebar, .side-nav, .navigation').count();
  console.log(`🧭 Found ${navElements} nav elements, ${sidebarElements} sidebar elements`);

  // Check if we might be on a login page
  const loginKeywords = ['login', 'تسجيل', 'دخول', 'password', 'username'];
  const hasLoginContent = loginKeywords.some((keyword) =>
    bodyText?.toLowerCase().includes(keyword.toLowerCase())
  );

  if (hasLoginContent) {
    console.log('🔐 Page might require authentication');
  }

  // Final summary
  console.log('\n📊 SUMMARY:');
  console.log(`- Page loads: ✅`);
  console.log(`- Title: "${title}"`);
  console.log(`- Arabic content: ${foundKeywords.length > 0 ? '✅' : '❌'}`);
  console.log(`- Buttons found: ${buttonCount}`);
  console.log(`- Likely login page: ${hasLoginContent ? '⚠️' : '❌'}`);
});
