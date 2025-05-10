"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt, FaTrash } from "react-icons/fa";

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        console.log("Fetched projects:", data);
        setProjects(data.projects || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        console.log("Fetched projects:", projects);
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Remove the deleted project from the state
          setProjects(projects.filter((project) => project._id !== id));
        } else {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete project");
        }
      } catch (err) {
        console.error("Error deleting project:", err);
        alert(err.message || "Failed to delete project");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-[#5E60CE]">
          <svg
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-[#5E60CE] inline-block"
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
          Loading projects...
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
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#5E60CE] mb-2">
          Projects Management
        </h1>
        <p className="text-gray-600">View and manage your portfolio projects</p>
      </div>

      <div className="flex justify-end mb-6">
        <Link
          href="/dashboard/projects/add"
          className="bg-white text-[#7209B7] border border-[#7209B7] hover:bg-[#7209B7] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
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
          <span>Add New Project</span>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm border border-purple-100 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-purple-200 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-xl font-semibold text-[#5E60CE] mb-2">
            No Projects Found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't added any projects yet. Click the button above to
            showcase your work.
          </p>
          <Link
            href="/dashboard/projects/add"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5E60CE] to-[#7209B7] text-white font-medium rounded-md hover:shadow-lg transition-all duration-200"
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
            Add First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="h-full rounded-2xl overflow-hidden bg-white border-[3px] border-transparent hover:border-[#C71585] shadow-xl transition-all duration-500 flex flex-col relative group"
            >
              <button
                onClick={() => handleDeleteProject(project._id)}
                className="absolute top-2 right-2 z-10 bg-white text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                aria-label="Delete project"
              >
                <FaTrash size={14} />
              </button>

              {/* Project Image */}
              <div className="relative h-[35%] w-full overflow-hidden">
                {/* <Image src={project && project.imageUrl} /> */}
                {console.log("Project image URL:", project.imageUrl)}
                {project && project.imageUrl ? (
                  <img
                    src={project.imageUrl || "/placeholder.png"}
                    alt={project.title + "shsdjhshdjsahjdsa"}
                    // layout="fill"
                    // objectFit="cover"
                    className=" transition-transform duration-500 w-full h-full bg-gradient-to-r from-[#5E60CE]/20 to-[#7209B7]/20 flex items-center justify-center "
                    // onError={(e) => {
                    //   console.error("Error loading image:", e);
                    // }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[#5E60CE]/20 to-[#7209B7]/20 flex items-center justify-center">
                    <span className="text-[#5E60CE] opacity-60 text-5xl font-light">
                      {project.title[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#1C1C1C] mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Project Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#5E60CE]/10 hover:bg-[#E6CCE4] transition-colors text-[#5E60CE] text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Links */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex space-x-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:bg-[#E6CCE4] transition-colors"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <FaGithub className="text-[#1C1C1C]" size={20} />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:bg-[#E6CCE4] transition-colors"
                      aria-label={`Visit live demo for ${project.title}`}
                    >
                      <FaExternalLinkAlt className="text-[#1C1C1C]" size={18} />
                    </a>
                  </div>

                  <div className="flex items-center">
                    {project.featured && (
                      <span className="bg-[#7209B7]/20 text-[#7209B7] text-xs px-2 py-1 rounded-full mr-2">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
