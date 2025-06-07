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
