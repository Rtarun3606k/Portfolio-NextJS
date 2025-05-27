"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PositionCard from "./PositionCard";
import { getData, storeData } from "@/_utils/LocalStorage";
import Link from "next/link";

export default function WorkExperience({ limited = false, showMore = false }) {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        if (getData("positions") !== null) {
          const data = getData("positions");
          // console.log("Fetched positions from localStorage:", data);
          setPositions(data);
          return;
        } else {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/positions`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          // console.log("Fetched positions:", data.positions);
          storeData("positions", data.positions);
          setPositions(data.positions);
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="py-16 px-4 sm:px-6 md:px-10 bg-[#f5e7eec5] overflow-hidden relative">
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
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#5E60CE]/10 px-4 py-1 rounded-full text-[#5E60CE] font-medium mb-4">
            My Journey
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold font-playfair  text-[#1F1F1F] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED]"
          >
            Work Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#6B7280] font-inter max-w-2xl mx-auto"
          >
            My professional journey and where I've contributed my skills
          </motion.p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
          </div>
        ) : positions.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-6 max-w-4xl mx-auto"
          >
            {(limited ? positions.slice(0, 3) : positions).map((position) => (
              <PositionCard key={position._id} position={position} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No work experience available yet.</p>
          </div>
        )}

        {showMore === true && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              href="/About"
              className="inline-flex items-center group relative"
            >
              <span className="text-[#6A0DAD] font-poppins font-medium text-lg mr-4 group-hover:text-[#7209B7] transition-all">
                Learn more about me
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
        )}
      </div>
    </section>
  );
}
