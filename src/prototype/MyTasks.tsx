import { categories } from './data'
import type { CustomTask, User } from './store'

type Props = { user: User; tasks: CustomTask[]; published?: string; onAdd: () => void }

// Dashboard for a task author: the tasks they published.
export default function MyTasks({ user, tasks, published, onAdd }: Props) {
  const mine = tasks.filter((t) => t.author === user.email)
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id

  return (
    <>
      <h1>Hi, {user.name}</h1>
      <p className="lead">Write short, realistic tasks that juniors can finish in 15–20 minutes.</p>
      {published && <p role="status" className="success">Task published: {published}</p>}
      <button className="primary" onClick={onAdd}>Add a task</button>
      <h2>My tasks</h2>
      {mine.length === 0 ? (
        <p>You have not published any tasks yet.</p>
      ) : (
        <ul className="cards">
          {mine.map((t) => (
            <li key={t.task.id} className="card">
              {t.task.title}
              <span>{categoryName(t.categoryId)} · {t.task.checks.length} checks · {t.task.minutes} min</span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
