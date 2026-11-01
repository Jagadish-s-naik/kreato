import type { Metadata } from "next";
import { SignInForm } from "@/frontend/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In to Kreato | Kreato",
  description: "Sign in to manage your brand deals, review contracts, and protect creator income.",
};

export default function LoginPage() {
  return <SignInForm />;
}

