import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Redirect lowercase /GOP/login to /GOP/Login
  if (pathname === '/GOP/login') {
    return NextResponse.redirect(new URL('/GOP/Login', request.url));
  }

  // Redirect lowercase /GOP/admin to /GOP/Admin
  if (pathname === '/GOP/admin') {
    return NextResponse.redirect(new URL('/GOP/Admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/GOP/login', '/GOP/admin'],
};
