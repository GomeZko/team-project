import { test, expect } from '@playwright/test';
import { mockSupabase, signIn, signUp } from './supabaseMock';

// S1 / FR1: a visitor can register and sign in. Supabase is replaced by a fake, see supabaseMock.ts.
test('a new visitor sees the sign-in screen and can switch to creating an account', async ({ page }) => {
  await mockSupabase(page);
  await page.goto('/?prototype');
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Create an account' }).click();
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create account', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'I already have an account' }).click();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
});

test('a job-seeker creates an account and lands on the dashboard', async ({ page }) => {
  const auth = await mockSupabase(page);
  await signUp(page, { name: 'Test Seeker', email: 'seeker@example.com' });
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' })).toBeVisible();
  expect(auth.accounts.get('seeker@example.com')).toMatchObject({ name: 'Test Seeker', role: 'seeker' });
});

test('a task author creates an account and sees My tasks', async ({ page }) => {
  const auth = await mockSupabase(page);
  await signUp(page, { name: 'Test Author', email: 'author@example.com', author: true });
  await expect(page.getByRole('button', { name: 'Add a task' })).toBeVisible();
  expect(auth.accounts.get('author@example.com')).toMatchObject({ role: 'author' });
});

test('creating an account checks the form before sending it', async ({ page }) => {
  const auth = await mockSupabase(page);
  await page.goto('/?prototype');
  await page.getByRole('button', { name: 'Create an account' }).click();
  await page.getByLabel('Name').fill('Test Seeker');
  await page.getByLabel('Email').fill('seeker@example.com');
  await page.getByLabel('Password').fill('12345');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText(
    'Enter your name, a valid email and a password of at least 6 characters.',
  );
  expect(auth.accounts.size).toBe(0);
});

test('an email can only be registered once', async ({ page }) => {
  const auth = await mockSupabase(page);
  auth.addAccount({ name: 'Test Seeker', email: 'seeker@example.com', password: 'secret123', role: 'seeker' });
  await page.goto('/?prototype');
  await page.getByRole('button', { name: 'Create an account' }).click();
  await page.getByLabel('Name').fill('Someone Else');
  await page.getByLabel('Email').fill('seeker@example.com');
  await page.getByLabel('Password').fill('another123');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('An account with this email already exists. Sign in instead.');
});

test('sign-in with a wrong password shows an error and keeps the email', async ({ page }) => {
  const auth = await mockSupabase(page);
  auth.addAccount({ name: 'Test Seeker', email: 'seeker@example.com', password: 'secret123', role: 'seeker' });
  await page.goto('/?prototype');
  await signIn(page, 'seeker@example.com', 'wrong-password');
  await expect(page.getByRole('alert')).toHaveText('Wrong email or password.');
  await expect(page.getByLabel('Email')).toHaveValue('seeker@example.com');
});

test('sign-in with an empty form shows an error', async ({ page }) => {
  await mockSupabase(page);
  await page.goto('/?prototype');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Enter a valid email and your password.');
});

test('an existing user signs in with the name and role they chose', async ({ page }) => {
  const auth = await mockSupabase(page);
  auth.addAccount({ name: 'Test Author', email: 'author@example.com', password: 'secret123', role: 'author' });
  await page.goto('/?prototype');
  await signIn(page, 'author@example.com', 'secret123');
  await expect(page.getByRole('heading', { name: 'Hi, Test Author' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add a task' })).toBeVisible();
});

test('the button says "Signing in…" and cannot be pressed twice while waiting', async ({ page }) => {
  const auth = await mockSupabase(page);
  auth.addAccount({ name: 'Test Seeker', email: 'seeker@example.com', password: 'secret123', role: 'seeker' });
  // Hold the answer from the fake server until the test has looked at the button.
  let release = () => {};
  const held = new Promise<void>((resolve) => (release = resolve));
  await page.route('**/auth/v1/token**', async (route) => {
    await held;
    await route.fallback();
  });
  await page.goto('/?prototype');
  await signIn(page, 'seeker@example.com', 'secret123');
  await expect(page.getByRole('button', { name: 'Signing in…' })).toBeDisabled();
  release();
  await expect(page.getByRole('heading', { name: 'Hi, Test Seeker' })).toBeVisible();
});

test('a signed-in user stays signed in after a reload', async ({ page }) => {
  await mockSupabase(page);
  await signUp(page, { name: 'Test Seeker', email: 'seeker@example.com' });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Hi, Test Seeker' })).toBeVisible();
});

test('sign out returns to the sign-in screen and stays signed out after a reload', async ({ page }) => {
  await mockSupabase(page);
  await signUp(page, { name: 'Test Seeker', email: 'seeker@example.com' });
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hi, Test Seeker' })).toBeHidden();
});

test('each account sees only its own attempts', async ({ page }) => {
  await mockSupabase(page);
  await signUp(page, { name: 'First Seeker', email: 'first@example.com' });
  await page.getByRole('button', { name: 'Start a task' }).click();
  await page.getByRole('button', { name: /SQL/ }).click();
  await page.getByRole('button', { name: /Top 3 customers/ }).click();
  await page.getByLabel('Your solution').fill('SELECT 1 GROUP BY x ORDER BY y DESC LIMIT 3');
  await page.getByRole('button', { name: 'Submit solution' }).click();
  await expect(page.getByRole('heading', { name: 'Your skill report' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign out' }).click();

  await signUp(page, { name: 'Second Seeker', email: 'second@example.com' });
  await expect(page.getByRole('status')).toHaveText('No reports yet. Start a task to get your first one.');
  await page.getByRole('button', { name: 'Sign out' }).click();

  await signIn(page, 'first@example.com', 'secret123');
  await expect(page.getByRole('button', { name: /Top 3 customers/ })).toBeVisible();
});
