"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the Statistics component
const StatsWrapper = dynamic(() => import("@/components/Statistics"));

const Page = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-pulse text-purple-600">
              Loading statistics...
            </div>
          </div>
        }
      >
        <StatsWrapper />
      </Suspense>
    </div>
  );
};

export default Page;
