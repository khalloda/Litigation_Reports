import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = 'http://lit.local:3001';
const TIMEOUT = 30000;

test.describe('Hearings Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to hearings page
    await page.goto(`${BASE_URL}/hearings`, { waitUntil: 'networkidle' });

    // Wait for page to load
    await expect(page.locator('h2')).toContainText('إدارة الجلسات');
  });

  test('should display hearings page with correct elements', async ({ page }) => {
    // Check page title and header
    await expect(page.locator('h2')).toContainText('إدارة الجلسات');
    await expect(page.locator('p.text-muted')).toContainText('إدارة وتتبع جميع جلسات المحكمة');

    // Check add button exists
    await expect(page.getByTestId('add-hearing-button')).toBeVisible();
    await expect(page.getByTestId('add-hearing-button')).toContainText('إضافة جلسة جديدة');

    // Check filters section
    await expect(page.locator('input[placeholder="البحث في الجلسات..."]')).toBeVisible();
    await expect(page.locator('select').first()).toBeVisible();

    // Check table headers
    await expect(page.locator('th')).toContainText(['تاريخ الجلسة', 'القضية', 'العميل', 'نوع الجلسة', 'النتيجة', 'المدة', 'القرار', 'الجلسة التالية', 'الإجراءات']);
  });

  test('should open add hearing modal when clicking add button', async ({ page }) => {
    // Click add hearing button
    await page.getByTestId('add-hearing-button').click();

    // Wait for modal to appear
    await expect(page.locator('.modal')).toBeVisible();
    await expect(page.locator('.modal-title')).toContainText('إضافة جلسة جديدة');

    // Check form fields are present
    await expect(page.getByTestId('case-select')).toBeVisible();
    await expect(page.getByTestId('hearing-date-input')).toBeVisible();
    await expect(page.getByTestId('hearing-type-select')).toBeVisible();
    await expect(page.getByTestId('hearing-result-select')).toBeVisible();
    await expect(page.getByTestId('hearing-duration-select')).toBeVisible();
    await expect(page.getByTestId('next-hearing-input')).toBeVisible();
    await expect(page.getByTestId('short-decision-input')).toBeVisible();
    await expect(page.getByTestId('hearing-decision-textarea')).toBeVisible();
    await expect(page.getByTestId('court-notes-textarea')).toBeVisible();
    await expect(page.getByTestId('lawyer-notes-textarea')).toBeVisible();
    await expect(page.getByTestId('expert-notes-textarea')).toBeVisible();

    // Check buttons
    await expect(page.getByTestId('submit-hearing-button')).toBeVisible();
    await expect(page.locator('button:has-text("إلغاء")')).toBeVisible();
  });

  test('should close modal when clicking cancel button', async ({ page }) => {
    // Open modal
    await page.getByTestId('add-hearing-button').click();
    await expect(page.locator('.modal')).toBeVisible();

    // Click cancel
    await page.locator('button:has-text("إلغاء")').click();

    // Modal should be closed
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('should close modal when clicking X button', async ({ page }) => {
    // Open modal
    await page.getByTestId('add-hearing-button').click();
    await expect(page.locator('.modal')).toBeVisible();

    // Click X button
    await page.locator('.modal-header .btn-close').click();

    // Modal should be closed
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('should show validation errors for required fields', async ({ page }) => {
    // Open modal
    await page.getByTestId('add-hearing-button').click();
    await expect(page.locator('.modal')).toBeVisible();

    // Try to submit empty form
    await page.getByTestId('submit-hearing-button').click();

    // Should show validation errors
    await expect(page.locator('.invalid-feedback')).toHaveCount(5); // 5 required fields
    await expect(page.locator('.invalid-feedback')).toContainText(['القضية مطلوبة', 'تاريخ الجلسة مطلوب', 'نوع الجلسة مطلوب', 'نتيجة الجلسة مطلوبة', 'مدة الجلسة مطلوبة']);
  });

  test('should clear validation errors when user starts typing', async ({ page }) => {
    // Open modal
    await page.getByTestId('add-hearing-button').click();
    await expect(page.locator('.modal')).toBeVisible();

    // Try to submit empty form to trigger validation errors
    await page.getByTestId('submit-hearing-button').click();
    await expect(page.locator('.invalid-feedback')).toHaveCount(5);

    // Start typing in case field
    await page.getByTestId('case-select').selectOption({ index: 1 });

    // Case field error should be cleared
    const caseField = page.getByTestId('case-select');
    await expect(caseField).not.toHaveClass(/is-invalid/);
  });

  test('should fill form with valid data and submit successfully', async ({ page }) => {
    // Mock API response for successful creation
    await page.route('**/api/hearings', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 1,
              case_id: 1,
              hearing_date: '2025-01-15T10:00:00',
              hearing_type: 'initial',
              hearing_result: 'pending',
              hearing_duration: '1hour',
              created_at: new Date().toISOString(),
            },
            message: 'تم إضافة الجلسة بنجاح'
          })
        });
      }
    });

    // Mock cases API response
    await page.route('**/api/cases*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            data: [
              {
                id: 1,
                matter_id: 'CASE-001',
                matter_ar: 'قضية تجارية',
                matter_en: 'Commercial Case',
                client_name_ar: 'شركة الأمان',
                client_name_en: 'Al Aman Company'
              }
            ]
          }
        })
      });
    });

    // Mock hearings options API response
    await page.route('**/api/hearings/options', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            type: {
              initial: 'جلسة أولى',
              procedural: 'جلسة إجرائية',
              evidence: 'جلسة إثبات'
            },
            result: {
              won: 'فاز',
              lost: 'خسر',
              postponed: 'مؤجل',
              pending: 'معلق'
            },
            duration: {
              '30min': '30 دقيقة',
              '1hour': 'ساعة واحدة',
              '2hours': 'ساعتان'
            }
          }
        })
      });
    });

    // Open modal
    await page.getByTestId('add-hearing-button').click();
    await expect(page.locator('.modal')).toBeVisible();

    // Wait for cases to load
    await page.waitForTimeout(1000);

    // Fill required fields
    await page.getByTestId('case-select').selectOption('1');
    await page.getByTestId('hearing-date-input').fill('2025-01-15T10:00');
    await page.getByTestId('hearing-type-select').selectOption('initial');
    await page.getByTestId('hearing-result-select').selectOption('pending');
    await page.getByTestId('hearing-duration-select').selectOption('1hour');

    // Fill optional fields
    await page.getByTestId('hearing-decision-textarea').fill('قرار الجلسة الأولى');
    await page.getByTestId('court-notes-textarea').fill('ملاحظات المحكمة');
    await page.getByTestId('lawyer-notes-textarea').fill('ملاحظات المحامي');

    // Submit form
    await page.getByTestId('submit-hearing-button').click();

    // Should show success message (you may need to check for toast or other success indicator)
    // Modal should close
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error response
    await page.route('**/api/hearings', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'خطأ في إضافة الجلسة',
            errors: {
              case_id: 'القضية غير صالحة'
            }
          })
        });
      }
    });

    // Mock cases API response
    await page.route('**/api/cases*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            data: [
              {
                id: 1,
                matter_id: 'CASE-001',
                matter_ar: 'قضية تجارية',
                matter_en: 'Commercial Case',
                client_name_ar: 'شركة الأمان',
                client_name_en: 'Al Aman Company'
              }
            ]
          }
        })
      });
    });

    // Open modal and fill form
    await page.getByTestId('add-hearing-button').click();
    await expect(page.locator('.modal')).toBeVisible();

    // Wait for cases to load
    await page.waitForTimeout(1000);

    // Fill required fields
    await page.getByTestId('case-select').selectOption('1');
    await page.getByTestId('hearing-date-input').fill('2025-01-15T10:00');
    await page.getByTestId('hearing-type-select').selectOption('initial');
    await page.getByTestId('hearing-result-select').selectOption('pending');
    await page.getByTestId('hearing-duration-select').selectOption('1hour');

    // Submit form
    await page.getByTestId('submit-hearing-button').click();

    // Should show error feedback
    await expect(page.locator('.invalid-feedback')).toContainText('القضية غير صالحة');

    // Modal should remain open
    await expect(page.locator('.modal')).toBeVisible();
  });

  test('should disable submit button while loading', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/hearings', async (route) => {
      if (route.request().method() === 'POST') {
        // Delay response to test loading state
        await new Promise(resolve => setTimeout(resolve, 2000));
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { id: 1 },
            message: 'تم إضافة الجلسة بنجاح'
          })
        });
      }
    });

    // Mock cases API response
    await page.route('**/api/cases*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            data: [
              {
                id: 1,
                matter_id: 'CASE-001',
                matter_ar: 'قضية تجارية',
                matter_en: 'Commercial Case',
                client_name_ar: 'شركة الأمان',
                client_name_en: 'Al Aman Company'
              }
            ]
          }
        })
      });
    });

    // Open modal and fill form
    await page.getByTestId('add-hearing-button').click();
    await expect(page.locator('.modal')).toBeVisible();

    // Wait for cases to load
    await page.waitForTimeout(1000);

    // Fill required fields
    await page.getByTestId('case-select').selectOption('1');
    await page.getByTestId('hearing-date-input').fill('2025-01-15T10:00');
    await page.getByTestId('hearing-type-select').selectOption('initial');
    await page.getByTestId('hearing-result-select').selectOption('pending');
    await page.getByTestId('hearing-duration-select').selectOption('1hour');

    // Submit form
    await page.getByTestId('submit-hearing-button').click();

    // Button should be disabled and show loading state
    await expect(page.getByTestId('submit-hearing-button')).toBeDisabled();
    await expect(page.getByTestId('submit-hearing-button')).toContainText('جاري الحفظ...');

    // Wait for completion
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 10000 });
  });

  test('should filter hearings by search term', async ({ page }) => {
    // Mock hearings API response with search
    await page.route('**/api/hearings*', (route) => {
      const url = new URL(route.request().url());
      const searchTerm = url.searchParams.get('search');

      if (searchTerm) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              data: [
                {
                  id: 1,
                  case_id: 1,
                  hearing_date: '2025-01-15T10:00:00',
                  hearing_type: 'initial',
                  hearing_result: 'pending',
                  matter_ar: 'قضية تجارية',
                  client_name_ar: 'شركة الأمان'
                }
              ],
              pagination: {
                current_page: 1,
                per_page: 10,
                total: 1,
                total_pages: 1,
                has_next: false,
                has_prev: false
              }
            }
          })
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              data: [],
              pagination: {
                current_page: 1,
                per_page: 10,
                total: 0,
                total_pages: 0,
                has_next: false,
                has_prev: false
              }
            }
          })
        });
      }
    });

    // Type in search field
    await page.locator('input[placeholder="البحث في الجلسات..."]').fill('قضية تجارية');

    // Click apply filter button
    await page.locator('button:has-text("تطبيق")').click();

    // Should show filtered results
    await expect(page.locator('tbody tr')).toHaveCount(1);
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('add-hearing-button')).toBeFocused();

    // Open modal with Enter key
    await page.keyboard.press('Enter');
    await expect(page.locator('.modal')).toBeVisible();

    // Navigate through form fields with Tab
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('case-select')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('hearing-date-input')).toBeFocused();

    // Close modal with Escape key
    await page.keyboard.press('Escape');
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/cases*', (route) => {
      route.abort('failed');
    });

    // Open modal
    await page.getByTestId('add-hearing-button').click();
    await expect(page.locator('.modal')).toBeVisible();

    // Should handle cases loading error gracefully
    // (You might want to add error handling UI for this case)
  });
});

test.describe('Hearings Management - RTL Support', () => {
  test.beforeEach(async ({ page }) => {
    // Set RTL locale
    await page.addInitScript(() => {
      localStorage.setItem('i18nextLng', 'ar');
    });

    await page.goto(`${BASE_URL}/hearings`, { waitUntil: 'networkidle' });
  });

  test('should display properly in RTL mode', async ({ page }) => {
    // Check that Arabic text is displayed correctly
    await expect(page.locator('h2')).toContainText('إدارة الجلسات');

    // Check button text
    await expect(page.getByTestId('add-hearing-button')).toContainText('إضافة جلسة جديدة');

    // Check that form is properly oriented for RTL
    await page.getByTestId('add-hearing-button').click();
    await expect(page.locator('.modal')).toBeVisible();

    // Verify form labels are in Arabic
    await expect(page.locator('label')).toContainText(['القضية', 'تاريخ الجلسة', 'نوع الجلسة']);
  });
});