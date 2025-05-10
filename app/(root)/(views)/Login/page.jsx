import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import LoginForm with client-side rendering only
const LoginForm = dynamic(() => import("@/components/LoginForm"));

export default function LoginPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-pulse text-purple-600">
              Loading login form...
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
