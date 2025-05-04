"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loading from "../app/(root)/(views)/loading";
import { useRouter } from "next/navigation";

export default function PageTransition() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle route changes
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = () => {
      // Ensure minimum loading time for better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    // Listen for router events
    window.addEventListener("beforeunload", handleRouteChangeStart);
    router?.events?.on?.("routeChangeStart", handleRouteChangeStart);
    router?.events?.on?.("routeChangeComplete", handleRouteChangeComplete);
    router?.events?.on?.("routeChangeError", handleRouteChangeComplete);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart);
      router?.events?.off?.("routeChangeStart", handleRouteChangeStart);
      router?.events?.off?.("routeChangeComplete", handleRouteChangeComplete);
      router?.events?.off?.("routeChangeError", handleRouteChangeComplete);
    };
  }, [router]);

  // Alternative method using pathname and searchParams changes
  // This will also detect route changes in the App Router
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
