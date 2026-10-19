import type { Attempt, User } from './store'

type Props = { user: User; attempts: Attempt[]; onBrowse: () => void; onOpen: (a: Attempt) => void }

export default function Dashboard({ user, attempts, onBrowse, onOpen }: Props) {
  const best = attempts.length ? Math.max(...attempts.map((a) => a.score)) : null
  const tasksTried = new Set(attempts.map((a) => a.taskId)).size

  return (
    <>
      <h1>Hi, {user.name}</h1>
      <p className="lead">Pick a task, submit a solution and share your report with employers.</p>
      <ul className="stats">
        <li><strong>{attempts.length}</strong> attempts</li>
        <li><strong>{best ?? '–'}</strong> best score</li>
        <li><strong>{tasksTried}</strong> tasks tried</li>
      </ul>
      <button className="primary" onClick={onBrowse}>Start a task</button>
      <h2>Recent reports</h2>
      {attempts.length === 0 ? (
        <p role="status">No reports yet. Start a task to get your first one.</p>
      ) : (
        <ul className="cards">
          {attempts.slice(0, 3).map((a) => (
            <li key={a.id}>
              <button className="card" onClick={() => onOpen(a)}>
                {a.taskTitle}
                <span>{a.score} / 100</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
