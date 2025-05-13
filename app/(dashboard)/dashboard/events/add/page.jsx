"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";
import EventDescription from "@/components/EventDescription";

export default function AddEventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    host: "",
    date: "",
    location: "",
    registerLink: "",
    category: "upcoming",
    skills: [],
    description: "", // Added description field for Markdown content
  });

  const [skillInput, setSkillInput] = useState("");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file selection with preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        content: "Please select an image file",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        content: "Image file is too large. Maximum size is 5MB",
      });
      return;
    }

    setImageFile(file);
    setUploadStatus("File selected: " + file.name);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Add skill to skills array
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  // Remove skill from skills array
  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Handle keydown for skills input (add on Enter)
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // Upload image to Azure Blob Storage
  const uploadImageToAzure = async (file) => {
    if (!file) return null;

    setUploadStatus("Uploading image to Azure...");

    const formData = new FormData();
    formData.append("file", file);
    // Specify the container name for events
    formData.append("container", "events");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      setUploadStatus("Image uploaded successfully");
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus(`Upload failed: ${error.message}`);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.host ||
        !formData.date ||
        !formData.location
      ) {
        throw new Error("Please fill all required fields");
      }

      if (!imageFile && !imagePreview) {
        throw new Error("Please select an image for the event");
      }

      // Upload image to Azure if we have a file
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImageToAzure(imageFile);
        if (!imageUrl) {
          throw new Error("Failed to upload image");
        }
      }

      // Prepare data for API
      const eventData = {
        ...formData,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      };

      // Send data to API endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create event");
      }

      // Success - show message and redirect
      setMessage({
        type: "success",
        content: "Event created successfully!",
      });

      // Reset form
      setFormData({
        name: "",
        host: "",
        date: "",
        location: "",
        registerLink: "",
        category: "upcoming",
        skills: [],
        description: "",
      });
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Redirect after a delay
      setTimeout(() => {
        router.push("/dashboard/events");
      }, 2000);
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage({
        type: "error",
        content: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1F1F1F]">Create New Event</h1>
        <Link
          href="/dashboard/events"
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
          Back to Events
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg order-2 lg:order-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                placeholder="e.g. React Advanced Conference"
              />
            </div>

            <div>
              <label
                htmlFor="host"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Host/Organizer *
              </label>
              <input
                type="text"
                id="host"
                name="host"
                value={formData.host}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                placeholder="e.g. TechEvents Global"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event Date *
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                  placeholder="e.g. June 15-17, 2025"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: Month Day-Day, Year
                </p>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="registerLink"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Registration Link
              </label>
              <input
                type="url"
                id="registerLink"
                name="registerLink"
                value={formData.registerLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                placeholder="e.g. https://reactadvanced.com/register"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Category
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="upcoming"
                    checked={formData.category === "upcoming"}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#6A0DAD] focus:ring-[#6A0DAD]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Upcoming</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="past"
                    checked={formData.category === "past"}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#6A0DAD] focus:ring-[#6A0DAD]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Past</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills/Technologies
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                  placeholder="e.g. React, JavaScript"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-[#6A0DAD] text-white rounded-r-lg hover:bg-[#7209B7]"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-[#6A0DAD]/10 text-[#6A0DAD] text-sm px-3 py-1 rounded-full flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-[#6A0DAD] hover:text-[#7209B7]"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Description
              </label>
              <EventDescription
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: value,
                  }))
                }
                placeholder="Describe your event in detail. You can use Markdown formatting for rich text..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Use Markdown to format your description. Add headings with #,
                lists with *, and more.
              </p>
            </div>

            <div>
              <label
                htmlFor="eventImage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Image *
              </label>
              <input
                type="file"
                id="eventImage"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
              />
              {uploadStatus && (
                <p className="mt-1 text-sm text-blue-600">{uploadStatus}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Recommended aspect ratio: 16:9. Max size: 5MB.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED] text-white font-medium rounded-lg transition-all hover:shadow-lg disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="order-1 lg:order-2">
          <h2 className="text-xl font-bold text-[#1F1F1F] mb-4">
            Event Preview
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6A0DAD]/10 flex flex-col h-full max-w-md mx-auto"
          >
            <div className="h-48 relative overflow-hidden">
              {imagePreview ? (
                <div className="relative h-full w-full">
                  <Image
                    src={imagePreview}
                    alt="Event preview"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">
                    Add an image for preview
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                    formData.category === "upcoming"
                      ? "bg-[#6A0DAD] text-white"
                      : "bg-[#6B7280]/20 text-[#6B7280]"
                  }`}
                >
                  {formData.category === "upcoming" ? "Upcoming" : "Past"}
                </span>
              </div>
            </div>

            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-xl text-[#1F1F1F] mb-2">
                  {formData.name || "Event Name"}
                </h3>

                <div className="flex items-center mb-3">
                  <svg
                    className="w-4 h-4 text-[#6A0DAD] mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                  </svg>
                  <p className="text-[#6B7280] text-sm">
                    {formData.host || "Event Host"}
                  </p>
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
                  <p className="text-[#6B7280] text-sm">
                    {formData.date || "Event Date"}
                  </p>
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
                  <p className="text-[#6B7280] text-sm">
                    {formData.location || "Event Location"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {formData.skills.length > 0 ? (
                    formData.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-[#6A0DAD]/10 text-[#6A0DAD] text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Add skills/technologies
                    </span>
                  )}
                </div>

                {formData.description && (
                  <div className="mb-4">
                    <p className="text-sm text-[#6B7280] line-clamp-3">
                      {formData.description.replace(/[*#\[\]()!]/g, "")}
                    </p>
                    <span className="text-xs text-[#6A0DAD]">
                      {formData.description.length > 120 ? "Read more..." : ""}
                    </span>
                  </div>
                )}
              </div>

              <div
                className={`mt-2 ${formData.registerLink ? "" : "opacity-60"}`}
              >
                {formData.registerLink ? (
                  <div className="inline-flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED] text-white font-medium rounded-lg">
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
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center w-full py-2 px-4 bg-[#6B7280]/20 text-[#6B7280] font-medium rounded-lg cursor-not-allowed">
                    {formData.category === "upcoming"
                      ? "Register"
                      : "Event Completed"}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
