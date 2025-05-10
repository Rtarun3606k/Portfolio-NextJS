"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BlogsClient = () => {
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
        console.log(data.blogs);
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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
    <section className="py-16 relative overflow-hidden bg-gradient-to-br from-[#E8EAF6] via-[#E0E7FF] to-[#EDE9FE]">
      {/* Enhanced decorative circles with blur effect */}
      <div className="absolute top-10 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#6A0DAD]/10 to-[#FF4ECD]/10 blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF4ECD]/10 to-[#6A0DAD]/10 blur-3xl opacity-40"></div>

      {/* Background circles positioned behind the entire component */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Larger circles with blur effects */}
        <div className="animate-float absolute top-[10%] left-[5%] w-32 h-32 bg-gradient-to-r from-[#5E60CE]/20 to-[#7209B7]/20 rounded-full blur-lg"></div>
        <div className="animate-float-delayed absolute top-[30%] right-[10%] w-40 h-40 bg-gradient-to-r from-[#7209B7]/20 to-[#E6CCE4]/30 rounded-full blur-lg"></div>
        <div className="animate-float-slow absolute bottom-[15%] left-[15%] w-36 h-36 bg-gradient-to-r from-[#C71585]/10 to-[#5E60CE]/20 rounded-full blur-lg"></div>

        {/* Medium circles with different animations */}
        <div className="animate-float-reverse absolute top-[45%] left-[25%] w-28 h-28 bg-gradient-to-br from-[#E6CCE4]/20 to-[#5E60CE]/10 rounded-full blur-md"></div>
        <div className="animate-float-diagonal absolute top-[20%] left-[70%] w-24 h-24 bg-gradient-to-bl from-[#7209B7]/10 to-[#C71585]/20 rounded-full blur-md"></div>
        <div className="animate-float-circular absolute bottom-[35%] right-[25%] w-36 h-36 bg-gradient-to-tr from-[#5E60CE]/20 to-[#E6CCE4]/20 rounded-full blur-lg"></div>

        {/* Smaller accent circles */}
        <div className="animate-pulsate absolute top-[65%] right-[12%] w-28 h-28 bg-gradient-to-r from-[#C71585]/10 to-[#5E60CE]/20 rounded-full blur-md"></div>
        <div className="animate-float-diagonal-reverse absolute top-[8%] left-[50%] w-20 h-20 bg-gradient-to-r from-[#E6CCE4]/20 to-[#7209B7]/10 rounded-full blur-sm"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-black text-center text-5xl font-space-grotesk  mb-3">
          My Blogs
        </h1>
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
                className="bg-white/80 backdrop-blur-sm hover:translate-y-1.5 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6A0DAD]/10"
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
                      e.target.src =
                        "https://placehold.co/600x400?text=No+Image";
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
    </section>
  );
};

export default BlogsClient;
