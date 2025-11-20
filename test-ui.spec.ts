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
