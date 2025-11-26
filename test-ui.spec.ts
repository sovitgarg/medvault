import { test, expect } from '@playwright/test';

test('capture screenshot of homepage', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'homepage-screenshot.png', fullPage: true });

  // Check if page loaded
  const title = await page.textContent('h1');
  console.log('Page title:', title);

  // Get button text
  const buttonText = await page.textContent('button');
  console.log('Button text:', buttonText);
});

test('test after oauth login', async ({ page }) => {
  // Go to homepage
  await page.goto('http://localhost:5173');

  // Check initial state
  console.log('Checking localStorage before login...');
  const beforeAuth = await page.evaluate(() => localStorage.getItem('medvault_access_token'));
  console.log('Token before:', beforeAuth);

  // Note: We can't actually complete OAuth in automated test
  // But we can check if the button is clickable
  const button = await page.locator('button:has-text("Connect to your Google Drive")');
  await expect(button).toBeVisible();
  console.log('Google button is visible and ready');
});

test('debug thumbnails with existing session', async ({ page }) => {
  // Listen for console messages
  page.on('console', msg => console.log('BROWSER:', msg.type(), msg.text()));

  // Listen for failed requests
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });

  await page.goto('http://localhost:5173');

  // Check if user is already authenticated (from previous session)
  const token = await page.evaluate(() => localStorage.getItem('medvault_access_token'));
  console.log('Access token exists:', !!token);

  if (!token) {
    console.log('No token found - user needs to login manually first');
    return;
  }

  // Wait for dashboard to load
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: 'debug-dashboard.png', fullPage: true });

  // Check for file cards
  const fileCards = await page.locator('[class*="FileCard"], [class*="file-card"], .group').count();
  console.log('File cards found:', fileCards);

  // Check img tags
  const images = await page.locator('img').all();
  for (const img of images) {
    const src = await img.getAttribute('src');
    console.log('Image src:', src?.substring(0, 100));
  }
});
