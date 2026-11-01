import { expect, type Page, type Request, type Route } from '@playwright/test';

// A fake Supabase server for browser tests: sign-in and the attempts table.
// The tests never talk to the real Supabase: CI needs no keys and no real accounts are created.
// Accounts and attempts live in memory for one test only. They survive a page reload, like real ones.
// It copies the rules of the migration, but does not test them: supabase/tests/rls_check.sql does that.
type Account = { id: string; email: string; password: string; name: string; role: string };
type AttemptRow = {
  id: string;
  user_id: string;
  task_id: string;
  task_title: string;
  results: unknown[];
  score: number;
  is_public: boolean;
  views: number;
  created_at: string;
};

export type Auth = {
  accounts: Map<string, Account>;
  addAccount: (account: Omit<Account, 'id'>) => void;
  attempts: AttemptRow[];
};

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
};

// The id of the signed-in person, read from the access token. A visitor without an account has none.
function tokenUserId(request: Request): string | undefined {
  const [, payload] = (request.headers().authorization ?? '').replace('Bearer ', '').split('.');
  return payload ? JSON.parse(Buffer.from(payload, 'base64url').toString()).sub : undefined;
}

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
      const account = byId(tokenUserId(request) ?? '');
      return account ? reply(route, 200, user(account)) : fail(route, 401, 'bad_jwt', 'invalid JWT');
    }

    if (url.pathname.endsWith('/logout')) return route.fulfill({ status: 204, headers: cors });

    return fail(route, 404, 'not_found', `Not mocked: ${url.pathname}`);
  });

  // Newest first. Like Row Level Security: a person reaches only their own rows, a visitor none.
  const attempts: AttemptRow[] = [];
  await page.route('**/rest/v1/attempts**', async (route) => {
    const request = route.request();
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    const userId = tokenUserId(request);
    if (!userId) return fail(route, 401, '42501', 'permission denied for table attempts');

    if (request.method() === 'GET') return reply(route, 200, attempts.filter((a) => a.user_id === userId));

    if (request.method() === 'POST') {
      const row: AttemptRow = {
        ...request.postDataJSON(),
        id: `00000000-0000-4000-8000-${String(attempts.length + 1).padStart(12, '0')}`,
        user_id: userId,
        is_public: false,
        views: 0,
        created_at: new Date().toISOString(),
      };
      attempts.unshift(row);
      return reply(route, 201, row);
    }

    if (request.method() === 'PATCH') {
      const id = new URL(request.url()).searchParams.get('id')?.replace('eq.', '');
      const row = attempts.find((a) => a.id === id && a.user_id === userId);
      if (row) row.is_public = request.postDataJSON().is_public;
      return route.fulfill({ status: 204, headers: cors });
    }

    return fail(route, 404, 'not_found', `Not mocked: ${request.method()}`);
  });

  await page.route('**/rest/v1/rpc/open_shared_report', async (route) => {
    const request = route.request();
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    const row = attempts.find((a) => a.id === request.postDataJSON().report_id && a.is_public);
    if (!row) return reply(route, 200, []);
    row.views += 1;
    return reply(route, 200, [{ task_title: row.task_title, results: row.results, score: row.score, created_at: row.created_at }]);
  });

  return { accounts, addAccount, attempts };
}

type NewAccount = { name: string; email: string; password?: string; author?: boolean };

// Creates an account through the real form and lands on the dashboard.
export async function signUp(page: Page, { name, email, password = 'secret123', author = false }: NewAccount) {
  await page.goto('/');
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
