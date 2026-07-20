import { NextResponse } from "next/server";
import { sendEmail } from "../../../_utils/emailsender";

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate request body
    const { to, subject, templateName, replacements } = body;

    if (!to || !subject || !templateName || !replacements) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Send templated email
    const result = await sendEmail(to, subject, templateName, replacements);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
