import { sendEmailTO } from "@/_utils/emailsender";
import { getDatabases } from "@/_utils/Mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    console.log("Received contact message");

    // Validate required fields
    if (
      !formData.get("firstName") ||
      !formData.get("lastName") ||
      !formData.get("email") ||
      !formData.get("description")
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert FormData to a plain object for MongoDB
    const contactData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      type: formData.get("type"),
      description: formData.get("description"),
      serviceId: formData.get("serviceId") || null,
      appointmentDate: formData.get("appointmentDate") || null,
      appointmentTime: formData.get("appointmentTime") || null,
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      createdAt: new Date(),
    };

    // console.log("Creating contact message:", contactData);

    const { contactCollection } = await getDatabases();

    const result = await contactCollection.insertOne(contactData);

    // if (formData.get("serviceId") !== null) {
    await sendEmailTO(contactData);
    // }

    return NextResponse.json(
      {
        message: "Contact message sent successfully",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      { error: "Failed to send contact message" },
      { status: 500 }
    );
  } finally {
    console.log("Contact message processing completed");
  }
}
