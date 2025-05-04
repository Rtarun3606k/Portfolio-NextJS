"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const BlogsAndPosts = () => {
  const [activeTab, setActiveTab] = useState("blogs");

  // Sample blog data
  const blogs = [
    {
      id: 1,
      title: "Building Scalable React Applications",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
      author: "Tarun Nayaka",
      coAuthor: "Alex Johnson",
      link: "https://medium.com/@tarunnayaka/building-scalable-react-applications",
      views: 3570,
    },
    {
      id: 2,
      title: "Machine Learning for Beginners: A Comprehensive Guide",
      image:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2070&auto=format&fit=crop",
      author: "Tarun Nayaka",
      coAuthor: "",
      link: "https://dev.to/tarunnayaka/machine-learning-for-beginners",
      views: 4280,
    },
    {
      id: 3,
      title: "The Future of Web Development with Next.js",
      image:
        "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop",
      author: "Tarun Nayaka",
      coAuthor: "Sarah Peters",
      link: "https://medium.com/@tarunnayaka/future-of-web-development-nextjs",
      views: 2150,
    },
    {
      id: 4,
      title: "Optimizing Performance in JavaScript Applications",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
      author: "Tarun Nayaka",
      coAuthor: "",
      link: "https://dev.to/tarunnayaka/optimizing-performance-javascript",
      views: 3840,
    },
  ];

  // Sample LinkedIn posts data
  const linkedinPosts = [
    {
      id: 1,
      title: "Reflections on Building Tech Communities",
      image:
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop",
      description:
        "Today I want to share my experience building tech communities from scratch. The key factors that contributed to our success were consistency, inclusivity, and providing real value to members.",
      link: "https://linkedin.com/in/tarunnayaka/posts/reflections-building-tech-communities",
    },
    {
      id: 2,
      title: "Why TypeScript Is Here To Stay",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
      description:
        "After 5 years of working with TypeScript, I've compiled the top 5 reasons why it's not just a trend but an essential tool for modern development teams.",
      link: "https://linkedin.com/in/tarunnayaka/posts/why-typescript-is-here-to-stay",
    },
    {
      id: 3,
      title: "My Journey From Junior Developer to Tech Lead",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
      description:
        "Sharing the key milestones, challenges, and learnings from my 7-year journey from being a junior developer to leading technical teams and mentoring others.",
      link: "https://linkedin.com/in/tarunnayaka/posts/journey-junior-to-tech-lead",
    },
    {
      id: 4,
      title: "Embracing AI Tools in Development Workflows",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
      description:
        "How our team increased productivity by 40% by strategically integrating AI tools into our development workflow without compromising code quality.",
      link: "https://linkedin.com/in/tarunnayaka/posts/embracing-ai-tools-dev-workflows",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const tabVariants = {
    inactive: { borderBottom: "2px solid transparent" },
    active: {
      borderBottom: "2px solid #6A0DAD",
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-br from-[#E8EAF6] via-[#E0E7FF] to-[#EDE9FE]">
      {/* Enhanced decorative circles with blur effect */}
      <div className="absolute top-10 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#6A0DAD]/10 to-[#FF4ECD]/10 blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF4ECD]/10 to-[#6A0DAD]/10 blur-3xl opacity-40"></div>
      <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-[#6A0DAD]/5 blur-2xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-[#FF4ECD]/10 blur-xl"></div>

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
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold font-poppins text-[#1F1F1F] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED]"
          >
            Blogs & Posts
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#6B7280] font-inter max-w-2xl mx-auto"
          >
            Sharing knowledge and insights through technical writing and social
            media
          </motion.p>
        </div>

        {/* Tabs with enhanced styling */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-8 border-b border-[#6A0DAD]/20 w-full max-w-md justify-center rounded-full bg-white/50 backdrop-blur-sm py-2 px-4 shadow-sm">
            <motion.button
              variants={tabVariants}
              animate={activeTab === "blogs" ? "active" : "inactive"}
              onClick={() => setActiveTab("blogs")}
              className={`pb-2 px-2 text-lg font-medium transition-colors duration-300 ${
                activeTab === "blogs" ? "text-[#6A0DAD]" : "text-[#6B7280]"
              }`}
            >
              Blogs
            </motion.button>
            <motion.button
              variants={tabVariants}
              animate={activeTab === "linkedin" ? "active" : "inactive"}
              onClick={() => setActiveTab("linkedin")}
              className={`pb-2 px-2 text-lg font-medium transition-colors duration-300 ${
                activeTab === "linkedin" ? "text-[#6A0DAD]" : "text-[#6B7280]"
              }`}
            >
              LinkedIn Posts
            </motion.button>
          </div>
        </div>

        {/* Blogs Section with improved card styling */}
        {activeTab === "blogs" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6A0DAD]/10"
              >
                <Link
                  href={blog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-poppins font-semibold text-lg text-[#1F1F1F] mb-2 line-clamp-2">
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
                        {blog.views.toLocaleString()} views
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
        )}

        {/* LinkedIn Posts Section with improved styling */}
        {activeTab === "linkedin" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {linkedinPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row border border-[#6A0DAD]/10"
              >
                <Link
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-2/5 h-48 md:h-auto relative"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 hover:scale-105"
                  />
                </Link>
                <div className="p-5 w-full md:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-poppins font-semibold text-lg text-[#1F1F1F] mb-2">
                      {post.title}
                    </h3>
                    <p className="text-[#6B7280] text-sm line-clamp-2 mb-3">
                      {post.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-[#0077b5]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                      </svg>
                      <span className="ml-1 text-xs text-[#6B7280]">
                        LinkedIn
                      </span>
                    </div>
                    <Link
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF4ECD] hover:underline text-sm font-semibold flex items-center group"
                    >
                      Read more
                      <svg
                        className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
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
        )}

        {/* Replacement for View All Button with circular arrow design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href={
              activeTab === "blogs"
                ? "/Blog"
                : "https://linkedin.com/in/tarunnayaka"
            }
            target={activeTab === "linkedin" ? "_blank" : "_self"}
            className="inline-flex items-center group relative"
          >
            <span className="text-[#6A0DAD] font-poppins font-medium text-lg mr-4 group-hover:text-[#7209B7] transition-all">
              See all {activeTab === "blogs" ? "blogs" : "posts"}
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
    </section>
  );
};

export default BlogsAndPosts;
