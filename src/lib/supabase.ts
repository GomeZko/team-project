import { createClient } from '@supabase/supabase-js'
import { databaseStatus } from './databaseStatus'

// The one Supabase connection for the whole app. The values come from .env (see .env.example).
// Without them it is null, and the sign-in screen says that sign-in is not set up.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = databaseStatus(url, key) === 'connected' ? createClient(url, key) : null
