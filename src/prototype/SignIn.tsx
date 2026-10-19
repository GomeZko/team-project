import { useState, type FormEvent } from 'react'
import type { Role, User } from './store'

// Demo sign-in (S1 in the prototype). Not real authentication: no password, nothing is sent anywhere.
export default function SignIn({ onSignIn }: { onSignIn: (user: User) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('seeker')
  const [error, setError] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (name.trim() === '' || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter your name and a valid email.')
      return
    }
    onSignIn({ name: name.trim(), email: email.trim(), role })
  }

  return (
    <main className="signin">
      <p className="badge">Prototype · demo sign-in</p>
      <h1>JobBridge</h1>
      <p className="lead">Prove one skill in 15 minutes and get a report you can attach to job applications.</p>
      <form onSubmit={submit} noValidate>
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
        <fieldset>
          <legend>I am</legend>
          <label className="inline">
            <input type="radio" name="role" checked={role === 'seeker'} onChange={() => setRole('seeker')} />
            looking for a developer job
          </label>
          <label className="inline">
            <input type="radio" name="role" checked={role === 'author'} onChange={() => setRole('author')} />
            a task author
          </label>
        </fieldset>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="primary" type="submit">Sign in</button>
      </form>
      <p className="hint">Demo only: no password, use a made-up name and email. Data stays in this browser.</p>
    </main>
  )
}
