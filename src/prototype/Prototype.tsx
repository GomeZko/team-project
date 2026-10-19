import { useState } from 'react'
import { categories, runChecks, type Category, type CheckResult, type Task } from './data'

// Clickable prototype for G4. Screens and words follow docs/UX.md.
// Everything runs in the browser with sample data: no account, no database, no real AI.
type Screen =
  | { name: 'categories' }
  | { name: 'tasks'; category: Category }
  | { name: 'task'; task: Task }
  | { name: 'report'; task: Task; results: CheckResult[] }

export default function Prototype() {
  const [screen, setScreen] = useState<Screen>({ name: 'categories' })

  return (
    <main>
      <p className="badge">Prototype · sample data</p>
      {screen.name === 'categories' && (
        <Categories onPick={(category) => setScreen({ name: 'tasks', category })} />
      )}
      {screen.name === 'tasks' && (
        <Tasks
          category={screen.category}
          onBack={() => setScreen({ name: 'categories' })}
          onPick={(task) => setScreen({ name: 'task', task })}
        />
      )}
      {screen.name === 'task' && (
        <TaskScreen
          task={screen.task}
          onBack={() => setScreen({ name: 'categories' })}
          onDone={(results) => setScreen({ name: 'report', task: screen.task, results })}
        />
      )}
      {screen.name === 'report' && (
        <Report
          task={screen.task}
          results={screen.results}
          onRetry={() => setScreen({ name: 'task', task: screen.task })}
          onHome={() => setScreen({ name: 'categories' })}
        />
      )}
    </main>
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

function Report({ task, results, onRetry, onHome }: { task: Task; results: CheckResult[]; onRetry: () => void; onHome: () => void }) {
  const [shared, setShared] = useState(false)
  const passed = results.filter((r) => r.passed).length
  const score = Math.round((passed / results.length) * 100)

  return (
    <>
      <h1>Your skill report</h1>
      <p className="lead">{task.title}</p>
      <h2>Score: {score} / 100</h2>
      <h3>Automated tests: {passed} of {results.length} passed</h3>
      <ul className="results">
        {results.map((r) => (
          <li key={r.name}>{r.passed ? '✅' : '❌'} {r.name}</li>
        ))}
      </ul>
      <h3>AI review</h3>
      <p>Sample text in the prototype. The real report explains code quality, structure and what to improve.</p>
      <div className="actions">
        <button className="primary" onClick={() => setShared(true)}>Share report</button>
        <button onClick={onRetry}>Try again</button>
        <button onClick={onHome}>Choose another task</button>
      </div>
      {shared && (
        <p role="status">Link ready to send: jobbridge.example/report/demo-123 (sample link, not real)</p>
      )}
    </>
  )
}
