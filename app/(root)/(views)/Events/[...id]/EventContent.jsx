import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/_utils/slugify";
import Script from "next/script";
import { RemoveByAttr } from "@/_utils/ArrayOperation";
import Markdown from "@/components/Markdown";

// Server component for better SEO
const EventContent = async ({ id, params }) => {
  // Extract the event ID from the URL parameters
  // Add console logs for debugging
  console.log("Received params:", params);

  // Extract the event ID from the URL parameters
  const eventId = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;

  if (!eventId) {
    // The function was cut off here. Use Next.js's notFound() function properly
    notFound();
  }

  // Server-side data fetching
  let event;
  let suggestedEvents = [];

  try {
    // Construct the API URL with proper protocol and host
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    // Fetch event data
    const eventRes = await fetch(`${baseUrl}/api/events/${eventId}`, {
      cache: "no-store", // Don't cache to ensure fresh content
      next: { tags: [`event-${eventId}`] }, // For on-demand revalidation
    });

    if (!eventRes.ok) {
      throw new Error(`Failed to fetch event: ${eventRes.status}`);
    }

    const eventData = await eventRes.json();
    event = eventData.event;

    // Fetch suggested events
    const suggestedRes = await fetch(`${baseUrl}/api/events`);

    if (suggestedRes.ok) {
      const suggestedData = await suggestedRes.json();
      suggestedEvents = RemoveByAttr(suggestedData.events, "_id", eventId);
      suggestedEvents = suggestedEvents.slice(0, 6); // Limit to 6 suggested events
    } else {
      console.error("Failed to fetch suggested events:", suggestedRes.status);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    notFound();
  }

  // Generate structured data for this event for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description?.substring(0, 160) || "",
    image: event.image || `${process.env.NEXT_PUBLIC_BASE_URL || ""}/image.png`,
    startDate: event.date || new Date().toISOString(),
    location: {
      "@type": "Place",
      name: event.location || "TBD",
    },
    organizer: {
      "@type": "Organization",
      name: event.host || "Tarun Nayaka R",
      url: process.env.NEXT_PUBLIC_BASE_URL || "",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${
        process.env.NEXT_PUBLIC_BASE_URL || ""
      }/Events/${eventId}/${slugify(event.name)}`,
    },
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      {/* Add JSON-LD structured data for better SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {event.image && (
        <div className="relative w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
          <Image
            src={event.image}
            alt={event.name}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
            priority
          />
        </div>
      )}

      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black font-space-grotesk">
        {event.name}
      </h1>

      <div className="flex flex-wrap items-center text-gray-600 mb-6">
        {event.host && (
          <span className="font-medium mr-3">Hosted by: {event.host}</span>
        )}
        {event.date && <span className="mr-3">Date: {event.date}</span>}
        {event.location && (
          <span className="mr-3">Location: {event.location}</span>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {event.skills &&
            event.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-[#6A0DAD]/10 text-[#6A0DAD] text-xs px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
        </div>
      </div>

      {event.registerLink && (
        <div className="mb-6">
          <a
            href={event.registerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center py-2 px-4 bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED] text-white font-medium rounded-lg transition-transform hover:scale-[1.02] hover:shadow-md"
          >
            Register Now
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </a>
        </div>
      )}

      <div className="prose prose-lg max-w-none mt-6">
        <Markdown source={event.description} />
      </div>

      {suggestedEvents.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4 font-playfair text-[#2c0356a6] text-center">
            More Events You Might Like
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {suggestedEvents.map((suggestedEvent) => (
              <Link
                key={suggestedEvent._id}
                href={`/Events/${suggestedEvent._id}/${slugify(
                  suggestedEvent.name
                )}`}
                className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6A0DAD]/10 flex flex-col h-full"
              >
                <div className="h-40 relative overflow-hidden">
                  {suggestedEvent.image ? (
                    <>
                      <Image
                        src={suggestedEvent.image}
                        alt={suggestedEvent.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-[#6A0DAD]/20 to-[#7C3AED]/20 flex items-center justify-center">
                      <span className="text-[#6A0DAD] opacity-60 text-4xl font-light">
                        {suggestedEvent.name ? suggestedEvent.name[0] : "E"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg text-[#1F1F1F] mb-2 line-clamp-2">
                    {suggestedEvent.name}
                  </h4>
                  <div className="flex items-center text-[#6B7280] text-sm mb-2">
                    <span>{suggestedEvent.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          href="/Events"
          className="inline-flex items-center group relative"
        >
          <span className="text-[#6A0DAD] font-medium text-lg mr-4 group-hover:text-[#7209B7] transition-all">
            Back to Events
          </span>

          {/* Custom SVG circle with arrow */}
          <div className="relative w-12 h-12">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              className="absolute top-0 left-0 transition-transform duration-500 group-hover:rotate-180"
            >
              <circle
                cx="24"
                cy="24"
                r="18"
                fill="none"
                stroke="#6A0DAD"
                strokeWidth="2"
                strokeDasharray="110 30"
                className="group-hover:stroke-[#7209B7] transition-all"
              />
              <path
                d="M20 16L28 24L20 32"
                stroke="#6A0DAD"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:stroke-[#7209B7] transition-all"
              />
            </svg>
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-[#7209B7] transition-opacity"></div>
          </div>
        </Link>
      </div>
    </main>
  );
};

export default EventContent;
