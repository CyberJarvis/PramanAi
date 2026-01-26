import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const JWT_SECRET = process.env.JWT_SECRET;
  const key = new TextEncoder().encode(JWT_SECRET || "default_secret_fallback"); // Fallback or handle missing secret

  let payload = null;
  if (token) {
    try {
      const { payload: verified } = await jwtVerify(token, key);
      payload = verified;
    } catch (error) {
      console.error("Token verification failed:", error);
      // Token is invalid, treat as unauthenticated
    }
  }

  const role = payload?.role;

  // Define route protections
  const protectedRoutes = ["/dashboard"];
  const adminRoutes = ["/admin"]; // Example admin route
  const authRoutes = ["/login", "/register"];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 1. Unauthenticated user trying to access protected routes
  if ((isProtectedRoute || isAdminRoute) && !payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user trying to access auth routes (login/register)
  if (isAuthRoute && payload) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Admin protection (Role-Based Access Control)
  if (isAdminRoute && role !== "admin") {
    // User is logged in but not an admin
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
