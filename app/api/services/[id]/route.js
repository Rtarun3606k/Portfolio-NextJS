import { NextResponse } from "next/server";
import { getDatabases } from "@/_utils/Mongodb";
import { withAuth } from "@/_utils/auth";
import { ObjectId } from "mongodb";

// Handler function for deleting a service
async function deleteHandler(request, { params }) {
  try {
    const id = params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const { servicesCollection } = await getDatabases();

    // Delete the service
    const result = await servicesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    // Check if the service was found and deleted
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Return success response
    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}

async function gethandler(request, { params }) {
  try {
    const id = params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const { servicesCollection } = await getDatabases();

    // Find the service by ID
    const service = await servicesCollection.findOne({
      _id: new ObjectId(id),
    });

    // Check if the service was found
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Return the service data
    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// Export the DELETE handler with authentication middleware
// Only authenticated users can delete services
export const DELETE = withAuth(deleteHandler);
export const GET = gethandler;
