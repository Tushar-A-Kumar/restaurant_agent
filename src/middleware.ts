import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow API routes and Next.js internals through
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_ROUTES.some(r => pathname.startsWith(r));
  const authCookie = req.cookies.get('kitchenos_auth');
  const isAuthed = !!authCookie?.value;

  // Unauthenticated access to protected route → redirect to login
  if (!isPublic && !isAuthed) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in → redirect away from login page
  if (isPublic && isAuthed) {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = '/';
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
