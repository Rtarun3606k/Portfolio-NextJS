import { NextResponse } from "next/server";
import { getDatabases } from "@/_utils/Mongodb";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { userCollection } = await getDatabases();

    // Parse the request body
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Ensure unique email by creating an index (only needs to be done once)
    await userCollection.createIndex({ email: 1 }, { unique: true });

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Create the user object
    const newUser = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || "user", // Default role is "user" unless specified
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the user
    const result = await userCollection.insertOne(newUser);

    // Return success response (without password)
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          ...userWithoutPassword,
          _id: result.insertedId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
