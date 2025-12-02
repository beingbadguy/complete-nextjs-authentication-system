import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null; // Invalid or expired token
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("nextToken")?.value || "";

  // Public routes (user shouldn't be redirected if logged in)
  const restrictedForLoggedIn = [
    "/login",
    "/signup",
    "/confirm",
    "/forget",
    "/reset",
  ];

  // Protected routes (only accessible if logged in)
  const protectedRoutes = ["/profile"];
  const onlyAdminRoutes = ["/admin"];

  if (!token) {
    // If no token, restrict access to protected routes
    if (protectedRoutes.includes(path)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Verify JWT with `jose`
  const decoded = await verifyJWT(token);
  console.log(decoded?.role);

  if (!decoded) {
    // If JWT is invalid or expired, clear cookie and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("nextToken");
    return response;
  }

  // Previously we redirected unverified users to the verification page.
  // That behavior is removed so users can navigate the site even if not verified.
  // If you'd like to protect certain routes from unverified users, add them
  // to an array and redirect as needed (e.g. profile). For now, we allow
  // all verified and unverified users to proceed.
  if (onlyAdminRoutes.includes(path) && decoded.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect already logged-in users away from auth pages
  if (restrictedForLoggedIn.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// ✅ Works on Vercel Edge Runtime!
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
    "/verify",
    "/admin",
  ],
};
