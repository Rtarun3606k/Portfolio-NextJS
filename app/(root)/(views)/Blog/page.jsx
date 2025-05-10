"use client";

import React from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the BlogsClient component
const BlogsClient = dynamic(() => import("@/components/BlogsClient"), {
  loading: () => (
    <div className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-black text-center text-5xl font-space-grotesk mb-3">
          My Blogs
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
        </div>
      </div>
    </div>
  ),
});

const BlogPage = () => {
  return (
    <div>
      <BlogsClient />
    </div>
  );
};

export default BlogPage;
