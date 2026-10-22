// Prototype storage. Accounts are in Supabase (see SignIn.tsx), but attempts and tasks
// still stay in this browser (localStorage) until a story saves them in the database.
import type { AppUser } from '../lib/auth'
import type { CheckResult, Task } from './data'

export type { Role } from '../lib/auth'
export type User = AppUser
export type Attempt = { id: string; taskId: string; taskTitle: string; results: CheckResult[]; score: number; date: string }

// One list of attempts per account, so two people on the same laptop do not see each other's reports.
const attemptsKey = (userId: string) => `jobbridge-attempts-${userId}`
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

export const loadAttempts = (userId: string) => read<Attempt[]>(attemptsKey(userId), [])
export function addAttempt(
  userId: string,
  attempts: Attempt[],
  taskId: string,
  taskTitle: string,
  results: CheckResult[],
): Attempt[] {
  const passed = results.filter((r) => r.passed).length
  const score = Math.round((passed / results.length) * 100)
  const attempt: Attempt = { id: `${Date.now()}`, taskId, taskTitle, results, score, date: new Date().toISOString() }
  const next = [attempt, ...attempts]
  write(attemptsKey(userId), next)
  return next
}

// Tasks added by a task author. They show up for job-seekers in the same browser.
export type CustomTask = { categoryId: string; author: string; task: Task }
export const loadCustomTasks = () => read<CustomTask[]>(TASKS_KEY, [])
export function addCustomTask(list: CustomTask[], item: CustomTask): CustomTask[] {
  const next = [...list, item]
  write(TASKS_KEY, next)
  return next
}
