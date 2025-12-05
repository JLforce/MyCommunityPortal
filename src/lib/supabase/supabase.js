import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    cookies: {
      getAll() {
        // Check if we're in the browser before accessing document
        if (typeof window === 'undefined') {
          return []
        }
        return document.cookie.split('; ').map(cookie => {
          const [name, ...rest] = cookie.split('=')
          return { name, value: rest.join('=') }
        })
      },
      setAll(cookiesToSet) {
        // Check if we're in the browser before accessing document
        if (typeof window === 'undefined') {
          return
        }
        cookiesToSet.forEach(({ name, value, options }) => {
          document.cookie = `${name}=${value}; path=/; ${options?.maxAge ? `max-age=${options.maxAge};` : ''} ${options?.domain ? `domain=${options.domain};` : ''} ${options?.sameSite ? `samesite=${options.sameSite};` : ''} ${options?.secure ? 'secure;' : ''}`
        })
      },
    },
  }
)
