// src/app/auth/callback/route.js
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// This is a Route Handler to complete the sign-in/sign-up process after OAuth redirect
export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    // Exchange the authorization code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the dashboard (or another protected page) after successful login
  return NextResponse.redirect(new URL('/dashboard', request.url));
}