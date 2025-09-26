import { test, expect } from '@playwright/test';

test.describe('Debug API Content', () => {
  test('Check what API returns', async ({ page, request }) => {
    console.log('🔍 Testing API response content');

    // Login via browser first
    await page.goto('http://lit.local:8080/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    console.log('✅ Logged in via browser');

    // Use the browser context for API request to maintain cookies
    const response = await page.request.post('/backend/api/index.php?action=generate_custom_report', {
      data: {
        entity: 'invoices',
        columns: ['invoice_number', 'amount'],
        filters: {},
        limit: 5
      }
    });

    console.log('📊 Status:', response.status());

    const contentType = response.headers()['content-type'];
    console.log('📄 Content-Type:', contentType);

    const responseText = await response.text();
    console.log('📝 Response length:', responseText.length);
    console.log('📝 First 500 chars:', responseText.substring(0, 500));

    if (responseText.startsWith('{')) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Valid JSON response');
        console.log('📋 Data keys:', Object.keys(data));

        if (data.data && data.data.length > 0) {
          console.log('🔍 First row keys:', Object.keys(data.data[0]));
          console.log('🔍 Data count:', data.data.length);
        }

        if (data.config) {
          console.log('⚙️ Config columns:', data.config.columns);
        }

      } catch (e) {
        console.log('❌ JSON parse error:', e.message);
      }
    } else {
      console.log('❌ Not JSON - likely HTML or error page');
    }
  });
});