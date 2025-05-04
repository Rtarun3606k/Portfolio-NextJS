import { NextResponse } from "next/server";
import { getDatabases } from "@/utils/Mongodb";
import { withAuth } from "@/utils/auth";

// Helper for multipart form data
async function parseMultipartForm(request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      githubUrl: formData.get("githubUrl"),
      liveUrl: formData.get("liveUrl"),
      featured: formData.get("featured") === "true",
      tags: JSON.parse(formData.get("tags") || "[]"),
    };

    // Handle image file if present
    const imageFile = formData.get("projectImage");

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
      // TODO: In a real implementation, you'd upload this to a blob storage service
      // For now, we'll simulate it with a placeholder URL
      // In production, use Azure Blob Storage or similar service

      // For now, set a placeholder URL (this would be replaced with the actual URL after upload)
      projectData.imageUrl = `/projects/${Date.now()}-${imageFile.name}`;

      // You would also save the image to your storage here
      // const uploadResult = await uploadToStorage(imageFile);
      // projectData.imageUrl = uploadResult.url;
    }

    // Insert into database
    const result = await projectsCollection.insertOne(projectData);

    // Return success response
    return NextResponse.json(
      {
        message: "Project created successfully",
        projectId: result.insertedId,
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
    const projects = await projectsCollection.find({}).toArray();

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
