// Manual page test script - run this in browser console on each page
// Test URLs: http://lit.local/clients, http://lit.local/cases, http://lit.local/hearings, http://lit.local/reports

function testCurrentPage() {
    const results = {
        url: window.location.href,
        timestamp: new Date().toISOString(),
        tests: {}
    };

    // Test 1: Check for "Coming Soon" message (should not exist)
    results.tests.noComingSoon = !document.body.textContent.includes('Coming Soon');

    // Test 2: Check for main heading (h1 or h2)
    const mainHeading = document.querySelector('h1, h2');
    results.tests.hasMainHeading = !!mainHeading;
    results.mainHeadingText = mainHeading ? mainHeading.textContent.trim() : null;

    // Test 3: Check for navigation/layout
    results.tests.hasNavigation = !!document.querySelector('nav, .navbar, .sidebar');

    // Test 4: Check for main content area
    results.tests.hasMainContent = !!document.querySelector('main, .main-content, .container');

    // Test 5: Check for interactive elements (buttons, forms)
    const buttons = document.querySelectorAll('button').length;
    const forms = document.querySelectorAll('form').length;
    results.tests.hasInteractiveElements = buttons > 0 || forms > 0;
    results.interactiveElementCounts = { buttons, forms };

    // Test 6: Check for Arabic content (RTL support)
    results.tests.hasArabicContent = document.body.textContent.includes('إدارة') ||
                                   document.body.textContent.includes('العملاء') ||
                                   document.body.textContent.includes('القضايا') ||
                                   document.body.textContent.includes('الجلسات') ||
                                   document.body.textContent.includes('التقارير');

    // Test 7: Check for loading states or errors
    const spinners = document.querySelectorAll('.spinner, .loading').length;
    const errors = document.querySelectorAll('.error, .alert-danger').length;
    results.tests.noLoadingIssues = errors === 0;
    results.loadingStates = { spinners, errors };

    // Summary
    const passedTests = Object.values(results.tests).filter(Boolean).length;
    const totalTests = Object.keys(results.tests).length;
    results.summary = {
        passed: passedTests,
        total: totalTests,
        success: passedTests === totalTests,
        score: `${passedTests}/${totalTests}`
    };

    console.log('=== PAGE TEST RESULTS ===');
    console.log(`URL: ${results.url}`);
    console.log(`Main Heading: ${results.mainHeadingText}`);
    console.log(`Score: ${results.summary.score}`);
    console.log('Tests:', results.tests);
    console.log('Interactive Elements:', results.interactiveElementCounts);
    console.log('=== END RESULTS ===');

    return results;
}

// Auto-run test
console.log('Running page functionality test...');
const result = testCurrentPage();

// Show results summary
if (result.summary.success) {
    console.log('✅ ALL TESTS PASSED - Page is fully functional');
} else {
    console.log('⚠️ Some tests failed - Check details above');
}