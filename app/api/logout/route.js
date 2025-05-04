import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create a response
    const response = NextResponse.json(
      {
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Clear the auth token cookie
    response.cookies.set("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Set expiration date in the past to delete the cookie
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
