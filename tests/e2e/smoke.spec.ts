import { test, expect } from '@playwright/test';

// Gate G3: the dev URL serves the product.
// S1: a new visitor who opens the app sees the sign-in screen.
test('a new visitor at the start page sees the product name and the sign-in screen', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'JobBridge' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});
