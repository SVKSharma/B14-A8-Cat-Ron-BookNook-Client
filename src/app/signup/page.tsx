import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a BookNook account and join the community shelf.",
};

export default function SignUpPage() {
  return <RegisterForm />;
}
