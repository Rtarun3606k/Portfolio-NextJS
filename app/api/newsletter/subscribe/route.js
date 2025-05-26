import { getDatabases } from "../../../../_utils/Mongodb";
import { sendWelcomeEmail } from "../../../../_utils/emailsender";

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), {
        status: 400,
      });
    }

    const { subscriptionsCollection } = await getDatabases();

    const existingSubscription = await subscriptionsCollection.findOne({
      email,
    });

    if (existingSubscription) {
      return new Response(JSON.stringify({ message: "Already subscribed" }), {
        status: 400,
      });
    }

    // Insert subscription record
    const result = await subscriptionsCollection.insertOne({
      email,
      name: name || "Subscriber",
      createdAt: new Date(),
      status: "active",
    });

    if (result.acknowledged) {
      // Send welcome email asynchronously
      try {
        console.log("Sending welcome email to:", email);
        const emailResult = await sendWelcomeEmail(
          email,
          name || "New Subscriber"
        );

        if (emailResult.success) {
          console.log("Welcome email sent successfully");
        } else {
          console.error("Failed to send welcome email:", emailResult.error);
        }
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail the subscription if email fails
      }

      return new Response(
        JSON.stringify({
          message: "Subscribed successfully",
          welcomeEmailSent: true,
        }),
        {
          status: 200,
        }
      );
    } else {
      return new Response(JSON.stringify({ message: "Subscription failed" }), {
        status: 500,
      });
    }
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
