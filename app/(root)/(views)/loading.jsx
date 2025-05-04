"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Loading = () => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Set a timeout to display the full name after the initial animation
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-[#e0f7fa] to-[#fce4ec] z-50">
      <div className="relative">
        {/* Initial TNR to RTN animation */}
        {!animationComplete ? (
          <div className="relative flex items-center justify-center">
            {/* T animation */}
            <motion.span
              initial={{ opacity: 1, x: 0, y: 0 }}
              animate={{ opacity: 0, x: 80, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-5xl md:text-7xl font-bold text-[#5E60CE] absolute"
            >
              T
            </motion.span>

            {/* N animation */}
            <motion.span
              initial={{ opacity: 1, x: 40, y: 0 }}
              animate={{ opacity: 0, x: 40, y: -40 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-5xl md:text-7xl font-bold text-[#7209B7] absolute"
            >
              N
            </motion.span>

            {/* R animation */}
            <motion.span
              initial={{ opacity: 1, x: 80, y: 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-5xl md:text-7xl font-bold text-[#C71585] absolute"
            >
              R
            </motion.span>

            {/* T becoming R */}
            <motion.span
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, x: 40, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="text-5xl md:text-7xl font-bold text-[#5E60CE] absolute"
            >
              T
            </motion.span>

            {/* N becoming N */}
            <motion.span
              initial={{ opacity: 0, x: 40, y: -40 }}
              animate={{ opacity: 1, x: 80, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="text-5xl md:text-7xl font-bold text-[#7209B7] absolute"
            >
              N
            </motion.span>
          </div>
        ) : (
          /* Full name animation */
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center space-x-3 md:space-x-4">
              <span className="text-5xl md:text-7xl font-playfair font-bold text-[#C71585]">
                R
              </span>
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ duration: 1 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="text-4xl md:text-6xl font-playfair font-bold text-[#5E60CE]">
                  Tarun
                </span>
                <span className="text-4xl md:text-6xl font-playfair font-bold text-[#7209B7] ml-3">
                  Nayaka
                </span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-4 text-gray-600"
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="w-2 h-2 bg-[#C71585] rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-[#5E60CE] rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#7209B7] rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Loading;
