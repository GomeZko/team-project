import { test, expect } from '@playwright/test';
import { mockSupabase, signUp } from './supabaseMock';

// S10: the code box works like an IDE: line numbers, and suggestions for the task's tables and columns.
test('the SQL editor suggests the task table and its columns', async ({ page }) => {
  await mockSupabase(page);
  await signUp(page, { name: 'Editor Seeker', email: 'editor@example.com' });
  await page.getByRole('button', { name: 'Start a task' }).click();
  await page.getByRole('button', { name: /SQL/ }).click();
  await page.getByRole('button', { name: /Top 3 customers/ }).click();

  await page.getByRole('button', { name: 'Start the task' }).click();
  const box = page.getByLabel('Your solution');
  await expect(page.locator('.cm-lineNumbers')).toBeVisible();
  await box.fill('');
  await box.pressSequentially('SELECT * FROM ord');
  await expect(page.getByRole('option', { name: /orders/ })).toBeVisible();
  // CodeMirror ignores Enter for a moment after the list opens, so a fast keypress is not taken by mistake.
  await page.waitForTimeout(200);
  await page.keyboard.press('Enter');
  await box.pressSequentially(' GROUP BY cust');
  await expect(page.getByRole('option', { name: /customer_id/ })).toBeVisible();
  await page.waitForTimeout(200);
  await page.keyboard.press('Enter');
  expect(await box.textContent()).toBe('SELECT * FROM orders GROUP BY customer_id');
});
