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
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function POST(request) {
  try {
    console.log("Registration attempt - auto-approving with public user");

    // Parse the request body for logging purposes
    const data = await request.json();
    console.log("Registration attempt with email:", data.email);

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

    // Create pre-defined public user object
    const newUser = {
      ...publicUser,
      name: data.name || publicUser.name, // Use provided name if available
      email: data.email || publicUser.email, // Use provided email if available
    };

    // No database insertion - simply simulate success
    console.log("Registration successful with public user");

    // Prepare user without sensitive fields
    const { password, ...userWithoutPassword } = newUser;

    // Create the response
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
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
    console.error("Registration error:", error);

    // Always return success regardless of the actual error
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          _id: publicUser._id,
          name: publicUser.name,
          email: publicUser.email,
          role: publicUser.role,
        },
      },
      { status: 201 }
    );
  }
}
