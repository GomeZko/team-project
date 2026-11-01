import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mockSupabase, signUp } from '../e2e/supabaseMock';

// Session 9: the accessibility check. Run it with: npm run a11y
// It opens every screen a person visits and lists serious and critical problems.
// Results are written down in docs/VALIDATION.md.
async function expectNoSeriousProblems(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  for (const v of serious) console.log(`${v.impact}: ${v.id}, ${v.help} (${v.nodes.length} places)`);
  expect(serious).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await mockSupabase(page);
});

test('no serious accessibility problems on the sign-in page', async ({ page }) => {
  await page.goto('/');
  await expectNoSeriousProblems(page);
});

test('no serious accessibility problems on the job-seeker screens', async ({ page }) => {
  await signUp(page, { name: 'Test Seeker', email: 'seeker@example.com' });
  await expectNoSeriousProblems(page); // dashboard

  await page.getByRole('button', { name: 'Tasks' }).click();
  await expectNoSeriousProblems(page); // categories
  await page.getByRole('button', { name: /SQL/ }).click();
  await expectNoSeriousProblems(page); // task list
  await page.getByRole('button', { name: /Top 3 customers/ }).click();
  await expectNoSeriousProblems(page); // task before Start

  await page.getByRole('button', { name: 'Start the task' }).click();
  await expect(page.getByLabel('Your solution')).toBeVisible();
  await expectNoSeriousProblems(page); // task after Start: timer and code editor
  await page.getByLabel('Your solution').fill('SELECT customer_id FROM orders GROUP BY customer_id');
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByRole('heading', { name: /Automated tests/ })).toBeVisible();
  await expectNoSeriousProblems(page); // report

  await page.getByRole('button', { name: 'History' }).click();
  await expectNoSeriousProblems(page); // history
});

test('no serious accessibility problems on the task author screens', async ({ page }) => {
  await signUp(page, { name: 'Test Author', email: 'author@example.com', author: true });
  await expectNoSeriousProblems(page); // author dashboard
  await page.getByRole('button', { name: 'Add a task' }).click();
  await expectNoSeriousProblems(page); // add a task form
});
