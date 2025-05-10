"use client";

import React from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the RegisterForm component
const RegisterForm = dynamic(() => import("@/components/RegisterForm"));

const RegisterPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-pulse text-purple-600">
              Loading registration form...
            </div>
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
};

export default RegisterPage;
