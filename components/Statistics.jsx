"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Stats } from "@/utils/Variables";

// Client component since we're using hooks and animations
export default function StatsPage() {
  const [stats, setStats] = useState({
    websiteVisitors: 12450,
    linkedinFollowers: 852,
    profileViews: 3280,
    projectsCompleted: 15,
    clientSatisfaction: "98%",
    countriesReached: 12,
  });

  const [isVisible, setIsVisible] = useState(true);

  const [isScrollable, setIsScrollable] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [scrollDirection, setScrollDirection] = useState("right");
  const scrollContainerRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  // Animation controls for the counting effect
  const [animatedStats, setAnimatedStats] = useState({});
  const [animationTriggered, setAnimationTriggered] = useState(false);

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const isScrollable = container.scrollWidth > container.clientWidth + 5;
        setIsScrollable(isScrollable);
      }
    };

    checkScrollable();
    const delayedCheck = setTimeout(checkScrollable, 500);

    window.addEventListener("resize", checkScrollable);
    return () => {
      window.removeEventListener("resize", checkScrollable);
      clearTimeout(delayedCheck);
    };
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isScrollable) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    if (isAutoScrolling) {
      autoScrollIntervalRef.current = setInterval(() => {
        if (!container) return;

        const isAtRightEdge =
          Math.ceil(container.scrollLeft + container.clientWidth) >=
          container.scrollWidth - 10;
        const isAtLeftEdge = container.scrollLeft <= 10;

        if (isAtRightEdge && scrollDirection === "right") {
          setScrollDirection("left");
        } else if (isAtLeftEdge && scrollDirection === "left") {
          setScrollDirection("right");
        }

        const scrollAmount = 2;
        container.scrollLeft +=
          scrollDirection === "right" ? scrollAmount : -scrollAmount;
      }, 20);
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [isScrollable, isAutoScrolling, scrollDirection]);

  // Pause auto-scroll on user interaction
  const handleContainerInteraction = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    if (isAutoScrolling) {
      setIsAutoScrolling(false);
    }

    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 5000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  // Manual scroll functions
  const scroll = (direction) => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    setIsAutoScrolling(false);

    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.75;
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }

    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 5000);
  };

  // Initialize animated stats with zeros
  useEffect(() => {
    if (Stats && Stats.length > 0) {
      const initialAnimatedValues = {};
      Stats.forEach((stat) => {
        // Only init numeric values - improved parsing to avoid negative numbers
        const numericValue = parseFloat(
          stat.value
            .toString()
            .replace(/,/g, "")
            .replace(/[^-\d.]/g, "")
        );
        if (!isNaN(numericValue)) {
          // Always start from 0, even for negative targets
          initialAnimatedValues[stat.title] = 0;
        } else {
          initialAnimatedValues[stat.title] = stat.value;
        }
      });
      setAnimatedStats(initialAnimatedValues);
    }
  }, []);

  // Number counting animation effect with improved easing
  useEffect(() => {
    if (!animationTriggered && Object.keys(animatedStats).length > 0) {
      return;
    }

    const animationDuration = 2500; // Increased to 2.5 seconds for better effect
    const frameDuration = 16; // Smoother animation (60fps)
    const totalFrames = animationDuration / frameDuration;

    let frame = 0;
    const countInterval = setInterval(() => {
      frame++;

      const progress = frame / totalFrames;
      const easedProgress = customEaseInOutBack(progress); // Use custom easing function

      const newAnimatedValues = {};
      Stats.forEach((stat) => {
        // Improved number parsing to handle negative numbers correctly
        const rawValue = stat.value.toString().replace(/,/g, "");
        const targetValue = parseFloat(rawValue.replace(/[^-\d.]/g, ""));

        if (!isNaN(targetValue)) {
          // For negative numbers, we need to ensure we animate in the right direction
          const isNegative = targetValue < 0;
          // Use absolute values for animation calculation
          const absTarget = Math.abs(targetValue);
          const currentValue = Math.round(easedProgress * absTarget);
          // Apply sign back if original was negative
          newAnimatedValues[stat.title] = isNegative
            ? -currentValue
            : currentValue;
        } else {
          newAnimatedValues[stat.title] = stat.value;
        }
      });

      setAnimatedStats(newAnimatedValues);

      if (frame >= totalFrames) {
        clearInterval(countInterval);

        // Ensure final values match the exact targets
        const finalValues = {};
        Stats.forEach((stat) => {
          finalValues[stat.title] = stat.value;
        });
        setAnimatedStats(finalValues);
      }
    }, frameDuration);

    return () => clearInterval(countInterval);
  }, [animationTriggered]);

  // Easing function for smooth animation - custom ease-in-out with faster middle
  function customEaseInOutBack(x) {
    // Custom easing function that starts slow, accelerates in the middle, then slows down at the end
    // Add a slight "back" effect for more visual interest
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  }

  const containerVariants = {
    hidden: { opacity: 1 }, // Changed from 0 to 1 to ensure visibility even before animation
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 1 }, // Changed from 0 to 1 to ensure visibility
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 1, y: -20 }, // Changed from 0 to 1 to ensure visibility
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  // Force re-evaluation of scrollability on Stats change
  useEffect(() => {
    if (Stats && Stats.length > 0) {
      const checkScrollable = () => {
        const container = scrollContainerRef.current;
        if (container) {
          setIsScrollable(container.scrollWidth > container.clientWidth);
        }
      };

      const timer = setTimeout(checkScrollable, 500);
      return () => clearTimeout(timer);
    }
  }, [Stats]);

  return (
    <section className="bg-gradient-to-r from-[#e0f7fa] to-[#fce4ec] py-16 px-4 md:px-8 overflow-hidden relative">
      {/* Background circles positioned behind the entire component */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="animate-float absolute top-[10%] left-[5%] w-32 h-32 bg-blue-300/20 rounded-full blur-lg"></div>
        <div className="animate-float-delayed absolute top-[30%] right-[10%] w-40 h-40 bg-purple-300/20 rounded-full blur-lg"></div>
        <div className="animate-float-slow absolute bottom-[15%] left-[15%] w-36 h-36 bg-pink-300/20 rounded-full blur-lg"></div>
        <div className="animate-float-reverse absolute top-[45%] left-[25%] w-28 h-28 bg-teal-300/20 rounded-full blur-lg"></div>
        <div className="animate-float-diagonal absolute top-[20%] left-[70%] w-24 h-24 bg-yellow-300/20 rounded-full blur-lg"></div>
        <div className="animate-float-circular absolute bottom-[35%] right-[25%] w-36 h-36 bg-indigo-300/20 rounded-full blur-lg"></div>
        <div className="animate-pulsate absolute top-[65%] right-[12%] w-28 h-28 bg-rose-300/20 rounded-full blur-lg"></div>
        <div className="animate-float-diagonal-reverse absolute top-[8%] left-[50%] w-20 h-20 bg-green-300/20 rounded-full blur-lg"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 1 }} // Force initial opacity to 1
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
          className="mb-16 text-center"
        >
          <span className="inline-block bg-[#5E60CE]/10 px-4 py-1 rounded-full text-[#5E60CE] font-medium mb-4">
            My Growth
          </span>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-[#1C1C1C] mb-3">
            The <span className="text-[#5E60CE]">Numbers</span> That Matter
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Quantifiable metrics showcasing the reach and impact of my
            professional journey
          </p>
        </motion.div>

        <div className="relative mb-16 sm:w-[95%] lg:w-[106%] mx-auto">
          {isScrollable && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 bg-white/80 rounded-full p-2 shadow-md hover:bg-[#5E60CE] hover:text-white transition-all duration-300"
                aria-label="Scroll left"
              >
                <FaChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 bg-white/80 rounded-full p-2 shadow-md hover:bg-[#5E60CE] hover:text-white transition-all duration-300"
                aria-label="Scroll right"
              >
                <FaChevronRight size={20} />
              </button>
            </>
          )}

          {/* Added a check to confirm Stats exists and has items */}
          {Stats && Stats.length > 0 ? (
            <motion.div
              ref={scrollContainerRef}
              variants={containerVariants}
              initial={{ opacity: 1 }} // Force initial opacity to 1
              animate={{ opacity: 1 }} // Force animate opacity to 1
              whileInView={() => {
                // Trigger number counting animation when this section is in view
                if (!animationTriggered) {
                  setAnimationTriggered(true);
                }
                return "visible";
              }}
              viewport={{ once: true, amount: 0.1 }}
              className="flex space-x-5 overflow-x-auto p-6 snap-x scrollbar-hide scroll-smooth opacity-100" // Added opacity-100 class
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                minWidth: "100%",
                opacity: 1, // Force inline style opacity to 1
              }}
              onMouseEnter={handleContainerInteraction}
              onMouseMove={handleContainerInteraction}
              onTouchStart={handleContainerInteraction}
              onTouchMove={handleContainerInteraction}
              onClick={handleContainerInteraction}
            >
              {Stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  variants={itemVariants}
                  initial={{ opacity: 1 }} // Force initial opacity to 1
                  animate={{ opacity: 1 }} // Force animate opacity to 1
                  whileHover={{ y: -5 }}
                  className="snap-center shrink-0 opacity-100" // Added opacity-100 class
                  style={{
                    width: "min(100%, 280px)",
                    opacity: 1, // Force inline style opacity to 1
                  }}
                >
                  <div
                    className={`h-full min-h-[200px] bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 flex flex-col justify-between opacity-100 relative overflow-hidden`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl">{stat.icon}</span>
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/30">
                          <span className="text-[#5E60CE] font-bold">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-space-grotesk text-lg font-medium text-[#1C1C1C] mb-2">
                        {stat.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {stat.description}
                      </p>
                    </div>
                    <p className="font-playfair text-4xl font-bold text-[#5E60CE] mt-6">
                      {/* Display animated number with formatting */}
                      {animatedStats[stat.title] !== undefined ? (
                        <>
                          {typeof animatedStats[stat.title] === "number"
                            ? animatedStats[stat.title].toLocaleString()
                            : animatedStats[stat.title]}
                          {/* Add plus sign at the end for numeric values */}
                          {typeof animatedStats[stat.title] === "number" &&
                            !stat.value.toString().includes("%") &&
                            "+"}
                        </>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">Loading statistics...</p>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 1 }} // Force initial opacity to 1
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-center"
        >
          <Link
            href="/about"
            className="inline-flex items-center group relative"
          >
            <span className="text-[#5E60CE] font-poppins font-medium text-lg mr-4 group-hover:text-[#7209B7] transition-all">
              Learn more about my journey
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
        </motion.div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* Additional styles to force opacity */
        .opacity-100 {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
