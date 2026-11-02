import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your BookNook account and return to the shared shelf.",
};

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="keep-content-center min-h-[32rem] animate-pulse py-12"><div className="mx-auto h-[28rem] max-w-md rounded-3xl bg-card/70" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
