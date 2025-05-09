import { NextResponse } from "next/server";
import { getDatabases } from "@/_utils/Mongodb";
import { withAuth } from "@/_utils/auth";
import { ObjectId } from "mongodb";
import { deleteFromAzure, getBlobNameFromUrl } from "../../Components/Azure";

// Get a single LinkedIn post by ID
async function getHandler(request, { params }) {
  try {
    const { linkedinCollection } = await getDatabases();
    const id = params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid LinkedIn post ID" },
        { status: 400 }
      );
    }

    // Find the post
    const post = await linkedinCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return NextResponse.json(
        { error: "LinkedIn post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching LinkedIn post:", error);
    return NextResponse.json(
      { error: "Failed to fetch LinkedIn post" },
      { status: 500 }
    );
  }
}

// Delete a LinkedIn post by ID
async function deleteHandler(request, { params }) {
  try {
    const { linkedinCollection } = await getDatabases();
    const id = params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid LinkedIn post ID" },
        { status: 400 }
      );
    }

    // Find the post first to get the image URL for Azure deletion
    const post = await linkedinCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return NextResponse.json(
        { error: "LinkedIn post not found" },
        { status: 404 }
      );
    }

    // Delete the post from MongoDB
    const result = await linkedinCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Failed to delete LinkedIn post" },
        { status: 500 }
      );
    }

    // Delete the image from Azure Blob Storage if it exists
    if (post.image) {
      try {
        const blobName = getBlobNameFromUrl(post.image);
        if (blobName) {
          console.log("Deleting LinkedIn post image from Azure:", blobName);
          // Use the specific "linkedinevents" container for LinkedIn post images
          await deleteFromAzure(blobName, "linkedinevents");
          console.log("LinkedIn post image deleted successfully");
        }
      } catch (imageError) {
        console.error(
          "Error deleting LinkedIn post image from Azure:",
          imageError
        );
        // Continue with success response even if image deletion fails
      }
    }

    return NextResponse.json(
      { message: "LinkedIn post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting LinkedIn post:", error);
    return NextResponse.json(
      { error: "Failed to delete LinkedIn post" },
      { status: 500 }
    );
  }
}

// Update a LinkedIn post by ID
async function putHandler(request, { params }) {
  try {
    const { linkedinCollection } = await getDatabases();
    const id = params.id;
    const updateData = await request.json();

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid LinkedIn post ID" },
        { status: 400 }
      );
    }

    // Basic validation of update data
    if (!updateData.title || !updateData.description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString();

    // Update the post
    const result = await linkedinCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "LinkedIn post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "LinkedIn post updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating LinkedIn post:", error);
    return NextResponse.json(
      { error: "Failed to update LinkedIn post" },
      { status: 500 }
    );
  }
}

// Export handlers with authentication middleware
export const GET = getHandler; // Anyone can get a LinkedIn post
export const DELETE = withAuth(deleteHandler); // Only authenticated users can delete
export const PUT = withAuth(putHandler); // Only authenticated users can update
