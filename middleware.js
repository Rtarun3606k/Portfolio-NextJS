import { NextResponse } from "next/server";

// List of allowed origins for CORS
const allowedOrigins = [
  "https://tarunnayaka.me", // Production domain
  "https://tarun-nayaka-r-g8fpf4e2dmd9e8dt.centralindia-01.azurewebsites.net/", // With www subdomain
  "http://tarunnayaka.vercel.app", // Local development
];

// This function handles CORS and other middleware operations
export function middleware(request) {
  // Check if the request is for an API route
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");

  // For non-API routes, simply continue the request without CORS handling
  if (!isApiRoute) {
    return NextResponse.next();
  }

  // For API routes, handle CORS
  const origin = request.headers.get("origin");

  // Handle preflight requests (OPTIONS)
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 }); // No content response for OPTIONS

    // Set CORS headers for preflight
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    } else {
      response.headers.set("Access-Control-Allow-Origin", "null");
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
    response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours

    return response;
  }

  // For regular requests, create the base response
  const response = NextResponse.next();

  // Set CORS headers
  if (origin) {
    // Check if the origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    } else {
      // For non-allowed origins, set null policy
      response.headers.set("Access-Control-Allow-Origin", "null");
    }
  }

  // Set other CORS headers regardless of origin
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

// Define which routes this middleware should be applied to
export const config = {
  matcher: [
    // Apply to all API routes
    "/api/:path*",
  ],
};
