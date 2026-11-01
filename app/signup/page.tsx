import type { Metadata } from "next";
import { SignUpForm } from "@/frontend/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Create your Kreato Account | Kreato",
  description: "Join independent creators managing their brand deals and income defense with Kreato.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}

