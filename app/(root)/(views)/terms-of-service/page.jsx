// or pages/terms-of-service.js (for Next.js Pages Router)

import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <>
      {/* Add Next.js Head component for SEO */}
      <Head>
        <title>Terms of Service | Tarun Nayaka</title>
        <meta
          name="description"
          content="Terms of Service for Tarun Nayaka's website"
        />
      </Head>

      {/* Main container with your existing purple gradient background */}
      <div className="min-h-screen bg-gradient-to-r from-[#e0f7fa] to-[#fce4ec] py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header section with accent color */}
          <div className="bg-[#6a2df2] text-white p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
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
                  Acceptance of Terms
                </h2>
                <p className="mb-4 leading-relaxed">
                  By accessing and using this website (tarunnayaka.me), you
                  accept and agree to be bound by the terms and conditions set
                  forth herein. If you do not agree to these terms, please do
                  not use this website.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#6a2df2] mb-4 flex items-center">
                  <span className="bg-[#f0e6fa] text-[#6a2df2] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">
                    2
                  </span>
                  Use License
                </h2>
                <p className="mb-4 leading-relaxed">
                  Permission is granted to temporarily view the materials on
                  this website for personal, non-commercial use only. This is
                  the grant of a license, not a transfer of title, and under
                  this license, you may not:
                </p>
                <ul className="list-none pl-6 mb-6 space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#6a2df2] mr-3">•</span>
                    <span>Modify or copy the materials</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#6a2df2] mr-3">•</span>
                    <span>
                      Use the materials for any commercial purpose or for any
                      public display
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#6a2df2] mr-3">•</span>
                    <span>
                      Attempt to decompile or reverse engineer any software
                      contained on this website
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#6a2df2] mr-3">•</span>
                    <span>
                      Remove any copyright or other proprietary notations from
                      the materials
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#6a2df2] mr-3">•</span>
                    <span>
                      Transfer the materials to another person or "mirror" the
                      materials on any other server
                    </span>
                  </li>
                </ul>
                <p className="mb-4 leading-relaxed">
                  This license shall automatically terminate if you violate any
                  of these restrictions and may be terminated by me at any time.
                </p>
              </section>

              {/* Section 3 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#6a2df2] mb-4 flex items-center">
                  <span className="bg-[#f0e6fa] text-[#6a2df2] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">
                    3
                  </span>
                  Disclaimer
                </h2>
                <div className="bg-gray-50 p-4 border-l-4 border-[#6a2df2] rounded-r">
                  <p className="mb-4 leading-relaxed">
                    The materials on this website are provided on an 'as is'
                    basis. I make no warranties, expressed or implied, and
                    hereby disclaim and negate all other warranties including,
                    without limitation, implied warranties or conditions of
                    merchantability, fitness for a particular purpose, or
                    non-infringement of intellectual property or other violation
                    of rights.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#6a2df2] mb-4 flex items-center">
                  <span className="bg-[#f0e6fa] text-[#6a2df2] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">
                    4
                  </span>
                  Limitations
                </h2>
                <p className="mb-4 leading-relaxed">
                  In no event shall I or my suppliers be liable for any damages
                  (including, without limitation, damages for loss of data or
                  profit, or due to business interruption) arising out of the
                  use or inability to use the materials on this website, even if
                  I or an authorized representative has been notified orally or
                  in writing of the possibility of such damage.
                </p>
              </section>

              {/* Section 5 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#6a2df2] mb-4 flex items-center">
                  <span className="bg-[#f0e6fa] text-[#6a2df2] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">
                    5
                  </span>
                  Accuracy of Materials
                </h2>
                <p className="mb-4 leading-relaxed">
                  The materials appearing on this website could include
                  technical, typographical, or photographic errors. I do not
                  warrant that any of the materials on this website are
                  accurate, complete, or current. I may make changes to the
                  materials contained on this website at any time without
                  notice.
                </p>
              </section>

              {/* Section 6 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#6a2df2] mb-4 flex items-center">
                  <span className="bg-[#f0e6fa] text-[#6a2df2] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">
                    6
                  </span>
                  Links
                </h2>
                <p className="mb-4 leading-relaxed">
                  I have not reviewed all of the sites linked to this website
                  and am not responsible for the contents of any such linked
                  site. The inclusion of any link does not imply endorsement by
                  me of the site. Use of any such linked website is at the
                  user's own risk.
                </p>
              </section>

              {/* Section 7 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#6a2df2] mb-4 flex items-center">
                  <span className="bg-[#f0e6fa] text-[#6a2df2] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">
                    7
                  </span>
                  Modifications
                </h2>
                <p className="mb-4 leading-relaxed">
                  I may revise these terms of service for this website at any
                  time without notice. By using this website, you are agreeing
                  to be bound by the current version of these terms of service.
                </p>
              </section>

              {/* Section 8 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#6a2df2] mb-4 flex items-center">
                  <span className="bg-[#f0e6fa] text-[#6a2df2] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">
                    8
                  </span>
                  Governing Law
                </h2>
                <p className="mb-4 leading-relaxed">
                  These terms and conditions are governed by and construed in
                  accordance with the laws of India, and you irrevocably submit
                  to the exclusive jurisdiction of the courts in Bangalore,
                  Karnataka, India.
                </p>
              </section>

              {/* Contact section with card style */}
              <section className="mt-10 bg-[#f0e6fa] p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-[#6a2df2] mb-4">
                  Contact Information
                </h2>
                <p className="mb-4">
                  If you have any questions about these terms, please contact me
                  at:
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
