import { test, expect } from '@playwright/test';
import { mockSupabase, signUp } from './supabaseMock';

// S9: a soft timer. It counts down from the task's minutes; after that the person can still submit,
// and the report shows the time taken next to the limit. The test moves the browser clock forward;
// real time still passes while it types, so the seconds are checked loosely.
test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await mockSupabase(page);
  await signUp(page, { name: 'Timer Seeker', email: 'timer@example.com' });
  await page.getByRole('button', { name: 'Start a task' }).click();
  await page.getByRole('button', { name: /SQL/ }).click();
  await page.getByRole('button', { name: /Top 3 customers/ }).click();
});

test('the timer counts down and the report shows the time taken', async ({ page }) => {
  await expect(page.getByRole('timer')).toHaveText(/^Time left: (15:00|14:5\d) of 15 min$/);
  await page.clock.fastForward('03:20');
  await expect(page.getByRole('timer')).toHaveText(/^Time left: 11:[34]\d of 15 min$/);

  await page.getByLabel('Your solution').fill(
    'SELECT customer_id, SUM(total) AS spent FROM orders GROUP BY customer_id ORDER BY spent DESC LIMIT 3',
  );
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByText(/^Time: 3 min 2\d s of 15 min$/)).toBeVisible();
  await expect(page.getByText('over the limit')).toBeHidden();
});

test('when time is up the person can still submit, and the report says they went over', async ({ page }) => {
  await page.clock.fastForward('17:05');
  await expect(page.getByRole('timer')).toHaveText(
    /^Time is up: 02:0\d over\. You can still submit; the report shows your time\.$/,
  );

  await page.getByLabel('Your solution').fill('SELECT customer_id FROM orders GROUP BY customer_id');
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByText(/^Time: 17 min \d+ s of 15 min · over the limit$/)).toBeVisible();
});
