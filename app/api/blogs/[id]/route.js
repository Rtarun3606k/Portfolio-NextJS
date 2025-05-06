import { getDatabases } from "@/utils/Mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { blogsCollection } = await getDatabases();
    const id = params.id;

    // Check if ID is valid ObjectId
    if (!ObjectId.isValid(id)) {
      console.error("Invalid blog ID:", id);
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    // Fetch the blog post by ID
    const blogPost = await blogsCollection.findOne({ _id: new ObjectId(id) });
    console.log("Blog post:", blogPost);

    if (!blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blogPost, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { blogsCollection } = await getDatabases();
    const id = params.id;

    // Check if ID is valid ObjectId
    if (!ObjectId.isValid(id)) {
      console.error("Invalid blog ID:", id);
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    // Delete the blog post by ID
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Blog post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { blogsCollection } = await getDatabases();
    const id = params.id;

    // Check if ID is valid ObjectId
    if (!ObjectId.isValid(id)) {
      console.error("Invalid blog ID:", id);
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const data = await request.json();

    // Update the blog post by ID
    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Blog post not found or no changes made" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Blog post updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}
