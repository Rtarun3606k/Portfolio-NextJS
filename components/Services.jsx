"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ServicesData } from "@/_utils/Variables";
import { getData, storeData } from "@/_utils/LocalStorage";
import parse from "html-react-parser";

const Services = ({ showMore = false, limited = false }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [services, setServices] = useState(ServicesData); // fallback
  const [loading, setLoading] = useState(true);

  // Move data fetching logic outside of the component's render cycle
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);

        // Check if data exists in localStorage first
        const cachedData = getData("services");
        if (cachedData) {
          console.log("Using cached services from localStorage");
          setServices(cachedData);
          setLoading(false);
          return;
        }

        // Fetch from API if no cached data exists
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/services`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Fetched services from API");

        // Store in localStorage for future use
        storeData("services", data.services);
        setServices(data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
        // Fallback to default data if fetch fails
        if (!getData("services")) {
          setServices(ServicesData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []); // Empty dependency array means this runs once on mount

  // Categories of services - moved outside of render cycle
  const categories = [
    { id: "all", name: "All Services" },
    { id: "web", name: "Web Development" },
    { id: "app", name: "App Development" },
    { id: "cms", name: "CMS Solutions" },
    { id: "video", name: "Video Editing" },
    { id: "cloud", name: "Cloud Solutions" },
  ];

  // Memoize the filtered services to prevent unnecessary recalculations
  const filteredServices = React.useMemo(() => {
    return activeCategory === "all"
      ? services
      : services.filter((service) => service.category === activeCategory);
  }, [services, activeCategory]);

  // Animation variants - moved outside of render cycle
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

  const tabVariants = {
    inactive: { borderBottom: "2px solid transparent" },
    active: {
      borderBottom: "2px solid #6A0DAD",
      transition: { duration: 0.3 },
    },
  };

  // Handle category change with useCallback to prevent recreating the function on each render
  const handleCategoryChange = useCallback((categoryId) => {
    setActiveCategory(categoryId);
  }, []);

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-br from-[#E8EAF6] via-[#E0E7FF] to-[#EDE9FE]">
      {/* Background decorative elements - unchanged */}
      <div className="absolute top-10 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#6A0DAD]/10 to-[#FF4ECD]/10 blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF4ECD]/10 to-[#6A0DAD]/10 blur-3xl opacity-40"></div>

      {/* Background circles - unchanged */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="animate-float absolute top-[10%] left-[5%] w-32 h-32 bg-gradient-to-r from-[#5E60CE]/20 to-[#7209B7]/20 rounded-full blur-lg"></div>
        <div className="animate-float-delayed absolute top-[30%] right-[10%] w-40 h-40 bg-gradient-to-r from-[#7209B7]/20 to-[#E6CCE4]/30 rounded-full blur-lg"></div>
        <div className="animate-float-slow absolute bottom-[15%] left-[15%] w-36 h-36 bg-gradient-to-r from-[#C71585]/10 to-[#5E60CE]/20 rounded-full blur-lg"></div>
        <div className="animate-float-reverse absolute top-[45%] left-[25%] w-28 h-28 bg-gradient-to-br from-[#E6CCE4]/20 to-[#5E60CE]/10 rounded-full blur-md"></div>
        <div className="animate-float-diagonal absolute top-[20%] left-[70%] w-24 h-24 bg-gradient-to-bl from-[#7209B7]/10 to-[#C71585]/20 rounded-full blur-md"></div>
        <div className="animate-float-circular absolute bottom-[35%] right-[25%] w-36 h-36 bg-gradient-to-tr from-[#5E60CE]/20 to-[#E6CCE4]/20 rounded-full blur-lg"></div>
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
            My Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#6B7280] font-inter max-w-2xl mx-auto"
          >
            Professional digital solutions tailored to your business needs with
            transparent pricing
          </motion.p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-4xl">
            <div className="scrollbar-hide flex overflow-x-auto pb-3 px-1 gap-1 md:gap-2 justify-start md:justify-center">
              <div className="inline-flex bg-white/50 backdrop-blur-sm rounded-full shadow-sm p-1.5 min-w-max">
                {categories.map((category) => (
                  <motion.button
                    key={category.id || category._id}
                    variants={tabVariants}
                    animate={
                      activeCategory === category.id ? "active" : "inactive"
                    }
                    onClick={() => handleCategoryChange(category.id)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs md:text-sm font-medium transition-all ${
                      activeCategory === category.id
                        ? "bg-[#6A0DAD]/10 text-[#6A0DAD]"
                        : "text-[#6B7280] hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid with loading state */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map((placeholder) => (
              <div
                key={placeholder}
                className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-[#6A0DAD]/10 h-full animate-pulse"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-gray-200 mr-4"></div>
                    <div className="h-6 bg-gray-200 w-24 rounded"></div>
                  </div>
                  <div className="space-y-3 flex-grow">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            layout
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            {(limited ? filteredServices.slice(0, 6) : filteredServices).map(
              (service) => (
                <motion.div
                  layout
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
                        <span className="text-gray-700">
                          {service.timeframe}
                        </span>
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
              )
            )}
          </motion.div>
        )}

        {/* Custom projects banner - unchanged */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED] rounded-xl p-8 shadow-lg text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/30 rounded-full filter blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/20 rounded-full filter blur-xl transform translate-x-1/4 translate-y-1/4"></div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 font-poppins">
                  Need a Custom Solution?
                </h3>
                <p className="max-w-2xl text-white/90">
                  Don't see exactly what you're looking for? I specialize in
                  creating custom solutions tailored precisely to your unique
                  requirements and business goals.
                </p>
              </div>

              <Link
                href="/Contact"
                className="inline-flex items-center group relative bg-white text-[#6A0DAD] px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105 shadow-md"
              >
                Let's Discuss Your Project
                <svg
                  className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
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

        {/* See more services link - conditional rendering */}
        {showMore === true && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              href="/Contact"
              className="inline-flex items-center group relative"
            >
              <span className="text-[#6A0DAD] font-poppins font-medium text-lg mr-4 group-hover:text-[#7209B7] transition-all">
                Contact for more information
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
        )}
      </div>
    </section>
  );
};

export default Services;
