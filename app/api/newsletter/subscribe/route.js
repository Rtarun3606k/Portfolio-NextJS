import { getDatabases } from "../../../../_utils/Mongodb";

export async function POST(request) {
  const { email } = await request.json();

  const { subscriptionsCollection } = await getDatabases();

  const existingSubscription = await subscriptionsCollection.findOne({ email });

  if (existingSubscription) {
    return new Response(JSON.stringify({ message: "Already subscribed" }), {
      status: 400,
    });
  }

  const result = await subscriptionsCollection.insertOne({
    email,
    createdAt: new Date(),
  });

  if (result.acknowledged) {
    return new Response(
      JSON.stringify({ message: "Subscribed successfully" }),
      {
        status: 200,
      }
    );
  } else {
    return new Response(JSON.stringify({ message: "Subscription failed" }), {
      status: 500,
    });
  }
}
