import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Handle dashboard protection
  if (path.startsWith("/dashboard")) {
    // Check for the admin session cookie
    const cookie = request.cookies.get("admin_session");

    // If no cookie exists, redirect to login
    if (!cookie) {
      return NextResponse.redirect(new URL("/Login", request.url));
    }
  }

  // Handle CORS for API routes
  if (path.startsWith("/api")) {
    // Get the origin from the request
    const origin = request.headers.get("origin");

    // Handle preflight requests (OPTIONS)
    if (request.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 204 });

      // Set CORS headers
      if (origin) {
        response.headers.set("Access-Control-Allow-Origin", origin);
      } else {
        response.headers.set("Access-Control-Allow-Origin", "*");
      }

      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET,DELETE,PATCH,POST,PUT,OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
      );
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Access-Control-Max-Age", "86400");

      return response;
    }

    // For regular API requests
    const response = NextResponse.next();

    // Set CORS headers
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    } else {
      response.headers.set("Access-Control-Allow-Origin", "*");
    }

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,DELETE,PATCH,POST,PUT,OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  }

  // For all other routes
  return NextResponse.next();
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
