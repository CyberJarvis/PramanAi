import { NextResponse } from "next/server";

// Clear auth cookie and redirect to login
function createLogoutResponse(request) {
  const loginUrl = new URL("/login", request.url);
  const response = NextResponse.redirect(loginUrl);

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}

// GET /api/auth/logout - Direct link logout
export async function GET(request) {
  return createLogoutResponse(request);
}

// POST /api/auth/logout - JavaScript logout
export async function POST(request) {
  return createLogoutResponse(request);
}
