import { NextResponse } from "next/server";
import { getDatabases } from "@/utils/Mongodb";
import { withAuth } from "@/utils/auth";

// Handler function for creating a new statistic
async function postHandler(request) {
  try {
    const { statsCollection } = await getDatabases();
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.value || !data.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the statistic document
    const statData = {
      title: data.title,
      value: data.value,
      description: data.description,
      icon: data.icon || "📊",
      color: data.color || "from-[#5E60CE]/20 to-[#7209B7]/20",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await statsCollection.insertOne(statData);

    // Return success response
    return NextResponse.json(
      {
        message: "Statistic created successfully",
        statisticId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating statistic:", error);
    return NextResponse.json(
      { error: "Failed to create statistic" },
      { status: 500 }
    );
  }
}

// Handler function for getting all statistics
async function getHandler() {
  try {
    const { statsCollection } = await getDatabases();

    // Get all statistics
    const statistics = await statsCollection.find({}).toArray();

    // Return statistics
    return NextResponse.json({ statistics }, { status: 200 });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

// Export the handlers with authentication middleware
// Only authenticated users can create statistics
export const POST = withAuth(postHandler);

// Anyone can view statistics
export const GET = getHandler;
