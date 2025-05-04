// Examples of all HTTP methods (GET, POST, PUT, PATCH, DELETE)
import { NextResponse } from "next/server";

// GET method - returns a simple hello world message
export async function GET() {
  return NextResponse.json(
    { message: "Hello World from GET!" },
    { status: 200 }
  );
}

// POST method - accepts data and returns it with a confirmation message
export async function POST(request) {
  try {
    const data = await request.json();
    return NextResponse.json(
      {
        message: "Hello World from POST!",
        receivedData: data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process POST request",
        details: error.message,
      },
      { status: 400 }
    );
  }
}

// PUT method - for replacing an entire resource
export async function PUT(request) {
  try {
    const data = await request.json();
    return NextResponse.json(
      {
        message: "Hello World from PUT!",
        updatedData: data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process PUT request",
        details: error.message,
      },
      { status: 400 }
    );
  }
}

// PATCH method - for partial updates to a resource
export async function PATCH(request) {
  try {
    const data = await request.json();
    return NextResponse.json(
      {
        message: "Hello World from PATCH!",
        partialUpdate: data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process PATCH request",
        details: error.message,
      },
      { status: 400 }
    );
  }
}

// DELETE method - for removing a resource
export async function DELETE() {
  return NextResponse.json(
    {
      message: "Hello World from DELETE!",
      resourceDeleted: true,
    },
    { status: 200 }
  );
}
