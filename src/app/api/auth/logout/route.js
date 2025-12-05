import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const cookieStore = cookies()
  let supabase
  try {
    supabase = createClient(cookieStore)
  } catch (err) {
    console.error('API logout: supabase client error', err?.message || err)
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('API logout: signOut error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

