"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserFriends,
  FaTrash,
} from "react-icons/fa";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageErrors, setImageErrors] = useState({});
  const [filter, setFilter] = useState("all"); // "all", "upcoming", "past"

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        console.log("Fetched events:", data);
        setEvents(data.events || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Function to handle image load errors
  const handleImageError = (eventId) => {
    setImageErrors((prev) => ({
      ...prev,
      [eventId]: true,
    }));
  };

  // Filter events based on current filter
  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    return event.category === filter;
  });

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(`/api/events/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Remove the deleted event from the state
          setEvents(events.filter((event) => event._id !== id));
        } else {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete event");
        }
      } catch (err) {
        console.error("Error deleting event:", err);
        alert(err.message || "Failed to delete event");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-[#6A0DAD]">
          <svg
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-[#6A0DAD] inline-block"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading events...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-6 bg-red-100 text-red-800 rounded-md border border-red-200">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white text-red-600 rounded-md border border-red-300 hover:bg-red-50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#6A0DAD] mb-2">
          Events Management
        </h1>
        <p className="text-gray-600">View and manage your portfolio events</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === "all"
                ? "bg-[#6A0DAD] text-white"
                : "bg-white text-[#6A0DAD] border border-[#6A0DAD]"
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === "upcoming"
                ? "bg-[#6A0DAD] text-white"
                : "bg-white text-[#6A0DAD] border border-[#6A0DAD]"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === "past"
                ? "bg-[#6A0DAD] text-white"
                : "bg-white text-[#6A0DAD] border border-[#6A0DAD]"
            }`}
          >
            Past
          </button>
        </div>
        <Link
          href="/dashboard/events/add"
          className="bg-white text-[#6A0DAD] border border-[#6A0DAD] hover:bg-[#6A0DAD] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add New Event</span>
        </Link>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm border border-purple-100 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-purple-200 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-[#6A0DAD] mb-2">
            No {filter !== "all" ? filter : ""} Events Found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't added any {filter !== "all" ? filter : ""} events yet.
            Click the button above to showcase your events.
          </p>
          <Link
            href="/dashboard/events/add"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED] text-white font-medium rounded-md hover:shadow-lg transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add First Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6A0DAD]/10 flex flex-col h-full relative group"
            >
              <button
                onClick={() => handleDeleteEvent(event._id)}
                className="absolute top-2 right-2 z-10 bg-white text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                aria-label="Delete event"
              >
                <FaTrash size={14} />
              </button>

              <div className="h-48 relative overflow-hidden">
                {event.image && !imageErrors[event._id] ? (
                  <>
                    <Image
                      src={event.image}
                      alt={event.name}
                      fill
                      style={{ objectFit: "cover" }}
                      onError={() => handleImageError(event._id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[#6A0DAD]/20 to-[#7C3AED]/20 flex items-center justify-center">
                    <span className="text-[#6A0DAD] opacity-60 text-5xl font-light">
                      {event.name ? event.name[0] : "E"}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                      event.category === "upcoming"
                        ? "bg-[#6A0DAD] text-white"
                        : "bg-[#6B7280]/20 text-[#6B7280]"
                    }`}
                  >
                    {event.category === "upcoming" ? "Upcoming" : "Past"}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-xl text-[#1F1F1F] mb-2">
                    {event.name}
                  </h3>

                  <div className="flex items-center mb-3">
                    <FaUserFriends className="w-4 h-4 text-[#6A0DAD] mr-2" />
                    <p className="text-[#6B7280] text-sm">{event.host}</p>
                  </div>

                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="w-4 h-4 text-[#6A0DAD] mr-2" />
                    <p className="text-[#6B7280] text-sm">{event.date}</p>
                  </div>

                  <div className="flex items-center mb-4">
                    <FaMapMarkerAlt className="w-4 h-4 text-[#6A0DAD] mr-2" />
                    <p className="text-[#6B7280] text-sm">{event.location}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.skills &&
                      event.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-[#6A0DAD]/10 text-[#6A0DAD] text-xs px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>

                <div
                  className={`mt-2 ${event.registerLink ? "" : "opacity-60"}`}
                >
                  {event.registerLink ? (
                    <a
                      href={event.registerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED] text-white font-medium rounded-lg transition-transform hover:scale-[1.02] hover:shadow-md"
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
                  ) : (
                    <div className="inline-flex items-center justify-center w-full py-2 px-4 bg-[#6B7280]/20 text-[#6B7280] font-medium rounded-lg cursor-not-allowed">
                      Event Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
