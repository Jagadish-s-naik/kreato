"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/backend/supabase/client";

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send reset email.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans flex flex-col justify-center items-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-[380px] sm:max-w-[400px]">
        {/* Centered Kreato Logo */}
        <div className="flex flex-col items-center mb-7">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-5">
            <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/kreato-logo.png"
                alt="Kreato"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="font-extrabold text-2xl text-slate-950 tracking-tight">
              Kreato
            </span>
          </Link>

          {/* Centered Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight text-center">
            Reset password
          </h1>
          <p className="mt-2 text-sm text-slate-500 text-center font-normal">
            Enter the email address tied to your creator account.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Password reset link sent
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              If an account exists for <strong className="text-slate-900">{email}</strong>, you will receive instructions to reset your password shortly.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#4056F4] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4056F4] focus:ring-2 focus:ring-[#8AA4FF]/40 transition-all font-normal"
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#111421] hover:bg-black active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Send Recovery Link</span>
                )}
              </button>
            </div>

            <div className="text-center pt-3">
              <Link
                href="/login"
                className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
