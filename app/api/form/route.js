// Handler for form data submissions
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Check content type to determine how to handle the form data
    const contentType = request.headers.get("content-type");

    // Handle different types of form data
    if (contentType?.includes("multipart/form-data")) {
      // Handle multipart form data (with or without files)
      const formData = await request.formData();
      const formValues = {};

      // Process all form fields
      for (const [key, value] of formData.entries()) {
        // Check if it's a file
        if (value instanceof File) {
          formValues[key] = {
            name: value.name,
            type: value.type,
            size: value.size,
            // Don't include file content in response for this example
          };
        } else {
          // Regular form field
          formValues[key] = value;
        }
      }

      return NextResponse.json(
        {
          success: true,
          message: "Form data with multipart/form-data received successfully",
          data: formValues,
        },
        { status: 200 }
      );
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      // Handle URL-encoded form data
      const formData = await request.formData();
      const formValues = Object.fromEntries(formData.entries());

      return NextResponse.json(
        {
          success: true,
          message: "URL-encoded form data received successfully",
          data: formValues,
        },
        { status: 200 }
      );
    } else {
      // Default to JSON
      const jsonData = await request.json();

      return NextResponse.json(
        {
          success: true,
          message: "JSON data received successfully",
          data: jsonData,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing form data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process form data",
        error: error.message,
      },
      { status: 400 }
    );
  }
}
