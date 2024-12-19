import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = ['/', '/login', '/signup'];
const apiPaths = ['/api/generate-video', '/api/video-status'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;
  const isPublicPath = publicPaths.includes(pathname);
  const isApiPath = apiPaths.some(path => pathname.startsWith(path));

  // Allow API requests with valid session
  if (isApiPath) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return res;
  }

  // Allow public paths without redirection
  if (isPublicPath) {
    return res;
  }

  // Redirect unauthenticated users to home page if trying to access protected routes
  if (!session && !isPublicPath) {
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