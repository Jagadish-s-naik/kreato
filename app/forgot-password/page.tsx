import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/frontend/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Kreato",
  description: "Reset your Kreato creator account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

