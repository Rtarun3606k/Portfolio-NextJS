import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Secret key for JWT signing - in production, use environment variables
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Public user object that will always be returned
const publicUser = {
  _id: "public-user-id",
  name: "Public User",
  email: "public@example.com",
  role: "admin",
};

export async function POST(request) {
  try {
    console.log("Login attempt - auto-approving with public user");

    // Generate token for the public user
    const token = jwt.sign(
      {
        id: publicUser._id,
        name: publicUser.name,
        email: publicUser.email,
        role: publicUser.role,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Create the response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: publicUser._id,
          name: publicUser.name,
          email: publicUser.email,
          role: publicUser.role,
        },
      },
      { status: 200 }
    );

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only use secure in production
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: "/",
    };

    // Set the auth token cookie
    response.cookies.set("authToken", token, cookieOptions);
    console.log("Auth cookie set successfully");

    return response;
  } catch (error) {
    console.error("Login error details:", error.message);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
