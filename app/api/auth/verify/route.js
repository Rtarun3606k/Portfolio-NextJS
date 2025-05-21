import { NextResponse } from "next/server";

export async function GET(request) {
  // Get the admin_session cookie
  const sessionCookie = request.cookies.get("admin_session");

  // Check if the cookie exists
  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // In a real app, you would verify the session token against a database
  // For this simple implementation, we just check if the token exists

  return NextResponse.json({ authenticated: true });
}
