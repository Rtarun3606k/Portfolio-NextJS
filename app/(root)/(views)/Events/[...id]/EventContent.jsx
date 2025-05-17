"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/_utils/slugify";
import Markdown from "@/components/Markdown";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const EventContent = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState({});
  const [suggestedEvents, setSuggestedEvents] = useState([]);

  // Extract the event ID from the URL parameters
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;

  const addViews = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}/views`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ views: event.views || 0 }),
      });

      if (!res.ok) {
        console.error("Failed to update views");
      }
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status}`);
        }
        const data = await res.json();
        setEvent(data.event);

        // Set document title on client side for proper browsing history
        if (typeof document !== "undefined") {
          document.title = `${data.event.name} | Tarun Nayaka R`;
        }

        // Check if URL needs to be updated with the proper slug
        const slug = slugify(data.event.name);
        const expectedPath = `/Events/${eventId}/${slug}`;
        const currentPath = window.location.pathname;

        // If we're on just the ID URL without the slug, redirect to the proper URL
        if (
          currentPath === `/Events/${eventId}` ||
          currentPath === `/Events/${eventId}/`
        ) {
          router.replace(expectedPath);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedEvents = async () => {
      try {
        const res = await fetch(`/api/events/suggested?exclude=${eventId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch suggested events");
        }
        const data = await res.json();
        setSuggestedEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching suggested events:", error);
      }
    };

    if (eventId) {
      fetchEvent();
      fetchSuggestedEvents();
    }
  }, [eventId, router]);

  // Add views after the event is loaded
  useEffect(() => {
    if (event._id) {
      addViews();
    }
  }, [event]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-red-500 text-xl">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          {event.image && (
            <div className="relative w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
              <Image
                src={event.image}
                alt={event.name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
          )}
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold mb-4 text-black font-space-grotesk"
        >
          {event.name}
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center text-gray-600 mb-6"
        >
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
        </motion.div>

        {event.registerLink && (
          <motion.div variants={itemVariants} className="mb-6">
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
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="prose prose-lg max-w-none mt-6"
        >
          <Markdown source={event.description} />
        </motion.div>

        {suggestedEvents.length > 0 && (
          <motion.div variants={itemVariants} className="mt-12">
            <h3 className="text-2xl font-bold mb-4">
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
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mt-8 mb-4">
          <Link
            href="/Events"
            className="inline-flex items-center text-[#6A0DAD] hover:underline"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to All Events
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default EventContent;
