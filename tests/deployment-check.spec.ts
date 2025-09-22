import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test.setTimeout(120000);

test('Check what application is actually deployed', async ({ page }) => {
  console.log('🕵️ Investigating deployed application...');

  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Take full page screenshot
  await page.screenshot({ path: 'test-results/deployment-full-page.png', fullPage: true });

  // Check page source and technology stack
  const htmlContent = await page.content();
  const pageTitle = await page.title();
  const currentUrl = page.url();

  console.log(`📄 Page Title: "${pageTitle}"`);
  console.log(`🔗 Current URL: ${currentUrl}`);

  // Check for React vs PHP indicators
  const techIndicators = {
    react: {
      found: false,
      indicators: ['react', '__react', 'jsx', 'useState', 'useEffect', 'ReactDOM'],
    },
    php: {
      found: false,
      indicators: ['<?php', '.php', 'X-Powered-By: PHP'],
    },
    frameworks: {
      bootstrap: htmlContent.includes('bootstrap'),
      jquery: htmlContent.includes('jquery'),
      vue: htmlContent.includes('vue'),
      angular: htmlContent.includes('angular'),
    },
  };

  // Check React indicators
  for (const indicator of techIndicators.react.indicators) {
    if (htmlContent.toLowerCase().includes(indicator.toLowerCase())) {
      techIndicators.react.found = true;
      console.log(`✅ React indicator found: ${indicator}`);
      break;
    }
  }

  // Check PHP indicators
  for (const indicator of techIndicators.php.indicators) {
    if (htmlContent.toLowerCase().includes(indicator.toLowerCase())) {
      techIndicators.php.found = true;
      console.log(`✅ PHP indicator found: ${indicator}`);
      break;
    }
  }

  // Check response headers for server technology
  const response = await page.goto(BASE_URL);
  const headers = response?.headers() || {};

  console.log('\n🔧 SERVER HEADERS:');
  Object.entries(headers).forEach(([key, value]) => {
    if (
      key.toLowerCase().includes('server') ||
      key.toLowerCase().includes('x-powered') ||
      key.toLowerCase().includes('content-type')
    ) {
      console.log(`${key}: ${value}`);
    }
  });

  // Check HTML structure
  console.log('\n📋 HTML STRUCTURE:');
  const bodyClasses = (await page.locator('body').getAttribute('class')) || '';
  const htmlLang = (await page.locator('html').getAttribute('lang')) || '';
  const metaTags = await page.locator('meta').count();
  const scriptTags = await page.locator('script').count();
  const linkTags = await page.locator('link').count();

  console.log(`Body classes: "${bodyClasses}"`);
  console.log(`HTML lang: "${htmlLang}"`);
  console.log(`Meta tags: ${metaTags}`);
  console.log(`Script tags: ${scriptTags}`);
  console.log(`Link tags: ${linkTags}`);

  // Check for specific application indicators
  console.log('\n🔍 APPLICATION TYPE ANALYSIS:');

  if (htmlContent.includes('id="root"') || htmlContent.includes('id="app"')) {
    console.log('✅ SPA root element found - likely React/Vue application');
  }

  if (htmlContent.includes('csrf') || htmlContent.includes('session')) {
    console.log('✅ CSRF/Session tokens found - likely server-side application');
  }

  // Check build artifacts
  const bundlePatterns = [
    /app\.[a-f0-9]+\.js/,
    /chunk\.[a-f0-9]+\.js/,
    /main\.[a-f0-9]+\.js/,
    /index\.[a-f0-9]+\.js/,
  ];

  let buildArtifactsFound = false;
  for (const pattern of bundlePatterns) {
    if (pattern.test(htmlContent)) {
      buildArtifactsFound = true;
      console.log(`✅ Build artifact found: ${pattern}`);
      break;
    }
  }

  // Check for our specific components
  console.log('\n🎯 CHECKING FOR OUR HEARINGS COMPONENTS:');

  const ourComponentIndicators = [
    'data-testid="add-hearing-button"',
    'إضافة جلسة جديدة',
    'HearingsPage',
    'React.createElement',
    'useAuth',
    'AuthProvider',
  ];

  let ourComponentsFound = 0;
  for (const indicator of ourComponentIndicators) {
    if (htmlContent.includes(indicator)) {
      ourComponentsFound++;
      console.log(`✅ Our component indicator found: ${indicator}`);
    }
  }

  // Final diagnosis
  console.log('\n🏥 DEPLOYMENT DIAGNOSIS:');
  console.log('='.repeat(50));

  if (techIndicators.react.found && ourComponentsFound > 0) {
    console.log('🎯 VERDICT: This IS our React application - looking for other issues');
  } else if (techIndicators.react.found && ourComponentsFound === 0) {
    console.log('⚠️ VERDICT: This is a React app, but NOT our version');
    console.log('   → Deployed version is outdated or different build');
  } else if (techIndicators.php.found) {
    console.log('🔄 VERDICT: This is a PHP application, not our React app');
    console.log('   → Wrong application deployed or running on wrong port');
  } else {
    console.log('❓ VERDICT: Unknown application type');
  }

  console.log('\n💡 RECOMMENDATIONS:');

  if (!techIndicators.react.found) {
    console.log('1. 🔄 Deploy the React application to lit.local:8080');
    console.log('2. 📦 Run "npm run build" to create production build');
    console.log('3. 📁 Copy build files to web server directory');
  } else if (ourComponentsFound === 0) {
    console.log('1. 🔄 Update deployment with latest code');
    console.log('2. 📦 Rebuild and redeploy application');
    console.log('3. 🔍 Check if correct branch/version is deployed');
  }

  console.log('\n📊 SUMMARY:');
  console.log(`- React detected: ${techIndicators.react.found ? '✅' : '❌'}`);
  console.log(`- PHP detected: ${techIndicators.php.found ? '✅' : '❌'}`);
  console.log(`- Our components: ${ourComponentsFound}/${ourComponentIndicators.length}`);
  console.log(`- Build artifacts: ${buildArtifactsFound ? '✅' : '❌'}`);

  // Save HTML for analysis
  await page.evaluate(() => {
    const html = document.documentElement.outerHTML;
    console.log('HTML length:', html.length);
  });
});
