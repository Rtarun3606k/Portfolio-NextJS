import { NextResponse } from "next/server";
import { getDatabases } from "@/_utils/Mongodb";
import { withAuth } from "@/_utils/auth";
import { uploadToAzure } from "../Components/Azure";

// Helper for multipart form data
async function parseMultipartForm(request) {
  try {
    const formData = await request.formData();
    const data = {};
    let logoFile = null;

    // Extract form fields
    for (const [key, value] of formData.entries()) {
      if (key === "logo" && value.size > 0) {
        logoFile = value;
      } else if (key === "responsibilities") {
        data[key] = JSON.parse(value);
      } else if (key === "isRemote" || key === "isCurrent") {
        data[key] = value === "true";
      } else {
        data[key] = value;
      }
    }

    return { data, logoFile };
  } catch (error) {
    console.error("Error parsing multipart form:", error);
    throw error;
  }
}

// GET all positions
async function getHandler() {
  try {
    const { positionsCollection } = await getDatabases();

    // Get all positions and sort by startDate in descending order (newest first)
    const positions = await positionsCollection
      .find({})
      .sort({ startDate: -1 })
      .toArray();

    return NextResponse.json({ positions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      { error: "Failed to fetch positions" },
      { status: 500 }
    );
  }
}

// POST a new position
async function postHandler(request) {
  try {
    const { positionsCollection } = await getDatabases();

    // For multipart form data with logo upload
    const { data, logoFile } = await parseMultipartForm(request);
    console.log("Parsed form data:", data);
    console.log(
      "Parsed logo file:",
      logoFile ? `${logoFile.name} (${logoFile.size} bytes)` : "None"
    );

    // Validate required fields
    if (
      !data.companyName ||
      !data.jobTitle ||
      !data.employmentType ||
      !data.startDate ||
      !data.location ||
      !data.responsibilities ||
      data.responsibilities.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Position data structure
    const positionData = {
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      employmentType: data.employmentType,
      startDate: data.startDate,
      endDate: data.isCurrent ? null : data.endDate,
      isCurrent: data.isCurrent,
      location: data.location,
      isRemote: data.isRemote,
      responsibilities: data.responsibilities,
      logoUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Upload logo to Azure if provided
    if (logoFile) {
      try {
        console.log("Uploading position logo to Azure:", logoFile.name);

        // Use the specific container for position logos
        const uploadResult = await uploadToAzure(
          logoFile,
          logoFile.name,
          "positions"
        );

        if (uploadResult.success) {
          positionData.logoUrl = uploadResult.url;
          console.log("Position logo uploaded successfully:", uploadResult.url);
        } else {
          console.error("Azure upload failed:", uploadResult.error);
          return NextResponse.json(
            { error: "Failed to upload logo" },
            { status: 500 }
          );
        }
      } catch (uploadError) {
        console.error("Error uploading position logo:", uploadError);
        return NextResponse.json(
          { error: "Error uploading logo: " + uploadError.message },
          { status: 500 }
        );
      }
    }

    // Insert into database
    const result = await positionsCollection.insertOne(positionData);

    return NextResponse.json(
      {
        message: "Position created successfully",
        positionId: result.insertedId,
        position: positionData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating position:", error);
    return NextResponse.json(
      { error: "Failed to create position" },
      { status: 500 }
    );
  }
}

// Export the handlers with authentication middleware
export const GET = getHandler; // Anyone can view positions
export const POST = withAuth(postHandler); // Only authenticated users can create positions
