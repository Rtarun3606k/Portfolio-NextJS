import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define which paths are considered public (no authentication required)
  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
    path === "/" ||
    path.startsWith("/api/login") ||
    path === "/api/register";

  // Check for auth token in cookies
  const authToken = request.cookies.get("authToken")?.value;

  // If a protected route is accessed without auth token, redirect to login
  if (!isPublicPath && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is already authenticated and tries to access login/register, redirect to dashboard
  if (
    isPublicPath &&
    authToken &&
    (path === "/login" || path === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For API routes that need authentication (except login and register)
  if (path.startsWith("/api/") && !isPublicPath && !authToken) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Add the auth token to request headers for API routes
  if (authToken && path.startsWith("/api/")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${authToken}`);

    // Create a new request with the modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Continue the request
  return NextResponse.next();
}

// Define which routes this middleware should be applied to
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/profile/:path*",
    "/api/:path*",
  ],
};
