# Playwright Testing Setup

This document provides comprehensive information about the Playwright testing setup for the Litigation Management System.

## Overview

Our Playwright testing framework provides:
- **End-to-end testing** for all user workflows
- **RTL and mixed content testing** for Arabic/English support
- **Accessibility testing** with WCAG 2.1 AA compliance
- **Visual regression testing** with screenshot comparisons
- **Cross-browser testing** across Chrome, Firefox, Safari, Edge
- **Mobile testing** for responsive design
- **Performance testing** for page load times
- **CI/CD integration** with automated test execution

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Setup Test Environment
```bash
npm run test:setup:quick
```

### 4. Run Tests
```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:auth
npm run test:rtl
npm run test:accessibility
npm run test:visual
```

## Test Structure

```
tests/
├── auth.spec.js                 # Authentication and login tests
├── rtl-mixed-content.spec.js    # RTL layout and mixed content tests
├── accessibility.spec.js        # Accessibility compliance tests
├── visual-regression.spec.js    # Visual regression tests
├── utils/
│   └── test-helpers.js          # Test utility functions
├── fixtures/
│   └── test-data.js             # Test data and fixtures
├── data/                        # Test data files (JSON)
├── global-setup.js              # Global test setup
└── global-teardown.js           # Global test cleanup
```

## Test Categories

### 1. Authentication Tests (`auth.spec.js`)
- Login page functionality
- RTL layout support
- Mixed content handling
- Form validation
- Keyboard navigation
- Screen reader compatibility
- Mobile responsiveness
- Password reset functionality
- Session management

### 2. RTL and Mixed Content Tests (`rtl-mixed-content.spec.js`)
- RTL layout switching
- Mixed Arabic/English content in forms
- Text direction handling
- RTL table layouts
- RTL navigation menus
- RTL form layouts
- Arabic date formatting
- Arabic number formatting
- RTL modal dialogs
- RTL data tables with sorting
- RTL pagination controls
- RTL search functionality
- RTL file upload areas
- RTL notification messages

### 3. Accessibility Tests (`accessibility.spec.js`)
- Heading structure validation
- Landmark roles verification
- Form labels and associations
- Keyboard navigation support
- Focus indicators
- ARIA attributes
- Color contrast validation
- Alt text for images
- Screen reader announcements
- Reduced motion preferences
- Form validation messages
- Table headers and associations
- Skip links
- High contrast mode
- Language attributes
- Focus management in modals

### 4. Visual Regression Tests (`visual-regression.spec.js`)
- Login page screenshots
- Dashboard layout screenshots
- Client management page screenshots
- Case management page screenshots
- Responsive design screenshots
- Form layout screenshots
- Data table layout screenshots
- Modal dialog screenshots
- Navigation menu screenshots
- Footer layout screenshots
- Error page layouts
- Loading states
- Notification messages
- Print styles
- Dark mode layout
- High contrast mode
- Reduced motion layout

## Browser Support

### Desktop Browsers
- **Chrome** (Chromium)
- **Firefox**
- **Safari** (WebKit)
- **Edge**

### RTL Testing
- **Chrome RTL** (Arabic locale)
- **Firefox RTL** (Arabic locale)

### Mobile Browsers
- **Chrome Mobile** (Pixel 5)
- **Safari Mobile** (iPhone 12)
- **Chrome Mobile RTL** (Arabic locale)

### Specialized Testing
- **Accessibility Testing** (reduced motion, high contrast)
- **Visual Regression** (consistent rendering)

## Test Configuration

### Playwright Configuration (`playwright.config.js`)
```javascript
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 3 : 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['github'],
    ['line']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://lit.local',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'ar-SA',
    timezoneId: 'Asia/Riyadh',
    reducedMotion: 'reduce'
  }
});
```

### Environment Variables
```bash
BASE_URL=http://lit.local          # Base URL for testing
NODE_ENV=testing                   # Test environment
TEST_TIMEOUT=30000                 # Test timeout in ms
TEST_RETRIES=2                     # Number of retries
TEST_WORKERS=2                     # Number of workers
DEFAULT_LANGUAGE=ar                # Default language
RTL_ENABLED=true                   # RTL support enabled
ACCESSIBILITY_ENABLED=true         # Accessibility testing
VISUAL_TESTING=true                # Visual regression testing
```

## Test Data

### Test Users
```javascript
const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'admin123',
    name: 'Admin User',
    arabicName: 'المدير العام'
  },
  lawyer: {
    email: 'lawyer@test.com',
    password: 'lawyer123',
    name: 'Lawyer User',
    arabicName: 'المحامي ناجي'
  }
};
```

### Test Clients
```javascript
const testClients = {
  valid: {
    name: 'John Smith',
    arabicName: 'ناجي رمضان',
    email: 'john.smith@example.com',
    phone: '+1234567890',
    arabicPhone: '+966501234567'
  }
};
```

## Running Tests

### Basic Commands
```bash
# Run all tests
npm run test

# Run with UI
npm run test:ui

# Run in headed mode
npm run test:headed

# Debug tests
npm run test:debug

# View test report
npm run test:report
```

### Specific Test Suites
```bash
# Authentication tests
npm run test:auth

# RTL and mixed content tests
npm run test:rtl

# Accessibility tests
npm run test:accessibility

# Visual regression tests
npm run test:visual

# Mobile tests
npm run test:mobile

# Performance tests
npm run test:performance

# Smoke tests
npm run test:smoke
```

### Advanced Commands
```bash
# Run with specific browser
npx playwright test --project=chromium

# Run with specific test file
npx playwright test tests/auth.spec.js

# Run with grep pattern
npx playwright test --grep "login"

# Update snapshots
npm run test:update-snapshots

# Run in CI mode
npm run test:ci
```

## Test Scripts

### Setup Scripts
```bash
# Full setup (database + test data)
npm run test:setup

# Quick setup (development)
npm run test:setup:quick

# CI setup
npm run test:setup:ci
```

### Run Scripts
```bash
# Use custom test runner
npm run test:run

# With options
./scripts/run-tests.sh --test-type rtl --browser chromium-rtl
./scripts/run-tests.sh --ci --test-type visual
./scripts/run-tests.sh --local --headless false
```

## CI/CD Integration

### GitHub Actions
The project includes a comprehensive GitHub Actions workflow (`.github/workflows/playwright.yml`) that runs:
- Browser tests on multiple browsers
- RTL tests with Arabic locale
- Accessibility tests
- Visual regression tests
- Mobile tests
- Performance tests

### CI Commands
```bash
# Run tests in CI
npm run test:ci

# Setup for CI
npm run test:setup:ci
```

## Test Utilities

### Test Helpers (`tests/utils/test-helpers.js`)
```javascript
const helpers = new TestHelpers(page);

// RTL testing
await helpers.switchLanguage('ar');
await helpers.waitForRTL();

// Mixed content testing
await helpers.testMixedContent(selector, arabicText, englishText);

// Accessibility testing
await helpers.testScreenReaderAccessibility();

// Visual testing
await helpers.takeVisualScreenshot(name);
await helpers.compareVisualElement(selector, name);

// Performance testing
await helpers.testPerformance();
```

## Debugging Tests

### Debug Mode
```bash
# Run in debug mode
npm run test:debug

# Debug specific test
npx playwright test tests/auth.spec.js --debug
```

### Test Results
- **HTML Report**: `playwright-report/index.html`
- **Screenshots**: `test-results/screenshots/`
- **Videos**: `test-results/videos/`
- **Traces**: `test-results/traces/`

### Common Issues
1. **Browser not found**: Run `npx playwright install`
2. **Test timeout**: Increase timeout in config
3. **RTL not working**: Check locale settings
4. **Visual regression failures**: Update snapshots with `--update-snapshots`

## Best Practices

### Test Writing
1. **Use descriptive test names**
2. **Group related tests with `describe`**
3. **Use `beforeEach` for setup**
4. **Test both LTR and RTL layouts**
5. **Include accessibility checks**
6. **Use proper selectors (data-testid)**
7. **Handle async operations properly**

### RTL Testing
1. **Test language switching**
2. **Verify text direction**
3. **Check layout alignment**
4. **Test mixed content**
5. **Validate Arabic text rendering**

### Accessibility Testing
1. **Check keyboard navigation**
2. **Verify ARIA attributes**
3. **Test screen reader compatibility**
4. **Validate color contrast**
5. **Check focus indicators**

### Visual Regression
1. **Use consistent viewport sizes**
2. **Disable animations**
3. **Set appropriate thresholds**
4. **Test on multiple browsers**
5. **Update snapshots when needed**

## Troubleshooting

### Common Issues
1. **Tests failing on CI**: Check environment setup
2. **RTL tests failing**: Verify Arabic locale
3. **Visual tests failing**: Update snapshots
4. **Performance tests failing**: Check thresholds
5. **Mobile tests failing**: Verify viewport settings

### Getting Help
1. Check test logs in `test-results/`
2. Review HTML report
3. Check browser console
4. Verify test data
5. Check environment configuration

## Contributing

### Adding New Tests
1. Create test file in `tests/`
2. Use test helpers for common functionality
3. Add test data to `tests/fixtures/test-data.js`
4. Update CI workflow if needed
5. Document new test scenarios

### Test Data Management
1. Use fixtures for consistent data
2. Clean up test data after tests
3. Use realistic test scenarios
4. Include both Arabic and English data
5. Test edge cases and error conditions

## Performance Considerations

### Test Execution
- **Parallel execution** for faster runs
- **Selective testing** for development
- **CI optimization** for automated runs
- **Resource management** for large test suites

### Browser Management
- **Headless mode** for CI
- **Headed mode** for debugging
- **Browser reuse** where possible
- **Cleanup** after test runs

This comprehensive Playwright testing setup ensures your litigation management system is thoroughly tested across all browsers, devices, and accessibility requirements, with special focus on RTL and mixed content scenarios.
