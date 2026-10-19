import { describe, expect, it } from 'vitest'
import { authErrorMessage, checkSignIn, checkSignUp, toAppUser } from './auth'

describe('checkSignUp', () => {
  const message = 'Enter your name, a valid email and a password of at least 6 characters.'

  it('accepts a name, a valid email and a 6-character password', () => {
    expect(checkSignUp('Test Seeker', 'seeker@example.com', 'secret')).toBeNull()
  })

  it('needs a name that is not only spaces', () => {
    expect(checkSignUp('   ', 'seeker@example.com', 'secret')).toBe(message)
  })

  it('needs a valid email', () => {
    expect(checkSignUp('Test Seeker', 'seeker@', 'secret')).toBe(message)
    expect(checkSignUp('Test Seeker', 'seeker example.com', 'secret')).toBe(message)
  })

  it('needs a password of at least 6 characters', () => {
    expect(checkSignUp('Test Seeker', 'seeker@example.com', '12345')).toBe(message)
  })
})

describe('checkSignIn', () => {
  const message = 'Enter a valid email and your password.'

  it('accepts a valid email and any password', () => {
    expect(checkSignIn('seeker@example.com', 'x')).toBeNull()
  })

  it('needs a valid email and a password', () => {
    expect(checkSignIn('', 'secret')).toBe(message)
    expect(checkSignIn('seeker@example.com', '')).toBe(message)
  })
})

describe('authErrorMessage', () => {
  it('explains a wrong email or password', () => {
    expect(authErrorMessage({ code: 'invalid_credentials', message: 'Invalid login credentials' })).toBe(
      'Wrong email or password.',
    )
  })

  it('explains that the account already exists', () => {
    expect(authErrorMessage({ code: 'user_already_exists', message: 'User already registered' })).toBe(
      'An account with this email already exists. Sign in instead.',
    )
  })

  it('explains a password that Supabase finds too weak', () => {
    expect(authErrorMessage({ code: 'weak_password', message: 'Password should be at least 6 characters.' })).toBe(
      'Choose a stronger password: at least 6 characters.',
    )
  })

  it('explains that the server cannot be reached', () => {
    expect(authErrorMessage({ message: 'Failed to fetch' })).toBe(
      'Could not reach the server. Check your connection and try again.',
    )
  })

  it('falls back to a general message for anything else', () => {
    expect(authErrorMessage({ message: 'Something unexpected' })).toBe('Something went wrong. Please try again.')
  })
})

describe('toAppUser', () => {
  it('reads the name and role saved at sign-up', () => {
    expect(
      toAppUser({ id: 'u1', email: 'author@example.com', user_metadata: { name: 'Test Author', role: 'author' } }),
    ).toEqual({ id: 'u1', name: 'Test Author', email: 'author@example.com', role: 'author' })
  })

  it('treats a missing or unknown role as a job-seeker', () => {
    expect(toAppUser({ id: 'u1', email: 'a@example.com', user_metadata: { name: 'A' } }).role).toBe('seeker')
    expect(toAppUser({ id: 'u1', email: 'a@example.com', user_metadata: { name: 'A', role: 'admin' } }).role).toBe(
      'seeker',
    )
  })

  it('uses the start of the email when no name was saved', () => {
    expect(toAppUser({ id: 'u1', email: 'seeker@example.com', user_metadata: {} }).name).toBe('seeker')
  })
})
