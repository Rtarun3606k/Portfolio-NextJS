import { NextResponse } from "next/server";
import { getDatabases } from "@/_utils/Mongodb";
import { withAuth } from "@/_utils/auth";

// Handler function for creating a new service
async function postHandler(request) {
  try {
    const { servicesCollection } = await getDatabases();
    const data = await request.json();

    // Validate required fields
    if (
      !data.title ||
      !data.description ||
      !data.price ||
      !data.timeframe ||
      !data.category
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the service document
    const serviceData = {
      title: data.title,
      description: data.description,
      price: data.price,
      timeframe: data.timeframe,
      category: data.category,
      iconPath: data.iconPath || "", // Optional
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await servicesCollection.insertOne(serviceData);

    // Return success response
    return NextResponse.json(
      {
        message: "Service created successfully",
        serviceId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

// Handler function for getting all services
async function getHandler() {
  try {
    const { servicesCollection } = await getDatabases();

    // Get all services
    const services = await servicesCollection.find({}).toArray();

    // Return services
    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// Export the handlers with authentication middleware
// Only authenticated users can create services
export const POST = withAuth(postHandler);

// Anyone can view services
export const GET = getHandler;
