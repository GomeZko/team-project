import { describe, expect, it } from 'vitest'
import sql from '../../supabase/migrations/20261027_tasks_attempts.sql?raw'

// Non-functional requirement 3: every table has Row Level Security.
// This test fails if someone adds a table to the migration and forgets to protect it.
const tables = [...sql.matchAll(/create table public\.(\w+)/g)].map((m) => m[1])

describe('database migration', () => {
  it('creates the tasks and attempts tables', () => {
    expect(tables).toEqual(['tasks', 'attempts'])
  })

  it.each(tables)('turns on Row Level Security for %s', (table) => {
    expect(sql).toContain(`alter table public.${table} enable row level security;`)
  })

  it('gives visitors without an account no table rights', () => {
    expect(sql).toContain('revoke all on public.tasks, public.attempts from anon, authenticated;')
    // anon may only call open_shared_report, never read a table directly.
    expect(sql).not.toMatch(/grant [^;]* on public\.(tasks|attempts)[^;]* to [^;]*anon/)
  })

  it('lets a person read only their own attempts', () => {
    expect(sql).toMatch(/for select to authenticated using \(user_id = auth\.uid\(\)\)/)
  })

  it('does not let people set the view count or share flag when saving an attempt', () => {
    expect(sql).toContain('grant insert (task_id, task_title, results, score) on public.attempts to authenticated;')
  })
})
