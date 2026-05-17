import { test, expect } from '@playwright/test';

test('capture deployed dark mode screenshots', async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1280, height: 1024 });
  
  const DEPLOYED_URL = 'https://bob-bridge.vercel.app/';
  
  await page.goto(DEPLOYED_URL);
  await page.waitForTimeout(3000);
  
  // Toggle Dark Mode
  console.log('Toggling dark mode...');
  await page.click('button[aria-label="Toggle theme"]');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'demo-screenshots/demo-deployed-dark-initial.png' });

  console.log('Clicking popular search...');
  await page.click('text="User Profile API"');
  await page.waitForTimeout(1000);

  console.log('Clicking generate...');
  await page.click('button:has-text("Generate Mock & Contract")');
  
  console.log('Waiting for result...');
  await page.waitForSelector('text=Your mock is ready', { timeout: 90000 });
  
  // Wait for animations
  await page.waitForTimeout(3000);
  
  console.log('Capturing final dark mode result...');
  await page.screenshot({ path: 'demo-screenshots/demo-deployed-dark-result.png', fullPage: true });
});
