import dynamic from "next/dynamic";
import { Suspense } from "react";
import React from "react";

// Dynamically import the StatsPage component with no SSR
const StatsPage = dynamic(() => import("@/components/Statistics"));

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
        <StatsPage />
      </Suspense>
    </div>
  );
};

export default Page;
