import { test, expect, type Page, type Route } from '@playwright/test';
import { mockSupabase, signUp } from './supabaseMock';

// FR8, FR9: attempts are saved in the database, and a shared report opens by link without an account.
// The database answers this kind of request with an error, until the returned function is called.
async function failRequest(page: Page, method: string) {
  const handler = (route: Route) =>
    route.request().method() === method ? route.fulfill({ status: 500, body: '{}' }) : route.fallback();
  await page.route('**/rest/v1/attempts**', handler);
  return () => page.unroute('**/rest/v1/attempts**', handler);
}

async function openTask(page: Page) {
  await page.getByRole('button', { name: 'Start a task' }).click();
  await page.getByRole('button', { name: /SQL/ }).click();
  await page.getByRole('button', { name: /Top 3 customers/ }).click();
  await page.getByLabel('Your solution').fill('SELECT 1 GROUP BY customer_id');
}

async function submitAttempt(page: Page) {
  await openTask(page);
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByRole('heading', { name: 'Your skill report' })).toBeVisible();
}

test('an attempt is saved in the database and is still in History after a reload', async ({ page }) => {
  const db = await mockSupabase(page);
  await signUp(page, { name: 'Test Seeker', email: 'seeker@example.com' });
  await submitAttempt(page);
  expect(db.attempts).toHaveLength(1);
  expect(db.attempts[0]).toMatchObject({ task_title: 'Top 3 customers by order total', score: 33, is_public: false });
  expect(await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('jobbridge-attempts')))).toEqual([]);

  await page.reload();
  await page.getByRole('button', { name: 'History', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open report: Top 3 customers by order total, 33 / 100' })).toBeVisible();
});

test('if saving fails, the person keeps their solution and can submit again', async ({ page }) => {
  const db = await mockSupabase(page);
  await signUp(page, { name: 'Test Seeker', email: 'seeker@example.com' });
  const recover = await failRequest(page, 'POST');
  await openTask(page);
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByRole('alert')).toHaveText('We could not save your attempt. Check your connection and submit again.');
  await expect(page.getByLabel('Your solution')).toHaveValue('SELECT 1 GROUP BY customer_id');
  expect(db.attempts).toHaveLength(0);

  await recover();
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByRole('heading', { name: 'Your skill report' })).toBeVisible();
  expect(db.attempts).toHaveLength(1);
});

test('if attempts cannot load, the dashboard says so instead of "No reports yet"', async ({ page }) => {
  await mockSupabase(page);
  await failRequest(page, 'GET');
  await page.goto('/');
  await page.getByRole('button', { name: 'Create an account' }).click();
  await page.getByLabel('Name').fill('Test Seeker');
  await page.getByLabel('Email').fill('seeker@example.com');
  await page.getByLabel('Password').fill('secret123');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('We could not load your attempts. Reload the page to try again.');
  await expect(page.getByText('No reports yet')).toBeHidden();
});

test('a visitor without an account opens a shared report, but not one that is not shared', async ({ page }) => {
  const db = await mockSupabase(page);
  await signUp(page, { name: 'Test Seeker', email: 'seeker@example.com' });
  await submitAttempt(page);
  const link = `/?report=${db.attempts[0].id}`;

  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.goto(link);
  await expect(page.getByRole('alert')).toContainText('We could not open this report');
  expect(db.attempts[0].views).toBe(0);

  await page.goto('/');
  await page.getByLabel('Email').fill('seeker@example.com');
  await page.getByLabel('Password').fill('secret123');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('button', { name: /Top 3 customers/ }).click();
  await page.getByRole('button', { name: 'Share report' }).click();
  await expect(page.getByRole('link', { name: new RegExp(`report=${db.attempts[0].id}`) })).toBeVisible();
  expect(db.attempts[0].is_public).toBe(true);
  await page.getByRole('button', { name: 'Sign out' }).click();

  await page.goto(link);
  await expect(page.getByRole('heading', { name: 'Score: 33 / 100' })).toBeVisible();
  await expect(page.getByText('Top 3 customers by order total')).toBeVisible();
  await expect(page.getByText('Test Seeker')).toBeHidden();
  await expect(page.getByLabel('Password')).toBeHidden();
  expect(db.attempts[0].views).toBeGreaterThan(0);
});

test('if sharing fails, the report says so and shows no link', async ({ page }) => {
  await mockSupabase(page);
  await signUp(page, { name: 'Test Seeker', email: 'seeker@example.com' });
  await submitAttempt(page);
  await failRequest(page, 'PATCH');
  await page.getByRole('button', { name: 'Share report' }).click();
  await expect(page.getByRole('alert')).toHaveText('We could not share this report. Check your connection and try again.');
  await expect(page.getByRole('link', { name: /report=/ })).toBeHidden();
});

test('the report link does not make a phone screen scroll sideways', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await mockSupabase(page);
  await signUp(page, { name: 'Test Seeker', email: 'seeker@example.com' });
  await submitAttempt(page);
  await page.getByRole('button', { name: 'Share report' }).click();
  await expect(page.getByRole('link', { name: /report=/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
