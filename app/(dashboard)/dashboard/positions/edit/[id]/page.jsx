"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PositionForm from "@/components/PositionForm";

export default function EditPosition({ params }) {
  const router = useRouter();
  const { id } = params;
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosition() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/positions/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch position");
        }

        const data = await response.json();
        setPosition(data.position);
      } catch (err) {
        console.error("Error fetching position:", err);
        setError(err.message || "Failed to load position");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPosition();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
        </div>
      </div>
    );
  }

  if (error || !position) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 p-4 rounded-lg text-red-700">
          {error || "Position not found"}
        </div>
        <div className="mt-4">
          <Link
            href="/dashboard/positions"
            className="bg-white text-[#6A0DAD] border border-[#6A0DAD] hover:bg-[#6A0DAD] hover:text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center inline-flex"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Positions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1F1F1F]">Edit Position</h1>
        <Link
          href="/dashboard/positions"
          className="bg-white text-[#6A0DAD] border border-[#6A0DAD] hover:bg-[#6A0DAD] hover:text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Positions
        </Link>
      </div>

      <PositionForm initialData={position} isEditing={true} />
    </div>
  );
}
