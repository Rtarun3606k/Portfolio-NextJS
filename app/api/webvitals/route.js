import { getDatabases } from "@/_utils/Mongodb";
import { NextResponse } from "next/server";

async function postHandler(params) {
  try {
    const data = await params.json();
    const { webVitalsCollection } = await getDatabases();

    const inserted = await webVitalsCollection.insertOne({
      ...data,
      createdAt: new Date(),
    });
    return NextResponse.json({ message: "data recived" }, { status: 200 });
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { error: "Failed to insert data" },
      { status: 500 }
    );
  }
}

async function GETHandler(params) {
  try {
    const { webVitalsCollection } = await getDatabases();
    const data = await webVitalsCollection.find({}).toArray();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export const POST = postHandler;
export const GET = GETHandler;
