"use client";

import React from "react";
import PageTransition from "@/components/PageTransition";

// This component wraps the PageTransition component in a client boundary
export default function PageTransitionWrapper() {
  return <PageTransition />;
}
