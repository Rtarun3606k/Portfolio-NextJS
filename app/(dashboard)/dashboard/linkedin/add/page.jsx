"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";

export default function AddLinkedInPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
  });

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    try {
      // Validate required fields
      if (!formData.title || !formData.description) {
        throw new Error("Please fill all required fields");
      }

      // Create FormData object for multipart/form-data (for image upload)
      const formDataToSend = new FormData();

      // Append form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append image if exists
      if (imageFile) {
        console.log("Appending image file:", imageFile.name);
        formDataToSend.append("image", imageFile);
      }

      // Send POST request to create LinkedIn post
      const response = await fetch("/api/linkedin", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create LinkedIn post");
      }

      const data = await response.json();
      console.log("LinkedIn post created:", data);

      // Success - show message and redirect
      setMessage({
        type: "success",
        content: "LinkedIn post created successfully!",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        link: "",
      });
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Redirect after a delay
      setTimeout(() => {
        router.push("/dashboard/linkedin");
      }, 2000);
    } catch (error) {
      console.error("Error creating LinkedIn post:", error);
      setMessage({
        type: "error",
        content: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1F1F1F]">
          Create LinkedIn Post
        </h1>
        <Link
          href="/dashboard/linkedin"
          className="bg-white text-[#0077B5] border border-[#0077B5] hover:bg-[#0077B5] hover:text-white px-4 py-2 rounded-md transition-all shadow-md hover:shadow-lg flex items-center"
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
          Back to LinkedIn Posts
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
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Post Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0077B5] focus:border-[#0077B5]"
                placeholder="e.g. Reflections on Building Tech Communities"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Post Content *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0077B5] focus:border-[#0077B5]"
                placeholder="e.g. Today I want to share my experience building tech communities from scratch..."
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="link"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                LinkedIn Post URL
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0077B5] focus:border-[#0077B5]"
                placeholder="e.g. https://linkedin.com/in/yourprofile/posts/your-post-id"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add a link to the live post on LinkedIn (optional)
              </p>
            </div>

            <div>
              <label
                htmlFor="postImage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Post Image
              </label>
              <input
                type="file"
                id="postImage"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0077B5] focus:border-[#0077B5]"
              />
              {uploadStatus && (
                <p className="mt-1 text-sm text-blue-600">{uploadStatus}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Upload an image to accompany your LinkedIn post. Max size: 5MB.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-[#0077B5] to-[#0e76a8] text-white font-medium rounded-lg transition-all hover:shadow-lg disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create LinkedIn Post"}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="order-1 lg:order-2">
          <h2 className="text-xl font-bold text-[#1F1F1F] mb-4">
            Post Preview
          </h2>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full max-w-md mx-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#0077B5] rounded-full flex items-center justify-center">
                  <FaLinkedin className="text-white text-2xl" />
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-800">Your Name</p>
                  <p className="text-gray-500 text-sm">Your Headline</p>
                </div>
              </div>
            </div>

            {/* Post Content Preview */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                {formData.title || "Your Post Title"}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                {formData.description ||
                  "Your post content will appear here..."}
              </p>
            </div>

            {/* Image Preview */}
            <div className="px-4 pb-4">
              {imagePreview ? (
                <div className="relative h-52 w-full rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Post preview"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="h-32 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400 text-sm">
                    Image preview will appear here
                  </p>
                </div>
              )}
            </div>

            {/* Post Reactions */}
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <span>0 reactions</span>
                <span>0 comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
