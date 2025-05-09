import { NextResponse } from "next/server";
import { getDatabases } from "@/_utils/Mongodb";
import { withAuth } from "@/_utils/auth";
import { ObjectId } from "mongodb";
import { deleteFromAzure, getBlobNameFromUrl } from "../../Components/Azure";

// Get a single event by ID
async function getHandler(request, { params }) {
  try {
    const { eventsCollection } = await getDatabases();
    const id = params.id;

    // Check if ID is valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// Delete an event by ID
async function deleteHandler(request, { params }) {
  try {
    const { eventsCollection } = await getDatabases();
    const id = params.id;

    // Check if ID is valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    // Find the event first to get the image URL for deletion from Azure
    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Delete the event from the database
    const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Failed to delete event" },
        { status: 500 }
      );
    }

    // If the event has an image, delete it from Azure Blob Storage
    if (event.image) {
      try {
        const blobName = getBlobNameFromUrl(event.image);
        if (blobName) {
          console.log("Deleting image from Azure:", blobName);
          // Pass the "events" container name to ensure we're deleting from the correct container
          await deleteFromAzure(blobName, "events");
        }
      } catch (imageError) {
        console.error("Error deleting image from Azure:", imageError);
        // Continue with success response even if image deletion fails
      }
    }

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

// Update an event by ID
async function putHandler(request, { params }) {
  try {
    const { eventsCollection } = await getDatabases();
    const id = params.id;
    const eventData = await request.json();

    // Check if ID is valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    // Validate required fields
    if (
      !eventData.name ||
      !eventData.host ||
      !eventData.date ||
      !eventData.location ||
      !eventData.skills ||
      !Array.isArray(eventData.skills) ||
      !eventData.category
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Add update timestamp
    eventData.updatedAt = new Date().toISOString();

    // Update the event
    const result = await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: eventData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Event updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// Export handlers with authentication middleware
export const GET = getHandler;
export const DELETE = withAuth(deleteHandler); // Only authenticated users can delete
export const PUT = withAuth(putHandler); // Only authenticated users can update
