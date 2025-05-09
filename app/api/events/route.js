import { NextResponse } from "next/server";
import { getDatabases } from "@/_utils/Mongodb";
import { withAuth } from "@/_utils/auth";

// Handler function for getting all events
async function getHandler() {
  try {
    const { eventsCollection } = await getDatabases();

    // Get all events
    const events = await eventsCollection.find({}).toArray();

    // Return events
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// Handler function for creating a new event
async function postHandler(request) {
  try {
    const { eventsCollection } = await getDatabases();

    // Parse JSON body
    const eventData = await request.json();

    // Validate required fields
    if (
      !eventData.name ||
      !eventData.host ||
      !eventData.date ||
      !eventData.location ||
      !eventData.image ||
      !eventData.skills ||
      !Array.isArray(eventData.skills) ||
      !eventData.category
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Add creation date if not provided
    if (!eventData.createdAt) {
      eventData.createdAt = new Date().toISOString();
    }

    // Insert event into database
    console.log("Inserting event with data:", JSON.stringify(eventData));
    const result = await eventsCollection.insertOne(eventData);

    // Return success response
    return NextResponse.json(
      {
        message: "Event created successfully",
        eventId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

// Export handlers with authentication middleware
export const GET = getHandler; // Anyone can view events
export const POST = withAuth(postHandler); // Only authenticated users can create events
