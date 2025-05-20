"use client";

import WorkExperience from "@/components/WorkExperience";
import { motion } from "framer-motion";

export default function ExperiencePage() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-[#1F1F1F] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED]">
            Professional Experience
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            An overview of my professional journey, showcasing the companies
            I've worked with and the roles I've held throughout my career.
          </p>
        </motion.div>

        <WorkExperience limited={false} />
      </div>
    </div>
  );
}
