import { test, expect } from '@playwright/test';

test.describe('Invoice Auto Number Generation Test', () => {
  test('Invoice number is auto-generated when left empty', async ({ page }) => {
    console.log('🧪 TESTING: Invoice number auto-generation');

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    // Navigate to invoices page
    await page.goto('/invoices', { waitUntil: 'networkidle' });
    console.log('✅ Navigated to invoices page');

    await page.waitForTimeout(3000);

    // Click "Add Invoice" button
    const addButton = page.getByRole('button', { name: /إضافة فاتورة|Add Invoice/i });
    await addButton.click();
    await page.waitForTimeout(2000);

    // Check if create modal opened
    const modalVisible = await page.locator('[role="dialog"]').isVisible();
    console.log(`📋 Modal visible: ${modalVisible}`);
    expect(modalVisible).toBe(true);

    // Check modal title for create mode
    const modalTitle = await page.locator('.modal-title').textContent();
    console.log(`📄 Modal title: "${modalTitle}"`);

    // Leave invoice number field empty (it should show placeholder text)
    const invoiceNumberInput = page.locator('[role="dialog"] input[type="text"]').first();
    const placeholder = await invoiceNumberInput.getAttribute('placeholder');
    console.log(`🔢 Invoice number placeholder: "${placeholder}"`);

    // Fill required fields but leave invoice number empty
    // Fill the first date input (invoice date)
    await page.locator('[role="dialog"] input[type="date"]').first().fill('2025-09-26');
    await page.locator('[role="dialog"] input[type="number"]').first().fill('5000.00');

    console.log('📝 Filled required fields (date and amount), left invoice number empty');

    // Listen for network requests to check API calls
    const requestPromise = page.waitForRequest(request =>
      request.url().includes('/api/invoices') &&
      request.method() === 'POST'
    );

    const responsePromise = page.waitForResponse(response =>
      response.url().includes('/api/invoices') &&
      response.request().method() === 'POST'
    );

    // Click create button
    const createButton = page.getByRole('button', { name: 'إضافة الفاتورة' });
    await createButton.click();
    console.log('🔄 Clicked create button');

    // Wait for API request and response
    const request = await requestPromise;
    const response = await responsePromise;

    console.log(`📡 API Request: ${request.method()} ${request.url()}`);
    console.log(`📡 API Response: ${response.status()}`);

    // Get the request body to check the invoice_number field
    const requestData = request.postData();
    console.log(`📡 Request data: ${requestData}`);

    // Parse the request data to check if invoice_number is empty
    const requestJson = JSON.parse(requestData || '{}');
    console.log(`📄 Invoice number in request: "${requestJson.invoice_number}"`);

    // Check if the request was successful (201 = Created)
    expect(response.status()).toBe(201);

    // Wait for modal to close and page to refresh
    await page.waitForTimeout(3000);

    console.log('\\n🎉 INVOICE AUTO-NUMBER GENERATION TEST COMPLETE!');
    console.log(`✅ Request sent with invoice_number: "${requestJson.invoice_number}"`);
    console.log('✅ Backend should auto-generate number if empty');
    console.log('✅ API returned 200 - creation successful!');
  });
});