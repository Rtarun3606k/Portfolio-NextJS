"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BlogsManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBlog, setNewBlog] = useState({
    title: "",
    image: "",
    author: "Tarun Nayaka",
    coAuthor: "",
    link: "",
    views: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBlog),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create blog post");
      }

      // Reset form and refresh data
      setNewBlog({
        title: "",
        image: "",
        author: "Tarun Nayaka",
        coAuthor: "",
        link: "",
        views: 0,
      });
      setShowForm(false);
      setShowPreview(false);

      // Refresh the blogs list
      const updatedResponse = await fetch("/api/blogs");
      const updatedData = await updatedResponse.json();
      setBlogs(updatedData);

      alert("Blog post created successfully!");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1F1F1F]">Blogs Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#6A0DAD] hover:bg-[#7209B7] text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center"
        >
          {showForm ? (
            <>
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </>
          ) : (
            <>
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Blog Post
            </>
          )}
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-[#6A0DAD]/10"
        >
          <h2 className="text-2xl font-semibold mb-6 text-[#1F1F1F]">
            {showPreview ? "Preview Blog Post" : "Create New Blog Post"}
          </h2>

          {showPreview ? (
            <div className="mb-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-[#6A0DAD]/10 max-w-sm mx-auto">
                <div className="h-48 relative overflow-hidden">
                  {newBlog.image ? (
                    <Image
                      src={newBlog.image}
                      alt={newBlog.title}
                      fill
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/600x400?text=Invalid+Image+URL";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                      No image URL provided
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-[#1F1F1F] mb-2">
                    {newBlog.title || "Blog Title"}
                  </h3>
                  <div className="flex items-center text-[#6B7280] text-sm mb-3">
                    <span className="font-medium">{newBlog.author}</span>
                    {newBlog.coAuthor && (
                      <>
                        <span className="mx-2">&middot;</span>
                        <span>Co-author: {newBlog.coAuthor}</span>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="bg-[#6A0DAD]/10 text-[#6A0DAD] px-3 py-1 rounded-full font-medium">
                      0 views
                    </span>
                    <svg
                      className="h-5 w-5 text-[#FF4ECD]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to Edit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#7209B7] transition-colors ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Publish Blog Post"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={newBlog.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD] outline-none transition-colors"
                    placeholder="Enter blog title"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Image URL *
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    required
                    value={newBlog.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD] outline-none transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Author *
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    required
                    value={newBlog.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD] outline-none transition-colors"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="coAuthor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Co-Author (Optional)
                  </label>
                  <input
                    type="text"
                    id="coAuthor"
                    name="coAuthor"
                    value={newBlog.coAuthor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD] outline-none transition-colors"
                    placeholder="Co-author name (if any)"
                  />
                </div>

                <div className="mb-4 md:col-span-2">
                  <label
                    htmlFor="link"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Blog Link *
                  </label>
                  <input
                    type="url"
                    id="link"
                    name="link"
                    required
                    value={newBlog.link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD] outline-none transition-colors"
                    placeholder="https://medium.com/your-blog-post"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    // Basic validation before showing preview
                    if (
                      !newBlog.title ||
                      !newBlog.image ||
                      !newBlog.author ||
                      !newBlog.link
                    ) {
                      setError("Please fill in all required fields");
                      return;
                    }
                    setError("");
                    setShowPreview(true);
                  }}
                  className="px-4 py-2 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#7209B7] transition-colors flex items-center"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Preview
                </button>
              </div>
            </form>
          )}
        </motion.div>
      )}

      {/* Blogs list */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
        </div>
      ) : blogs.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog._id || blog.id}
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6A0DAD]/10"
            >
              <div className="h-48 relative overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-[#1F1F1F] mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <div className="flex items-center text-[#6B7280] text-sm mb-3">
                  <span className="font-medium">{blog.author}</span>
                  {blog.coAuthor && (
                    <>
                      <span className="mx-2">&middot;</span>
                      <span>Co-author: {blog.coAuthor}</span>
                    </>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="bg-[#6A0DAD]/10 text-[#6A0DAD] px-3 py-1 rounded-full font-medium">
                    {blog.views?.toLocaleString() || 0} views
                  </span>
                  <Link
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="h-5 w-5 text-[#FF4ECD]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No blog posts found</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-[#6A0DAD] font-medium hover:text-[#7209B7] underline"
          >
            Create your first blog post
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogsManagement;
