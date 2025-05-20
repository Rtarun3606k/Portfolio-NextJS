"use client";

import { useEffect } from "react";
import initWebVitals, { WebVitalsTracker } from "./webVitals";
import { Suspense } from "react";

export default function WebVitalsScriptt() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WebVitalsTracker />
    </Suspense>
  ); // This component doesn't render anything visible
}
