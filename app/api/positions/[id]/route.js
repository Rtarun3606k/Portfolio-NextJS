import { NextResponse } from "next/server";
import { getDatabases } from "@/_utils/Mongodb";
import { withAuth } from "@/_utils/auth";
import { ObjectId } from "mongodb";
import { deleteFromAzure, getBlobNameFromUrl } from "../../Components/Azure";

// Get a single position by ID
async function getHandler(request, { params }) {
  try {
    const { positionsCollection } = await getDatabases();
    const id = params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid position ID" },
        { status: 400 }
      );
    }

    // Find the position
    const position = await positionsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!position) {
      return NextResponse.json(
        { error: "Position not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ position }, { status: 200 });
  } catch (error) {
    console.error("Error fetching position:", error);
    return NextResponse.json(
      { error: "Failed to fetch position" },
      { status: 500 }
    );
  }
}

// Delete a position by ID
async function deleteHandler(request, { params }) {
  try {
    const { positionsCollection } = await getDatabases();
    const id = params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid position ID" },
        { status: 400 }
      );
    }

    // Find the position first to get the logo URL for Azure deletion
    const position = await positionsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!position) {
      return NextResponse.json(
        { error: "Position not found" },
        { status: 404 }
      );
    }

    // Delete the position from MongoDB
    const result = await positionsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Failed to delete position" },
        { status: 500 }
      );
    }

    // Delete the logo from Azure Blob Storage if it exists
    if (position.logoUrl) {
      try {
        const blobName = getBlobNameFromUrl(position.logoUrl);
        if (blobName) {
          console.log("Deleting position logo from Azure:", blobName);
          // Use the specific "positions" container for position logos
          await deleteFromAzure(blobName, "positions");
          console.log("Position logo deleted successfully");
        }
      } catch (imageError) {
        console.error("Error deleting position logo from Azure:", imageError);
        // Continue with success response even if image deletion fails
      }
    }

    return NextResponse.json(
      { message: "Position deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting position:", error);
    return NextResponse.json(
      { error: "Failed to delete position" },
      { status: 500 }
    );
  }
}

// Update a position by ID
async function putHandler(request, { params }) {
  try {
    const { positionsCollection } = await getDatabases();
    const id = params.id;
    const formData = await request.formData();
    const updateData = {};
    let logoFile = null;

    // Process form data
    for (const [key, value] of formData.entries()) {
      if (key === "logo" && value instanceof Blob && value.size > 0) {
        logoFile = value;
      } else if (key === "responsibilities") {
        updateData[key] = JSON.parse(value);
      } else if (key === "isRemote" || key === "isCurrent") {
        updateData[key] = value === "true";
      } else {
        updateData[key] = value;
      }
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid position ID" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !updateData.companyName ||
      !updateData.jobTitle ||
      !updateData.employmentType ||
      !updateData.startDate ||
      !updateData.location ||
      !updateData.responsibilities ||
      updateData.responsibilities.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Handle end date based on isCurrent
    if (updateData.isCurrent) {
      updateData.endDate = null;
    } else if (!updateData.endDate) {
      return NextResponse.json(
        { error: "End date is required for non-current positions" },
        { status: 400 }
      );
    }

    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString();

    // Get the current position to check for existing logo
    const currentPosition = await positionsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!currentPosition) {
      return NextResponse.json(
        { error: "Position not found" },
        { status: 404 }
      );
    }

    // Upload logo to Azure if provided
    if (logoFile) {
      try {
        console.log("Uploading new position logo to Azure:", logoFile.name);

        // Use the specific container for position logos
        const uploadResult = await uploadToAzure(
          logoFile,
          logoFile.name,
          "positions"
        );

        if (uploadResult.success) {
          updateData.logoUrl = uploadResult.url;
          console.log("Position logo uploaded successfully:", uploadResult.url);

          // Delete the old logo if it exists
          if (currentPosition.logoUrl) {
            try {
              const blobName = getBlobNameFromUrl(currentPosition.logoUrl);
              if (blobName) {
                console.log("Deleting old position logo from Azure:", blobName);
                await deleteFromAzure(blobName, "positions");
              }
            } catch (error) {
              console.error("Error deleting old position logo:", error);
              // Continue even if deletion of old logo fails
            }
          }
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
    } else {
      // Keep the existing logo URL if no new logo is provided
      updateData.logoUrl = currentPosition.logoUrl;
    }

    // Update the position
    const result = await positionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Position not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Position updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating position:", error);
    return NextResponse.json(
      { error: "Failed to update position" },
      { status: 500 }
    );
  }
}

// Export handlers with authentication middleware
export const GET = getHandler; // Anyone can get a position
export const DELETE = withAuth(deleteHandler); // Only authenticated users can delete
export const PUT = withAuth(putHandler); // Only authenticated users can update
