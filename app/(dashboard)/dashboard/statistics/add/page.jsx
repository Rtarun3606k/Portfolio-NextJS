"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddStatistic() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    description: "",
    icon: "📊",
    color: "from-[#5E60CE]/20 to-[#7209B7]/20",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/statistics`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          content: "Statistic added successfully!",
        });
        // Reset form
        setFormData({
          title: "",
          value: "",
          description: "",
          icon: "📊",
          color: "from-[#5E60CE]/20 to-[#7209B7]/20",
        });
      } else {
        setMessage({
          type: "error",
          content: data.error || "Failed to add statistic",
        });
      }
    } catch (error) {
      console.error("Error adding statistic:", error);
      setMessage({
        type: "error",
        content: "An error occurred while adding the statistic",
      });
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = [
    { label: "Purple to Pink", value: "from-[#5E60CE]/20 to-[#7209B7]/20" },
    { label: "Pink to Purple", value: "from-[#7209B7]/20 to-[#5E60CE]/20" },
    {
      label: "Purple to Purple (Light)",
      value: "from-[#5E60CE]/20 to-[#5E60CE]/10",
    },
    {
      label: "Pink to Pink (Light)",
      value: "from-[#7209B7]/20 to-[#7209B7]/10",
    },
    { label: "Blue to Purple", value: "from-[#4CC9F0]/20 to-[#5E60CE]/20" },
    { label: "Green to Blue", value: "from-[#4CAF50]/20 to-[#4CC9F0]/20" },
    { label: "Yellow to Orange", value: "from-[#FFCA28]/20 to-[#FF9800]/20" },
    { label: "Orange to Red", value: "from-[#FF9800]/20 to-[#F44336]/20" },
  ];

  const iconOptions = [
    "📊",
    "📈",
    "📉",
    "🚀",
    "⭐",
    "👥",
    "👁️",
    "🌍",
    "🌎",
    "🏆",
    "💼",
    "📱",
    "💻",
    "🔧",
    "⚙️",
    "📢",
    "📝",
    "✅",
    "🔔",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#5E60CE] mb-2">
          Add New Statistic
        </h1>
        <p className="text-gray-600">
          Add a new statistic to showcase on your site
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <Link
          href="/dashboard/statistics"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Statistics</span>
        </Link>
      </div>

      {message.content && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {message.content}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-[#5E60CE] mb-2"
          >
            Statistic Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 border border-purple-200 rounded-md focus:ring-[#5E60CE] focus:border-[#5E60CE] bg-white text-gray-800"
            placeholder="e.g. Projects Completed"
          />
        </div>

        <div>
          <label
            htmlFor="value"
            className="block text-sm font-semibold text-[#5E60CE] mb-2"
          >
            Value
          </label>
          <input
            type="text"
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
            className="w-full p-3 border border-purple-200 rounded-md focus:ring-[#5E60CE] focus:border-[#5E60CE] bg-white text-gray-800"
            placeholder="e.g. 15 or 98%"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-[#5E60CE] mb-2"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 border border-purple-200 rounded-md focus:ring-[#5E60CE] focus:border-[#5E60CE] bg-white text-gray-800"
            placeholder="e.g. Enterprise & startups"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="icon"
              className="block text-sm font-semibold text-[#5E60CE] mb-2"
            >
              Icon
            </label>
            <div className="relative">
              <select
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full p-3 border border-purple-200 rounded-md focus:ring-[#5E60CE] focus:border-[#5E60CE] bg-white text-gray-800 appearance-none"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}{" "}
                    {icon === "🚀"
                      ? "- Rocket"
                      : icon === "⭐"
                      ? "- Star"
                      : icon === "🌎"
                      ? "- Globe"
                      : ""}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="color"
              className="block text-sm font-semibold text-[#5E60CE] mb-2"
            >
              Background Color
            </label>
            <div className="relative">
              <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full p-3 border border-purple-200 rounded-md focus:ring-[#5E60CE] focus:border-[#5E60CE] bg-white text-gray-800 appearance-none"
              >
                {colorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-medium text-[#5E60CE]">Preview</h3>
          </div>
          <div className="flex justify-center">
            <div
              className={`bg-gradient-to-br ${formData.color} p-6 rounded-xl w-64`}
            >
              <div className="text-3xl mb-2">{formData.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {formData.title || "Statistic Title"}
              </h3>
              <p className="text-2xl font-bold text-[#5E60CE] mb-2">
                {formData.value || "0"}
              </p>
              <p className="text-sm text-gray-600">
                {formData.description || "Description"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#5E60CE] to-[#7209B7] text-white px-8 py-3 rounded-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#5E60CE] focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-medium"
          >
            {loading ? "Adding..." : "Add Statistic"}
          </button>
        </div>
      </form>
    </div>
  );
}
