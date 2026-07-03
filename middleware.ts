import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const cookieName = `a_session_${projectId}`;
  const hasSession = request.cookies.has(cookieName);

  const pathname = request.nextUrl.pathname;

  // Protect /account and /admin routes
  if (pathname.startsWith("/account") || pathname.startsWith("/admin") || pathname === "/login" || pathname === "/register") {

    // Allow guest access to login and register
    if (pathname === "/login" || pathname === "/register") {
      if (hasSession) {
        // Redirect to home if already logged in
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    }

    if (!hasSession) {
      // Redirect to login if unauthenticated
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/login", "/register"],
};
