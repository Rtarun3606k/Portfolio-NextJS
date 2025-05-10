"use client";

import React from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Contact component
const Contact = dynamic(() => import("@/components/Constact"));

const ContactPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-pulse text-purple-600">
              Loading contact form...
            </div>
          </div>
        }
      >
        <Contact />
      </Suspense>
    </div>
  );
};

export default ContactPage;
