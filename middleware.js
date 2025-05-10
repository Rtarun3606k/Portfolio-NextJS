import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // All routes are now public - no authentication checks

  // Simply continue the request
  return NextResponse.next();
}

// Define which routes this middleware should be applied to
// Since we're making all routes public, middleware is essentially inactive
export const config = {
  matcher: [], // Empty array means middleware won't be applied to any routes
};
