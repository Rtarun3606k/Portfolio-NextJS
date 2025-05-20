"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function PositionCard({
  position,
  isEditMode = false,
  onEdit,
  onDelete,
}) {
  const [expandedResponsibilities, setExpandedResponsibilities] =
    useState(false);
  const [imageError, setImageError] = useState(false);
  const [responsibilitiesOverflow, setResponsibilitiesOverflow] = useState([]);
  const responsibilityRefs = useRef([]);

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Calculate duration
  const getDuration = () => {
    if (!position.startDate) return "";

    const start = new Date(position.startDate);
    const end = position.isCurrent ? new Date() : new Date(position.endDate);

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    let duration = "";

    if (years > 0) {
      duration += `${years} ${years === 1 ? "year" : "years"}`;
    }

    if (months > 0 || (years === 0 && months === 0)) {
      if (duration) duration += ", ";
      duration += `${months} ${months === 1 ? "month" : "months"}`;
    }

    return duration;
  };

  // Check if text overflows one line
  useEffect(() => {
    if (position.responsibilities && position.responsibilities.length > 0) {
      // Reset refs array to match number of responsibilities
      responsibilityRefs.current = position.responsibilities.map(
        (_, i) => responsibilityRefs.current[i] || createRef()
      );

      // Check which responsibilities overflow
      const newOverflowState = position.responsibilities.map((_, index) => {
        const element = responsibilityRefs.current[index]?.current;
        if (!element) return false;

        return element.scrollHeight > element.clientHeight;
      });

      setResponsibilitiesOverflow(newOverflowState);
    }
  }, [position.responsibilities]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[#6A0DAD]/30 transition-all duration-300"
    >
      {/* Edit/Delete Controls */}
      {isEditMode && (
        <div className="absolute top-2 right-2 z-10 flex space-x-2">
          <button
            onClick={() => onEdit(position)}
            className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition-colors"
            aria-label="Edit position"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(position)}
            className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors"
            aria-label="Delete position"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Header with company logo and info */}
      <div className="p-5 border-b border-gray-200 flex items-center">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mr-4 relative">
          {position.logoUrl && !imageError ? (
            <Image
              src={position.logoUrl}
              alt={`${position.companyName} logo`}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
              <span className="text-[#6A0DAD] opacity-60 text-2xl font-medium">
                {position.companyName ? position.companyName[0] : "C"}
              </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">
            {position.companyName}
          </h3>
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <FaMapMarkerAlt className="mr-1 text-[#6A0DAD]" size={12} />
            <span>{position.location}</span>
            {position.isRemote && (
              <span className="ml-2 bg-[#6A0DAD]/10 text-[#6A0DAD] text-xs px-2 py-0.5 rounded-full">
                Remote
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Job details */}
      <div className="p-5">
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <FaBriefcase className="mr-2 text-[#6A0DAD]" size={14} />
            <h4 className="font-semibold text-[#1F1F1F]">
              {position.jobTitle}
            </h4>
          </div>
          <p className="text-gray-500 text-sm ml-6">
            {position.employmentType}
          </p>
          <div className="flex items-center text-gray-500 text-sm mt-2 ml-6">
            <FaCalendarAlt className="mr-2" size={12} />
            <span>
              {formatDate(position.startDate)} -{" "}
              {position.isCurrent ? "Present" : formatDate(position.endDate)}
              <span className="mx-1">·</span>
              {getDuration()}
            </span>
          </div>
        </div>

        <div>
          <h5 className="font-medium text-[#1F1F1F] mb-2">Responsibilities:</h5>
          <ul className="list-disc pl-5 space-y-1">
            {position.responsibilities.map((resp, index) => (
              <li key={index} className="text-gray-700 text-sm">
                <div
                  ref={(el) =>
                    (responsibilityRefs.current[index] = { current: el })
                  }
                  className={`${
                    expandedResponsibilities ? "" : "line-clamp-1"
                  }`}
                >
                  {resp}
                </div>
              </li>
            ))}
          </ul>

          {position.responsibilities.some(
            (_, index) => responsibilitiesOverflow[index]
          ) && (
            <button
              onClick={() =>
                setExpandedResponsibilities(!expandedResponsibilities)
              }
              className="text-[#6A0DAD] text-sm font-medium mt-2 hover:underline focus:outline-none"
            >
              {expandedResponsibilities ? "See less" : "See more"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
