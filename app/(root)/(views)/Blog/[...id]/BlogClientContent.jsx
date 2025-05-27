"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { slugify } from "@/_utils/slugify";
import { motion } from "framer-motion";

// Dynamic import of markdown preview component
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

// Animation variants for interactive elements
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const BlogClientContent = ({ blog, suggestedBlogs, updateViews }) => {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  // Effect to update view count when component mounts
  useEffect(() => {
    async function handleViewCount() {
      if (blog._id) {
        try {
          // Call the server action to update views
          await updateViews(blog._id, blog.views);

          // Check if URL needs to be updated with the proper slug
          const slug = slugify(blog.title);
          const expectedPath = `/Blog/${blog._id}/${slug}`;
          const currentPath = window.location.pathname;

          // If we're on just the ID URL without the slug, redirect to the proper URL
          if (
            currentPath === `/Blog/${blog._id}` ||
            currentPath === `/Blog/${blog._id}/`
          ) {
            router.replace(expectedPath);
          }
        } catch (error) {
          console.error("Error updating view count:", error);
        }
      }

      // Mark component as loaded for animations
      setIsLoaded(true);
    }

    handleViewCount();
  }, [blog, router, updateViews]);

  return (
    <motion.div
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
      className="prose prose-lg max-w-none"
    >
      <MarkdownPreview
        source={blog.content}
        wrapperElement={{ "data-color-mode": "light" }}
        style={{ backgroundColor: "#c7d2fe", color: "black" }}
      />

      {/* <ReactMarkdown>{blog.content}</ReactMarkdown> */}
    </motion.div>
  );
};

export default BlogClientContent;
