import { NextResponse } from "next/server";

// List of allowed origins for CORS
const allowedOrigins = [
  "https://tarunnayaka.me",
  "https://www.tarunnayaka.me",
  "https://tarun-nayaka-r-g8fpf4e2dmd9e8dt.centralindia-01.azurewebsites.net",
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:8000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:4000",
  "http://127.0.0.1:8000",
];

/**
 * CORS middleware for Next.js
 */
export function middleware(request) {
  console.log("⭐ Middleware executing for path:", request.nextUrl.pathname);

  // Only apply CORS to API routes
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const origin = request.headers.get("origin");
  console.log("🔍 Origin:", origin);

  // Handle OPTIONS preflight requests
  if (request.method === "OPTIONS") {
    console.log("➡️ Handling OPTIONS preflight request");
    const response = new NextResponse(null, { status: 204 });

    // Allow all origins during development for easier debugging
    // In production you would want to be more restrictive
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Max-Age", "86400");

    console.log("✅ Preflight response headers set");
    return response;
  }

  // For actual requests
  console.log("➡️ Handling actual request:", request.method);
  const response = NextResponse.next();

  // For now, allow all origins while debugging
  response.headers.set("Access-Control-Allow-Origin", origin || "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  console.log("✅ Response headers set");
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
