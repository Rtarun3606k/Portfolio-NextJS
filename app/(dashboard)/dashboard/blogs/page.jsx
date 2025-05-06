"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BlogsManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Handle delete blog
  const handleDelete = async (blogId) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const response = await fetch(`/api/blogs/${blogId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete blog");
        }

        // Remove blog from state
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
      } catch (error) {
        console.error("Error deleting blog:", error);
        setError("Failed to delete blog");
      }
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
        <Link
          href="/dashboard/blogs/add"
          className="bg-[#6A0DAD] hover:bg-[#7209B7] text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Blog Post
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded-lg text-red-700">{error}</div>
      ) : blogs.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6A0DAD]/10"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={
                    blog.featuredImage ||
                    blog.image ||
                    "https://placehold.co/600x400?text=No+Image"
                  }
                  alt={blog.title}
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x400?text=No+Image";
                  }}
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-[#1F1F1F] mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <div className="flex items-center text-[#6B7280] text-sm mb-3">
                  <span className="font-medium">{blog.author}</span>
                  <span className="mx-2">&middot;</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-gray-600 mb-3">
                  <p className="line-clamp-3">
                    {blog.content
                      ?.replace(/[*#\[\]()!]/g, "")
                      .substring(0, 100)}
                    ...
                  </p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="bg-[#6A0DAD]/10 text-[#6A0DAD] px-3 py-1 rounded-full font-medium">
                    {blog.views?.toLocaleString() || 0} views
                  </span>
                  <div className="flex space-x-3">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/blogs/edit/${blog._id}`)
                      }
                      className="text-blue-600 hover:text-blue-800"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-600 hover:text-red-800"
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
                    <Link
                      href={`/Blog/${blog._id}`}
                      className="text-[#FF4ECD] hover:text-[#FF6FD8]"
                    >
                      <svg
                        className="h-5 w-5"
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
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No blog posts found</p>
          <Link
            href="/dashboard/blogs/new"
            className="text-[#6A0DAD] font-medium hover:text-[#7209B7] underline"
          >
            Create your first blog post
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogsManagement;
