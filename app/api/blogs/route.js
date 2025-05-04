import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Get environment variables
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB || "portfolio";

// MongoDB Client
const client = new MongoClient(uri);

// GET all blog posts
export async function GET(request) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("blogs");

    const blogs = await collection.find({}).toArray();

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST a new blog post
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.image || !body.author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Add created date
    const blogPost = {
      ...body,
      createdAt: new Date(),
      views: 0, // Initialize with zero views
    };

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("blogs");

    const result = await collection.insertOne(blogPost);

    return NextResponse.json(
      {
        message: "Blog post created successfully",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
