"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Hero from "@/components/Hero";
import StatsPage from "@/components/Statistics";
import Projects from "@/components/Projects";
import BlogsAndPosts from "@/components/BlogsAndPosts";
import Events from "@/components/Events";
import Contact from "@/components/Constact";

const AnimatedSection = ({ children, delay = 0.2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: "easeOut",
            delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      {/* Hero section doesn't need scroll animation since it's visible on page load */}
      <Hero />

      {/* Stats section with scroll animation */}
      <AnimatedSection>
        <StatsPage />
      </AnimatedSection>

      <AnimatedSection delay={0.3}>
        <Projects />
      </AnimatedSection>

      <AnimatedSection delay={0.3}>
        <BlogsAndPosts />
      </AnimatedSection>

      <AnimatedSection delay={0.3}>
        <Events />
      </AnimatedSection>

      <AnimatedSection delay={0.3}>
        <Contact />
      </AnimatedSection>
      {/* You can add more sections with scroll animations */}
      {/* 
      <AnimatedSection delay={0.3}>
        <ProjectsSection />
      </AnimatedSection>
      
      <AnimatedSection delay={0.4}>
        <TestimonialsSection />
      </AnimatedSection>
      */}
    </main>
  );
}
