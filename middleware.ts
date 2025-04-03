import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("nextToken")?.value || "";

  // Public routes that should NOT be accessible when logged in
  const restrictedForLoggedIn = [
    "/login",
    "/signup",
    "/confirm",
    "/forget",
    "/reset",
  ];

  // Protected routes that should NOT be accessible when NOT logged in
  const protectedRoutes = ["/profile"];

  // Redirect logged-in users away from login/signup/reset pages
  if (token && restrictedForLoggedIn.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect non-logged-in users away from protected pages
  if (!token && protectedRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    "/",
    "/about",
    "/login",
    "/profile",
    "/signup",
    "/confirm",
    "/forget",
    "/reset",
  ],
};
