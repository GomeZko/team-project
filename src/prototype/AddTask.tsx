import { useState, type FormEvent } from 'react'
import { categories, type Task } from './data'

// Task author form. One check per line: "Test name | text the solution must contain".
export default function AddTask({ onAdd }: { onAdd: (categoryId: string, task: Task) => void }) {
  const [categoryId, setCategoryId] = useState(categories[0].id)
  const [title, setTitle] = useState('')
  const [minutes, setMinutes] = useState('15')
  const [description, setDescription] = useState('')
  const [starter, setStarter] = useState('')
  const [checks, setChecks] = useState('')
  const [error, setError] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    const parsed = checks
      .split('\n')
      .map((line) => line.split('|').map((part) => part.trim()))
      .filter(([name, text]) => name && text)
      .map(([name, text]) => ({ name, mustContain: text.toLowerCase() }))
    const mins = Number(minutes)
    if (!title.trim() || !description.trim()) return setError('Add a title and a description.')
    if (!(mins >= 5 && mins <= 60)) return setError('Time must be between 5 and 60 minutes.')
    if (parsed.length === 0) return setError('Add at least one check, like: Uses GROUP BY | group by')
    onAdd(categoryId, {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      minutes: mins,
      description: description.trim(),
      starter,
      checks: parsed,
    })
  }

  return (
    <>
      <h1>Add a task</h1>
      <p className="lead">Job-seekers see the task in its category right away.</p>
      <form onSubmit={submit} noValidate>
        <label htmlFor="category">Category</label>
        <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <label htmlFor="title">Title</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label htmlFor="minutes">Time in minutes</label>
        <input id="minutes" type="number" min={5} max={60} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        <label htmlFor="description">Description</label>
        <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        <label htmlFor="starter">Starter code (optional)</label>
        <textarea id="starter" rows={4} value={starter} onChange={(e) => setStarter(e.target.value)} />
        <label htmlFor="checks">Checks, one per line: test name | text the solution must contain</label>
        <textarea id="checks" rows={4} value={checks} onChange={(e) => setChecks(e.target.value)} placeholder="Uses GROUP BY | group by" />
        {error && <p className="error" role="alert">{error}</p>}
        <button className="primary" type="submit">Publish task</button>
      </form>
    </>
  )
}
