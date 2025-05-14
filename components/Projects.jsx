"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { getData, storeData } from "@/_utils/LocalStorage";
import { Fascinate } from "next/font/google";

// Sample project data - replace with your actual projects
const projectData1 = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with secure payments, real-time inventory, and responsive design across all devices.",
    image: "/projects/ecommerce.jpg", // Replace with your actual image path
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    githubUrl: "https://github.com/yourusername/ecommerce-platform",
    liveUrl: "https://ecommerce-example.com",
    featured: true,
  },
  {
    id: 2,
    title: "Cloud Management Dashboard",
    description:
      "Centralized cloud resource monitoring and management dashboard for Azure with cost optimization features.",
    image: "/projects/cloud-dashboard.jpg", // Replace with your actual image path
    tags: ["Azure", "React", "TypeScript", "D3.js"],
    githubUrl: "https://github.com/yourusername/cloud-dashboard",
    liveUrl: "https://cloud-dashboard-example.com",
    featured: true,
  },
  {
    id: 3,
    title: "AI Content Generator",
    description:
      "An AI-powered application that creates optimized content for blogs, social media, and marketing materials.",
    image: "/projects/ai-generator.jpg", // Replace with your actual image path
    tags: ["Python", "TensorFlow", "React", "FastAPI"],
    githubUrl: "https://github.com/yourusername/ai-content-generator",
    liveUrl: "https://ai-generator-example.com",
    featured: true,
  },
  {
    id: 4,
    title: "Healthcare Patient Portal",
    description:
      "Secure patient portal for healthcare providers with appointment scheduling and medical record access.",
    image: "/projects/healthcare-portal.jpg", // Replace with your actual image path
    tags: ["Next.js", "GraphQL", "PostgreSQL", "Auth0"],
    githubUrl: "https://github.com/yourusername/healthcare-portal",
    liveUrl: "https://healthcare-portal-example.com",
    featured: true,
  },
  {
    id: 5,
    title: "Real-time Collaboration Tool",
    description:
      "Team collaboration platform with real-time document editing, video conferencing, and task management.",
    image: "/projects/collaboration-tool.jpg", // Replace with your actual image path
    tags: ["WebSockets", "React", "Redis", "WebRTC"],
    githubUrl: "https://github.com/yourusername/collaboration-tool",
    liveUrl: "https://collab-tool-example.com",
    featured: true,
  },
];

// const projectData =
//   JSON.parse(localStorage.getItem("data")).value[4].projects || projectData1;

const Projects = ({ showMore = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(null);
  const carouselRef = useRef(null);
  const [projectData, setProjectData] = useState(projectData1);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (getData("projects") !== null) {
          const data = getData("projects");
          console.log("Fetched services from localStorage:", data);
          setProjectData(data);
          return;
        } else {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects` // Replace with your API endpoint
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Fetched services:", data.projects);
          storeData("projects", data.projects);
          setProjectData(data.projects);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  // Handle window resize and set responsive state
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    // setProjectData(
    //   JSON.parse(localStorage.getItem("data")).value[4].projects || projectData1
    // );
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (!autoRotate) return;

    const rotateInterval = 5000; // 5 seconds between rotations
    autoRotateRef.current = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, rotateInterval);

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [autoRotate, currentIndex, isAnimating]);

  // Touch handling for swipe
  useEffect(() => {
    if (!carouselRef.current) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      setAutoRotate(false);
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      // Minimum swipe distance
      const minSwipeDistance = 50;
      const swipeDistance = touchEndX - touchStartX;

      if (!isAnimating) {
        if (swipeDistance > minSwipeDistance) {
          handlePrev();
        } else if (swipeDistance < -minSwipeDistance) {
          handleNext();
        }
      }

      // Resume auto-rotation after a delay
      setTimeout(() => setAutoRotate(true), 5000);
    };

    const carousel = carouselRef.current;
    carousel.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    carousel.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      carousel.removeEventListener("touchstart", handleTouchStart);
      carousel.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isAnimating]);

  // Pause auto-rotation on hover
  const handleMouseEnter = () => setAutoRotate(false);
  const handleMouseLeave = () => setAutoRotate(true);

  // Navigation handlers
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projectData.length);
    setTimeout(() => setIsAnimating(false), 500); // Match with animation duration
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + projectData.length) % projectData.length
    );
    setTimeout(() => setIsAnimating(false), 500); // Match with animation duration
  };

  // Get visible cards based on current index
  const getVisibleProjects = () => {
    const projects = [];
    const centerIndex = currentIndex;
    const leftIndex =
      (currentIndex - 1 + projectData.length) % projectData.length;
    const rightIndex = (currentIndex + 1) % projectData.length;

    projects.push({
      ...projectData[leftIndex],
      position: "left",
    });

    projects.push({
      ...projectData[centerIndex],
      position: "center",
    });

    projects.push({
      ...projectData[rightIndex],
      position: "right",
    });

    return projects;
  };

  // Card variants for animations - Updated with wider spacing
  const cardVariants = {
    left: {
      x: "-30%", // Increased from -20% to -30% for more spacing
      scale: 0.8,
      opacity: 0.7,
      zIndex: 0,
      filter: "blur(2px)",
      transition: { duration: 0.5 },
    },
    center: {
      x: "0%",
      scale: 1,
      opacity: 1,
      zIndex: 1,
      filter: "blur(0px)",
      transition: { duration: 0.5 },
    },
    right: {
      x: "30%", // Increased from 20% to 30% for more spacing
      scale: 0.8,
      opacity: 0.7,
      zIndex: 0,
      filter: "blur(2px)",
      transition: { duration: 0.5 },
    },
    // For entering cards
    enterFromLeft: {
      x: "-100%",
      scale: 0.8,
      opacity: 0,
      filter: "blur(4px)",
    },
    enterFromRight: {
      x: "100%",
      scale: 0.8,
      opacity: 0,
      filter: "blur(4px)",
    },
    // For exiting cards
    exitToLeft: {
      x: "-100%",
      scale: 0.8,
      opacity: 0,
      filter: "blur(4px)",
      transition: { duration: 0.5 },
    },
    exitToRight: {
      x: "100%",
      scale: 0.8,
      opacity: 0,
      filter: "blur(4px)",
      transition: { duration: 0.5 },
    },
  };

  // Only show one card at a time on mobile
  const mobileCardVariants = {
    center: {
      x: "0%",
      scale: 1,
      opacity: 1,
      zIndex: 1,
      filter: "blur(0px)",
      transition: { duration: 0.5 },
    },
    exitToLeft: {
      x: "-100%",
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.5 },
    },
    exitToRight: {
      x: "100%",
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.5 },
    },
    enterFromLeft: {
      x: "-100%",
      scale: 0.8,
      opacity: 0,
    },
    enterFromRight: {
      x: "100%",
      scale: 0.8,
      opacity: 0,
    },
  };

  const visibleProjects = isMobile
    ? [projectData[currentIndex]]
    : getVisibleProjects();

  return (
    <section className="py-16 px-4 sm:px-6 md:px-10 bg-[#FDFDFD] overflow-hidden relative">
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

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#5E60CE]/10 px-4 py-1 rounded-full text-[#5E60CE] font-medium mb-4">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#1C1C1C] mb-4">
            Featured <span className="text-[#5E60CE]">Projects</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore a selection of my recent work showcasing expertise in
            full-stack development, cloud architecture, and innovative
            solutions.
          </p>
        </div>

        <div
          ref={carouselRef}
          className="relative w-full md:w-[90%] mx-auto h-[450px] md:h-[500px] overflow-visible" // Increased width, reduced height
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence initial={false}>
            {visibleProjects.map((project) => {
              // Determine which variant to use based on position and device
              let variant = isMobile ? "center" : project.position;

              return (
                <motion.div
                  key={project.id || project._id}
                  custom={project.position}
                  variants={isMobile ? mobileCardVariants : cardVariants}
                  initial={
                    project.position === "left"
                      ? "enterFromLeft"
                      : project.position === "right"
                      ? "enterFromRight"
                      : "center"
                  }
                  animate={variant}
                  exit={
                    project.position === "left"
                      ? "exitToLeft"
                      : project.position === "right"
                      ? "exitToRight"
                      : project.position === "center" &&
                        currentIndex > project.id
                      ? "exitToLeft"
                      : "exitToRight"
                  }
                  className={`absolute top-0 left-0 right-0 w-full md:w-[60%] lg:w-[55%] max-w-2xl mx-auto h-full`} // Reduced width for center card
                  style={{
                    originX: 0.5,
                    originY: 0.5,
                    margin: "0 auto",
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className={`h-full rounded-2xl overflow-hidden bg-white border-[3px] ${
                      variant === "center"
                        ? "border-[#C71585]"
                        : "border-transparent"
                    } shadow-xl transition-all duration-500 flex flex-col`}
                  >
                    {/* Project Image */}
                    <div className="relative h-[55%] w-full bg-gray-200 overflow-hidden">
                      {/* Reduced height from 40% to 35% */}
                      {/* Replace with actual images */}
                      <div className="w-full h-full bg-gradient-to-r from-[#5E60CE]/20 to-[#7209B7]/20 flex items-center justify-center">
                        {/* <span className="text-[#5E60CE] opacity-60 text-5xl font-light">

                          {project.title[0]}
                        </span> */}
                        {/* <img src={project?.imageUrl} alt="no image" /> */}

                        <img
                          src="https://walkez.blob.core.windows.net/projects/1746435456870-Microsoft-Learner-Badge-Guinness-World-Record-Holder.png"
                          alt="no iamge"
                        />
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                      {/* Reduced padding on mobile */}
                      <div>
                        <h3 className="text-xl md:text-2xl font-space-grotesk font-bold text-[#1C1C1C] mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base mb-3 line-clamp-2">
                          {/* Reduced from line-clamp-3 to line-clamp-2, less margin */}
                          {project.description}
                        </p>

                        {/* Project Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {/* Reduced margin-bottom from 6 to 4 */}
                          {project.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-[#5E60CE]/10 hover:bg-[#E6CCE4] transition-colors text-[#5E60CE] text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Project Links */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex space-x-3">
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-[#E6CCE4] transition-colors"
                            aria-label={`View ${project.title} on GitHub`}
                          >
                            <FaGithub className="text-[#1C1C1C]" size={20} />
                          </a>
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-[#E6CCE4] transition-colors"
                            aria-label={`Visit live demo for ${project.title}`}
                          >
                            <FaExternalLinkAlt
                              className="text-[#1C1C1C]"
                              size={18}
                            />
                          </a>
                        </div>

                        {variant === "center" && (
                          <button
                            className="text-[#5E60CE] hover:text-[#7209B7] transition-colors text-sm font-medium flex items-center"
                            onClick={() => (window.location.href = "/Projects")}
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Navigation Buttons - Now positioned with more space */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-0 items-center w-full md:w-[95%] max-w-6xl mx-auto">
            {/* Increased width to 95% */}
            <button
              onClick={handlePrev}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/80 shadow-lg hover:bg-[#5E60CE] hover:text-white transition-all z-10"
              aria-label="Previous project"
            >
              <FaChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/80 shadow-lg hover:bg-[#5E60CE] hover:text-white transition-all z-10"
              aria-label="Next project"
            >
              <FaChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Project Counter */}
        <div className="flex items-center justify-center mt-6">
          {/* Reduced margin-top from 8 to 6 */}
          <div className="flex space-x-2">
            {projectData.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 500);
                }}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-[#5E60CE] scale-125"
                    : "bg-gray-300"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Link to All Projects */}
        {showMore === true ? (
          <div className="text-center mt-12">
            <Link
              href="/Projects"
              className="inline-flex items-center group relative"
            >
              <span className="text-[#5E60CE] font-poppins font-medium text-lg mr-4 group-hover:text-[#7209B7] transition-all">
                See all projects
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
                    stroke="#5E60CE"
                    strokeWidth="2"
                    strokeDasharray="110 30"
                    className="group-hover:stroke-[#7209B7] transition-all"
                  />
                  <path
                    d="M20 16L28 24L20 32"
                    stroke="#5E60CE"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:stroke-[#7209B7] transition-all"
                  />
                </svg>
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-[#7209B7] transition-opacity"></div>
              </div>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Projects;
