// /my-nextjs-app/middleware.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

// Define the paths that are protected and public
const PROTECTED_ROUTES = [
  '/dashboard-admin', 
  '/profile', 
  '/reports', 
  '/pickup', 
  '/settings',
  '/users'
];
const PUBLIC_ROUTES = ['/', '/signin', '/signup', '/forgot-password'];
// NOTE: We are excluding '/api' routes from this list; they will be protected internally.

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 1. Get the session (This refreshes the session cookies if necessary)
  const { data: { session } } = await supabase.auth.getSession();
  
  const pathname = req.nextUrl.pathname;
  
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = PUBLIC_ROUTES.some(route => route !== '/' && pathname.startsWith(route));

  // --- Logic A: Redirect unauthenticated/unauthorized users from protected routes ---
  if (isProtectedRoute) {
    if (!session) {
      // 1. If NOT logged in, redirect to signin
      const redirectUrl = new URL('/signin', req.url);
      redirectUrl.searchParams.set('next', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    } 

    // 2. If LOGGED IN, check for Admin role in the 'profiles' table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // The user must be an admin to proceed to the dashboard.
    // If there's an error fetching the profile or the role is not 'admin'
    if (error || profile?.role !== 'admin') {
      // Redirect to a non-admin page (e.g., the root page)
      return NextResponse.redirect(new URL('/', req.url)); 
    }
  }

  // --- Logic B: Redirect authenticated users from auth routes ---
  if (isAuthRoute && session) {
    // Redirect logged-in users away from signin/signup back to the admin dashboard
    return NextResponse.redirect(new URL('/dashboard-admin', req.url)); 
  }

  return res;
}

export const config = {
  matcher: [
    // Include all dashboard and auth routes
    '/dashboard-admin/:path*',
    '/profile/:path*',
    '/reports/:path*',
    '/pickup/:path*',
    '/settings/:path*',
    '/users/:path*',
    '/signin',
    '/signup',
    '/forgot-password',
    '/',
    // Match the /api routes to allow the middleware to refresh tokens, 
    // but the role check for APIs is done inside the handler itself.
    '/api/:path*', 
  ],
};