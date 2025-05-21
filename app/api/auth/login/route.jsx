import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Get admin credentials from environment variables
    const adminEmail = process.env.NEXT_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_ADMIN_PASSWORD;

    // Validate credentials
    if (email === adminEmail && password === adminPassword) {
      // Generate a simple session token - in a real app, use a more secure method
      const token =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Create a secure HTTP-only cookie
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
      });

      // Set HTTP-only cookie with expiration (2 hours)
      response.cookies.set({
        name: "admin_session",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 120, // 2 hours
        path: "/",
      });

      // Set a non-HTTP-only cookie for client-side awareness
      // (less secure but helps with UI state)
      const expiry = Date.now() + 120 * 60 * 1000; // 2 hours
      response.cookies.set({
        name: "adminAccess",
        value: JSON.stringify({ value: true, expiry }),
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 120, // 2 hours
        path: "/",
      });

      return response;
    }

    // Invalid credentials
    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
