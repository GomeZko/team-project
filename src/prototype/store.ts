// Prototype storage. Everything stays in this browser (localStorage): no server, no database.
// There are no passwords: the demo sign-in only remembers a display name, an email and a role.
import type { CheckResult } from './data'

export type Role = 'seeker' | 'author'
export type User = { name: string; email: string; role: Role }
export type Attempt = { id: string; taskId: string; taskTitle: string; results: CheckResult[]; score: number; date: string }

const USER_KEY = 'jobbridge-demo-user'
const ATTEMPTS_KEY = 'jobbridge-demo-attempts'

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

export const loadUser = () => read<User | null>(USER_KEY, null)
export const saveUser = (user: User | null) => write(USER_KEY, user)

export const loadAttempts = () => read<Attempt[]>(ATTEMPTS_KEY, [])
export function addAttempt(attempts: Attempt[], taskId: string, taskTitle: string, results: CheckResult[]): Attempt[] {
  const passed = results.filter((r) => r.passed).length
  const score = Math.round((passed / results.length) * 100)
  const attempt: Attempt = { id: `${Date.now()}`, taskId, taskTitle, results, score, date: new Date().toISOString() }
  const next = [attempt, ...attempts]
  write(ATTEMPTS_KEY, next)
  return next
}
