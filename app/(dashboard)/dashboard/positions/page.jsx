"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaBriefcase } from "react-icons/fa";
import { motion } from "framer-motion";
import PositionCard from "@/components/PositionCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function PositionsManagement() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPositions() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/positions`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch positions");
        }
        const data = await response.json();
        console.log("Fetched positions:", data);
        setPositions(data.positions || []);
      } catch (err) {
        console.error("Error fetching positions:", err);
        setError("Failed to load positions. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchPositions();
  }, []);

  const handleDelete = async (position) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      try {
        const response = await fetch(`/api/positions/${position._id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Remove the deleted position from the state
          setPositions(positions.filter((p) => p._id !== position._id));
        } else {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete position");
        }
      } catch (err) {
        console.error("Error deleting position:", err);
        alert(err.message || "Failed to delete position");
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
          Loading positions...
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
          Work Experience Management
        </h1>
        <p className="text-gray-600">View and manage your work experience</p>
      </div>

      <div className="flex justify-end mb-6">
        <Link
          href="/dashboard/positions/add"
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
          <span>Add New Position</span>
        </Link>
      </div>

      {positions.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm border border-purple-100 text-center">
          <FaBriefcase className="w-16 h-16 mx-auto text-purple-200 mb-4" />
          <h3 className="text-xl font-semibold text-[#6A0DAD] mb-2">
            No Positions Found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't added any work experience yet. Click the button above to
            showcase your professional journey.
          </p>
          <Link
            href="/dashboard/positions/add"
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
            Add First Position
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {positions.map((position) => (
            <div key={position._id} className="relative">
              <PositionCard
                position={position}
                isEditMode={true}
                onEdit={(position) => {
                  window.location.href = `/dashboard/positions/edit/${position._id}`;
                }}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
