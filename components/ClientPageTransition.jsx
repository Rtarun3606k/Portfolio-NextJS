"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import PageTransition with ssr: false
const PageTransitionWrapper = dynamic(
  () => import("@/components/PageTransitionWrapper"),
  {
    ssr: false,
  }
);

export default function ClientPageTransition() {
  return (
    <Suspense fallback={null}>
      <PageTransitionWrapper />
    </Suspense>
  );
}
