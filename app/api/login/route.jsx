import { NextResponse } from "next/server";
import { getDatabases } from "@/utils/Mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Secret key for JWT signing - in production, use environment variables
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request) {
  try {
    console.log("Login attempt started");

    const { userCollection } = await getDatabases();
    console.log("Database connected successfully");

    const data = await request.json();
    console.log("Login attempt for email:", data.email);

    // Validate request data
    if (!data.email || !data.password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await userCollection.findOne({ email: data.email });
    console.log("User found:", !!user);

    // Check if user exists
    if (!user) {
      console.log("User not found for email:", data.email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const validPassword = await bcrypt.compare(data.password, user.password);
    console.log("Password valid:", validPassword);

    if (!validPassword) {
      console.log("Invalid password for user:", data.email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create token payload with user information
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || "user", // Default role if not specified
    };

    // Generate JWT token
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "7d", // Token expires in 7 days
    });
    console.log("JWT token generated successfully");

    // Create the response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
        },
      },
      { status: 200 }
    );

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only use secure in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    };

    // Set the auth token cookie
    response.cookies.set("authToken", token, cookieOptions);
    console.log("Auth cookie set successfully");

    return response;
  } catch (error) {
    console.error("Login error details:", error.message);
    console.error("Login error stack:", error.stack);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
