import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Page-level access control matrix (must match lib/rbac.js)
const PAGE_ACCESS = {
  "/dashboard": ["admin", "policy_designer", "analyst", "user", "viewer"],
  "/dashboard/map": ["admin", "policy_designer", "analyst", "user"],
  "/dashboard/risk": ["admin", "policy_designer", "analyst"],
  "/dashboard/timeline": ["admin", "policy_designer", "analyst", "user"],
  "/dashboard/attribution": ["admin", "policy_designer", "analyst", "user"],
  "/dashboard/intelligence": ["admin", "policy_designer", "analyst"],
  "/dashboard/scenarios": ["admin", "policy_designer"],
  "/dashboard/causal-graph": ["admin", "policy_designer"],
  "/dashboard/council": ["admin", "policy_designer"],
  "/admin": ["admin"],
  "/admin/users": ["admin"],
  "/admin/roles": ["admin"],
  "/admin/activity": ["admin"],
};

function canAccessPage(role, pathname) {
  // Find exact match first
  if (PAGE_ACCESS[pathname]) {
    return PAGE_ACCESS[pathname].includes(role);
  }

  // Check for parent path match
  const pathParts = pathname.split('/').filter(Boolean);
  while (pathParts.length > 0) {
    const parentPath = '/' + pathParts.join('/');
    if (PAGE_ACCESS[parentPath]) {
      return PAGE_ACCESS[parentPath].includes(role);
    }
    pathParts.pop();
  }

  return true; // Allow if no rule defined
}

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const JWT_SECRET = process.env.JWT_SECRET;
  const key = new TextEncoder().encode(JWT_SECRET || "default_secret_fallback");

  let payload = null;
  if (token) {
    try {
      const { payload: verified } = await jwtVerify(token, key);
      payload = verified;
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  }

  const role = payload?.role || null;

  // Route categories
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isAccessDeniedPage = pathname === "/dashboard/access-denied";

  // 1. Unauthenticated user trying to access protected routes
  if (isProtectedRoute && !payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user trying to access auth routes
  if (isAuthRoute && payload) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Role-Based Page Access Control
  if (isProtectedRoute && !isAccessDeniedPage && role) {
    const hasAccess = canAccessPage(role, pathname);
    if (!hasAccess) {
      // Redirect to access denied page with info
      const accessDeniedUrl = new URL("/dashboard/access-denied", request.url);
      accessDeniedUrl.searchParams.set("page", pathname);
      accessDeniedUrl.searchParams.set("role", role);
      return NextResponse.redirect(accessDeniedUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
