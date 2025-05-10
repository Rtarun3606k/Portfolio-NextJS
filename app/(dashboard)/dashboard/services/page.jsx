"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/services`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data.services || []);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/services/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Remove the deleted service from the state
          setServices(services.filter((service) => service._id !== id));
        } else {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete service");
        }
      } catch (err) {
        console.error("Error deleting service:", err);
        alert(err.message || "Failed to delete service");
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
          Loading services...
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
          Services Management
        </h1>
        <p className="text-gray-600">View and manage your portfolio services</p>
      </div>

      <div className="flex justify-end mb-6">
        <Link
          href="/dashboard/services/add"
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
          <span>Add New Service</span>
        </Link>
      </div>

      {services.length === 0 ? (
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="text-xl font-semibold text-[#5E60CE] mb-2">
            No Services Found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't added any services yet. Click the button above to create
            your first service.
          </p>
          <Link
            href="/dashboard/services/add"
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
            Create First Service
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white shadow-md rounded-lg p-6 border border-purple-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {service.iconPath && (
                    <div className="mr-4 text-[#5E60CE]">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={service.iconPath}
                        ></path>
                      </svg>
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-[#5E60CE]">
                      {service.title}
                    </h2>
                    <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-[#7209B7]">
                      {service.category}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteService(service._id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-full transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
              </div>

              <p className="mt-3 text-gray-700">{service.description}</p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-purple-50 p-3 rounded-md">
                  <span className="text-sm text-[#7209B7] font-medium">
                    Price Range:
                  </span>
                  <p className="font-semibold text-gray-800">{service.price}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-md">
                  <span className="text-sm text-[#7209B7] font-medium">
                    Timeframe:
                  </span>
                  <p className="font-semibold text-gray-800">
                    {service.timeframe}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
