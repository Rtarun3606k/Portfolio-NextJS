import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { getDatabases } from "@/_utils/Mongodb";
// import { auth } from "../../../auth";
import { auth } from "@/app/auth";

// Get environment variables
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB || "portfolio";

// MongoDB Client
const client = new MongoClient(uri);

// GET all blog posts
export async function GET(request) {
  try {
    const { blogsCollection } = await getDatabases();

    const blogs = await blogsCollection
      .find({}, { projection: { content: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ blogs: blogs }, { status: 200 });
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
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Creating blog post:", body);

    // Add created date
    const blogPost = {
      ...body,
      createdAt: new Date(),
      views: 0, // Initialize with zero views
    };

    const { blogsCollection } = await getDatabases();

    const result = await blogsCollection.insertOne(blogPost);

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
