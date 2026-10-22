import { test, expect, type Page } from '@playwright/test';
import { mockSupabase, signUp } from './supabaseMock';

// G4 prototype: the main flow from docs/UX.md works with sample data.
// Sign-in itself is tested in auth.spec.ts. Here every test starts with a fresh account.
test.beforeEach(async ({ page }) => {
  await mockSupabase(page);
});

async function signIn(page: Page, name = 'Test Seeker', author = false) {
  await signUp(page, { name, email: `${author ? 'author' : 'seeker'}@example.com`, author });
}

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

test('history lists every attempt and opens its report', async ({ page }) => {
  await signIn(page);
  await page.getByRole('button', { name: 'History' }).click();
  await expect(page.getByRole('status')).toHaveText('No attempts yet. Your reports appear here after you submit a task.');
  for (const solution of ['SELECT 1 GROUP BY x', 'SELECT 1 GROUP BY x ORDER BY y DESC LIMIT 3']) {
    await page.getByRole('button', { name: 'Tasks' }).click();
    await page.getByRole('button', { name: /SQL/ }).click();
    await page.getByRole('button', { name: /Top 3 customers/ }).click();
    await page.getByLabel('Your solution').fill(solution);
    await page.getByRole('button', { name: 'Submit solution' }).click();
    await expect(page.getByRole('heading', { name: 'Your skill report' })).toBeVisible();
  }
  await page.getByRole('button', { name: 'History' }).click();
  await expect(page.getByRole('row')).toHaveCount(3);
  await page.getByRole('button', { name: 'Open report: Top 3 customers by order total, 33 / 100' }).click();
  await expect(page.getByRole('heading', { name: 'Score: 33 / 100' })).toBeVisible();
});

test('a task author publishes a task and a job-seeker can solve it', async ({ page }) => {
  await signIn(page, 'Test Author', true);
  await page.getByRole('button', { name: 'Add a task' }).click();
  await page.getByLabel('Title').fill('Count active users');
  await page.getByLabel('Description').fill('Write a query that counts users where active is true.');
  await page.getByRole('button', { name: 'Publish task' }).click();
  await expect(page.getByRole('alert')).toHaveText('Add at least one check, like: Uses GROUP BY | group by');
  await page.getByLabel(/^Checks/).fill('Counts rows | count(\nFilters active users | where');
  await page.getByRole('button', { name: 'Publish task' }).click();
  await expect(page.getByRole('status')).toHaveText('Task published: Count active users');
  await expect(page.getByText('SQL · 2 checks · 15 min')).toBeVisible();

  await page.getByRole('button', { name: 'Sign out' }).click();
  await signIn(page);
  await page.getByRole('button', { name: 'Start a task' }).click();
  await page.getByRole('button', { name: /SQL.*2 tasks/ }).click();
  await page.getByRole('button', { name: /Count active users/ }).click();
  await page.getByLabel('Your solution').fill('SELECT COUNT(*) FROM users WHERE active');
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByRole('heading', { name: 'Automated tests: 2 of 2 passed' })).toBeVisible();
});

test('Java tasks pass with or without spaces around operators', async ({ page }) => {
  await signIn(page);
  await page.getByRole('button', { name: 'Tasks' }).click();
  await page.getByRole('button', { name: /Java.*2 tasks/ }).click();
  await page.getByRole('button', { name: /Is the number even/ }).click();
  await page.getByLabel('Your solution').fill('public static boolean isEven(int n) {\n  return n%2==0;\n}');
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByRole('heading', { name: 'Automated tests: 3 of 3 passed' })).toBeVisible();
});

test('Python tasks give a score', async ({ page }) => {
  await signIn(page);
  await page.getByRole('button', { name: 'Tasks' }).click();
  await page.getByRole('button', { name: /Python.*2 tasks/ }).click();
  await page.getByRole('button', { name: /Largest number in a list/ }).click();
  await page.getByLabel('Your solution').fill('def largest(numbers):\n    return max(numbers)');
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByRole('heading', { name: 'Score: 100 / 100' })).toBeVisible();
});

test('the task shows its checks, and Tab adds spaces in the code box', async ({ page }) => {
  await signIn(page);
  await page.getByRole('button', { name: 'Tasks' }).click();
  await page.getByRole('button', { name: /Python/ }).click();
  await page.getByRole('button', { name: /Say hello/ }).click();
  await expect(page.getByRole('heading', { name: 'What we check' })).toBeVisible();
  await expect(page.getByRole('listitem').filter({ hasText: 'Uses the name' })).toBeVisible();
  const box = page.getByLabel('Your solution');
  await box.fill('');
  await box.press('Tab');
  await expect(box).toHaveValue('    ');
  await expect(box).toBeFocused();
  await box.press('Escape');
  await box.press('Tab');
  await expect(box).not.toBeFocused();
});

test('a failed check shows a tip, and sharing shows a badge', async ({ page }) => {
  await signIn(page);
  await page.getByRole('button', { name: 'Tasks' }).click();
  await page.getByRole('button', { name: /Python/ }).click();
  await page.getByRole('button', { name: /Say hello/ }).click();
  await expect(page.getByText('greet("Anna") → "Hello, Anna!"')).toBeVisible();
  await page.getByLabel('Your solution').fill('def greet(name):\n    return "Hello!"');
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByText('Tip: Put the name into the text')).toBeVisible();
  await page.getByRole('button', { name: 'Share report' }).click();
  await expect(page.getByLabel(/Badge: JobBridge verified, Say hello/)).toBeVisible();
});
