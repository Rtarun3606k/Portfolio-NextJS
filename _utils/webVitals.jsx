"use client";

import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Function to send data to your backend
const sendToAnalytics = (metric, pathname) => {
  if (typeof window !== "undefined") {
    const body = {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      page: pathname || window.location.pathname,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      referrer: document.referrer || "",
      timestamp: new Date().toISOString(),
    };

    // console.log("Sending metric:", body);
    // Uncomment when ready to send to backend
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${baseUrl}/api/webvitals`, JSON.stringify(body));
    } else {
      fetch(`${baseUrl}/api/analytics`, {
        body: JSON.stringify(body),
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
};

// Create a component that will monitor page changes
export function WebVitalsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const reportWebVitals = () => {
      // Page view event
      sendToAnalytics(
        {
          name: "page_view",
          value: performance.now(),
          id: crypto.randomUUID
            ? crypto.randomUUID()
            : `page-view-${Date.now()}`,
        },
        pathname
      );

      // Reset and measure Core Web Vitals for the new page
      onCLS((metric) => sendToAnalytics(metric, pathname));
      onINP((metric) => sendToAnalytics(metric, pathname));
      onLCP((metric) => sendToAnalytics(metric, pathname));
      onTTFB((metric) => sendToAnalytics(metric, pathname));
      onFCP((metric) => sendToAnalytics(metric, pathname));
    };

    reportWebVitals();
  }, [pathname, searchParams]); // Re-run when the route changes

  return null; // This component doesn't render anything
}

// Keep the original function for backward compatibility
export default function initWebVitals() {
  // This function can be empty now as WebVitalsTracker handles everything
  return () => {};
}
