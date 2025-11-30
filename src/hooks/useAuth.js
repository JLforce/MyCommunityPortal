// src/hooks/useAuth.js

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

  // --- NEW: Authentication Methods ---

  const signInWithProvider = async (provider) => {
    // This is the function needed to fix the Google/Facebook login issue
    return supabase.auth.signInWithOAuth({
      provider: provider, // 'google' or 'facebook'
      options: {
        // NOTE: Ensure this redirect URL is correct for your App Router setup
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signIn = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email, password) => {
    return supabase.auth.signUp({ email, password })
  }

  const signOut = async () => {
    return supabase.auth.signOut()
  }

  // --- Existing Profile Handler ---
  const handlePendingProfile = async (userId) => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('pending_profile='))
      ?.split('=')[1]

    if (cookieValue) {
      try {
        const profileData = JSON.parse(decodeURIComponent(cookieValue))

        // Ensure user_id is set for the profile insertion (critical for foreign key)
        profileData.user_id = userId; 

        // Insert profile data and log response for debugging
        const { data: insertedProfile, error } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()

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

  // --- Final Return ---
  return { 
    user, 
    loading, 
    signIn, 
    signUp, 
    signOut,
    signInWithProvider // EXPOSE THE OAUTH FUNCTION HERE
  }
}