import { NextResponse } from "next/server";

// This function handles CORS and other middleware operations
export function middleware(request) {
  // Check if the request is for an API route
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");

  // For non-API routes, simply continue the request without CORS handling
  if (!isApiRoute) {
    return NextResponse.next();
  }

  // Get the origin from the request
  const origin = request.headers.get("origin");
  console.log(`Received request from origin: ${origin}`);

  // Handle preflight requests (OPTIONS)
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });

    // Allow any origin during debugging
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      console.log(`CORS preflight: Allowing origin: ${origin}`);
    } else {
      response.headers.set("Access-Control-Allow-Origin", "*");
      console.log("CORS preflight: No origin provided, using '*'");
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

  // Allow any origin during debugging
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    console.log(`CORS: Allowing origin: ${origin}`);
  } else {
    response.headers.set("Access-Control-Allow-Origin", "*");
    console.log("CORS: No origin provided, using '*'");
  }

  // Set other CORS headers
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
