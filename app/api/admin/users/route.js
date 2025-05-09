import { NextResponse } from "next/server";
import { getDatabases } from "@/_utils/Mongodb";
import { withAuth } from "@/_utils/auth";

// Handler for the request
async function handler(request) {
  try {
    const { userCollection } = await getDatabases();

    // The user information is available from the request
    // This was attached by the withAuth middleware
    const adminUser = request.user;

    // Get all users (excluding password field)
    const users = await userCollection
      .find({}, { projection: { password: 0 } })
      .toArray();

    return NextResponse.json(
      {
        users,
        requestedBy: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Export the GET method with admin role requirement
export const GET = withAuth(handler, { requiredRole: "admin" });
