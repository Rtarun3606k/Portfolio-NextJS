"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { EventsData } from "@/_utils/Variables";
import { getData, storeData } from "@/_utils/LocalStorage";

const Events = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [events, setEvents] = useState(EventsData);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (getData("events") !== null) {
          const data = getData("events");
          console.log("Fetched services from localStorage:", data);
          setEvents(data);
          return;
        } else {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/events` // Replace with your API endpoint
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Fetched services:", data.events);
          storeData("events", data.events);
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  // Sample events data
  // const events =
  //   JSON.parse(localStorage.getItem("data")).value[2].events || EventsData;
  // console.log(events.value[2].events, "events");
  // console.log(events, "events");

  useEffect(() => {
    const stored = localStorage.getItem("data");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const blogsFromStorage = parsed?.value[2]?.events;
        if (blogsFromStorage) {
          setEvents(blogsFromStorage);
        }
      } catch (err) {
        console.error("Failed to parse localStorage data:", err);
      }
    }
  }, []);

  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((event) => event.category === activeFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const tabVariants = {
    inactive: { borderBottom: "2px solid transparent" },
    active: {
      borderBottom: "2px solid #6A0DAD",
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-br from-[#E8EAF6] via-[#E0E7FF] to-[#EDE9FE]">
      {/* Enhanced decorative circles with blur effect */}
      <div className="absolute top-10 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#6A0DAD]/10 to-[#FF4ECD]/10 blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF4ECD]/10 to-[#6A0DAD]/10 blur-3xl opacity-40"></div>

      {/* Background circles positioned behind the entire component */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Larger circles with blur effects */}
        <div className="animate-float absolute top-[10%] left-[5%] w-32 h-32 bg-gradient-to-r from-[#5E60CE]/20 to-[#7209B7]/20 rounded-full blur-lg"></div>
        <div className="animate-float-delayed absolute top-[30%] right-[10%] w-40 h-40 bg-gradient-to-r from-[#7209B7]/20 to-[#E6CCE4]/30 rounded-full blur-lg"></div>
        <div className="animate-float-slow absolute bottom-[15%] left-[15%] w-36 h-36 bg-gradient-to-r from-[#C71585]/10 to-[#5E60CE]/20 rounded-full blur-lg"></div>

        {/* Medium circles with different animations */}
        <div className="animate-float-reverse absolute top-[45%] left-[25%] w-28 h-28 bg-gradient-to-br from-[#E6CCE4]/20 to-[#5E60CE]/10 rounded-full blur-md"></div>
        <div className="animate-float-diagonal absolute top-[20%] left-[70%] w-24 h-24 bg-gradient-to-bl from-[#7209B7]/10 to-[#C71585]/20 rounded-full blur-md"></div>
        <div className="animate-float-circular absolute bottom-[35%] right-[25%] w-36 h-36 bg-gradient-to-tr from-[#5E60CE]/20 to-[#E6CCE4]/20 rounded-full blur-lg"></div>

        {/* Smaller accent circles */}
        <div className="animate-pulsate absolute top-[65%] right-[12%] w-28 h-28 bg-gradient-to-r from-[#C71585]/10 to-[#5E60CE]/20 rounded-full blur-md"></div>
        <div className="animate-float-diagonal-reverse absolute top-[8%] left-[50%] w-20 h-20 bg-gradient-to-r from-[#E6CCE4]/20 to-[#7209B7]/10 rounded-full blur-sm"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold font-poppins text-[#1F1F1F] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED]"
          >
            Tech Events
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#6B7280] font-inter max-w-2xl mx-auto"
          >
            Connect, learn, and grow through these tech events and conferences
          </motion.p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-6 border-b border-[#6A0DAD]/20 w-full max-w-md justify-center rounded-full bg-white/50 backdrop-blur-sm py-2 px-4 shadow-sm">
            <motion.button
              variants={tabVariants}
              animate={activeFilter === "all" ? "active" : "inactive"}
              onClick={() => setActiveFilter("all")}
              className={`pb-2 px-2 text-lg font-medium transition-colors duration-300 ${
                activeFilter === "all" ? "text-[#6A0DAD]" : "text-[#6B7280]"
              }`}
            >
              All Events
            </motion.button>
            <motion.button
              variants={tabVariants}
              animate={activeFilter === "upcoming" ? "active" : "inactive"}
              onClick={() => setActiveFilter("upcoming")}
              className={`pb-2 px-2 text-lg font-medium transition-colors duration-300 ${
                activeFilter === "upcoming"
                  ? "text-[#6A0DAD]"
                  : "text-[#6B7280]"
              }`}
            >
              Upcoming
            </motion.button>
            <motion.button
              variants={tabVariants}
              animate={activeFilter === "past" ? "active" : "inactive"}
              onClick={() => setActiveFilter("past")}
              className={`pb-2 px-2 text-lg font-medium transition-colors duration-300 ${
                activeFilter === "past" ? "text-[#6A0DAD]" : "text-[#6B7280]"
              }`}
            >
              Past
            </motion.button>
          </div>
        </div>

        {/* Events grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
        >
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id || event._id}
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6A0DAD]/10 flex flex-col h-full"
            >
              <div className="h-48 relative overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
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
                  <h3 className="font-poppins font-semibold text-xl text-[#1F1F1F] mb-2">
                    {event.name}
                  </h3>

                  <div className="flex items-center mb-3">
                    <svg
                      className="w-4 h-4 text-[#6A0DAD] mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                    </svg>
                    <p className="text-[#6B7280] text-sm">{event.host}</p>
                  </div>

                  <div className="flex items-center mb-3">
                    <svg
                      className="w-4 h-4 text-[#6A0DAD] mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <p className="text-[#6B7280] text-sm">{event.date}</p>
                  </div>

                  <div className="flex items-center mb-4">
                    <svg
                      className="w-4 h-4 text-[#6A0DAD] mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <p className="text-[#6B7280] text-sm">{event.location}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.skills.map((skill, i) => (
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
                  className={`mt-2 ${
                    event.registerLink ? "" : "opacity-60"
                  } gap-1`}
                >
                  {event.registerLink ? (
                    <Link
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
                    </Link>
                  ) : (
                    <div className="inline-flex items-center justify-center w-full py-2 px-4 bg-[#6B7280]/20 text-[#6B7280] font-medium rounded-lg cursor-not-allowed">
                      Event Completed
                    </div>
                  )}

                  <Link
                    href={`/Events/${event._id || null}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-[#dfd8e4e0] to-[#b9a9d3db] text-white font-medium rounded-lg transition-transform hover:scale-[1.02] hover:shadow-md"
                  >
                    Learn More
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
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* See more link with circular arrow design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/Events"
            className="inline-flex items-center group relative"
          >
            <span className="text-[#6A0DAD] font-poppins font-medium text-lg mr-4 group-hover:text-[#7209B7] transition-all">
              See all events
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
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
