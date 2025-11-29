import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)

      // If user is signed in and confirmed, check for pending profile
      if (session?.user) {
        await handlePendingProfile(session.user.id)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)

        // If user just signed in (confirmed email), handle pending profile
        if (event === 'SIGNED_IN' && session?.user) {
          await handlePendingProfile(session.user.id)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handlePendingProfile = async (userId) => {
    // Check if there's a pending profile cookie
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('pending_profile='))
      ?.split('=')[1]

    if (cookieValue) {
      try {
        const profileData = JSON.parse(decodeURIComponent(cookieValue))

        // DEBUG: Log the profile data coming from the cookie
        console.log('--- handlePendingProfile: profileData from cookie ---', profileData)

        // Insert profile data and log response for debugging
        const { data: insertedProfile, error } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()

        console.log('--- handlePendingProfile: insert response ---', { insertedProfile, error })

        if (!error) {
          // Clear the cookie
          document.cookie = 'pending_profile=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        } else {
          console.error('Profile insert error:', error)
        }
      } catch (err) {
        console.error('Error handling pending profile:', err)
      }
    }
  }

  return { user, loading }
}
