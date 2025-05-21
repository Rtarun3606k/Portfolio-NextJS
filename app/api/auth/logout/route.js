import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Clear the HTTP-only session cookie
  response.cookies.set({
    name: "admin_session",
    value: "",
    expires: new Date(0),
    path: "/",
  });

  // Clear the client-side cookie
  response.cookies.set({
    name: "adminAccess",
    value: "",
    expires: new Date(0),
    path: "/",
  });

  return response;
}
