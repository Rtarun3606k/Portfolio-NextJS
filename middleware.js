import { NextResponse } from "next/server";

// List of allowed origins for CORS - restricted to just 3 URLs
const allowedOrigins = [
  "https://tarunnayaka.me",
  "https://www.tarunnayaka.me",
  "http://localhost:3000",
  "https://tarun-nayaka-r-g8fpf4e2dmd9e8dt.centralindia-01.azurewebsites.net",
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

    // Only allow the three specified origins
    if (origin && allowedOrigins.includes(origin)) {
      console.log(`✅ Allowing preflight for origin: ${origin}`);
      response.headers.set("Access-Control-Allow-Origin", origin);
    } else {
      console.log(`❌ Blocking preflight for origin: ${origin || "null"}`);
      response.headers.set("Access-Control-Allow-Origin", "null");
    }

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

  // Only allow the three specified origins
  if (origin && allowedOrigins.includes(origin)) {
    console.log(`✅ Allowing request for origin: ${origin}`);
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else {
    console.log(`❌ Blocking request for origin: ${origin || "null"}`);
    response.headers.set("Access-Control-Allow-Origin", "null");
  }

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
