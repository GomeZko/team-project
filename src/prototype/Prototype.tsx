import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { toAppUser } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { runChecks, withCustomTasks, type Category, type CheckResult, type Task } from './data'
import AddTask from './AddTask'
import MyTasks from './MyTasks'
import Dashboard from './Dashboard'
import History from './History'
import SignIn from './SignIn'
import { addAttempt, addCustomTask, loadAttempts, loadCustomTasks, type Attempt, type User } from './store'

// Clickable prototype for G4. Screens and words follow docs/UX.md.
// Accounts are real (Supabase). Tasks and reports are sample data in this browser, and there is no real AI yet.
type Screen =
  | { name: 'dashboard' }
  | { name: 'categories' }
  | { name: 'history' }
  | { name: 'add-task' }
  | { name: 'my-tasks'; published?: string }
  | { name: 'tasks'; category: Category }
  | { name: 'task'; task: Task }
  | { name: 'report'; attempt: Attempt; task?: Task }

export default function Prototype() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(Boolean(supabase))
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [customTasks, setCustomTasks] = useState(loadCustomTasks)
  const [screen, setScreen] = useState<Screen>({ name: 'dashboard' })
  const shownUserId = useRef<string | null>(null)
  const categories = withCustomTasks(customTasks)

  // Supabase remembers the session in this browser and tells us when someone signs in or out.
  // It also sends events when a token is refreshed: we only reset the screen when the person changes.
  useEffect(() => {
    if (!supabase) return
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const next = session ? toAppUser(session.user) : null
      if ((next?.id ?? null) !== shownUserId.current) {
        shownUserId.current = next?.id ?? null
        setUser(next)
        setAttempts(next ? loadAttempts(next.id) : [])
        setScreen({ name: 'dashboard' })
      }
      setChecking(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  if (checking) return <main><p className="hint">Loading…</p></main>
  if (!user) return <SignIn />

  async function signOut() {
    await supabase?.auth.signOut()
  }

  function finish(task: Task, results: CheckResult[]) {
    const next = addAttempt(user!.id, attempts, task.id, task.title, results)
    setAttempts(next)
    setScreen({ name: 'report', attempt: next[0], task })
  }

  const go = (name: 'dashboard' | 'categories' | 'history' | 'add-task') => setScreen({ name } as Screen)

  return (
    <>
      <header className="topbar">
        <strong className="brand">JobBridge</strong>
        <nav aria-label="Main">
          <button className="link" aria-current={screen.name === 'dashboard' || screen.name === 'my-tasks' ? 'page' : undefined} onClick={() => go('dashboard')}>Dashboard</button>
          <button className="link" aria-current={screen.name === 'categories' ? 'page' : undefined} onClick={() => go('categories')}>Tasks</button>
          {user.role === 'seeker' ? (
            <button className="link" aria-current={screen.name === 'history' ? 'page' : undefined} onClick={() => go('history')}>History</button>
          ) : (
            <button className="link" aria-current={screen.name === 'add-task' ? 'page' : undefined} onClick={() => go('add-task')}>Add task</button>
          )}
        </nav>
        <span className="who">{user.name}</span>
        <button onClick={signOut}>Sign out</button>
      </header>
      <main>
        <p className="badge">Prototype · sample data</p>
        {screen.name === 'my-tasks' || (screen.name === 'dashboard' && user.role === 'author') ? (
          <MyTasks
            user={user}
            tasks={customTasks}
            published={screen.name === 'my-tasks' ? screen.published : undefined}
            onAdd={() => go('add-task')}
          />
        ) : null}
        {screen.name === 'add-task' && (
          <AddTask
            onAdd={(categoryId, task) => {
              setCustomTasks(addCustomTask(customTasks, { categoryId, author: user.email, task }))
              setScreen({ name: 'my-tasks', published: task.title })
            }}
          />
        )}
        {screen.name === 'dashboard' && user.role === 'seeker' && (
          <Dashboard
            user={user}
            attempts={attempts}
            onBrowse={() => go('categories')}
            onOpen={(attempt) => setScreen({ name: 'report', attempt })}
          />
        )}
        {screen.name === 'history' && (
          <History attempts={attempts} onOpen={(attempt) => setScreen({ name: 'report', attempt })} />
        )}
        {screen.name === 'categories' && (
          <Categories categories={categories} onPick={(category) => setScreen({ name: 'tasks', category })} />
        )}
        {screen.name === 'tasks' && (
          <Tasks
            category={screen.category}
            onBack={() => go('categories')}
            onPick={(task) => setScreen({ name: 'task', task })}
          />
        )}
        {screen.name === 'task' && (
          <TaskScreen task={screen.task} onBack={() => go('categories')} onDone={(results) => finish(screen.task, results)} />
        )}
        {screen.name === 'report' && (
          <Report
            attempt={screen.attempt}
            onRetry={screen.task ? () => setScreen({ name: 'task', task: screen.task! }) : undefined}
            onHome={() => go('dashboard')}
          />
        )}
      </main>
    </>
  )
}

function Categories({ categories, onPick }: { categories: Category[]; onPick: (c: Category) => void }) {
  return (
    <>
      <h1>Choose a skill to prove</h1>
      <p className="lead">Pick a category. Each task takes 15–20 minutes.</p>
      <ul className="cards">
        {categories.map((c) => (
          <li key={c.id}>
            <button className="card" onClick={() => onPick(c)}>
              {c.name}
              <span>{c.tasks.length} {c.tasks.length === 1 ? 'task' : 'tasks'}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

function Tasks({ category, onBack, onPick }: { category: Category; onBack: () => void; onPick: (t: Task) => void }) {
  return (
    <>
      <button className="link" onClick={onBack}>← All categories</button>
      <h1>{category.name}</h1>
      {category.tasks.length === 0 ? (
        <p role="status">No tasks in this category yet. Try another category.</p>
      ) : (
        <ul className="cards">
          {category.tasks.map((t) => (
            <li key={t.id}>
              <button className="card" onClick={() => onPick(t)}>
                {t.title}
                <span>{t.minutes} min</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function TaskScreen({ task, onBack, onDone }: { task: Task; onBack: () => void; onDone: (r: CheckResult[]) => void }) {
  const [solution, setSolution] = useState(task.starter)
  const [error, setError] = useState('')
  const [running, setRunning] = useState(false)
  // Tab adds spaces in the code box (test A). Esc, then Tab, leaves the box, so keyboard users are not trapped.
  const [leaving, setLeaving] = useState(false)
  // If the person leaves this screen while the tests run, cancel them, so the report does not jump in later.
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Escape') return setLeaving(true)
    if (e.key !== 'Tab' || e.shiftKey || leaving) return
    e.preventDefault()
    const box = e.currentTarget
    const { selectionStart: start, selectionEnd: end } = box
    const next = solution.slice(0, start) + '    ' + solution.slice(end)
    setSolution(next)
    requestAnimationFrame(() => box.setSelectionRange(start + 4, start + 4))
  }

  function submit() {
    if (solution.trim() === '' || solution.trim() === task.starter.trim()) {
      setError('Write your solution first. The starter code alone does not count.')
      return
    }
    setError('')
    setRunning(true)
    timer.current = window.setTimeout(() => onDone(runChecks(task, solution)), 800)
  }

  return (
    <>
      <button className="link" onClick={onBack}>← All categories</button>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      {task.examples.length > 0 && (
        <>
          <h2>Examples</h2>
          <ul className="examples">
            {task.examples.map((ex) => (
              <li key={ex}><code>{ex}</code></li>
            ))}
          </ul>
        </>
      )}
      <h2>What we check</h2>
      <ul className="checklist">
        {task.checks.map((c) => (
          <li key={c.name}>{c.name}</li>
        ))}
      </ul>
      <label htmlFor="solution">Your solution</label>
      <p id="solution-hint" className="hint">Replace the comment in the starter code with your code. Tab adds spaces; press Esc, then Tab, to leave the box.</p>
      <textarea
        id="solution"
        rows={8}
        value={solution}
        aria-describedby="solution-hint"
        onChange={(e) => setSolution(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => setLeaving(false)}
      />
      {error && <p className="error" role="alert">{error}</p>}
      <button className="primary" onClick={submit} disabled={running}>
        {running ? 'Running tests…' : 'Submit solution'}
      </button>
    </>
  )
}

function Report({ attempt, onRetry, onHome }: { attempt: Attempt; onRetry?: () => void; onHome: () => void }) {
  const [shared, setShared] = useState(false)
  const passed = attempt.results.filter((r) => r.passed).length

  return (
    <>
      <h1>Your skill report</h1>
      <p className="lead">{attempt.taskTitle} · {new Date(attempt.date).toLocaleDateString('en-GB')}</p>
      <h2>Score: {attempt.score} / 100</h2>
      <h3>Automated tests: {passed} of {attempt.results.length} passed</h3>
      <ul className="results">
        {attempt.results.map((r) => (
          <li key={r.name}>
            {r.passed ? '✅' : '❌'} {r.name}
            {r.tip && <span className="tip"> Tip: {r.tip}</span>}
          </li>
        ))}
      </ul>
      <h3>AI review</h3>
      <p>Sample text in the prototype. The real report explains code quality, structure and what to improve.</p>
      <p className="hint">Prototype: the checks look for key parts of your code, they do not run it yet. The real version runs your code against tests.</p>
      <div className="actions">
        <button className="primary" onClick={() => setShared(true)}>Share report</button>
        {onRetry && <button onClick={onRetry}>Try again</button>}
        <button onClick={onHome}>Back to dashboard</button>
      </div>
      {shared && (
        <div role="status">
          <p>Link ready to send: jobbridge.example/report/{attempt.id} (sample link, not real)</p>
          <p className="share-badge" aria-label={`Badge: JobBridge verified, ${attempt.taskTitle}, ${attempt.score} / 100`}>
            <strong>JobBridge</strong> {attempt.taskTitle} · {attempt.score}/100
          </p>
          <p className="hint">Put this badge on your CV, LinkedIn or GitHub profile.</p>
        </div>
      )}
    </>
  )
}
