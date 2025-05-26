import { sendNewsletterDigest } from "../../../../_utils/emailsender";

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), {
        status: 400,
      });
    }

    const result = await sendNewsletterDigest(email, name || "Subscriber");

    if (result.success) {
      return new Response(
        JSON.stringify({ message: "Newsletter digest sent successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "Failed to send newsletter digest",
          error: result.error,
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending newsletter digest:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
