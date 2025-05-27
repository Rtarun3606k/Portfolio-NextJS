"use client";

import React, { use, useEffect, useState } from "react";
import { updateViews } from "./actions";
import { useRouter } from "next/navigation";
import { slugify } from "@/_utils/slugify";

const ViewCounter = ({ blog }) => {
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
      // console.log("View count updated for blog:", blog._id);
      // Mark component as loaded for animations
      setIsLoaded(true);
    }

    handleViewCount();
  }, [blog, router, updateViews]);
  return null;
};

export default ViewCounter;
