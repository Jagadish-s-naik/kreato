import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUpForm } from "@/frontend/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Create your Kreato Account",
  description:
    "Join independent creators managing their brand deals and income defense with Kreato.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SignUpForm />
    </Suspense>
  );
}
