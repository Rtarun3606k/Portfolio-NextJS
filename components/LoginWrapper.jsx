"use client";

import React from "react";
import LoginForm from "@/components/LoginForm";

// This component acts as a client boundary wrapper for LoginForm
export default function LoginWrapper() {
  return <LoginForm />;
}
