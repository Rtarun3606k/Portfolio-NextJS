import { NextResponse } from "next/server";
import { getDatabases } from "@/_utils/Mongodb";
import { withAuth } from "@/_utils/auth";
import { uploadToAzure } from "../Components/Azure";

// GET all LinkedIn posts
async function getHandler() {
  try {
    const { linkedinCollection } = await getDatabases();

    // Get all LinkedIn posts
    const posts = await linkedinCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching LinkedIn posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch LinkedIn posts" },
      { status: 500 }
    );
  }
}

// POST a new LinkedIn post
async function postHandler(request) {
  try {
    const { linkedinCollection } = await getDatabases();

    // Parse form data for image upload
    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title");
    const description = formData.get("description");
    const link = formData.get("link");
    const imageFile = formData.get("image");

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Prepare the LinkedIn post data
    const postData = {
      title,
      description,
      link: link || "",
      image: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Upload image to Azure Blob Storage if provided
    if (imageFile && imageFile.size > 0) {
      try {
        console.log("Uploading LinkedIn post image to Azure:", imageFile.name);

        // Use the specific "linkedinevents" container for LinkedIn post images
        const uploadResult = await uploadToAzure(
          imageFile,
          imageFile.name,
          "linkedinevents"
        );

        if (uploadResult.success) {
          // Set the image URL
          postData.image = uploadResult.url;
          console.log(
            "LinkedIn post image uploaded successfully:",
            uploadResult.url
          );
        } else {
          console.error("Azure upload failed:", uploadResult.error);
          return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
          );
        }
      } catch (uploadError) {
        console.error("Error uploading LinkedIn post image:", uploadError);
        return NextResponse.json(
          { error: "Error uploading image: " + uploadError.message },
          { status: 500 }
        );
      }
    }

    // Insert the LinkedIn post into the database
    console.log("Inserting LinkedIn post with data:", JSON.stringify(postData));
    const result = await linkedinCollection.insertOne(postData);

    return NextResponse.json(
      {
        message: "LinkedIn post created successfully",
        postId: result.insertedId,
        post: postData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating LinkedIn post:", error);
    return NextResponse.json(
      { error: "Failed to create LinkedIn post" },
      { status: 500 }
    );
  }
}

// Export the handlers with authentication middleware
export const GET = getHandler; // Anyone can view LinkedIn posts
export const POST = withAuth(postHandler); // Only authenticated users can create posts
