import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = ['/', '/login', '/signup', '/api/videos', '/success', '/api/webhooks/stripe'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const pathname = req.nextUrl.pathname;

  // Allow public access to specified paths
  if (publicPaths.includes(pathname)) {
    return res;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect API routes except those in publicPaths
  if (pathname.startsWith('/api') && !publicPaths.includes(pathname)) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return res;
  }

  // Redirect unauthenticated users to home page if trying to access protected routes
  if (!session && !publicPaths.includes(pathname)) {
    const redirectUrl = new URL('/', req.url);
    redirectUrl.searchParams.set('authRequired', 'true');
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 