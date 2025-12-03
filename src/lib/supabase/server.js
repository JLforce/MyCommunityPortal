// lib/supabase/server.js (example helper)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Primary helper used across the app
export function createClient(cookieStore) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Supabase URL and ANON KEY are required to create a Supabase client.\nSet NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment (e.g. .env.local).'
    )
  }

  return createServerClient(url, anonKey, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, options) => {
        try {
          // Setting cookies via `next/headers().cookies.set` is only allowed
          // inside Server Actions or Route Handlers. Wrap in try/catch so
          // components or other server-render contexts don't crash when
          // Supabase attempts to refresh a session during rendering.
          if (cookieStore && typeof cookieStore.set === 'function') {
            cookieStore.set({ name, value, ...options })
          }
        } catch (err) {
          // Don't throw here — log and continue. Caller may be rendering
          // where cookie mutation is not permitted.
          // eslint-disable-next-line no-console
          console.warn('Could not set cookie (safe to ignore outside actions/handlers):', err?.message || err)
        }
      },
      remove: (name, options) => {
        try {
          if (cookieStore && typeof cookieStore.set === 'function') {
            cookieStore.set({ name, value: '', ...options })
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('Could not remove cookie (safe to ignore outside actions/handlers):', err?.message || err)
        }
      },
    },
  })
}

// Backwards-compatible alias for older imports expecting `createServerClient`
export function createServerClientFromCookies(cookieStore) {
  return createClient(cookieStore)
}