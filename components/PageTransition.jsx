"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loading from "../app/(root)/(views)/loading";

export default function PageTransition() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStartLoading = () => {
      setIsLoading(true);
    };

    const handleStopLoading = () => {
      // Using a timeout to ensure the loading animation shows for a minimum time
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Minimum display of 1 second after page loads
    };

    // Subscribe to navigation events
    document.addEventListener("nextjs:page-loading", handleStartLoading);
    document.addEventListener("nextjs:page-loaded", handleStopLoading);

    return () => {
      // Clean up event listeners
      document.removeEventListener("nextjs:page-loading", handleStartLoading);
      document.removeEventListener("nextjs:page-loaded", handleStopLoading);
    };
  }, []);

  // Also detect route changes with pathname and searchParams
  useEffect(() => {
    setIsLoading(true);

    // When route changes, show loading for at least 1 second
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Pass isPageTransition=true to the Loading component
  return isLoading ? <Loading isPageTransition={true} /> : null;
}
