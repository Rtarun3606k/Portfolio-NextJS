"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaProjectDiagram,
  FaTools,
  FaChartPie,
  FaPlus,
  FaBriefcase,
} from "react-icons/fa";

export default function Dashboard() {
  // Count state for dashboard metrics (you can replace with real data from API)
  const [counts, setCounts] = useState({
    projects: 0,
    services: 0,
    statistics: 0,
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#5E60CE] mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your portfolio content</p>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#5E60CE]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 font-medium">Total Projects</p>
              <h3 className="text-3xl font-bold text-[#1C1C1C]">
                {counts.projects}
              </h3>
            </div>
            <div className="bg-[#5E60CE]/10 p-4 rounded-full">
              <FaProjectDiagram className="text-[#5E60CE] text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#7209B7]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 font-medium">Total Services</p>
              <h3 className="text-3xl font-bold text-[#1C1C1C]">
                {counts.services}
              </h3>
            </div>
            <div className="bg-[#7209B7]/10 p-4 rounded-full">
              <FaTools className="text-[#7209B7] text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#C71585]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 font-medium">Statistics</p>
              <h3 className="text-3xl font-bold text-[#1C1C1C]">
                {counts.statistics}
              </h3>
            </div>
            <div className="bg-[#C71585]/10 p-4 rounded-full">
              <FaChartPie className="text-[#C71585] text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Projects Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#5E60CE] transition-all duration-300">
          <div className="h-3 bg-[#5E60CE]"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1C1C1C]">Projects</h3>
              <div className="bg-[#5E60CE]/10 p-3 rounded-full">
                <FaProjectDiagram className="text-[#5E60CE]" />
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Manage your portfolio projects and showcase your work.
            </p>
            <div className="flex justify-between items-center">
              <Link
                href="/dashboard/projects"
                className="bg-white text-[#5E60CE] border border-[#5E60CE] hover:bg-[#5E60CE] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
              >
                <span>Manage Projects</span>
              </Link>
              <Link
                href="/dashboard/projects/add"
                className="bg-[#5E60CE]/10 p-2 rounded-full text-[#5E60CE] hover:bg-[#5E60CE]/20 transition-colors duration-200"
              >
                <FaPlus />
              </Link>
            </div>
          </div>
        </div>

        {/* Services Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#715981] transition-all duration-300">
          <div className="h-3 bg-[#7209B7]"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1C1C1C]">web vitals</h3>
              <div className="bg-[#7209B7]/10 p-3 rounded-full">
                <FaTools className="text-[#7209B7]" />
              </div>
            </div>
            <p className="text-gray-600 mb-6">check web vitals.</p>
            <div className="flex justify-between items-center">
              <Link
                href="/dashboard/webvitals"
                className="bg-white text-[#7209B7] border border-[#7209B7] hover:bg-[#7209B7] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
              >
                <span>Manage web vitals</span>
              </Link>
              {/* <Link
                href="/dashboard/services/add"
                className="bg-[#7209B7]/10 p-2 rounded-full text-[#7209B7] hover:bg-[#7209B7]/20 transition-colors duration-200"
              >
                <FaPlus />
              </Link> */}
            </div>
          </div>
        </div>
        {/* Services Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#7209B7] transition-all duration-300">
          <div className="h-3 bg-[#7209B7]"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1C1C1C]">Services</h3>
              <div className="bg-[#7209B7]/10 p-3 rounded-full">
                <FaTools className="text-[#7209B7]" />
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Customize the services you offer to potential clients.
            </p>
            <div className="flex justify-between items-center">
              <Link
                href="/dashboard/services"
                className="bg-white text-[#7209B7] border border-[#7209B7] hover:bg-[#7209B7] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
              >
                <span>Manage Services</span>
              </Link>
              <Link
                href="/dashboard/services/add"
                className="bg-[#7209B7]/10 p-2 rounded-full text-[#7209B7] hover:bg-[#7209B7]/20 transition-colors duration-200"
              >
                <FaPlus />
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#C71585] transition-all duration-300">
          <div className="h-3 bg-[#C71585]"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1C1C1C]">Statistics</h3>
              <div className="bg-[#C71585]/10 p-3 rounded-full">
                <FaChartPie className="text-[#C71585]" />
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Add and manage statistics to highlight your achievements.
            </p>
            <div className="flex justify-between items-center">
              <Link
                href="/dashboard/statistics"
                className="bg-white text-[#C71585] border border-[#C71585] hover:bg-[#C71585] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
              >
                <span>Manage Statistics</span>
              </Link>
              <Link
                href="/dashboard/statistics/add"
                className="bg-[#C71585]/10 p-2 rounded-full text-[#C71585] hover:bg-[#C71585]/20 transition-colors duration-200"
              >
                <FaPlus />
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#C71585] transition-all duration-300">
          <div className="h-3 bg-[#C71585]"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1C1C1C]">Blogs</h3>
              <div className="bg-[#C71585]/10 p-3 rounded-full">
                <FaChartPie className="text-[#C71585]" />
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Add and manage statistics to highlight your Blogs.
            </p>
            <div className="flex justify-between items-center">
              <Link
                href="/dashboard/blogs"
                className="bg-white text-[#C71585] border border-[#C71585] hover:bg-[#C71585] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
              >
                <span>Manage Blogs</span>
              </Link>
              <Link
                href="/dashboard/blogs/add"
                className="bg-[#C71585]/10 p-2 rounded-full text-[#C71585] hover:bg-[#C71585]/20 transition-colors duration-200"
              >
                <FaPlus />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#f689ce] transition-all duration-300">
          <div className="h-3 bg-[#2c6235]"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1C1C1C]">Events</h3>
              <div className="bg-[#C71585]/10 p-3 rounded-full">
                <FaChartPie className="text-[#C71585]" />
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Add and manage statistics to highlight your Events.
            </p>
            <div className="flex justify-between items-center">
              <Link
                href="/dashboard/events"
                className="bg-white text-[#C71585] border border-[#C71585] hover:bg-[#C71585] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
              >
                <span>Manage events</span>
              </Link>
              <Link
                href="/dashboard/events/add"
                className="bg-[#C71585]/10 p-2 rounded-full text-[#C71585] hover:bg-[#C71585]/20 transition-colors duration-200"
              >
                <FaPlus />
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#673c57] transition-all duration-300">
          <div className="h-3 bg-[#75ff04]"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1C1C1C]">Linkedin</h3>
              <div className="bg-[#C71585]/10 p-3 rounded-full">
                <FaChartPie className="text-[#C71585]" />
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Add and manage statistics to highlight your Blogs.
            </p>
            <div className="flex justify-between items-center">
              <Link
                href="/dashboard/linkedin"
                className="bg-white text-[#C71585] border border-[#C71585] hover:bg-[#C71585] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
              >
                <span>Manage LinkedIn</span>
              </Link>
              <Link
                href="/dashboard/linkedin/add"
                className="bg-[#C71585]/10 p-2 rounded-full text-[#C71585] hover:bg-[#C71585]/20 transition-colors duration-200"
              >
                <FaPlus />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#8a56ab] transition-all duration-300">
          <div className="h-3 bg-[#6A0DAD]"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1C1C1C]">
                Work Experience
              </h3>
              <div className="bg-[#6A0DAD]/10 p-3 rounded-full">
                <FaBriefcase className="text-[#6A0DAD]" />
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Add and manage your professional work experience.
            </p>
            <div className="flex justify-between items-center">
              <Link
                href="/dashboard/positions"
                className="bg-white text-[#6A0DAD] border border-[#6A0DAD] hover:bg-[#6A0DAD] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
              >
                <span>Manage Positions</span>
              </Link>
              <Link
                href="/dashboard/positions/add"
                className="bg-[#6A0DAD]/10 p-2 rounded-full text-[#6A0DAD] hover:bg-[#6A0DAD]/20 transition-colors duration-200"
              >
                <FaPlus />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#8a56ab] transition-all duration-300">
          <div className="h-3 bg-[#6A0DAD]"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1C1C1C]">News Letters</h3>
              <div className="bg-[#6A0DAD]/10 p-3 rounded-full">
                <FaBriefcase className="text-[#6A0DAD]" />
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Manage your professional Newsletter.
            </p>
            <div className="flex justify-between items-center">
              <Link
                href="/dashboard/newsletter"
                className="bg-white text-[#6A0DAD] border border-[#6A0DAD] hover:bg-[#6A0DAD] hover:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
              >
                <span>Manage Newsletters</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section - Optional */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-[#1C1C1C] mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          <p className="text-gray-500 text-center py-4">
            No recent activity to display
          </p>
        </div>
      </div>
    </div>
  );
}
