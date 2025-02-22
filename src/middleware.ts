import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import useRegisterModal from './hooks/use-register-modal';
 
export async function middleware(req: NextRequest) {
  const session = await auth();
  const protectedRoutes = ["/explore", "/my-capsules", "/profile"]; // Define protected routes

  // Check if the request matches any protected route
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url)); // Redirect unauthenticated users
    }
  }

  return NextResponse.next();
}
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|login).*)'],
};