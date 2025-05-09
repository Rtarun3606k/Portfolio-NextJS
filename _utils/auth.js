import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Secret key for JWT verification - in production, use environment variables
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Verifies a JWT token from the Authorization header or cookie
 * @param {Request} request - The Next.js request object
 * @returns {Object} - The decoded token payload or null if invalid
 */
export function verifyAuth(request) {
  try {
    // Try to get token from Authorization header first
    let token = request.headers.get("Authorization")?.split(" ")[1];

    // If no token in header, try to get from cookies
    if (!token) {
      token = request.cookies.get("authToken")?.value;
    }

    if (!token) {
      return null;
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
}

/**
 * Middleware function to protect API routes
 * @param {Function} handler - The API route handler
 * @param {Object} options - Options for the auth check
 * @returns {Function} - A wrapped handler function
 */
export function withAuth(handler, options = {}) {
  return async function (request, ...args) {
    const user = verifyAuth(request);

    // Handle unauthorized requests
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check role if required
    if (options.requiredRole && user.role !== options.requiredRole) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Attach user info to request for use in the handler
    request.user = user;

    // Call the original handler with the updated request
    return handler(request, ...args);
  };
}

/**
 * Gets the current authenticated user from the request
 * @param {Request} request - The Next.js request object
 * @returns {Object|null} - The user object or null if not authenticated
 */
export function getCurrentUser(request) {
  return verifyAuth(request);
}
