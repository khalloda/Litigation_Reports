import { test, expect } from '@playwright/test';

test.describe('Lawyers CRUD - Complete Functionality Test', () => {
  let context;
  let page;

  // Test data
  const testLawyer = {
    name: 'Ahmed Al-Mansouri',
    arabicName: 'أحمد المنصوري',
    email: 'ahmed.mansouri@test.com',
    phone: '+971501234567',
    specialization: 'Corporate Law',
    barNumber: 'BAR123456789',
    licenseNumber: 'LIC987654321',
    yearsOfExperience: '15',
    hourlyRate: '500',
    bio: 'Experienced corporate lawyer with expertise in mergers and acquisitions'
  };

  const updatedLawyer = {
    name: 'Ahmed Al-Mansouri Updated',
    arabicName: 'أحمد المنصوري محدث',
    email: 'ahmed.mansouri.updated@test.com',
    phone: '+971501234568',
    specialization: 'Criminal Law',
    barNumber: 'BAR123456789',
    licenseNumber: 'LIC987654321',
    yearsOfExperience: '18',
    hourlyRate: '650',
    bio: 'Senior lawyer with extensive experience in criminal and corporate law'
  };

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    // Navigate to application
    await page.goto('http://lit.local:3002/');
    await page.waitForLoadState('networkidle');

    console.log('1. Navigate to application...');
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('Should complete full Lawyers CRUD workflow', async () => {
    // Step 1: Login
    console.log('2. Login process...');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Verify successful login
    await expect(page.locator('text=مرحباً بك')).toBeVisible({ timeout: 10000 });
    console.log('✓ Login successful');

    // Step 2: Navigate to Lawyers page
    console.log('3. Navigate to Lawyers page...');
    await page.click('text=المحامون');
    await page.waitForLoadState('networkidle');

    // Verify we're on the lawyers page
    await expect(page.locator('h2:has-text("إدارة المحامين")')).toBeVisible({ timeout: 10000 });
    console.log('✓ Successfully navigated to Lawyers page');

    // Step 3: Test CREATE functionality
    console.log('4. Testing CREATE functionality...');

    // Click Add New Lawyer button
    await page.click('button:has-text("إضافة محامي جديد")');
    await page.waitForSelector('.modal-content', { timeout: 5000 });

    // Verify modal opened
    await expect(page.locator('.modal-title:has-text("إضافة محامي جديد")')).toBeVisible();
    console.log('✓ Add lawyer modal opened');

    // Fill in all lawyer details
    await page.fill('input[placeholder*="الاسم"]', testLawyer.name);
    await page.fill('input[placeholder*="العربية"]', testLawyer.arabicName);
    await page.fill('input[type="email"]', testLawyer.email);
    await page.fill('input[type="tel"]', testLawyer.phone);
    await page.fill('input[placeholder*="التخصص"]', testLawyer.specialization);
    await page.fill('input[placeholder*="رقم المحاماة"]', testLawyer.barNumber);
    await page.fill('input[placeholder*="رقم الترخيص"]', testLawyer.licenseNumber);
    await page.fill('input[type="number"]', testLawyer.yearsOfExperience);
    await page.fill('input[placeholder*="الأجر"]', testLawyer.hourlyRate);
    await page.fill('textarea', testLawyer.bio);

    console.log('✓ Filled all lawyer form fields');

    // Submit the form
    await page.click('button:has-text("حفظ المحامي")');
    await page.waitForLoadState('networkidle');

    // Wait for modal to close and success message
    await page.waitForSelector('.modal-content', { state: 'detached', timeout: 10000 });
    console.log('✓ Lawyer created successfully');

    // Step 4: Verify the lawyer appears in the list
    console.log('5. Verifying lawyer appears in list...');
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Search for the created lawyer
    await page.fill('input[placeholder*="البحث"]', testLawyer.name);
    await page.waitForLoadState('networkidle');

    // Verify lawyer appears in results
    await expect(page.locator(`text=${testLawyer.name}`)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`text=${testLawyer.email}`)).toBeVisible();
    console.log('✓ Created lawyer appears in the list');

    // Step 5: Test READ/VIEW functionality
    console.log('6. Testing READ/VIEW functionality...');

    // Click on the lawyer row to view details
    await page.click(`tr:has-text("${testLawyer.name}") button:has-text("عرض")`);
    await page.waitForSelector('.modal-content', { timeout: 5000 });

    // Verify view modal shows correct information
    await expect(page.locator('.modal-title:has-text("تفاصيل المحامي")')).toBeVisible();
    await expect(page.locator(`text=${testLawyer.name}`)).toBeVisible();
    await expect(page.locator(`text=${testLawyer.email}`)).toBeVisible();
    await expect(page.locator(`text=${testLawyer.specialization}`)).toBeVisible();
    console.log('✓ View details modal shows correct information');

    // Close view modal
    await page.click('.modal-header button[aria-label="Close"]');
    await page.waitForSelector('.modal-content', { state: 'detached' });

    // Step 6: Test UPDATE functionality
    console.log('7. Testing UPDATE functionality...');

    // Click edit button for the lawyer
    await page.click(`tr:has-text("${testLawyer.name}") button:has-text("تعديل")`);
    await page.waitForSelector('.modal-content', { timeout: 5000 });

    // Verify edit modal opened
    await expect(page.locator('.modal-title:has-text("تعديل محامي")')).toBeVisible();
    console.log('✓ Edit lawyer modal opened');

    // Clear and update fields
    await page.fill('input[value*="Ahmed Al-Mansouri"]', updatedLawyer.name);
    await page.fill('input[value*="أحمد المنصوري"]', updatedLawyer.arabicName);
    await page.fill('input[value*="ahmed.mansouri@test.com"]', updatedLawyer.email);
    await page.fill('input[value*="+971501234567"]', updatedLawyer.phone);
    await page.fill('input[value*="Corporate Law"]', updatedLawyer.specialization);
    await page.fill('input[value="15"]', updatedLawyer.yearsOfExperience);
    await page.fill('input[value="500"]', updatedLawyer.hourlyRate);

    // Clear and update bio
    await page.fill('textarea', updatedLawyer.bio);

    console.log('✓ Updated lawyer form fields');

    // Submit the update
    await page.click('button:has-text("حفظ التغييرات")');
    await page.waitForLoadState('networkidle');

    // Wait for modal to close
    await page.waitForSelector('.modal-content', { state: 'detached', timeout: 10000 });
    console.log('✓ Lawyer updated successfully');

    // Step 7: Verify the updates are reflected
    console.log('8. Verifying updates are reflected...');
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Search for updated lawyer
    await page.fill('input[placeholder*="البحث"]', updatedLawyer.name);
    await page.waitForLoadState('networkidle');

    // Verify updated information appears
    await expect(page.locator(`text=${updatedLawyer.name}`)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`text=${updatedLawyer.email}`)).toBeVisible();
    console.log('✓ Updated lawyer information is displayed correctly');

    // Step 8: Test advanced search and filtering
    console.log('9. Testing search and filtering...');

    // Clear search
    await page.fill('input[placeholder*="البحث"]', '');
    await page.waitForLoadState('networkidle');

    // Test search by specialization
    await page.fill('input[placeholder*="البحث"]', updatedLawyer.specialization);
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${updatedLawyer.name}`)).toBeVisible();

    // Test search by email
    await page.fill('input[placeholder*="البحث"]', updatedLawyer.email);
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${updatedLawyer.name}`)).toBeVisible();

    console.log('✓ Search functionality works correctly');

    // Step 9: Test lawyer statistics/counts
    console.log('10. Testing lawyer statistics...');

    // Clear search to see all lawyers
    await page.fill('input[placeholder*="البحث"]', '');
    await page.waitForLoadState('networkidle');

    // Check if statistics cards are displayed
    const statsCards = await page.locator('.card .text-primary, .card .text-success, .card .text-info').count();
    expect(statsCards).toBeGreaterThan(0);
    console.log('✓ Lawyer statistics are displayed');

    // Step 10: Test pagination (if applicable)
    console.log('11. Testing pagination...');

    // Check if pagination exists
    const pagination = await page.locator('.pagination').count();
    if (pagination > 0) {
      console.log('✓ Pagination controls are present');
    } else {
      console.log('✓ No pagination needed (few records)');
    }

    // Step 11: Test DELETE functionality
    console.log('12. Testing DELETE functionality...');

    // Search for the lawyer we want to delete
    await page.fill('input[placeholder*="البحث"]', updatedLawyer.name);
    await page.waitForLoadState('networkidle');

    // Click delete button
    await page.click(`tr:has-text("${updatedLawyer.name}") button:has-text("حذف")`);
    await page.waitForSelector('.modal-content', { timeout: 5000 });

    // Verify delete confirmation modal
    await expect(page.locator('.modal-title:has-text("تأكيد الحذف")')).toBeVisible();
    await expect(page.locator(`text=${updatedLawyer.name}`)).toBeVisible();
    console.log('✓ Delete confirmation modal opened');

    // Confirm deletion
    await page.click('button:has-text("حذف"):not(:has-text("تأكيد"))');
    await page.waitForLoadState('networkidle');

    // Wait for modal to close
    await page.waitForSelector('.modal-content', { state: 'detached', timeout: 10000 });
    console.log('✓ Lawyer deleted successfully');

    // Step 12: Verify lawyer is removed from list
    console.log('13. Verifying lawyer is removed from list...');
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Search for deleted lawyer
    await page.fill('input[placeholder*="البحث"]', updatedLawyer.name);
    await page.waitForLoadState('networkidle');

    // Verify lawyer no longer appears
    await expect(page.locator(`text=${updatedLawyer.name}`)).not.toBeVisible({ timeout: 5000 });
    console.log('✓ Deleted lawyer no longer appears in the list');

    // Step 13: Test error handling
    console.log('14. Testing error handling...');

    // Try to create lawyer with invalid data
    await page.click('button:has-text("إضافة محامي جديد")');
    await page.waitForSelector('.modal-content', { timeout: 5000 });

    // Fill only required fields with invalid email
    await page.fill('input[placeholder*="الاسم"]', 'Test Lawyer');
    await page.fill('input[type="email"]', 'invalid-email');

    // Try to submit
    await page.click('button:has-text("حفظ المحامي")');

    // Check for validation error (email format)
    const emailInput = await page.locator('input[type="email"]');
    const validationMessage = await emailInput.evaluate(el => el.validationMessage);
    expect(validationMessage).toBeTruthy();
    console.log('✓ Email validation works correctly');

    // Close the modal
    await page.click('.modal-header button[aria-label="Close"]');
    await page.waitForSelector('.modal-content', { state: 'detached' });

    console.log('🎉 All Lawyers CRUD tests completed successfully!');
  });

  test('Should test Lawyers CRUD API endpoints', async () => {
    console.log('15. Testing API endpoints...');

    // Test GET /api/lawyers endpoint
    const response = await page.request.get('http://lit.local/api/lawyers');
    expect(response.ok()).toBeTruthy();

    const lawyersData = await response.json();
    expect(lawyersData.success).toBeTruthy();
    console.log('✓ GET /api/lawyers endpoint works');

    // Test GET /api/lawyers/options endpoint
    const optionsResponse = await page.request.get('http://lit.local/api/lawyers/active');
    expect(optionsResponse.ok()).toBeTruthy();
    console.log('✓ GET /api/lawyers/active endpoint works');

    console.log('🎉 API endpoints test completed!');
  });

  test('Should test responsive design on mobile', async () => {
    console.log('16. Testing responsive design...');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Navigate to lawyers page
    await page.click('text=المحامون');
    await page.waitForLoadState('networkidle');

    // Verify page is responsive
    await expect(page.locator('h2:has-text("إدارة المحامين")')).toBeVisible();

    // Check if mobile navigation works
    const addButton = await page.locator('button:has-text("إضافة محامي جديد")');
    await expect(addButton).toBeVisible();

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    console.log('✓ Responsive design works correctly');
  });
});

// Additional test for edge cases
test.describe('Lawyers CRUD - Edge Cases', () => {
  test('Should handle special characters and Arabic text properly', async ({ page }) => {
    console.log('17. Testing special characters and Arabic text...');

    // Navigate and login (simplified for edge case testing)
    await page.goto('http://lit.local:3002/');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Go to lawyers page
    await page.click('text=المحامون');
    await page.waitForLoadState('networkidle');

    // Test Arabic text and special characters
    const arabicLawyer = {
      name: 'محمد عبدالله الأحمدي',
      email: 'mohammed.arabic@test.com',
      specialization: 'قانون الأحوال الشخصية والمعاملات المدنية'
    };

    await page.click('button:has-text("إضافة محامي جديد")');
    await page.waitForSelector('.modal-content');

    await page.fill('input[placeholder*="الاسم"]', arabicLawyer.name);
    await page.fill('input[type="email"]', arabicLawyer.email);
    await page.fill('input[placeholder*="التخصص"]', arabicLawyer.specialization);

    await page.click('button:has-text("حفظ المحامي")');
    await page.waitForLoadState('networkidle');

    // Verify Arabic text is handled correctly
    await page.fill('input[placeholder*="البحث"]', arabicLawyer.name);
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${arabicLawyer.name}`)).toBeVisible();

    console.log('✓ Arabic text and special characters handled correctly');
  });
});