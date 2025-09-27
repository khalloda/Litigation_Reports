import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('PDF Export System Validation', () => {
  test('PDF Export API Functionality Test', async ({ request }) => {
    console.log('🧪 Testing PDF export API functionality...');

    // Sample litigation data
    const testData = [
      {
        id: 1,
        client_name_ar: "عميل اختبار نظام PDF",
        case_title_ar: "قضية اختبار تصدير PDF",
        case_type_ar: "مدني",
        status_ar: "جاري",
        created_date: "2024-01-15",
        amount: "50000"
      }
    ];

    const startTime = Date.now();

    // Call PDF export API
    const response = await request.post(`${BASE_URL}/api/export/pdf-chrome`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: { data: testData }
    });

    const duration = Date.now() - startTime;

    // Verify response
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');

    // Verify PDF
    const pdfBuffer = await response.body();
    expect(pdfBuffer.length).toBeGreaterThan(5000); // Substantial size

    // Verify PDF structure
    const pdfHeader = pdfBuffer.slice(0, 5).toString('ascii');
    expect(pdfHeader).toBe('%PDF-');

    const pdfFooter = pdfBuffer.slice(-6).toString('ascii');
    expect(pdfFooter.includes('%%EOF')).toBe(true);

    // Performance check
    expect(duration).toBeLessThan(15000); // Should complete within 15 seconds

    console.log(`✅ PDF export test passed: ${pdfBuffer.length} bytes in ${duration}ms`);
  });

  test('PDF Export Error Handling Test', async ({ request }) => {
    console.log('🧪 Testing PDF export error handling...');

    // Test with empty data
    const emptyResponse = await request.post(`${BASE_URL}/api/export/pdf-chrome`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: { data: [] }
    });

    // Should handle gracefully (either success with empty PDF or proper error)
    expect([200, 400, 422, 500]).toContain(emptyResponse.status());

    // Test with malformed data
    const malformedResponse = await request.post(`${BASE_URL}/api/export/pdf-chrome`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: { invalid: 'data' }
    });

    expect(malformedResponse.status()).toBeGreaterThanOrEqual(400);

    console.log('✅ Error handling test passed');
  });

  test('PDF Export Performance Test', async ({ request }) => {
    console.log('🧪 Testing PDF export performance...');

    // Test with multiple records
    const largeDataset = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      client_name_ar: `عميل الأداء ${i + 1}`,
      case_title_ar: `قضية اختبار ${i + 1}`,
      case_type_ar: "مدني",
      status_ar: "جاري",
      created_date: "2024-01-15",
      amount: String((i + 1) * 1000)
    }));

    const startTime = Date.now();

    const response = await request.post(`${BASE_URL}/api/export/pdf-chrome`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: { data: largeDataset }
    });

    const duration = Date.now() - startTime;

    expect(response.status()).toBe(200);

    const pdfBuffer = await response.body();
    expect(pdfBuffer.length).toBeGreaterThan(10000);

    // Performance expectations
    expect(duration).toBeLessThan(30000); // Should complete within 30 seconds
    const recordsPerSecond = largeDataset.length / (duration / 1000);
    expect(recordsPerSecond).toBeGreaterThan(0.1); // At least 0.1 records per second

    console.log(`✅ Performance test passed: ${largeDataset.length} records in ${duration}ms`);
  });
});