import { useState } from 'react'
import { categories, runChecks, type Category, type CheckResult, type Task } from './data'
import Dashboard from './Dashboard'
import History from './History'
import SignIn from './SignIn'
import { addAttempt, loadAttempts, loadUser, saveUser, type Attempt, type User } from './store'

// Clickable prototype for G4. Screens and words follow docs/UX.md.
// Everything runs in the browser with sample data: no real accounts, no database, no real AI.
type Screen =
  | { name: 'dashboard' }
  | { name: 'categories' }
  | { name: 'history' }
  | { name: 'tasks'; category: Category }
  | { name: 'task'; task: Task }
  | { name: 'report'; attempt: Attempt; task?: Task }

export default function Prototype() {
  const [user, setUser] = useState<User | null>(loadUser)
  const [attempts, setAttempts] = useState<Attempt[]>(loadAttempts)
  const [screen, setScreen] = useState<Screen>({ name: 'dashboard' })

  if (!user) {
    return (
      <SignIn
        onSignIn={(u) => {
          saveUser(u)
          setUser(u)
          setScreen({ name: 'dashboard' })
        }}
      />
    )
  }

  function signOut() {
    saveUser(null)
    setUser(null)
  }

  function finish(task: Task, results: CheckResult[]) {
    const next = addAttempt(attempts, task.id, task.title, results)
    setAttempts(next)
    setScreen({ name: 'report', attempt: next[0], task })
  }

  const go = (name: 'dashboard' | 'categories' | 'history') => setScreen({ name } as Screen)

  return (
    <>
      <header className="topbar">
        <strong className="brand">JobBridge</strong>
        <nav aria-label="Main">
          <button className="link" aria-current={screen.name === 'dashboard' ? 'page' : undefined} onClick={() => go('dashboard')}>Dashboard</button>
          <button className="link" aria-current={screen.name === 'categories' ? 'page' : undefined} onClick={() => go('categories')}>Tasks</button>
          <button className="link" aria-current={screen.name === 'history' ? 'page' : undefined} onClick={() => go('history')}>History</button>
        </nav>
        <span className="who">{user.name}</span>
        <button onClick={signOut}>Sign out</button>
      </header>
      <main>
        <p className="badge">Prototype · sample data</p>
        {screen.name === 'dashboard' && (
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
          <Categories onPick={(category) => setScreen({ name: 'tasks', category })} />
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

function Categories({ onPick }: { onPick: (c: Category) => void }) {
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

  function submit() {
    if (solution.trim() === '' || solution.trim() === task.starter.trim()) {
      setError('Write your solution first. The starter code alone does not count.')
      return
    }
    setError('')
    setRunning(true)
    setTimeout(() => onDone(runChecks(task, solution)), 800)
  }

  return (
    <>
      <button className="link" onClick={onBack}>← All categories</button>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <label htmlFor="solution">Your solution</label>
      <textarea id="solution" rows={8} value={solution} onChange={(e) => setSolution(e.target.value)} />
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
          <li key={r.name}>{r.passed ? '✅' : '❌'} {r.name}</li>
        ))}
      </ul>
      <h3>AI review</h3>
      <p>Sample text in the prototype. The real report explains code quality, structure and what to improve.</p>
      <div className="actions">
        <button className="primary" onClick={() => setShared(true)}>Share report</button>
        {onRetry && <button onClick={onRetry}>Try again</button>}
        <button onClick={onHome}>Back to dashboard</button>
      </div>
      {shared && (
        <p role="status">Link ready to send: jobbridge.example/report/{attempt.id} (sample link, not real)</p>
      )}
    </>
  )
}
