import { test, expect } from '@playwright/test';

// G4 prototype: the main flow from docs/UX.md works with sample data.
test('a job-seeker picks SQL, submits a solution and sees a report', async ({ page }) => {
  await page.goto('/?prototype');
  await page.getByRole('button', { name: /SQL/ }).click();
  await page.getByRole('button', { name: /Top 3 customers/ }).click();
  await page.getByLabel('Your solution').fill(
    'SELECT customer_id, SUM(total) AS spent FROM orders GROUP BY customer_id ORDER BY spent DESC LIMIT 3',
  );
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByRole('heading', { name: 'Your skill report' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Automated tests: 3 of 3 passed' })).toBeVisible();
});

test('submitting only the starter code shows an error', async ({ page }) => {
  await page.goto('/?prototype');
  await page.getByRole('button', { name: /SQL/ }).click();
  await page.getByRole('button', { name: /Top 3 customers/ }).click();
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByRole('alert')).toHaveText('Write your solution first. The starter code alone does not count.');
});

test('a category without tasks says so', async ({ page }) => {
  await page.goto('/?prototype');
  await page.getByRole('button', { name: /Junior Backend/ }).click();
  await expect(page.getByRole('status')).toHaveText('No tasks in this category yet. Try another category.');
});
