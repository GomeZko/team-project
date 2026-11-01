// Storage. Accounts and attempts are in Supabase (see docs/DECISIONS.md 2026-10-27).
// Tasks added by authors still stay in this browser (localStorage) until a story saves them in the database.
// The attempts functions run only after sign-in; without Supabase they fail and the screen shows an error.
import type { AppUser } from '../lib/auth'
import { supabase } from '../lib/supabase'
import type { CheckResult, Task } from './data'

export type { Role } from '../lib/auth'
export type User = AppUser
export type Attempt = { id: string; taskId: string; taskTitle: string; results: CheckResult[]; score: number; date: string }

type AttemptRow = { id: string; task_id: string; task_title: string; results: CheckResult[]; score: number; created_at: string }
const ATTEMPT_COLUMNS = 'id, task_id, task_title, results, score, created_at'
const toAttempt = (row: AttemptRow): Attempt => ({
  id: row.id,
  taskId: row.task_id,
  taskTitle: row.task_title,
  results: row.results,
  score: row.score,
  date: row.created_at,
})

const TASKS_KEY = 'jobbridge-demo-tasks'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

// If storage is blocked (private mode), the prototype still works and forgets on reload.
function write(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

// Row Level Security returns only the signed-in person's rows, so there is no filter by user here.
export async function loadAttempts(): Promise<Attempt[]> {
  const { data, error } = await supabase!.from('attempts').select(ATTEMPT_COLUMNS).order('created_at', { ascending: false })
  if (error) throw error
  return (data as AttemptRow[]).map(toAttempt)
}

export async function addAttempt(taskId: string, taskTitle: string, results: CheckResult[]): Promise<Attempt> {
  const passed = results.filter((r) => r.passed).length
  const score = Math.round((passed / results.length) * 100)
  const { data, error } = await supabase!
    .from('attempts')
    .insert({ task_id: taskId, task_title: taskTitle, results, score })
    .select(ATTEMPT_COLUMNS)
    .single()
  if (error) throw error
  return toAttempt(data as AttemptRow)
}

// Tasks added by a task author. They show up for job-seekers in the same browser.
export type CustomTask = { categoryId: string; author: string; task: Task }
export const loadCustomTasks = () => read<CustomTask[]>(TASKS_KEY, [])
export function addCustomTask(list: CustomTask[], item: CustomTask): CustomTask[] {
  const next = [...list, item]
  write(TASKS_KEY, next)
  return next
}
