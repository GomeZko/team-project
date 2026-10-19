import { expect, type Page, type Route } from '@playwright/test';

// A fake Supabase sign-in server for browser tests.
// The tests never talk to the real Supabase: CI needs no keys and no real accounts are created.
// Accounts live in memory for one test only. They survive a page reload, like real ones.
type Account = { id: string; email: string; password: string; name: string; role: string };

export type Auth = {
  accounts: Map<string, Account>;
  addAccount: (account: Omit<Account, 'id'>) => void;
};

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Supabase reads the user id and expiry from the access token, so it is shaped like a real one.
function token(account: Account) {
  const part = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + 3600;
  return `${part({ alg: 'HS256', typ: 'JWT' })}.${part({ sub: account.id, email: account.email, exp, role: 'authenticated' })}.test`;
}

function user(account: Account) {
  return {
    id: account.id,
    aud: 'authenticated',
    role: 'authenticated',
    email: account.email,
    user_metadata: { name: account.name, role: account.role },
    app_metadata: { provider: 'email', providers: ['email'] },
    created_at: new Date().toISOString(),
  };
}

function session(account: Account) {
  return {
    access_token: token(account),
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: `refresh-${account.id}`,
    user: user(account),
  };
}

const reply = (route: Route, status: number, body?: object) =>
  route.fulfill({ status, headers: { ...cors, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : '' });

const fail = (route: Route, status: number, code: string, msg: string) =>
  reply(route, status, { code: status, error_code: code, msg });

export async function mockSupabase(page: Page): Promise<Auth> {
  const accounts = new Map<string, Account>();
  let next = 1;
  const addAccount = (account: Omit<Account, 'id'>) =>
    void accounts.set(account.email, { ...account, id: `test-user-${next++}` });
  const byId = (id: string) => [...accounts.values()].find((a) => a.id === id);

  await page.route('**/auth/v1/**', async (route) => {
    const request = route.request();
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    const url = new URL(request.url());
    const body = request.postDataJSON() ?? {};

    if (url.pathname.endsWith('/signup')) {
      if (accounts.has(body.email)) return fail(route, 422, 'user_already_exists', 'User already registered');
      addAccount({ email: body.email, password: body.password, name: body.data?.name ?? '', role: body.data?.role ?? '' });
      return reply(route, 200, session(accounts.get(body.email)!));
    }

    if (url.pathname.endsWith('/token') && url.searchParams.get('grant_type') === 'password') {
      const account = accounts.get(body.email);
      if (!account || account.password !== body.password)
        return fail(route, 400, 'invalid_credentials', 'Invalid login credentials');
      return reply(route, 200, session(account));
    }

    if (url.pathname.endsWith('/token') && url.searchParams.get('grant_type') === 'refresh_token') {
      const account = byId(String(body.refresh_token).replace('refresh-', ''));
      return account ? reply(route, 200, session(account)) : fail(route, 400, 'refresh_token_not_found', 'Invalid Refresh Token');
    }

    if (url.pathname.endsWith('/user')) {
      const [, payload] = (request.headers().authorization ?? '').replace('Bearer ', '').split('.');
      const account = payload && byId(JSON.parse(Buffer.from(payload, 'base64url').toString()).sub);
      return account ? reply(route, 200, user(account)) : fail(route, 401, 'bad_jwt', 'invalid JWT');
    }

    if (url.pathname.endsWith('/logout')) return route.fulfill({ status: 204, headers: cors });

    return fail(route, 404, 'not_found', `Not mocked: ${url.pathname}`);
  });

  return { accounts, addAccount };
}

type NewAccount = { name: string; email: string; password?: string; author?: boolean };

// Creates an account through the real form and lands on the dashboard.
export async function signUp(page: Page, { name, email, password = 'secret123', author = false }: NewAccount) {
  await page.goto('/?prototype');
  await page.getByRole('button', { name: 'Create an account' }).click();
  await page.getByLabel('Name').fill(name);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  if (author) await page.getByLabel('a task author').check();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('heading', { name: `Hi, ${name}` })).toBeVisible();
}

export async function signIn(page: Page, email: string, password: string) {
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
}
