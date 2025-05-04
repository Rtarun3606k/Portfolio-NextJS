import { NextResponse } from "next/server";
import { getDatabases } from "@/utils/Mongodb";
import { withAuth } from "@/utils/auth";
import { ObjectId } from "mongodb";

// Handler function for deleting a project
async function deleteHandler(request, { params }) {
  try {
    const id = params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const { projectsCollection } = await getDatabases();

    // Delete the project
    const result = await projectsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    // Check if the project was found and deleted
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // In production, you would also delete the associated image file from storage
    // const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
    // if (project && project.imageUrl) {
    //   await deleteFileFromStorage(project.imageUrl);
    // }

    // Return success response
    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

// Handler for getting a single project
async function getHandler(request, { params }) {
  try {
    const id = params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const { projectsCollection } = await getDatabases();

    // Find the project
    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });

    // Check if the project exists
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Return the project
    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// Export the handlers with authentication middleware
// Only authenticated users can delete projects
export const DELETE = withAuth(deleteHandler);

// Anyone can get a single project
export const GET = getHandler;
