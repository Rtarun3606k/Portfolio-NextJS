import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Get environment variables
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB || "portfolio";

// MongoDB Client
const client = new MongoClient(uri);

// GET all LinkedIn posts
export async function GET(request) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("linkedin");

    const linkedinPosts = await collection.find({}).toArray();

    return NextResponse.json(linkedinPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching LinkedIn posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch LinkedIn posts" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST a new LinkedIn post
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.image || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Add created date
    const linkedinPost = {
      ...body,
      createdAt: new Date(),
    };

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("linkedin");

    const result = await collection.insertOne(linkedinPost);

    return NextResponse.json(
      {
        message: "LinkedIn post created successfully",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating LinkedIn post:", error);
    return NextResponse.json(
      { error: "Failed to create LinkedIn post" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
