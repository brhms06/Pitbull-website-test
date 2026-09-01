import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

/**
 * Server-side gate for /admin/*: redirects to /admin/login before any admin
 * HTML ships, replacing the old client-only auth check that briefly flashed
 * the dashboard before redirecting.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (request.nextUrl.pathname === '/admin/login') {
    return response;
  }

  const supabase = createMiddlewareClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    return NextResponse.redirect(new URL('/admin/login?unauthorized=1', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
