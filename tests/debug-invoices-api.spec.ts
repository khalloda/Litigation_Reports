import { test, expect } from '@playwright/test';

test.describe('Debug Invoices API Response', () => {
  test('invoices API response directly', async ({ page, request }) => {
    console.log('🔍 Testing invoices API response directly');

    // First login to get session/cookies
    await page.goto('http://lit.local:8080/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    // Now test the API directly
    const response = await request.post(
      'http://lit.local:8080/backend/api/index.php?action=generate_custom_report',
      {
        data: {
          entity: 'invoices',
          columns: ['invoice_number', 'amount'], // Select only 2 columns
          filters: {},
          limit: 10,
          page: 1,
        },
      }
    );

    console.log('📊 API Response Status:', response.status());

    if (response.status() === 200) {
      const data = await response.json();

      console.log('✅ API Success!');
      console.log('📋 Data keys:', Object.keys(data));

      if (data.data && data.data.length > 0) {
        console.log('🔍 First row keys:', Object.keys(data.data[0]));
        console.log('🔍 First row data:', data.data[0]);
      }

      if (data.config) {
        console.log('⚙️ Config:', data.config);
        console.log('📊 Selected columns in config:', data.config.columns);
      }

      if (data.available_columns) {
        console.log('📋 Available columns:', Object.keys(data.available_columns));
      }
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
    }
  });
});
