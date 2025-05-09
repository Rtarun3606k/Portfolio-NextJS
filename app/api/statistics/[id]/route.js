import { NextResponse } from "next/server";
import { getDatabases } from "@/_utils/Mongodb";
import { withAuth } from "@/_utils/auth";
import { ObjectId } from "mongodb";

// Handler function for deleting a statistic
async function deleteHandler(request, { params }) {
  try {
    const id = params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid statistic ID" },
        { status: 400 }
      );
    }

    const { statsCollection } = await getDatabases();

    // Delete the statistic
    const result = await statsCollection.deleteOne({ _id: new ObjectId(id) });

    // Check if the statistic was found and deleted
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Statistic not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: "Statistic deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting statistic:", error);
    return NextResponse.json(
      { error: "Failed to delete statistic" },
      { status: 500 }
    );
  }
}

// Handler for getting a single statistic
async function getHandler(request, { params }) {
  try {
    const id = params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid statistic ID" },
        { status: 400 }
      );
    }

    const { statsCollection } = await getDatabases();

    // Find the statistic
    const statistic = await statsCollection.findOne({ _id: new ObjectId(id) });

    // Check if the statistic exists
    if (!statistic) {
      return NextResponse.json(
        { error: "Statistic not found" },
        { status: 404 }
      );
    }

    // Return the statistic
    return NextResponse.json({ statistic }, { status: 200 });
  } catch (error) {
    console.error("Error fetching statistic:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistic" },
      { status: 500 }
    );
  }
}

// Export the delete handler with authentication middleware
// Only authenticated users can delete statistics
export const DELETE = withAuth(deleteHandler);

// Anyone can get a single statistic
export const GET = getHandler;
