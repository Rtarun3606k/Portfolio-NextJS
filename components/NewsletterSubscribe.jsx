"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const NewsletterSubscribe = ({ usedINBlogs = false }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setStatus("loading");
    setErrorMessage("");

    // Validate email
    if (!validateEmail(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    try {
      // Replace with your API endpoint for newsletter subscription
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // throw new Error(data.message || "Something went wrong");
        // return;
        console.log("Subscription error:", data.message);
      }

      // Success state
      setStatus("success");
      setEmail("");

      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setStatus("error");
      setErrorMessage(
        error.message || "Failed to subscribe. Please try again later."
      );
    }
  };

  const handleClear = () => {
    setEmail("");
    setStatus(null);
    setErrorMessage("");
  };

  return (
    <div
      className={` mx-auto py-16 relative overflow-hidden bg-gradient-to-br  ${
        usedINBlogs
          ? "bg-transparent"
          : "from-[#E8EAF6] via-[#E0E7FF] to-[#EDE9FE]"
      }`}
    >
      {/* Enhanced decorative circles with blur effect */}
      {usedINBlogs === true ? null : (
        <>
          <div className="absolute top-10 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#6A0DAD]/10 to-[#FF4ECD]/10 blur-3xl opacity-50"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF4ECD]/10 to-[#6A0DAD]/10 blur-3xl opacity-40"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-[#6A0DAD]/5 blur-2xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-[#FF4ECD]/10 blur-xl"></div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Larger circles with blur effects */}
            <div className="animate-float absolute top-[10%] left-[5%] w-32 h-32 bg-gradient-to-r from-[#5E60CE]/20 to-[#7209B7]/20 rounded-full blur-lg"></div>
            <div className="animate-float-delayed absolute top-[30%] right-[10%] w-40 h-40 bg-gradient-to-r from-[#7209B7]/20 to-[#E6CCE4]/30 rounded-full blur-lg"></div>
            <div className="animate-float-slow absolute bottom-[15%] left-[15%] w-36 h-36 bg-gradient-to-r from-[#C71585]/10 to-[#5E60CE]/20 rounded-full blur-lg"></div>

            {/* Medium circles with different animations */}
            <div className="animate-float-reverse absolute top-[45%] left-[25%] w-28 h-28 bg-gradient-to-br from-[#E6CCE4]/20 to-[#5E60CE]/10 rounded-full blur-md"></div>
            <div className="animate-float-diagonal absolute top-[20%] left-[70%] w-24 h-24 bg-gradient-to-bl from-[#7209B7]/10 to-[#C71585]/20 rounded-full blur-md"></div>
            <div className="animate-float-circular absolute bottom-[35%] right-[25%] w-36 h-36 bg-gradient-to-tr from-[#5E60CE]/20 to-[#E6CCE4]/20 rounded-full blur-lg"></div>

            {/* Smaller accent circles */}
            <div className="animate-pulsate absolute top-[65%] right-[12%] w-28 h-28 bg-gradient-to-r from-[#C71585]/10 to-[#5E60CE]/20 rounded-full blur-md"></div>
            <div className="animate-float-diagonal-reverse absolute top-[8%] left-[50%] w-20 h-20 bg-gradient-to-r from-[#E6CCE4]/20 to-[#7209B7]/10 rounded-full blur-sm"></div>
          </div>
        </>
      )}
      {/* Card with backdrop blur and semi-transparent white background */}
      <center>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 border border-lavender-300 max-w-[55%] ">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-lavender-100 mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-purple-800 mb-2">
              Subscribe to My Newsletter
            </h2>
            <p className="text-purple-700">
              Stay updated with my latest articles, projects, and exclusive
              content.
            </p>
          </div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-lavender-50 border border-lavender-200 rounded-lg p-4 flex items-start mb-4"
            >
              <svg
                className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <center>
                <div className="text-sm text-purple-700 text-center">
                  <p className="font-medium text-center">
                    Thank you for subscribing!
                  </p>
                  <p className="mt-1 text-center">
                    You'll receive updates on my latest content.
                  </p>
                </div>
              </center>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`bg-white/70 backdrop-blur-sm border ${
                    status === "error"
                      ? "border-red-300"
                      : "border-lavender-300"
                  } text-gray-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-3`}
                  placeholder="your.email@example.com"
                  required
                />
                {email && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <svg
                      className="w-5 h-5 text-purple-400 hover:text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {errorMessage}
                </motion.p>
              )}

              <div className="flex items-center">
                <input
                  id="newsletter-marketing"
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 bg-white border-lavender-300 rounded focus:ring-purple-500"
                />
                <label
                  htmlFor="newsletter-marketing"
                  className="ml-2 text-sm font-medium text-purple-700"
                >
                  I agree to receive updates about blog posts and events
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className={`w-full rounded-lg px-5 py-3 text-center text-white font-medium text-sm transition-all
                ${
                  status === "loading"
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg"
                }`}
              >
                {status === "loading" ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Subscribing...
                  </div>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          )}

          <div className="mt-8 flex justify-center space-x-8">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center mb-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
              </div>
              <span className="text-xs text-purple-600">Blog Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center mb-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <span className="text-xs text-purple-600">Events</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center mb-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-xs text-purple-600">Updates</span>
            </div>
          </div>

          <div className="mt-6 text-xs text-center text-purple-600">
            <p>
              By subscribing, you agree to our{" "}
              <a
                href="/privacy-policy"
                className="text-purple-800 hover:underline"
              >
                Privacy Policy
              </a>
              . You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </center>
    </div>
  );
};

export default NewsletterSubscribe;
