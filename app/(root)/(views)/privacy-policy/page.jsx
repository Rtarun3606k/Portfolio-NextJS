// or pages/privacy-policy.js (for Next.js Pages Router)

import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      {/* Add Next.js Head component for SEO */}
      <Head>
        <title>Privacy Policy | Tarun Nayaka</title>
        <meta
          name="description"
          content="Privacy Policy for Tarun Nayaka's website"
        />
      </Head>

      {/* Main container with your existing purple gradient background */}
      <div className="min-h-screen bg-gradient-to-r from-[#e0f7fa] to-[#fce4ec] py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header section with accent color */}
          <div className="bg-[#6a2df2] text-white p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            <p className="mt-2 text-sm opacity-90">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content section with proper spacing and typography */}
          <div className="p-6 md:p-10 text-gray-800">
            <div className="prose max-w-none">
              {/* Section 1 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#6a2df2] mb-4 flex items-center">
                  <span className="bg-[#f0e6fa] text-[#6a2df2] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">
                    1
                  </span>
                  Introduction
                </h2>
                <p className="mb-4 leading-relaxed">
                  Welcome to Tarun Nayaka's website. I respect your privacy and
                  am committed to protecting your personal data. This privacy
                  policy will inform you about how I look after your personal
                  data when you visit my website and tell you about your privacy
                  rights and how the law protects you.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#6a2df2] mb-4 flex items-center">
                  <span className="bg-[#f0e6fa] text-[#6a2df2] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">
                    2
                  </span>
                  The Data I Collect
                </h2>
                <p className="mb-4 leading-relaxed">
                  When you visit my website, I may collect:
                </p>
                <ul className="list-none pl-6 mb-6 space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#6a2df2] mr-3">•</span>
                    <span>
                      Contact information (name, email) when you fill out
                      contact forms
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#6a2df2] mr-3">•</span>
                    <span>Usage data (how you interact with my website)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#6a2df2] mr-3">•</span>
                    <span>
                      Technical data (IP address, browser type and version)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#6a2df2] mr-3">•</span>
                    <span>
                      Information you provide when submitting forms or
                      requesting services
                    </span>
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#6a2df2] mb-4 flex items-center">
                  <span className="bg-[#f0e6fa] text-[#6a2df2] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">
                    3
                  </span>
                  How I Use Your Data
                </h2>
                <p className="mb-4 leading-relaxed">I use your data to:</p>
                <ul className="list-none pl-6 mb-6 space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#6a2df2] mr-3">•</span>
                    <span>Respond to your inquiries and service requests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#6a2df2] mr-3">•</span>
                    <span>Provide you with information about my services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#6a2df2] mr-3">•</span>
                    <span>Improve my website and user experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#6a2df2] mr-3">•</span>
                    <span>
                      Send you updates and communications (with your consent)
                    </span>
                  </li>
                </ul>
              </section>

              {/* Additional sections */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#6a2df2] mb-4 flex items-center">
                  <span className="bg-[#f0e6fa] text-[#6a2df2] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">
                    4
                  </span>
                  Cookies
                </h2>
                <p className="mb-4 leading-relaxed">
                  My website uses cookies to enhance your browsing experience.
                  Cookies are small text files stored on your device that help
                  analyze web traffic and let you know when you visit a
                  particular site. You can choose to disable cookies through
                  your browser settings, but this may affect your experience on
                  the website.
                </p>
              </section>

              {/* Continue with remaining sections */}
              {/* ... */}

              {/* Contact section with card style */}
              <section className="mt-10 bg-[#f0e6fa] p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-[#6a2df2] mb-4">
                  Contact Information
                </h2>
                <p className="mb-4">
                  If you have any questions about this privacy policy or my data
                  practices, please contact me at:
                </p>
                <div className="pl-4 border-l-4 border-[#6a2df2]">
                  <p className="mb-2">Email: r.tarunnayaka25042005@gmail.com</p>
                  <p>
                    Address: Sampangi Rama Nagara, Bangalore 560027, Karnataka,
                    India
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Footer with back button */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-[#6a2df2] text-white rounded-md hover:bg-[#5a25d8] transition-colors duration-300 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
