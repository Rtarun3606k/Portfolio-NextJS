import { NextResponse } from "next/server";
import { getDatabases } from "@/_utils/Mongodb";
import { withAuth } from "@/_utils/auth";
import { uploadToAzure } from "../Components/Azure";

// Helper for multipart form data
async function parseMultipartForm(request) {
  try {
    const formData = await request.formData();
    console.log(
      "Form data entries:",
      [...formData.entries()].map(([k, v]) =>
        k === "image" ? `${k}: [File]` : `${k}: ${v}`
      )
    );

    // Extract form fields
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      githubUrl: formData.get("githubUrl"),
      liveUrl: formData.get("liveUrl"),
      featured: formData.get("featured") === "true",
      tags: JSON.parse(formData.get("tags") || "[]"),
    };

    // Handle image file if present - use "image" field name to match frontend
    const imageFile = formData.get("image");
    console.log(
      "Image file found:",
      imageFile
        ? `${imageFile.name} (${imageFile.size} bytes)`
        : "No image file"
    );

    return { data, imageFile };
  } catch (error) {
    console.error("Error parsing form data:", error);
    throw error;
  }
}

// Handler function for creating a new project
async function postHandler(request) {
  try {
    const { projectsCollection } = await getDatabases();

    // For multipart form data with image upload
    const { data, imageFile } = await parseMultipartForm(request);
    console.log("Parsed form data:", data);
    console.log(
      "Parsed image file:",
      imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : "None"
    );

    // Validate required fields
    if (
      !data.title ||
      !data.description ||
      !data.githubUrl ||
      data.tags.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Project data structure
    const projectData = {
      title: data.title,
      description: data.description,
      githubUrl: data.githubUrl,
      liveUrl: data.liveUrl || "",
      featured: data.featured,
      tags: data.tags,
      imageUrl: null, // Will be updated if there's an image
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      try {
        console.log("Uploading image to Azure:", imageFile.name);
        const uploadResult = await uploadToAzure(imageFile, imageFile.name);
        console.log("Azure upload result:", uploadResult);

        if (uploadResult.success) {
          // Set the image URL from Azure
          projectData.imageUrl = uploadResult.url;
          console.log("Successfully set imageUrl:", uploadResult.url);
        } else {
          console.error(
            "Azure upload failed but continuing with null image URL:",
            uploadResult.error
          );
          // Don't return early, just log the error and continue with null imageUrl
        }
      } catch (uploadError) {
        console.error("Error during image upload:", uploadError);
        // Don't return early, just log the error and continue with null imageUrl
      }
    }

    // Insert into database regardless of image upload success
    console.log("Inserting project with data:", JSON.stringify(projectData));
    const result = await projectsCollection.insertOne(projectData);

    // Return success response
    return NextResponse.json(
      {
        message: "Project created successfully",
        projectId: result.insertedId,
        imageUrl: projectData.imageUrl, // Return the image URL in the response
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// Handler function for getting all projects
async function getHandler() {
  try {
    const { projectsCollection } = await getDatabases();

    // Get all projects
    const projects = await projectsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Return projects
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// Export the handlers with authentication middleware
// Only authenticated users can create projects
export const POST = withAuth(postHandler);

// Anyone can view projects
export const GET = getHandler;
