import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Secret key for JWT verification - in production, use environment variables
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Previously verified a JWT token, now always returns a default public user
 * @param {Request} request - The Next.js request object
 * @returns {Object} - A default public user object
 */
export function verifyAuth(request) {
  // Always return a default public user object
  return {
    id: "public-user",
    name: "Public User",
    email: "public@example.com",
    role: "user",
  };
}

/**
 * Middleware function that used to protect API routes but now allows all access
 * @param {Function} handler - The API route handler
 * @param {Object} options - Options for the auth check (ignored now)
 * @returns {Function} - A wrapped handler function
 */
export function withAuth(handler, options = {}) {
  return async function (request, ...args) {
    // No authentication checks - simply call the handler directly
    // Add a default public user to maintain compatibility with any code that expects request.user
    request.user = {
      id: "public-user",
      name: "Public User",
      email: "public@example.com",
      role: "user",
    };

    // Call the original handler with the updated request
    return handler(request, ...args);
  };
}

/**
 * Gets the current authenticated user from the request
 * Now always returns a default public user
 * @param {Request} request - The Next.js request object
 * @returns {Object} - A default public user object
 */
export function getCurrentUser(request) {
  return verifyAuth(request);
}
