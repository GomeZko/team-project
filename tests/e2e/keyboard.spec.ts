import { test, expect, type Locator, type Page } from '@playwright/test';
import { mockSupabase, signUp } from './supabaseMock';

// Non-functional requirement 2: the main tasks work fully by keyboard.
// Only Tab, typing and Enter are used after sign-in: no mouse clicks.
async function tabTo(page: Page, target: Locator) {
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    if (await target.evaluate((el) => el === document.activeElement)) return;
  }
  throw new Error('Could not reach the element with Tab');
}

test('a job-seeker picks a task, submits a solution and reads the report by keyboard', async ({ page }) => {
  await mockSupabase(page);
  await signUp(page, { name: 'Keyboard Seeker', email: 'keyboard@example.com' });

  await tabTo(page, page.getByRole('button', { name: 'Start a task' }));
  await page.keyboard.press('Enter');
  await tabTo(page, page.getByRole('button', { name: /SQL/ }));
  await page.keyboard.press('Enter');
  await tabTo(page, page.getByRole('button', { name: /Top 3 customers/ }));
  await page.keyboard.press('Enter');

  const box = page.getByLabel('Your solution');
  await tabTo(page, box);
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('SELECT customer_id, SUM(total) AS spent FROM orders GROUP BY customer_id ORDER BY spent DESC LIMIT 3');
  // Tab inside the code box types spaces, so the person presses Escape first to leave it with Tab.
  await page.keyboard.press('Escape');
  await tabTo(page, page.getByRole('button', { name: 'Submit solution' }));
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', { name: 'Automated tests: 3 of 3 passed' })).toBeVisible();
});
