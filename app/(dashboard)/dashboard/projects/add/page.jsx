"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaTimes, FaGithub, FaExternalLinkAlt } from "react-icons/fa";

export default function AddProjectForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
    tags: [],
    featured: false,
  });

  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setMessage({
          type: "error",
          content: "Image file is too large. Maximum size is 5MB.",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() !== "" && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    try {
      // Create FormData object for multipart/form-data (for image upload)
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "tags") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append image file if exists (just once)
      if (imageFile) {
        console.log("Appending image file:", imageFile.name);
        formDataToSend.append("image", imageFile);
      }
      console.log("Form data to send:", formDataToSend);

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formDataToSend,
        // Don't set Content-Type header when using FormData, it will automatically set to multipart/form-data
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          content: "Project created successfully!",
        });

        // Reset form
        setFormData({
          title: "",
          description: "",
          githubUrl: "",
          liveUrl: "",
          tags: [],
          featured: false,
        });
        setImageFile(null);
        setImagePreview(null);

        // Redirect to projects list after a short delay
        setTimeout(() => {
          router.push("/dashboard/projects");
        }, 1500);
      } else {
        setMessage({
          type: "error",
          content: data.error || "Failed to create project",
        });
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setMessage({
        type: "error",
        content: "An error occurred while creating the project",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#5E60CE] mb-2">
          Add New Project
        </h1>
        <p className="text-gray-600">
          Showcase your work with a beautiful project card
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <Link
          href="/dashboard/projects"
          className="bg-white text-[#7209B7] border border-[#7209B7] hover:bg-[#7209B7] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
        >
          <span>Back to Projects</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow-sm order-2 lg:order-1"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-[#5E60CE] mb-2"
            >
              Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-purple-200 rounded-md focus:ring-[#5E60CE] focus:border-[#5E60CE] bg-white text-gray-800"
              placeholder="e.g. E-commerce Platform"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-[#5E60CE] mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 border border-purple-200 rounded-md focus:ring-[#5E60CE] focus:border-[#5E60CE] bg-white text-gray-800"
              placeholder="Describe your project..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="githubUrl"
                className="block text-sm font-semibold text-[#5E60CE] mb-2"
              >
                GitHub URL
              </label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full p-3 border border-purple-200 rounded-md focus:ring-[#5E60CE] focus:border-[#5E60CE] bg-white text-gray-800"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div>
              <label
                htmlFor="liveUrl"
                className="block text-sm font-semibold text-[#5E60CE] mb-2"
              >
                Live Demo URL
              </label>
              <input
                type="url"
                id="liveUrl"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                className="w-full p-3 border border-purple-200 rounded-md focus:ring-[#5E60CE] focus:border-[#5E60CE] bg-white text-gray-800"
                placeholder="https://yourproject.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#5E60CE] mb-2">
              Project Tags
            </label>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 p-3 border border-purple-200 rounded-l-md focus:ring-[#5E60CE] focus:border-[#5E60CE] bg-white text-gray-800"
                placeholder="Add tags (e.g. React, NextJS)"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-3 bg-[#5E60CE] text-white rounded-r-md hover:bg-[#7209B7] transition-colors"
              >
                <FaPlus />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#5E60CE]/10 text-[#5E60CE] text-sm px-3 py-1 rounded-full flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-[#5E60CE] hover:text-[#7209B7]"
                  >
                    <FaTimes size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-[#5E60CE] mb-2"
            >
              Project Image (optional)
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border border-purple-200 rounded-md focus:ring-[#5E60CE] focus:border-[#5E60CE] bg-white text-gray-800"
            />
            <p className="text-xs text-gray-500 mt-1">
              Max file size: 5MB. Recommended size: 1200×630 pixels.
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-[#7209B7] focus:ring-[#5E60CE] border-gray-300 rounded"
            />
            <label
              htmlFor="featured"
              className="ml-2 block text-sm text-gray-700"
            >
              Mark as featured project
            </label>
          </div>

          <div className="flex items-center justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#5E60CE] to-[#7209B7] text-white px-8 py-3 rounded-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#5E60CE] focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-medium"
            >
              {loading ? "Creating..." : "Add Project"}
            </button>
          </div>
        </form>

        {/* Preview */}
        <div className="order-1 lg:order-2">
          <h3 className="text-lg font-semibold text-[#5E60CE] mb-4">
            Project Preview
          </h3>
          <div className="h-[450px] rounded-2xl overflow-hidden bg-white border-[3px] border-transparent shadow-xl flex flex-col">
            {/* Project Image Preview */}
            <div className="relative h-[35%] w-full overflow-hidden">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Project preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-[#5E60CE]/20 to-[#7209B7]/20 flex items-center justify-center">
                  <span className="text-[#5E60CE] opacity-60 text-5xl font-light">
                    {formData.title ? formData.title[0] : "P"}
                  </span>
                </div>
              )}
            </div>

            {/* Project Content Preview */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-[#1C1C1C] mb-2">
                  {formData.title || "Project Title"}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {formData.description ||
                    "Your project description will appear here..."}
                </p>

                {/* Tags Preview */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.tags.length > 0 ? (
                    formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#5E60CE]/10 hover:bg-[#E6CCE4] transition-colors text-[#5E60CE] text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Tags will appear here...
                    </span>
                  )}
                </div>
              </div>

              {/* Project Links Preview */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex space-x-3">
                  <a className="p-2 rounded-full hover:bg-[#E6CCE4] transition-colors">
                    <FaGithub className="text-[#1C1C1C]" size={20} />
                  </a>
                  <a className="p-2 rounded-full hover:bg-[#E6CCE4] transition-colors">
                    <FaExternalLinkAlt className="text-[#1C1C1C]" size={18} />
                  </a>
                </div>

                <div className="flex items-center">
                  {formData.featured && (
                    <span className="bg-[#7209B7]/20 text-[#7209B7] text-xs px-2 py-1 rounded-full mr-2">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
