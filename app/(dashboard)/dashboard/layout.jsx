"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Layout = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status by verifying the session with the server
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include", // Important to include cookies
        });

        const data = await response.json();

        if (response.ok && data.authenticated) {
          console.log("Admin access verified");
          setIsAuthenticated(true);
        } else {
          console.log("Authentication failed, redirecting to login");
          router.push("/Login");
        }
      } catch (error) {
        console.error("Error verifying authentication:", error);
        router.push("/Login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up periodic authentication check
    const authCheckInterval = setInterval(checkAuth, 5 * 60 * 1000); // Check every 5 minutes

    return () => {
      clearInterval(authCheckInterval);
    };
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Render the children only if authenticated
  return isAuthenticated ? (
    <div className="layout">{children}</div>
  ) : (
    // Optional: show placeholder while redirecting
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-gray-500">Redirecting to login...</p>
    </div>
  );
};

export default Layout;
