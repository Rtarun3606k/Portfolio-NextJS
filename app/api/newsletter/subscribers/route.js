import { getDatabases } from "@/_utils/Mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  sendNewsletterDigest,
  sendNewsletterToAllSubscribers,
  getNewsletterPreview,
  sendTestNewsletter,
} from "@/_utils/newsLetterSender";

// GET - Fetch all subscribers
export async function GET(req) {
  try {
    console.log("Fetching all subscribers");

    const { subscriptionsCollection } = await getDatabases();

    // Get URL search params for filtering and pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const isActive = searchParams.get("isActive");

    // Build query filter
    const filter = {};
    if (isActive !== null && isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await subscriptionsCollection.countDocuments(filter);

    // Fetch subscribers with pagination and sorting
    const subscribers = await subscriptionsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json(
      {
        success: true,
        data: {
          subscribers,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNextPage,
            hasPrevPage,
            limit,
          },
        },
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch subscribers",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Handle newsletter operations
export async function POST(req) {
  try {
    const body = await req.json();
    const { action, userId, email, testEmail } = body;

    console.log(`Newsletter POST request - Action: ${action}`);

    switch (action) {
      case "send_to_user":
        return await sendNewsletterToUser(userId);

      case "send_to_all":
        return await sendNewsletterToAll();

      case "preview":
        return await getPreview();

      case "test":
        return await sendTest(testEmail);

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action specified",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in newsletter POST:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to send newsletter to specific user
async function sendNewsletterToUser(userId) {
  try {
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid user ID format",
        },
        { status: 400 }
      );
    }

    const { subscriptionsCollection } = await getDatabases();

    // Find user by ID
    const user = await subscriptionsCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    if (user.isActive === false) {
      return NextResponse.json(
        {
          success: false,
          error: "User has unsubscribed",
        },
        { status: 400 }
      );
    }

    const { email, name } = user;

    // Send newsletter digest
    console.log(`Sending newsletter to user: ${email}`);
    const emailResult = await sendNewsletterDigest(email, name || email);

    if (emailResult.success) {
      // Update user record with last newsletter sent date
      await subscriptionsCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            lastNewsletterSent: new Date(),
            newslettersSent: (user.newslettersSent || 0) + 1,
          },
        }
      );

      return NextResponse.json({
        success: true,
        message: "Newsletter sent successfully",
        data: {
          email: email,
          messageId: emailResult.messageId,
          sentAt: new Date().toISOString(),
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send newsletter",
          details: emailResult.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending newsletter to user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send newsletter",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to send newsletter to all subscribers
async function sendNewsletterToAll() {
  try {
    console.log("Starting bulk newsletter sending");

    const result = await sendNewsletterToAllSubscribers();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Bulk newsletter sending completed",
        data: {
          sent: result.sent,
          failed: result.failed,
          totalSubscribers: result.totalSubscribers,
          errors: result.errors,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send newsletters",
          details: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in bulk newsletter sending:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send newsletters",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to get newsletter preview
async function getPreview() {
  try {
    console.log("Generating newsletter preview");

    const previewResult = await getNewsletterPreview();

    if (previewResult.success) {
      return NextResponse.json({
        success: true,
        message: "Newsletter preview generated",
        data: previewResult.preview,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate preview",
          details: previewResult.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating preview:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate preview",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to send test newsletter
async function sendTest(testEmail) {
  try {
    if (!testEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Test email address is required",
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email address format",
        },
        { status: 400 }
      );
    }

    console.log(`Sending test newsletter to: ${testEmail}`);

    const testResult = await sendTestNewsletter(testEmail);

    if (testResult.success) {
      return NextResponse.json({
        success: true,
        message: "Test newsletter sent successfully",
        data: {
          email: testEmail,
          messageId: testResult.messageId,
          sentAt: new Date().toISOString(),
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send test newsletter",
          details: testResult.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending test newsletter:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test newsletter",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update subscriber status
export async function PUT(req) {
  try {
    const body = await req.json();
    const { userId, isActive } = body;

    if (!userId || typeof isActive !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "User ID and isActive status are required",
        },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid user ID format",
        },
        { status: 400 }
      );
    }

    const { subscriptionsCollection } = await getDatabases();

    const updateResult = await subscriptionsCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          isActive: isActive,
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User subscription ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      data: {
        userId,
        isActive,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating subscriber status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update subscriber status",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove subscriber
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid user ID format",
        },
        { status: 400 }
      );
    }

    const { subscriptionsCollection } = await getDatabases();

    const deleteResult = await subscriptionsCollection.deleteOne({
      _id: new ObjectId(userId),
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscriber removed successfully",
      data: {
        userId,
        deletedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete subscriber",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
