import { useState, type FormEvent } from 'react'
import { authErrorMessage, checkSignIn, checkSignUp, type Role } from '../lib/auth'
import { supabase } from '../lib/supabase'

// Sign-in and account creation (S1), with Supabase email + password.
// After success Supabase tells Prototype.tsx that someone signed in, and it shows the dashboard.
export default function SignIn() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('seeker')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const signingUp = mode === 'sign-up'

  function switchMode() {
    setMode(signingUp ? 'sign-in' : 'sign-up')
    setError('')
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const problem = signingUp ? checkSignUp(name, email, password) : checkSignIn(email, password)
    if (problem) return setError(problem)
    if (!supabase) return
    setError('')
    setBusy(true)
    const { data, error } = signingUp
      ? await supabase.auth.signUp({ email: email.trim(), password, options: { data: { name: name.trim(), role } } })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) setError(authErrorMessage(error))
    // Only happens if "Confirm email" is turned on in Supabase.
    else if (!data.session) setError('Check your email and confirm your account, then sign in.')
  }

  return (
    <main className="signin">
      <p className="badge">Prototype</p>
      <h1>JobBridge</h1>
      <p className="lead">Prove one skill in 15 minutes and get a report you can attach to job applications.</p>
      <h2>{signingUp ? 'Create an account' : 'Sign in'}</h2>
      {!supabase && (
        <p className="error" role="alert">
          Sign-in is not set up yet: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.
        </p>
      )}
      <form onSubmit={submit} noValidate>
        {signingUp && (
          <>
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </>
        )}
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={signingUp ? 'new-password' : 'current-password'}
        />
        {signingUp && (
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
        )}
        {error && <p className="error" role="alert">{error}</p>}
        <button className="primary" type="submit" disabled={busy}>
          {signingUp ? (busy ? 'Creating account…' : 'Create account') : busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p>
        <button type="button" className="link" onClick={switchMode}>
          {signingUp ? 'I already have an account' : 'Create an account'}
        </button>
      </p>
      <p className="hint">Prototype: use a made-up name. Tasks and reports stay in this browser for now.</p>
    </main>
  )
}
