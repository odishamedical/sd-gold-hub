import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Protect /admin and /vendor routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/vendor')) {
    const token = searchParams.get('token');
    const sessionCookie = request.cookies.get('sd_session');

    // If token is present in URL (coming from Auth Center SSO), set the session cookie
    if (token === 'sd_super_admin_secret_token') {
      const response = NextResponse.next();
      response.cookies.set('sd_session', 'authenticated', {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      return response;
    }

    // If no session cookie is present, redirect to Auth Center SSO Launcher
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      // Redirect to Universal SSO Launcher
      return NextResponse.redirect('https://sd-auth-center.vercel.app/launcher');
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*'],
};
