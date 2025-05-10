"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getData, storeData } from "@/_utils/LocalStorage";
import parse from "html-react-parser";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  // Sample blogs data
  const defaultBlogs = [
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

  // Default services
  const defaultServices = [
    {
      id: 1,
      title: "Web Development",
      description:
        "Custom websites using modern frameworks like React and Next.js",
      price: "$500 - $2,500",
      timeframe: "2-4 weeks",
      iconPath:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>',
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications",
      price: "$1,000 - $5,000",
      timeframe: "4-8 weeks",
      iconPath:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>',
    },
  ];

  const [blogs, setBlogs] = useState(defaultBlogs);
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (getData("blogs") !== null) {
          const data = getData("blogs");
          console.log("Fetched blogs from localStorage:", data);
          setBlogs(data);
          return;
        } else {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Fetched blogs:", data.blogs);
          storeData("blogs", data.blogs);
          setBlogs(data.blogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    const fetchServices = async () => {
      try {
        if (getData("services") !== null) {
          const data = getData("services");
          console.log("Fetched services from localStorage:", data);
          setServices(data);
          return;
        } else {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/services`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Fetched services:", data.services);
          storeData("services", data.services);
          setServices(data.services);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchBlogs();
    fetchServices();
  }, []);

  // Display only first 4 blogs
  const displayBlogs = blogs.slice(0, 4);

  // Display only first 2 services
  const displayServices = services.slice(0, 2);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
        damping: 10,
      },
    },
  };

  const glitchAnimation = {
    initial: { skew: 0, translateX: 0 },
    animate: {
      skew: [0, -5, 5, 0],
      translateX: [0, 10, -10, 0],
      transition: {
        duration: 0.4,
        repeat: Infinity,
        repeatType: "mirror",
        repeatDelay: 5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#fce4ec] py-16 px-4 md:px-8 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="animate-float absolute top-[10%] left-[5%] w-32 h-32 bg-blue-300/20 rounded-full blur-lg"></div>
        <div className="animate-float-delayed absolute top-[30%] right-[10%] w-40 h-40 bg-purple-300/20 rounded-full blur-lg"></div>
        <div className="animate-float-slow absolute bottom-[15%] left-[15%] w-36 h-36 bg-pink-300/20 rounded-full blur-lg"></div>
        <div className="animate-float-reverse absolute bottom-[35%] right-[25%] w-36 h-36 bg-indigo-300/20 rounded-full blur-lg"></div>
      </div>

      <div className="mb-5 lg:mt-[-4%] sm:mt-[0%]">
        <Navbar />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* 404 Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-[#5E60CE]/10 px-4 py-1 rounded-full text-[#5E60CE] font-medium mb-4"
          >
            Error 404
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-playfair font-bold text-[#1C1C1C] mb-6"
            {...glitchAnimation}
          >
            <span className="text-[#6A0DAD]">Oops!</span> Page Not Found
          </motion.h1>

          <motion.p
            className="text-gray-600 max-w-xl mx-auto text-lg mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            The page you're looking for seems to have wandered off into the
            digital void. While we search for it, why not explore some of my
            latest content?
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              Back to Home
            </Link>

            <Link
              href="/Contact"
              className="px-6 py-3 bg-white/80 text-[#6A0DAD] font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#6A0DAD]/20 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              Contact Me
            </Link>
          </motion.div>
        </div>

        {/* Blog section */}

        {/* Services section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-playfair font-bold text-[#1C1C1C] mb-3">
              Explore My <span className="text-[#6A0DAD]">Services</span>
            </h2>
            <p className="text-gray-600">Need help with your next project?</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {displayServices.map((service) => (
              <motion.div
                key={service.id || service._id}
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6A0DAD]/10 h-full"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6A0DAD]/10 to-[#FF4ECD]/20 flex items-center justify-center mr-4 text-[#6A0DAD]">
                      <div className="w-14 h-14 flex items-center justify-center">
                        {typeof service.iconPath === "string"
                          ? parse(String(service.iconPath))
                          : service.iconPath}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-[#1F1F1F] font-poppins">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-[#6B7280] mb-6 flex-grow">
                    {service.description}
                  </p>

                  <div className="border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-[#6B7280]">
                        Price Range:
                      </span>
                      <span className="text-[#6A0DAD] font-semibold">
                        {service.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-[#6B7280]">
                        Timeframe:
                      </span>
                      <span className="text-gray-700">{service.timeframe}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="text-sm text-[#6B7280] mb-4">
                      <span className="font-medium">Payment Methods:</span>{" "}
                      PayPal, AirTM
                    </div>
                    <Link
                      href="/Contact"
                      className="inline-flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED] text-white font-medium rounded-lg transition-transform hover:scale-[1.02] hover:shadow-md"
                    >
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
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-8">
            <Link
              href="/Services"
              className="inline-flex items-center group px-6 py-3 border-2 border-[#6A0DAD] text-[#6A0DAD] font-medium rounded-lg hover:bg-[#6A0DAD] hover:text-white transition-all duration-300"
            >
              View All Services
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-playfair font-bold text-[#1C1C1C] mb-3">
              Check Out My{" "}
              <span className="text-[#6A0DAD]">Latest Articles</span>
            </h2>
            <p className="text-gray-600">
              Explore some of my recent thoughts and tutorials
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {displayBlogs.map((blog) => (
              <motion.div
                key={blog.id || blog._id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6A0DAD]/10"
              >
                <Link
                  href={blog.link || "/Blog/" + blog._id}
                  rel="noopener noreferrer"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={blog.featuredImage || blog.image}
                      alt={blog.title}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
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
                        {typeof blog.views === "number"
                          ? blog.views.toLocaleString()
                          : blog.views}{" "}
                        views
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

          <div className="text-center mt-8">
            <Link
              href="/Blog"
              className="inline-flex items-center group px-6 py-3 border-2 border-[#6A0DAD] text-[#6A0DAD] font-medium rounded-lg hover:bg-[#6A0DAD] hover:text-white transition-all duration-300"
            >
              View All Articles
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes float-delayed {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes float-slow {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes float-reverse {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(15px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite 1s;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 5s ease-in-out infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
