import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test.setTimeout(180000);

test('Comprehensive CRUD debugging for hearings', async ({ page }) => {
  console.log('🔧 Starting comprehensive CRUD debugging...');

  // Track console errors and network requests
  const consoleErrors: string[] = [];
  const networkErrors: string[] = [];
  const apiRequests: { url: string; method: string; status: number; response?: any }[] = [];

  // Listen for console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });

  // Listen for network requests
  page.on('response', (response) => {
    const url = response.url();
    const method = response.request().method();
    const status = response.status();

    if (url.includes('/api/') || url.includes('hearings')) {
      apiRequests.push({ url, method, status });
      console.log(`🌐 API Request: ${method} ${url} → ${status}`);
    }

    if (status >= 400) {
      networkErrors.push(`${method} ${url} → ${status}`);
      console.log(`❌ Network Error: ${method} ${url} → ${status}`);
    }
  });

  // Step 1: Login and navigate
  console.log('🔐 Logging in...');
  await page.goto(`${BASE_URL}/hearings`);
  await page.waitForLoadState('domcontentloaded');

  if (page.url().includes('login')) {
    await page.locator('input[type="email"]').fill('admin@litigation.com');
    await page.locator('input[type="password"]').fill('admin123');
    await page.locator('button:has-text("دخول")').click();
    await page.waitForTimeout(3000);
  }

  // Navigate to hearings
  await page.goto(`${BASE_URL}/hearings`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);

  console.log(`✅ On hearings page: ${page.url()}`);
  await page.screenshot({ path: 'test-results/crud-hearings-page.png', fullPage: true });

  // Step 2: Check page load and initial API calls
  console.log('📊 Checking initial page load...');
  console.log(`Console errors so far: ${consoleErrors.length}`);
  console.log(`Network errors so far: ${networkErrors.length}`);
  console.log(`API requests so far: ${apiRequests.length}`);

  // Step 3: Test CREATE functionality
  console.log('🆕 Testing CREATE functionality...');

  const addButton = page.locator('button:has-text("إضافة جلسة جديدة")');
  const addButtonExists = (await addButton.count()) > 0;
  console.log(`Add button exists: ${addButtonExists ? '✅' : '❌'}`);

  if (addButtonExists) {
    console.log('🖱️ Clicking add button...');

    // Clear previous API requests for this test
    apiRequests.length = 0;

    await addButton.click();
    await page.waitForTimeout(5000);

    console.log(`API requests after button click: ${apiRequests.length}`);
    apiRequests.forEach((req) => console.log(`  - ${req.method} ${req.url} → ${req.status}`));

    // Check for modal with multiple strategies
    const modalChecks = [
      { name: 'Bootstrap Modal', selector: '.modal.show' },
      { name: 'Modal Dialog', selector: '.modal-dialog' },
      { name: 'Modal Content', selector: '.modal-content' },
      { name: 'Any Modal', selector: '.modal' },
      { name: 'Dialog Element', selector: 'dialog[open]' },
      { name: 'Popup/Overlay', selector: '.popup, .overlay' },
    ];

    let modalFound = false;
    for (const check of modalChecks) {
      const isVisible = await page
        .locator(check.selector)
        .isVisible()
        .catch(() => false);
      console.log(
        `${check.name} (${check.selector}): ${isVisible ? '✅ Visible' : '❌ Not visible'}`
      );
      if (isVisible && !modalFound) {
        modalFound = true;

        // Take screenshot of modal
        await page.screenshot({ path: 'test-results/crud-modal-found.png', fullPage: true });

        // Analyze modal content
        const modalText = await page.locator(check.selector).textContent();
        console.log(`📝 Modal content preview: ${modalText?.substring(0, 300)}...`);

        // Test form fields
        await testFormFields(page, check.selector);
      }
    }

    if (!modalFound) {
      console.log('❌ No modal found after clicking add button');

      // Check if page changed
      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}`);

      // Look for any new content
      const pageContent = await page.locator('body').textContent();
      if (pageContent?.includes('إضافة') || pageContent?.includes('form')) {
        console.log('📝 Page might have form content without modal');
      }
    }
  } else {
    console.log('❌ Add button not found');
  }

  // Step 4: Test READ functionality (existing hearings)
  console.log('📖 Testing READ functionality...');

  const tableRows = await page.locator('tbody tr').count();
  console.log(`Table rows found: ${tableRows}`);

  if (tableRows > 0) {
    console.log('✅ Data is being displayed');

    // Check for view/edit/delete buttons
    const actionButtons = await page.locator('tbody tr:first-child button').count();
    console.log(`Action buttons per row: ${actionButtons}`);

    if (actionButtons > 0) {
      const buttonTexts = await page.locator('tbody tr:first-child button').allTextContents();
      console.log(`Action button texts: ${buttonTexts.join(' | ')}`);
    }
  } else {
    console.log('📄 No existing hearings data found');

    // Check for "no data" message
    const noDataMessage = await page
      .locator('text=/لا توجد|no data|empty/i')
      .textContent()
      .catch(() => '');
    if (noDataMessage) {
      console.log(`No data message: "${noDataMessage}"`);
    }
  }

  // Step 5: Check API endpoints directly
  console.log('🔗 Testing API endpoints directly...');

  const apiTests = [
    { endpoint: '/api/hearings', method: 'GET', description: 'List hearings' },
    { endpoint: '/api/hearings/options', method: 'GET', description: 'Get hearing options' },
    { endpoint: '/api/cases', method: 'GET', description: 'List cases for dropdown' },
  ];

  for (const apiTest of apiTests) {
    try {
      console.log(`🧪 Testing ${apiTest.description}: ${apiTest.method} ${apiTest.endpoint}`);

      const response = await page.evaluate(
        async ({ endpoint, method }) => {
          const response = await fetch(endpoint, {
            method,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
              'Content-Type': 'application/json',
            },
          });

          return {
            status: response.status,
            ok: response.ok,
            data: response.ok
              ? await response.json().catch(() => 'Invalid JSON')
              : await response.text(),
          };
        },
        { endpoint: `${BASE_URL}${apiTest.endpoint}`, method: apiTest.method }
      );

      console.log(`  Status: ${response.status} ${response.ok ? '✅' : '❌'}`);
      if (!response.ok) {
        console.log(`  Error: ${JSON.stringify(response.data).substring(0, 200)}`);
      } else if (typeof response.data === 'object') {
        console.log(`  Success: ${JSON.stringify(response.data).substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`  ❌ API Error: ${error}`);
    }
  }

  // Step 6: Check browser storage and authentication
  console.log('🔒 Checking authentication state...');

  const authToken = await page.evaluate(() => localStorage.getItem('auth_token'));
  const sessionData = await page.evaluate(
    () => sessionStorage.getItem('user') || sessionStorage.getItem('auth')
  );

  console.log(`Auth token exists: ${authToken ? '✅' : '❌'}`);
  console.log(`Session data exists: ${sessionData ? '✅' : '❌'}`);

  if (authToken) {
    console.log(`Token preview: ${authToken.substring(0, 20)}...`);
  }

  // Step 7: Final diagnosis
  console.log('\n🏥 DIAGNOSIS SUMMARY:');
  console.log('='.repeat(50));
  console.log(`🔐 Authentication: ${authToken ? '✅ Token present' : '❌ No token'}`);
  console.log(`📄 Page loads: ${page.url().includes('hearings') ? '✅ Yes' : '❌ No'}`);
  console.log(`🔘 Add button: ${addButtonExists ? '✅ Present' : '❌ Missing'}`);
  console.log(`🪟 Modal opens: ${modalFound ? '✅ Yes' : '❌ No'}`);
  console.log(
    `📊 Console errors: ${consoleErrors.length === 0 ? '✅ None' : `❌ ${consoleErrors.length} errors`}`
  );
  console.log(
    `🌐 Network errors: ${networkErrors.length === 0 ? '✅ None' : `❌ ${networkErrors.length} errors`}`
  );
  console.log(`📡 API requests: ${apiRequests.length} total`);

  if (consoleErrors.length > 0) {
    console.log('\n❌ CONSOLE ERRORS:');
    consoleErrors.forEach((error, i) => console.log(`${i + 1}. ${error}`));
  }

  if (networkErrors.length > 0) {
    console.log('\n❌ NETWORK ERRORS:');
    networkErrors.forEach((error, i) => console.log(`${i + 1}. ${error}`));
  }

  // Step 8: Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (!modalFound && addButtonExists) {
    console.log("- Add button exists but modal doesn't open → Check JavaScript errors");
    console.log('- Possible missing dependencies or build issues');
  }
  if (consoleErrors.length > 0) {
    console.log('- Fix console errors that may be preventing functionality');
  }
  if (networkErrors.length > 0) {
    console.log('- Backend API endpoints may be missing or misconfigured');
  }
  if (!authToken) {
    console.log('- Authentication token missing → may affect API calls');
  }
});

async function testFormFields(page: any, modalSelector: string) {
  console.log('🧪 Testing form fields in modal...');

  const formElements = {
    selects: await page.locator(`${modalSelector} select`).count(),
    inputs: await page.locator(`${modalSelector} input`).count(),
    textareas: await page.locator(`${modalSelector} textarea`).count(),
    buttons: await page.locator(`${modalSelector} button`).count(),
  };

  console.log(`📋 Form elements: ${JSON.stringify(formElements)}`);

  // Test form interactions
  if (formElements.selects > 0) {
    try {
      const firstSelect = page.locator(`${modalSelector} select`).first();
      const options = await firstSelect.locator('option').count();
      console.log(`First dropdown has ${options} options`);

      if (options > 1) {
        await firstSelect.selectOption({ index: 1 });
        console.log('✅ Successfully selected dropdown option');
      }
    } catch (error) {
      console.log(`❌ Error testing dropdown: ${error}`);
    }
  }

  if (formElements.inputs > 0) {
    try {
      const dateInput = page.locator(`${modalSelector} input[type="datetime-local"]`).first();
      if ((await dateInput.count()) > 0) {
        await dateInput.fill('2025-12-31T10:00');
        console.log('✅ Successfully filled date input');
      }
    } catch (error) {
      console.log(`❌ Error testing date input: ${error}`);
    }
  }

  if (formElements.textareas > 0) {
    try {
      const textarea = page.locator(`${modalSelector} textarea`).first();
      await textarea.fill('Test content');
      console.log('✅ Successfully filled textarea');
    } catch (error) {
      console.log(`❌ Error testing textarea: ${error}`);
    }
  }
}
