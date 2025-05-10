"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaTrash, FaExternalLinkAlt } from "react-icons/fa";

export default function LinkedInPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/linkedin`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch LinkedIn posts");
        }
        const data = await response.json();
        console.log("Fetched LinkedIn posts:", data);
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Error fetching LinkedIn posts:", err);
        setError("Failed to load LinkedIn posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Function to handle image load errors
  const handleImageError = (postId) => {
    setImageErrors((prev) => ({
      ...prev,
      [postId]: true,
    }));
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this LinkedIn post?")) {
      try {
        const response = await fetch(`/api/linkedin/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Remove the deleted post from the state
          setPosts(posts.filter((post) => post._id !== id));
        } else {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete LinkedIn post");
        }
      } catch (err) {
        console.error("Error deleting LinkedIn post:", err);
        alert(err.message || "Failed to delete LinkedIn post");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-[#0077B5]">
          <svg
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-[#0077B5] inline-block"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading LinkedIn posts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-6 bg-red-100 text-red-800 rounded-md border border-red-200">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white text-red-600 rounded-md border border-red-300 hover:bg-red-50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#0077B5] mb-2">
          LinkedIn Posts Management
        </h1>
        <p className="text-gray-600">View and manage your LinkedIn posts</p>
      </div>

      <div className="flex justify-end mb-6">
        <Link
          href="/dashboard/linkedin/add"
          className="bg-white text-[#0077B5] border border-[#0077B5] hover:bg-[#0077B5] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add New LinkedIn Post</span>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm border border-blue-100 text-center">
          <FaLinkedin className="w-16 h-16 mx-auto text-blue-200 mb-4" />
          <h3 className="text-xl font-semibold text-[#0077B5] mb-2">
            No LinkedIn Posts Found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't added any LinkedIn posts yet. Click the button above to
            showcase your thoughts and experiences.
          </p>
          <Link
            href="/dashboard/linkedin/add"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0077B5] to-[#0e76a8] text-white font-medium rounded-md hover:shadow-lg transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add First LinkedIn Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="h-full rounded-xl overflow-hidden bg-white border-[3px] border-transparent hover:border-[#0077B5] shadow-lg transition-all duration-300 flex flex-col relative group"
            >
              <button
                onClick={() => handleDeletePost(post._id)}
                className="absolute top-2 right-2 z-10 bg-white text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                aria-label="Delete LinkedIn post"
              >
                <FaTrash size={14} />
              </button>

              {/* LinkedIn Post Image */}
              <div className="relative h-40 w-full overflow-hidden">
                {post.image && !imageErrors[post._id] ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                    onError={() => handleImageError(post._id)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[#0077B5]/20 to-[#0e76a8]/20 flex items-center justify-center">
                    <FaLinkedin className="text-[#0077B5] opacity-60 text-5xl" />
                  </div>
                )}
              </div>

              {/* LinkedIn Post Content */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#1C1C1C] mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.description}
                  </p>
                </div>

                {/* LinkedIn Post Link */}
                <div className="flex items-center justify-end mt-auto">
                  {post.link ? (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#0077B5] hover:underline transition-colors"
                    >
                      View on LinkedIn
                      <FaExternalLinkAlt className="ml-2" size={14} />
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No link provided
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
