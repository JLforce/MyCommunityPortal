// middleware.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

// Define the paths that are protected and public
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/reports', '/pickup', '/settings'];
const PUBLIC_ROUTES = ['/', '/signin', '/signup', '/forgot-password'];
// NOTE: I'm keeping 'public' routes minimal for clarity. You may add more marketing pages here.

export async function middleware(req) {
  // 1. Initialize Supabase Client for Middleware
  // This client handles reading and refreshing the user session via cookies
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });
  const supabase = createMiddlewareClient({ req, res });

  // 2. Get the session (This step refreshes the session cookies if necessary)
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // Get the current path for checking
  const pathname = req.nextUrl.pathname;
  
  // Check if the current path starts with any of the protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  // Check if the current path is one of the explicit authentication routes
  const isAuthRoute = PUBLIC_ROUTES.some(route => route !== '/' && pathname.startsWith(route));

  // --- Logic A: Redirect unauthenticated users from protected routes ---
  if (isProtectedRoute && !session) {
    // Redirect to the signin page if trying to access protected content without a session
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // --- Logic B: Redirect authenticated users from auth routes ---
  if (isAuthRoute && session) {
    // Redirect logged-in users away from signin/signup back to the dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If none of the above rules apply, allow the request to proceed
  return res;
}

// 3. Matcher Configuration
// This tells Next.js which paths should run the middleware logic
export const config = {
  // Match all the routes we defined in our arrays, plus the root path '/'
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/reports/:path*',
    '/pickup/:path*',
    '/settings/:path*',
    '/signin',
    '/signup',
    '/forgot-password',
    '/', // Explicitly include the root page
    // Include the API routes you want to protect here, e.g. '/api/status'
  ],
};