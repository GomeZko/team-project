import { test, expect, type Page } from '@playwright/test';

// G4 prototype: the main flow from docs/UX.md works with sample data.
async function signIn(page: Page) {
  await page.goto('/?prototype');
  await page.getByLabel('Name').fill('Test Seeker');
  await page.getByLabel('Email').fill('seeker@example.com');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Hi, Test Seeker' })).toBeVisible();
}

test('sign-in needs a name and a valid email', async ({ page }) => {
  await page.goto('/?prototype');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toHaveText('Enter your name and a valid email.');
});

test('a job-seeker submits a SQL solution and the report shows on the dashboard', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('status')).toHaveText('No reports yet. Start a task to get your first one.');
  await page.getByRole('button', { name: 'Start a task' }).click();
  await page.getByRole('button', { name: /SQL/ }).click();
  await page.getByRole('button', { name: /Top 3 customers/ }).click();
  await page.getByLabel('Your solution').fill(
    'SELECT customer_id, SUM(total) AS spent FROM orders GROUP BY customer_id ORDER BY spent DESC LIMIT 3',
  );
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByRole('heading', { name: 'Automated tests: 3 of 3 passed' })).toBeVisible();
  await page.getByRole('button', { name: 'Back to dashboard' }).click();
  await expect(page.getByRole('button', { name: /Top 3 customers.*100 \/ 100/ })).toBeVisible();
});

test('error and empty states: starter code only, category without tasks', async ({ page }) => {
  await signIn(page);
  await page.getByRole('button', { name: 'Tasks' }).click();
  await page.getByRole('button', { name: /SQL/ }).click();
  await page.getByRole('button', { name: /Top 3 customers/ }).click();
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByRole('alert')).toHaveText('Write your solution first. The starter code alone does not count.');
  await page.getByRole('button', { name: 'Tasks' }).click();
  await page.getByRole('button', { name: /Junior Backend/ }).click();
  await expect(page.getByRole('status')).toHaveText('No tasks in this category yet. Try another category.');
});
