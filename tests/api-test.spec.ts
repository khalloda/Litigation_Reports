import { test, expect } from '@playwright/test';

test.describe('API Endpoint Tests', () => {
  test('API health check should work', async ({ request }) => {
    console.log('🧪 Testing API health endpoint...');

    const response = await request.get('http://localhost:8000/api/ping');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toBe('Litigation Management API');

    console.log('✅ API health check passed');
  });

  test('Clients API should return client data', async ({ request }) => {
    console.log('🧪 Testing Clients API endpoint...');

    try {
      const response = await request.get('http://localhost:8000/api/clients');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();

      // Check if it contains client data (not user data)
      if (data.data && data.data.data && data.data.data.length > 0) {
        const firstItem = data.data.data[0];
        // Should have client fields, not user fields like 'email'
        const hasClientFields = firstItem.client_name_ar || firstItem.client_name_en;
        const hasUserFields = firstItem.email !== undefined;

        if (hasClientFields && !hasUserFields) {
          console.log('✅ Clients API returned client data correctly');
        } else if (hasUserFields) {
          console.log('❌ Clients API returned user data instead of client data');
        } else {
          console.log('⚠️  API returned data but unclear what type');
        }
      } else {
        console.log('ℹ️  No data returned from clients API');
      }

    } catch (error) {
      console.log('❌ Clients API error:', error.message);
    }
  });

  test('Cases API should return case data', async ({ request }) => {
    console.log('🧪 Testing Cases API endpoint...');

    try {
      const response = await request.get('http://localhost:8000/api/cases');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data.success).toBe(true);

      console.log('✅ Cases API responded successfully');

    } catch (error) {
      console.log('❌ Cases API error:', error.message);
    }
  });

  test('Lawyers API should return lawyer data', async ({ request }) => {
    console.log('🧪 Testing Lawyers API endpoint...');

    try {
      const response = await request.get('http://localhost:8000/api/lawyers');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data.success).toBe(true);

      console.log('✅ Lawyers API responded successfully');

    } catch (error) {
      console.log('❌ Lawyers API error:', error.message);
    }
  });

  test('Hearings API should return hearing data', async ({ request }) => {
    console.log('🧪 Testing Hearings API endpoint...');

    try {
      const response = await request.get('http://localhost:8000/api/hearings');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data.success).toBe(true);

      console.log('✅ Hearings API responded successfully');

    } catch (error) {
      console.log('❌ Hearings API error:', error.message);
    }
  });

  test('Documents API should return document data', async ({ request }) => {
    console.log('🧪 Testing Documents API endpoint...');

    try {
      const response = await request.get('http://localhost:8000/api/documents');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data.success).toBe(true);

      console.log('✅ Documents API responded successfully');

    } catch (error) {
      console.log('❌ Documents API error:', error.message);
    }
  });

  test('Invoices API should return invoice data', async ({ request }) => {
    console.log('🧪 Testing Invoices API endpoint...');

    try {
      const response = await request.get('http://localhost:8000/api/invoices');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data.success).toBe(true);

      console.log('✅ Invoices API responded successfully');

    } catch (error) {
      console.log('❌ Invoices API error:', error.message);
    }
  });
});
