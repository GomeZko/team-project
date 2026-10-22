// Sign-up and sign-in helpers (S1). Supabase does the real work; this file checks the form
// and turns Supabase answers into words a person understands.
export type Role = 'seeker' | 'author'
export type AppUser = { id: string; name: string; email: string; role: Role }

const validEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email.trim())

// Supabase needs at least 6 characters by default, so we ask for the same.
export function checkSignUp(name: string, email: string, password: string): string | null {
  if (name.trim() === '' || !validEmail(email) || password.length < 6)
    return 'Enter your name, a valid email and a password of at least 6 characters.'
  return null
}

export function checkSignIn(email: string, password: string): string | null {
  if (!validEmail(email) || password === '') return 'Enter a valid email and your password.'
  return null
}

export function authErrorMessage(error: { code?: string; message?: string }): string {
  if (error.code === 'invalid_credentials') return 'Wrong email or password.'
  if (error.code === 'user_already_exists') return 'An account with this email already exists. Sign in instead.'
  if (error.code === 'weak_password') return 'Choose a stronger password: at least 6 characters.'
  if (/fetch|network/i.test(error.message ?? '')) return 'Could not reach the server. Check your connection and try again.'
  return 'Something went wrong. Please try again.'
}

// The name and role are saved with the account at sign-up (Supabase "user_metadata").
type SupabaseUser = { id: string; email?: string; user_metadata?: Record<string, unknown> }

export function toAppUser(user: SupabaseUser): AppUser {
  const email = user.email ?? ''
  const meta = user.user_metadata ?? {}
  const name = typeof meta.name === 'string' && meta.name.trim() !== '' ? meta.name : email.split('@')[0]
  return { id: user.id, name, email, role: meta.role === 'author' ? 'author' : 'seeker' }
}
