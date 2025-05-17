"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaLaptopCode,
  FaLinkedin,
  FaGithub,
  FaGoogle,
  FaCloud,
  FaWhatsapp,
  FaServer,
  FaDatabase,
} from "react-icons/fa";
import { Technology } from "@/_utils/Variables";

const Hero = () => {
  const techStackRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Control animations visibility
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const container = techStackRef.current;
    if (!container) return;

    let scrollAmount = 0;
    let isHovered = false;
    let isTouching = false;
    let animationId;
    let scrollSpeed = 0.15; // Reduced speed for smoother scrolling

    // Handle mouse interactions
    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
    };

    // Handle touch interactions
    const handleTouchStart = () => {
      isTouching = true;
      // Completely stop auto-scrolling during touch
      cancelAnimationFrame(animationId);
    };

    const handleTouchEnd = () => {
      isTouching = false;
      // Resume auto-scrolling after a delay
      setTimeout(() => {
        if (!isHovered && !isTouching) {
          animationId = requestAnimationFrame(step);
        }
      }, 1500); // Longer delay before resuming
    };

    // Add event listeners with passive: true for better performance
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd);

    // Smooth scrolling animation
    const step = () => {
      if (container && !isHovered && !isTouching) {
        scrollAmount += scrollSpeed;

        // Smoothly loop back to the start when reaching the end
        if (scrollAmount >= container.scrollWidth - container.clientWidth) {
          // Create a smooth transition back to the beginning
          scrollSpeed *= 0.95; // Gradually slow down
          if (scrollSpeed < 0.01) {
            // Reset when almost stopped
            scrollAmount = 0;
            scrollSpeed = 0.15; // Reset to original speed
          }
        }

        container.scrollLeft = scrollAmount;
      }
      animationId = requestAnimationFrame(step);
    };

    // Start the animation
    animationId = requestAnimationFrame(step);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Technology stack data
  const technologies = Technology;

  return (
    <section className="bg-[#C7D2FE] text-[#1C1C1C] min-h-screen flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-10 sm:py-16 font-poppins relative overflow-hidden">
      {/* Background animation elements for visual interest */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Original circles */}
        <div
          className={`animate-float absolute top-[10%] left-[5%] w-12 sm:w-16 h-12 sm:h-16 bg-blue-300 rounded-full opacity-0 blur-sm ${
            isVisible ? "animate-fade-in" : ""
          }`}
          style={{ animationDelay: "1.2s" }}
        ></div>
        <div
          className={`animate-float-delayed absolute top-[30%] right-[10%] w-16 sm:w-24 h-16 sm:h-24 bg-purple-300 rounded-full opacity-0 blur-sm ${
            isVisible ? "animate-fade-in" : ""
          }`}
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className={`animate-float-slow absolute bottom-[15%] left-[15%] w-14 sm:w-20 h-14 sm:h-20 bg-pink-300 rounded-full opacity-0 blur-sm ${
            isVisible ? "animate-fade-in" : ""
          }`}
          style={{ animationDelay: "1.8s" }}
        ></div>

        {/* Additional bokeh circles */}
        <div
          className={`animate-float-reverse absolute top-[45%] left-[25%] w-10 sm:w-14 h-10 sm:h-14 bg-teal-300 rounded-full opacity-0 blur-md ${
            isVisible ? "animate-fade-in" : ""
          }`}
          style={{ animationDelay: "1.3s" }}
        ></div>
        <div
          className={`animate-float-diagonal absolute top-[20%] left-[70%] w-8 sm:w-12 h-8 sm:h-12 bg-yellow-300 rounded-full opacity-0 blur-lg ${
            isVisible ? "animate-fade-in" : ""
          }`}
          style={{ animationDelay: "1.6s" }}
        ></div>
        <div
          className={`animate-float-circular absolute bottom-[35%] right-[25%] w-16 sm:w-20 h-16 sm:h-20 bg-indigo-300 rounded-full opacity-0 blur-md ${
            isVisible ? "animate-fade-in" : ""
          }`}
          style={{ animationDelay: "1.9s" }}
        ></div>
        <div
          className={`animate-pulsate absolute top-[65%] right-[12%] w-10 sm:w-14 h-10 sm:h-14 bg-rose-300 rounded-full opacity-0 blur-lg ${
            isVisible ? "animate-fade-in" : ""
          }`}
          style={{ animationDelay: "2.1s" }}
        ></div>
        <div
          className={`animate-float-diagonal-reverse absolute top-[8%] left-[50%] w-6 sm:w-8 h-6 sm:h-8 bg-green-300 rounded-full opacity-0 blur-md ${
            isVisible ? "animate-fade-in" : ""
          }`}
          style={{ animationDelay: "1.7s" }}
        ></div>
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`animate-float absolute top-[10%] left-[5%] w-12 sm:w-16 h-12 sm:h-16 bg-blue-300 rounded-full opacity-0 ${
            isVisible ? "animate-fade-in" : ""
          }`}
          style={{ animationDelay: "1.2s" }}
        ></div>
        <div
          className={`animate-float-delayed absolute top-[30%] right-[10%] w-16 sm:w-24 h-16 sm:h-24 bg-purple-300 rounded-full opacity-0 ${
            isVisible ? "animate-fade-in" : ""
          }`}
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className={`animate-float-slow absolute bottom-[15%] left-[15%] w-14 sm:w-20 h-14 sm:h-20 bg-pink-300 rounded-full opacity-0 ${
            isVisible ? "animate-fade-in" : ""
          }`}
          style={{ animationDelay: "1.8s" }}
        ></div>
      </div>
      {/* Image section - now FIRST on mobile */}
      <div
        className={`w-full md:w-1/2 md:order-2 flex flex-col items-center mb-8 md:mb-0 ${
          isVisible ? "animate-fade-in-delayed" : "opacity-0"
        }`}
        style={{ animationDelay: "1.8s" }}
      >
        <div className="relative w-full max-w-md mx-auto">
          {/* Image with animation */}
          <div
            className={
              isVisible ? "animate-float-in" : "opacity-0 translate-y-8"
            }
            style={{ animationDelay: "2.0s" }}
          >
            <Image
              src="/tarun.png"
              alt="Tarun Nayaka - Web Developer and Cloud Architect"
              className="w-full drop-shadow-lg"
              width={500}
              height={400}
              priority={true}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Project count bubble with bounce animation */}
          <div
            className={`absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-[#4169E1] text-white rounded-full h-16 sm:h-20 w-16 sm:w-20 flex flex-col items-center justify-center text-center transform rotate-12 ${
              isVisible ? "animate-bounce-in-delayed" : "opacity-0 scale-0"
            }`}
            style={{ animationDelay: "2.5s" }}
          >
            <span className="text-base sm:text-lg font-bold">15+</span>
            <span className="text-[10px] sm:text-xs">Projects</span>
          </div>
        </div>

        {/* Stats grid with staggered animations - HIDDEN on mobile */}
        <div className="hidden md:grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6 w-full max-w-md mx-auto">
          {[
            {
              icon: (
                <FaServer
                  className="mx-auto text-[#4169E1] text-lg sm:text-xl"
                  aria-hidden="true"
                />
              ),
              label: "Cloud Architecture",
            },
            {
              icon: (
                <FaLaptopCode
                  className="mx-auto text-[#4169E1] text-lg sm:text-xl"
                  aria-hidden="true"
                />
              ),
              label: "Full-Stack Dev",
            },
            {
              icon: (
                <FaDatabase
                  className="mx-auto text-[#4169E1] text-lg sm:text-xl"
                  aria-hidden="true"
                />
              ),
              label: "Database Design",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`bg-white/60 backdrop-blur-sm p-2 sm:p-3 rounded-lg text-center hover:bg-white hover:scale-105 transition-all ${
                isVisible ? "animate-scale-in" : "opacity-0 scale-90"
              }`}
              style={{ animationDelay: `${2.8 + index * 0.2}s` }}
            >
              {stat.icon}
              <p className="text-xs sm:text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Left content section - now SECOND on mobile */}
      <div className="w-full md:w-1/2 md:order-1 z-10 flex flex-col space-y-4 sm:space-y-6">
        {/* Hero header and intro with animations */}
        <div>
          {/* Animated name with typing effect */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Hi, I'm{" "}
            <span
              className={`text-[#4169E1] ${
                isVisible ? "animate-reveal-text" : "opacity-0"
              }`}
            >
              <span className="inline-block">T</span>
              <span className="inline-block" style={{ animationDelay: "0.1s" }}>
                a
              </span>
              <span className="inline-block" style={{ animationDelay: "0.2s" }}>
                r
              </span>
              <span className="inline-block" style={{ animationDelay: "0.3s" }}>
                u
              </span>
              <span className="inline-block" style={{ animationDelay: "0.4s" }}>
                n
              </span>
              <span className="inline-block" style={{ animationDelay: "0.5s" }}>
                {" "}
              </span>
              <span className="inline-block" style={{ animationDelay: "0.6s" }}>
                N
              </span>
              <span className="inline-block" style={{ animationDelay: "0.7s" }}>
                a
              </span>
              <span className="inline-block" style={{ animationDelay: "0.8s" }}>
                y
              </span>
              <span className="inline-block" style={{ animationDelay: "0.9s" }}>
                a
              </span>
              <span className="inline-block" style={{ animationDelay: "1.0s" }}>
                k
              </span>
              <span className="inline-block" style={{ animationDelay: "1.1s" }}>
                a
              </span>
              <span className="inline-block" style={{ animationDelay: "1.2s" }}>
                {" "}
              </span>
              <span className="inline-block" style={{ animationDelay: "1.3s" }}>
                R
              </span>
            </span>
          </h1>

          {/* Tagline with fade-in and slide-up animation */}
          <h2
            className={`text-lg sm:text-xl md:text-2xl text-[#4169E1] mt-2 sm:mt-3 ${
              isVisible ? "animate-fade-slide-up" : "opacity-0 translate-y-4"
            }`}
            style={{ animationDelay: "1.5s" }}
          >
            Freelancer | Cloud Architect | Full-Stack Developer
          </h2>

          {/* USP with fade-in animation */}
          <p
            className={`text-base sm:text-lg mt-4 ${
              isVisible ? "animate-fade-slide-up" : "opacity-0 translate-y-4"
            }`}
            style={{ animationDelay: "1.7s" }}
          >
            Crafting stunning, responsive web , mobile applications and cloud
            solutions for startups and personal brands.
          </p>

          <p
            className={`text-sm sm:text-base mt-2 ${
              isVisible ? "animate-fade-slide-up" : "opacity-0 translate-y-4"
            }`}
            style={{ animationDelay: "1.9s" }}
          >
            Specialized in{" "}
            <span className="font-semibold">Python, Java Script</span>,{" "}
            <span className="font-semibold">
              MongoDB, PSQL, Firebase, Azure Cloud
            </span>
            , and <span className="font-semibold">Google Cloud Plartform</span>{" "}
            with 3+ years of experience.
          </p>
        </div>

        {/* Tech stack section with staggered reveal */}
        <div
          className={`py-3 ${
            isVisible ? "animate-fade-slide-up" : "opacity-0 translate-y-4"
          }`}
          style={{ animationDelay: "2.1s" }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            My Tech Stack:
          </h3>
          <div
            ref={techStackRef}
            className="flex gap-2 md:gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth", // Add smooth scrolling behavior
            }}
          >
            {technologies.map((tech, index) => (
              <div
                key={tech.name}
                className={`flex flex-col items-center justify-between bg-white/70 backdrop-blur-sm p-2 rounded-lg min-w-[85px] sm:min-w-[90px] h-[85px] sm:h-[90px] snap-center hover:bg-white hover:scale-105 transition-all ${
                  isVisible ? "animate-fade-scale-in" : "opacity-0 scale-90"
                }`}
                style={{ animationDelay: `${2.1 + index * 0.05}s` }}
              >
                <div className="flex items-center justify-center h-10">
                  <Image
                    src={tech.iconUrl}
                    alt={`${tech.name} icon`}
                    width={28}
                    height={28}
                    loading="lazy"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-center line-clamp-2 mt-1">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills tags with staggered animation */}
        <div
          className={`flex flex-wrap gap-2 ${
            isVisible ? "animate-fade-slide-up" : "opacity-0 translate-y-4"
          }`}
          style={{ animationDelay: "2.3s" }}
        >
          {[
            "Python",
            "JavaScript",
            "Django",
            "Flask",
            "GO Lang",
            "Express.js",
            "MongoDB",
            "MySQL",
            "PostgreSQL",
            "GraphQL",
            "REST APIs",

            "Next.js",
            "Nginx",
            "Apache",
            "Apache Kafka",
            "React",
            "React Native",
            "Flutter",
            "Fast API",
            "Azure",
            "Google Cloud",
            "Firebase",
            "TypeScript",
            "Tailwind CSS",
            "Node.js",
          ].map((skill, index) => (
            <span
              key={skill}
              className="bg-white/50 px-2 sm:px-3 py-1 rounded-full text-xs font-medium hover:bg-[#4169E1] hover:text-white transition-all"
              style={{
                animationDelay: `${2.3 + index * 0.1}s`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.5s ease ${
                  2.3 + index * 0.1
                }s, transform 0.5s ease ${2.3 + index * 0.1}s`,
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* CTA Buttons with staggered animation */}
        <div
          className={`flex items-center gap-3 sm:gap-4 flex-wrap mt-2 ${
            isVisible ? "animate-fade-slide-up" : "opacity-0 translate-y-4"
          }`}
          style={{ animationDelay: "2.5s" }}
        >
          <a
            href="/resume.pdf"
            download
            className="bg-[#4169E1] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:bg-[#C71585] transition-all flex items-center gap-2 hover:scale-105 text-sm sm:text-base animate-pulse-subtle"
          >
            <FaLaptopCode aria-hidden="true" />
            <span>Download Resume</span>
          </a>
          <Link
            href="https://www.linkedin.com/in/tarun-nayaka-r-28612a27a/"
            className={`border-2 border-[#4169E1] text-[#4169E1] px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full hover:bg-[#4169E1] hover:text-white transition-all hover:scale-105 text-sm sm:text-base ${
              isVisible ? "animate-bounce-in" : "opacity-0 scale-90"
            }`}
            style={{ animationDelay: "2.7s" }}
          >
            Let's Connect
          </Link>
        </div>

        {/* Social media links with staggered animation */}
        <div className="flex items-center space-x-4 sm:space-x-5 mt-2 text-xl sm:text-2xl">
          {[
            {
              icon: <FaLinkedin aria-hidden="true" />,
              url: "https://linkedin.com/in/tarun-nayaka-r-28612a27a",
              label: "LinkedIn profile",
            },
            {
              icon: <FaGithub aria-hidden="true" />,
              url: "https://github.com/Rtarun3606k",
              label: "GitHub profile",
            },
            {
              icon: <FaGoogle aria-hidden="true" />,
              url: "mailto:r.tarunnayaka25042005@gmail.com",
              label: "Email contact",
            },
            {
              icon: <FaCloud aria-hidden="true" />,
              url: "#",
              label: "Cloud portfolio",
            },
            {
              icon: <FaWhatsapp aria-hidden="true" />,
              url: "https://wa.me/7483997976",
              label: "WhatsApp contact",
            },
          ].map((social, index) => (
            <a
              key={social.label}
              href={social.url}
              className={`hover:text-[#C71585] hover:scale-110 transition-all ${
                isVisible ? "animate-pop-in" : "opacity-0 scale-50"
              }`}
              style={{ animationDelay: `${2.8 + index * 0.1}s` }}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
      {/* Add CSS animations with Azure best practices for performance */}
      <style jsx>{``}</style>
    </section>
  );
};

export default Hero;
