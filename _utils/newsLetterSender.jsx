// Add these imports to your existing file
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  sendNewsletterDigest,
  fetchRecentBlogs,
  fetchUpcomingEvents,
} from "./emailsender";

// Function to send newsletter to a specific user by ID
async function PostSendNewsLetter(req, { params }) {
  try {
    const id = params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Get database connection
    const { subscriptionsCollection } = await getDatabases();

    // Find user by ID
    const user = await subscriptionsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { email, name } = user;

    // Send newsletter digest
    console.log(`Sending newsletter to user: ${email}`);
    const emailResult = await sendNewsletterDigest(email, name || email);

    if (emailResult.success) {
      // Update user record with last newsletter sent date
      await subscriptionsCollection.updateOne(
        { _id: new ObjectId(id) },
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
        email: email,
        messageId: emailResult.messageId,
      });
    } else {
      return NextResponse.json(
        {
          error: "Failed to send newsletter",
          details: emailResult.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in PostSendNewsLetter:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Function to send newsletter to all subscribers
async function sendNewsletterToAllSubscribers() {
  try {
    console.log("Starting bulk newsletter sending process");

    const { subscriptionsCollection } = await getDatabases();

    // Get all active subscribers
    const subscribers = await subscriptionsCollection
      .find({ isActive: { $ne: false } })
      .toArray();

    if (subscribers.length === 0) {
      return {
        success: true,
        message: "No active subscribers found",
        sent: 0,
        failed: 0,
      };
    }

    // Pre-fetch content to avoid repeated API calls
    console.log("Pre-fetching recent blogs and events...");
    const [recentBlogs, upcomingEvents] = await Promise.all([
      fetchRecentBlogs(3),
      fetchUpcomingEvents(3),
    ]);

    const results = {
      sent: 0,
      failed: 0,
      errors: [],
    };

    // Send emails in batches to avoid overwhelming the SMTP server
    const batchSize = 10;
    const batches = [];

    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize));
    }

    console.log(
      `Sending newsletters to ${subscribers.length} subscribers in ${batches.length} batches`
    );

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(
        `Processing batch ${batchIndex + 1}/${batches.length} (${
          batch.length
        } emails)`
      );

      // Process batch in parallel
      const batchPromises = batch.map(async (subscriber) => {
        try {
          const emailResult = await sendNewsletterDigest(
            subscriber.email,
            subscriber.name || subscriber.email
          );

          if (emailResult.success) {
            // Update subscriber record
            await subscriptionsCollection.updateOne(
              { _id: subscriber._id },
              {
                $set: {
                  lastNewsletterSent: new Date(),
                  newslettersSent: (subscriber.newslettersSent || 0) + 1,
                },
              }
            );
            results.sent++;
            return { success: true, email: subscriber.email };
          } else {
            results.failed++;
            results.errors.push({
              email: subscriber.email,
              error: emailResult.error.message,
            });
            return {
              success: false,
              email: subscriber.email,
              error: emailResult.error,
            };
          }
        } catch (error) {
          console.error(
            `Error sending newsletter to ${subscriber.email}:`,
            error
          );
          results.failed++;
          results.errors.push({
            email: subscriber.email,
            error: error.message,
          });
          return {
            success: false,
            email: subscriber.email,
            error: error.message,
          };
        }
      });

      // Wait for batch to complete
      await Promise.all(batchPromises);

      // Add delay between batches to respect rate limits
      if (batchIndex < batches.length - 1) {
        console.log("Waiting 2 seconds before next batch...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log(
      `Newsletter sending completed. Sent: ${results.sent}, Failed: ${results.failed}`
    );

    return {
      success: true,
      message: `Newsletter sending completed`,
      sent: results.sent,
      failed: results.failed,
      totalSubscribers: subscribers.length,
      errors: results.errors,
    };
  } catch (error) {
    console.error("Error in sendNewsletterToAllSubscribers:", error);
    return {
      success: false,
      error: error.message,
      sent: 0,
      failed: 0,
    };
  }
}

// Function to get newsletter content preview (for admin dashboard)
async function getNewsletterPreview() {
  try {
    console.log("Generating newsletter preview");

    const [recentBlogs, upcomingEvents] = await Promise.all([
      fetchRecentBlogs(3),
      fetchUpcomingEvents(3),
    ]);

    return {
      success: true,
      preview: {
        blogs: recentBlogs.map((blog) => ({
          id: blog._id,
          title: blog.title,
          author: blog.author || "Tarun Nayaka R",
          createdAt: blog.createdAt,
          categories: blog.categories || [],
          excerpt: blog.content
            ? blog.content
                .replace(/[#_*`~>\-\[\]\(\)!\n]/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 120) + "..."
            : "Click to read the full article.",
        })),
        events: upcomingEvents.map((event) => ({
          id: event._id,
          name: event.name,
          host: event.host || "Tarun Nayaka R",
          date: event.date,
          location: event.location,
          skills: event.skills || [],
          description: event.description
            ? event.description
                .replace(/[#_*`~>\-\[\]\(\)!\n]/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 100) + "..."
            : "Join us for this exciting event!",
        })),
        contentSummary: {
          totalBlogs: recentBlogs.length,
          totalEvents: upcomingEvents.length,
          hasContent: recentBlogs.length > 0 || upcomingEvents.length > 0,
        },
      },
    };
  } catch (error) {
    console.error("Error generating newsletter preview:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Function to send test newsletter to admin
async function sendTestNewsletter(adminEmail) {
  try {
    console.log(`Sending test newsletter to admin: ${adminEmail}`);

    const emailResult = await sendNewsletterDigest(adminEmail, "Admin Test");

    if (emailResult.success) {
      return {
        success: true,
        message: "Test newsletter sent successfully",
        messageId: emailResult.messageId,
      };
    } else {
      return {
        success: false,
        error: emailResult.error.message,
      };
    }
  } catch (error) {
    console.error("Error sending test newsletter:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Export all functions
export {
  PostSendNewsLetter,
  sendNewsletterToAllSubscribers,
  getNewsletterPreview,
  sendTestNewsletter,
  sendNewsletterDigest,
};
