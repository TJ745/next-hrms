import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

// const protectedRoutes = ["/profile", "/admin/dashboard"];

const allowedAuthWhenLoggedIn = [
  "/auth/create-password",
  "/auth/set-password",
  "/auth/reset-password",
];

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const sessionCookie = getSessionCookie(req);

  const res = NextResponse.next();

  const isLoggedIn = !!sessionCookie;
  // const isOnProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  
  // const isAllowedAuthRoute = allowedAuthWhenLoggedIn.includes(nextUrl.pathname);

  // Check if the current auth route is allowed even if logged in
  const isAllowedAuthRoute = allowedAuthWhenLoggedIn.some(route =>
    nextUrl.pathname.startsWith(route)
  );

  // if (isOnProtectedRoute && !isLoggedIn) {
  //   return NextResponse.redirect(new URL("/auth/login", req.url));
  // }

  // if (isOnAuthRoute && isLoggedIn) {
  //   return NextResponse.redirect(new URL("/profile", req.url));
  // }

  // Not logged in and not on auth routes → redirect to login
  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Logged in but navigating to auth routes BUT allow password setup routes
  if (isLoggedIn && isAuthRoute && !isAllowedAuthRoute) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
