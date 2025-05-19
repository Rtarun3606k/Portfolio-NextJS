import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/_utils/slugify";
import BlogClientContent from "./BlogClientContent";
import Script from "next/script";
import { updateViews } from "./actions";

// Server component for better SEO
const PageBlog = async ({ id, params }) => {
  // With NextJS 15+, params should be awaited
  const resolvedParams = params ? await params : undefined;

  // Extract the blog ID from the URL parameters
  const blogId = id
    ? id
    : resolvedParams?.id
    ? Array.isArray(resolvedParams.id)
      ? resolvedParams.id[0]
      : resolvedParams.id
    : undefined;

  if (!blogId) {
    notFound();
  }

  // Server-side data fetching
  let blog;
  let suggestedBlogs = [];

  try {
    // Construct the API URL with proper protocol and host
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    // Fetch blog data
    const blogRes = await fetch(`${baseUrl}/api/blogs/${blogId}`, {
      cache: "no-store", // Don't cache to ensure fresh content
      next: { tags: [`blog-${blogId}`] }, // For on-demand revalidation
    });

    if (!blogRes.ok) {
      throw new Error(`Failed to fetch blog: ${blogRes.status}`);
    }

    blog = await blogRes.json();

    // Fetch suggested blogs
    const suggestedRes = await fetch(
      `${baseUrl}/api/blogs/suggested?exclude=${blogId}`,
      {
        cache: "no-store",
        next: { tags: ["blogs"] }, // For on-demand revalidation
      }
    );

    if (suggestedRes.ok) {
      suggestedBlogs = await suggestedRes.json();
    } else {
      console.error("Failed to fetch suggested blogs:", suggestedRes.status);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    notFound();
  }

  // No useEffect needed in server component

  // No loading state needed since we're using server-side rendering

  // Generate structured data for this blog post for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.description || blog.content.substring(0, 160),
    image:
      blog.featuredImage ||
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/image.png`,
    datePublished: blog.createdAt || new Date().toISOString(),
    dateModified: blog.updatedAt || blog.createdAt || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: blog.author || "Tarun Nayaka R",
      url: process.env.NEXT_PUBLIC_BASE_URL || "",
    },
    publisher: {
      "@type": "Person",
      name: "Tarun Nayaka R",
      url: process.env.NEXT_PUBLIC_BASE_URL || "",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/image.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${
        process.env.NEXT_PUBLIC_BASE_URL || ""
      }/Blog/${blogId}/${slugify(blog.title)}`,
    },
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      {/* Add JSON-LD structured data for better SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black font-space-grotesk">
        {blog.title}
      </h1>

      <div className="flex flex-wrap items-center text-gray-600 mb-6">
        {blog.author && (
          <span className="font-medium mr-3">
            By:{" "}
            {blog.author && blog.author.length > 2
              ? blog.author
              : "Tarun Nayaka R"}
          </span>
        )}
        {blog.createdAt && (
          <>
            <span className="mx-2 hidden sm:inline">&middot;</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </>
        )}
      </div>

      <div className="mb-8">
        {blog.featuredImage && (
          <div className="relative h-64 md:h-96 w-full mb-6 rounded-xl overflow-hidden">
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        )}
      </div>

      {/* Client component for interactive elements */}
      <BlogClientContent
        blog={blog}
        suggestedBlogs={suggestedBlogs}
        updateViews={updateViews}
      />

      {suggestedBlogs.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-black">
            Related Articles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedBlogs.map((suggestedBlog) => (
              <div
                key={suggestedBlog._id}
                className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6A0DAD]/10"
              >
                <Link
                  href={`/Blog/${suggestedBlog._id}/${slugify(
                    suggestedBlog.title
                  )}`}
                >
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={
                        suggestedBlog.featuredImage ||
                        "https://placehold.co/600x400?text=No+Image"
                      }
                      alt={suggestedBlog.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-[#1F1F1F] mb-2 line-clamp-2">
                      {suggestedBlog.title}
                    </h3>
                    <div className="flex items-center text-[#6B7280] text-sm mb-3">
                      <span className="font-medium">
                        {suggestedBlog.author}
                      </span>
                      {suggestedBlog.createdAt && (
                        <>
                          <span className="mx-2">&middot;</span>
                          <span>
                            {new Date(
                              suggestedBlog.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="bg-[#6A0DAD]/10 text-[#6A0DAD] px-3 py-1 rounded-full font-medium">
                        {suggestedBlog.views?.toLocaleString() || 0} views
                      </span>
                      <svg
                        className="h-5 w-5 text-[#FF4ECD]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mt-12">
        <Link href="/Blog" className="inline-flex items-center group relative">
          <span className="text-[#6A0DAD] font-medium text-lg mr-4 group-hover:text-[#7209B7] transition-all">
            Back to Blogs
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
      </div>
    </main>
  );
};

export default PageBlog;
