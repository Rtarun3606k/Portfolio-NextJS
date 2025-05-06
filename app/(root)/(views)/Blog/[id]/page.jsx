"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Page = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogContent, setBlogContent] = useState("");
  const [blog, setBlog] = useState({});
  const [suggestedBlogs, setSuggestedBlogs] = useState([]);

  const addViews = async () => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ views: blog.views }),
      });
      if (!res.ok) {
        throw new Error("Failed to update views");
      }
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status}`);
        }
        const data = await res.json();
        setBlog(data);
        setBlogContent(data.content);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedBlogs = async () => {
      try {
        const res = await fetch(`/api/blogs/suggested?exclude=${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch suggested blogs");
        }
        const data = await res.json();
        setSuggestedBlogs(data);
      } catch (error) {
        console.error("Error fetching suggested blogs:", error);
      }
    };

    if (id) {
      fetchBlog();
      addViews();
      fetchSuggestedBlogs();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-red-500 text-xl">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black font-space-grotesk">
        {blog.title}
      </h1>
      <div className="flex flex-wrap items-center text-gray-600 mb-6">
        {blog.author && (
          <span className="font-medium mr-3">
            By: {(blog.author && blog.author.len > 2) || "Tarun Nayaka R"}
          </span>
        )}
        {blog.createdAt && (
          <>
            <span className="mx-2 hidden sm:inline">&middot;</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </>
        )}
      </div>
      <div className="mb-8">
        {blog.featuredImage && (
          <div className="relative h-64 md:h-96 w-full mb-6 rounded-xl overflow-hidden">
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        )}
      </div>

      <div className="prose prose-lg max-w-none">
        <MarkdownPreview
          source={blogContent}
          wrapperElement={{ "data-color-mode": "light" }}
          style={{ backgroundColor: "#c7d2fe", color: "black" }}
        />
      </div>

      {suggestedBlogs.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-black">
            Related Articles
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {suggestedBlogs.map((blog) => (
              <motion.div
                key={blog._id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6A0DAD]/10"
              >
                <Link href={`/Blog/${blog._id}`}>
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={
                        blog.featuredImage ||
                        "https://placehold.co/600x400?text=No+Image"
                      }
                      alt={blog.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-500 hover:scale-105"
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
                      {blog.createdAt && (
                        <>
                          <span className="mx-2">&middot;</span>
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="bg-[#6A0DAD]/10 text-[#6A0DAD] px-3 py-1 rounded-full font-medium">
                        {blog.views?.toLocaleString() || 0} views
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
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center mt-12"
      >
        <Link href="/Blog" className="inline-flex items-center group relative">
          <span className="text-[#6A0DAD] font-medium text-lg mr-4 group-hover:text-[#7209B7] transition-all">
            Back to Blogs
          </span>

          {/* Custom SVG circle with arrow */}
          <div className="relative w-12 h-12">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              className="absolute top-0 left-0 transition-transform duration-500 group-hover:rotate-180"
            >
              <circle
                cx="24"
                cy="24"
                r="18"
                fill="none"
                stroke="#6A0DAD"
                strokeWidth="2"
                strokeDasharray="110 30"
                className="group-hover:stroke-[#7209B7] transition-all"
              />
              <path
                d="M20 16L28 24L20 32"
                stroke="#6A0DAD"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:stroke-[#7209B7] transition-all"
              />
            </svg>
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-[#7209B7] transition-opacity"></div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

export default Page;
