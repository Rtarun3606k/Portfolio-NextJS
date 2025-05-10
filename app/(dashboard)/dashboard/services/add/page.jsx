"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Technology } from "@/_utils/Variables";

export default function AddServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    timeframe: "",
    category: "",
    iconPath: "",
  });

  // Categories for the dropdown
  const categories = [
    { id: "web", name: "Web Development" },
    { id: "app", name: "App Development" },
    { id: "cms", name: "CMS Solutions" },
    { id: "cloud", name: "Cloud Solutions" },
    { id: "video", name: "Video Editing" },
    { id: "design", name: "UI/UX Design" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      // Validate the form data
      if (
        !formData.title ||
        !formData.description ||
        !formData.price ||
        !formData.timeframe ||
        !formData.category
      ) {
        throw new Error("Please fill in all required fields");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create service");
      }

      setSuccess("Service created successfully!");

      // Reset the form
      setFormData({
        title: "",
        description: "",
        price: "",
        timeframe: "",
        category: "",
        iconPath: "",
      });

      // Redirect after successful submission (after a short delay to show success message)
      setTimeout(() => {
        router.push("/dashboard/services");
      }, 1500);
    } catch (err) {
      console.error("Error creating service:", err);
      setError(err.message || "Failed to create service");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create an icon component based on the iconPath or use a default
  const ServiceIcon = () => {
    if (formData.iconPath) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d={formData.iconPath} />
        </svg>
      );
    }

    // Default icons based on category
    const categoryIcons = {
      web: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
      app: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      cms: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      cloud: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
      ),
      video: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      design: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
    };

    return formData.category && categoryIcons[formData.category] ? (
      categoryIcons[formData.category]
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#5E60CE]">Add New Service</h1>
        <p className="text-gray-600 mt-2">
          Create a new service to showcase in your portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-8 border border-purple-100">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                <p className="font-medium">Success</p>
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Title */}
                <div className="col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Service Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Full Stack Web Development"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5E60CE] focus:border-[#5E60CE] outline-none transition-colors"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5E60CE] focus:border-[#5E60CE] outline-none transition-colors"
                    required
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Icon Path */}
                <div>
                  <label
                    htmlFor="iconPath"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Icon Path (Optional)
                  </label>
                  <input
                    type="text"
                    id="iconPath"
                    name="iconPath"
                    value={formData.iconPath}
                    onChange={handleChange}
                    placeholder="e.g. M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5E60CE] focus:border-[#5E60CE] outline-none transition-colors"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a valid SVG path or leave empty for default icons
                  </p>
                </div>

                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price Range*
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. $1,500 - $5,000"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5E60CE] focus:border-[#5E60CE] outline-none transition-colors"
                    required
                  />
                </div>

                {/* Timeframe */}
                <div>
                  <label
                    htmlFor="timeframe"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Timeframe*
                  </label>
                  <input
                    type="text"
                    id="timeframe"
                    name="timeframe"
                    value={formData.timeframe}
                    onChange={handleChange}
                    placeholder="e.g. 2-4 weeks"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5E60CE] focus:border-[#5E60CE] outline-none transition-colors"
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe what this service includes, key features, and benefits..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5E60CE] focus:border-[#5E60CE] outline-none transition-colors"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Technologies related to this service */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Technologies Preview (Non-editable)
                </label>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                  {Technology.slice(0, 6).map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm"
                    >
                      <img
                        src={tech.iconUrl}
                        alt={tech.name}
                        className="w-4 h-4 mr-2"
                      />
                      <span className="text-sm">{tech.name}</span>
                    </div>
                  ))}
                  <div className="flex items-center px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm">
                    <span className="text-sm text-gray-500">+ more</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Technologies will be editable in a future update
                </p>
              </div>

              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Link
                  href="/dashboard/services"
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-gradient-to-r from-[#5E60CE] to-[#7209B7] text-white font-medium rounded-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5E60CE] ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Creating...
                    </span>
                  ) : (
                    "Create Service"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-blue-800 font-medium mb-2 flex items-center">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Tips for creating effective service listings
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
              <li>
                Use clear, descriptive titles that explain exactly what you
                offer
              </li>
              <li>
                Include specific details about deliverables in your description
              </li>
              <li>Be transparent about pricing and timeframes</li>
              <li>Mention the technologies and methodologies you use</li>
              <li>Highlight the benefits and outcomes clients can expect</li>
            </ul>
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-white rounded-xl shadow-md border border-purple-100 overflow-hidden">
              <div className="p-4 bg-[#5E60CE]/10 border-b border-purple-100 flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#5E60CE]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span className="font-medium text-[#5E60CE]">Live Preview</span>
              </div>

              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6A0DAD]/10 to-[#FF4ECD]/20 flex items-center justify-center mr-4 text-[#6A0DAD]">
                    <ServiceIcon />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1F1F1F] font-poppins">
                    {formData.title || "Service Title"}
                  </h3>
                </div>

                <p className="text-[#6B7280] mb-6 flex-grow">
                  {formData.description ||
                    "Your service description will appear here. Make sure to provide a clear and concise explanation of what you offer, including key features and benefits."}
                </p>

                <div className="border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-[#6B7280]">
                      Price Range:
                    </span>
                    <span className="text-[#6A0DAD] font-semibold">
                      {formData.price || "$XXX - $XXX"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-[#6B7280]">
                      Timeframe:
                    </span>
                    <span className="text-gray-700">
                      {formData.timeframe || "X-X weeks"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="text-sm text-[#6B7280] mb-4">
                    <span className="font-medium">Payment Methods:</span>{" "}
                    PayPal, AirTM
                  </div>
                  <div className="inline-flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED] text-white font-medium rounded-lg transition-transform hover:scale-[1.02] hover:shadow-md cursor-not-allowed opacity-90">
                    Request Quote
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
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h3 className="text-yellow-800 font-medium mb-2 flex items-center">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Preview Notes
              </h3>
              <p className="text-sm text-yellow-700">
                This is how your service will appear to clients. Make sure all
                information is accurate and compelling.
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                The "Request Quote" button is disabled in this preview but will
                be active on the live site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
