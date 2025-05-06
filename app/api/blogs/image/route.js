import { NextResponse } from "next/server";
import { withAuth } from "@/utils/auth";
import { uploadToAzure } from "../../Components/Azure";

/**
 * Handle file uploads to Azure Blob Storage
 */
async function uploadHandler(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    // Get the container name from the form data, default to "projects" if not provided
    const container = formData.get("container");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Received file for upload:", file.name, "Size:", file.size);
    console.log("Using container:", container || "default");

    // Upload to Azure Blob Storage with the specified container
    const result = await uploadToAzure(file, file.name, "blog");

    if (!result.success) {
      console.error("Upload to Azure failed:", result.error);
      return NextResponse.json(
        { error: "Failed to upload file: " + result.error },
        { status: 500 }
      );
    }

    console.log("Upload successful, URL:", result.url);

    return NextResponse.json(
      {
        success: true,
        url: result.url,
        name: result.name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json(
      { error: "Failed to process upload: " + error.message },
      { status: 500 }
    );
  }
}

// Export the handler with authentication middleware
export const POST = withAuth(uploadHandler);
