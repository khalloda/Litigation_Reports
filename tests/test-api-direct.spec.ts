import { test, expect } from '@playwright/test';

test.describe('Direct API Test', () => {
  test('Test API endpoints directly from browser', async ({ page }) => {
    console.log('🧪 TESTING: Direct API calls from browser');

    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    // Navigate to invoices page to get the authentication token
    await page.goto('/invoices', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Try to make API calls directly from browser context
    const apiResults = await page.evaluate(async () => {
      const results = { clients: null, cases: null, error: null };

      try {
        // Get the token from localStorage or wherever it's stored
        const token = localStorage.getItem('auth_token') ||
                     sessionStorage.getItem('auth_token') ||
                     localStorage.getItem('token') ||
                     sessionStorage.getItem('token');

        console.log('Found token:', token ? 'exists' : 'not found');

        // Test clients API
        const clientsResponse = await fetch('http://lit.local:8080/api/clients?limit=5', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Clients response status:', clientsResponse.status);

        if (clientsResponse.ok) {
          const clientsData = await clientsResponse.json();
          results.clients = {
            status: clientsResponse.status,
            success: clientsData.success,
            count: clientsData.data?.data?.length || 0
          };
        }

        // Test cases API
        const casesResponse = await fetch('http://lit.local:8080/api/cases?limit=5', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Cases response status:', casesResponse.status);

        if (casesResponse.ok) {
          const casesData = await casesResponse.json();
          results.cases = {
            status: casesResponse.status,
            success: casesData.success,
            count: casesData.data?.data?.length || 0
          };
        }

      } catch (error) {
        results.error = error.message;
        console.error('API test error:', error);
      }

      return results;
    });

    console.log('\\n📊 API Results:');
    console.log('   Clients:', JSON.stringify(apiResults.clients));
    console.log('   Cases:', JSON.stringify(apiResults.cases));
    if (apiResults.error) {
      console.log('   Error:', apiResults.error);
    }

    // Verify that API calls work
    expect(apiResults.clients).not.toBeNull();
    expect(apiResults.cases).not.toBeNull();
  });
});