"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function StatisticsList() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/statistics`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data = await response.json();
        setStats(data.statistics || []);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to load statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const handleDeleteStat = async (id) => {
    if (window.confirm("Are you sure you want to delete this statistic?")) {
      try {
        const response = await fetch(`/api/statistics/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Remove the deleted statistic from the state
          setStats(stats.filter((stat) => stat._id !== id));
        } else {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete statistic");
        }
      } catch (err) {
        console.error("Error deleting statistic:", err);
        alert(err.message || "Failed to delete statistic");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-[#5E60CE]">
          <svg
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-[#5E60CE] inline-block"
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
          Loading statistics...
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
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#5E60CE] mb-2">
          Statistics Management
        </h1>
        <p className="text-gray-600">View and update your site statistics</p>
      </div>

      <div className="flex justify-end mb-6">
        <Link
          href="/dashboard/statistics/add"
          className="bg-white text-[#7209B7] border border-[#7209B7] hover:bg-[#7209B7] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
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
          <span>Add New Statistic</span>
        </Link>
      </div>

      {stats.length === 0 ? (
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-[#5E60CE] mb-2">
            No Statistics Found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't added any statistics yet. Click the button above to add
            your first statistic.
          </p>
          <Link
            href="/dashboard/statistics/add"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5E60CE] to-[#7209B7] text-white font-medium rounded-md hover:shadow-lg transition-all duration-200"
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
            Add First Statistic
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat._id}
              className={`bg-gradient-to-br ${
                stat.color || "from-purple-100 to-purple-50"
              } p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative group`}
            >
              <button
                onClick={() => handleDeleteStat(stat._id)}
                className="absolute top-2 right-2 bg-white text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete statistic"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="text-3xl mb-2">{stat.icon || "📊"}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-[#5E60CE] mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
