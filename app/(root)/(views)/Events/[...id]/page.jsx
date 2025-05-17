// app/Events/[id]/page.jsx

import { EventIDFetch } from "@/_utils/DataFetching";
import Markdown from "@/components/Markdown";
import dynamic from "next/dynamic";
import React from "react";

export default async function Page({ params }) {
  const idn = params.id; // ✅ No need to await
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const result = await EventIDFetch(id);

  if (result?.error) {
    return <div>Error: {result.error}</div>;
  }

  if (!result?.event) {
    return <div>No event found</div>;
  }

  const { event } = result;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{event.name}</h1>
          <div className="text-sm text-gray-500">
            Hosted by{" "}
            <span className="font-medium text-blue-600">{event.host}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <p>
              <strong>Date:</strong> {event.date}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Category:</strong> {event.category}
            </p>
            <p>
              <strong>Skills:</strong> {event.skills.join(", ")}
            </p>
          </div>
          <a
            href={event.registerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Register Now
          </a>
          <div className="pt-6">
            <Markdown source={event.description} />
          </div>
        </div>
      </div>
    </section>
  );
}
