"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/backend/supabase/client";

export const SignUpForm: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanHandle = handle.startsWith("@") ? handle.trim() : `@${handle.trim()}`;

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            handle: cleanHandle,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      // Immediately sign in to establish browser session cookies
      let session = data.session;
      if (!session) {
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (signInErr) {
          setErrorMessage(signInErr.message);
          setLoading(false);
          return;
        }
        session = signInData.session;
      }

      if (session) {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account.");
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google") => {
    setOauthLoading(provider);
    setErrorMessage("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) {
        setErrorMessage(error.message);
        setOauthLoading(null);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "OAuth sign-in failed.");
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans flex flex-col lg:flex-row">
      {/* ============================================================ */}
      {/* LEFT COLUMN: Registration Form (approx 44% width on desktop) */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[44%] flex flex-col justify-between px-6 py-8 sm:px-12 sm:py-12 lg:px-16 lg:py-14 xl:px-20 xl:py-16">
        <div>
          {/* Official Kreato Brand Header */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8 sm:mb-10 group">
            <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/kreato-logo.png"
                alt="Kreato"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="font-extrabold text-xl text-slate-950 tracking-tight">
              Kreato
            </span>
          </Link>

          {/* Clean Modern Sans-Serif Heading */}
          <div className="max-w-[420px]">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Create your Kreato account
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-500 font-normal leading-relaxed">
              Start managing your creator business, protecting your income and organizing every brand collaboration.
            </p>

            {errorMessage && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Registration Form with 4 Mandatory Fields */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* FIELD 1: Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 sm:h-13 px-4 rounded-xl bg-white border border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4056F4] focus:ring-2 focus:ring-[#8AA4FF]/40 transition-all"
                />
              </div>

              {/* FIELD 2: Creator Handle / Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Creator Username / Handle
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm select-none">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="yourhandle"
                    value={handle.replace(/^@/, "")}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full h-12 sm:h-13 pl-9 pr-4 rounded-xl bg-white border border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4056F4] focus:ring-2 focus:ring-[#8AA4FF]/40 transition-all font-medium"
                  />
                </div>
              </div>

              {/* FIELD 3: Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 sm:h-13 px-4 rounded-xl bg-white border border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4056F4] focus:ring-2 focus:ring-[#8AA4FF]/40 transition-all"
                />
              </div>

              {/* FIELD 4: Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 sm:h-13 px-4 pr-11 rounded-xl bg-white border border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4056F4] focus:ring-2 focus:ring-[#8AA4FF]/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Primary CTA: Continue -> */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#4056F4] hover:bg-[#3046DD] active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Separator: ──────── or ──────── */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-slate-400 font-medium select-none">
                or
              </span>
            </div>

            {/* Supported Social Authentication Options */}
            <div>
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={oauthLoading !== null}
                className="w-full h-12 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99] text-slate-800 font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-2xs disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {oauthLoading === "google" ? "Connecting..." : "Sign up with Google"}
                </span>
              </button>
            </div>

            {/* Existing account link */}
            <div className="mt-6 text-center sm:text-left text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#4056F4] hover:underline"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>

        {/* Terms and Privacy Footer */}
        <div className="pt-8 mt-6 text-xs text-slate-400 leading-relaxed max-w-[420px]">
          By signing up, you agree to Kreato's Terms of Service and Privacy Policy.
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT COLUMN: Beacons Showcase Image Composition (56%)       */}
      {/* ============================================================ */}
      <div className="hidden lg:flex w-[56%] bg-white flex-col justify-center items-center p-8 xl:p-14 relative overflow-hidden">
        <div className="w-full max-w-[540px] flex flex-col items-center">
          {/* Main Visual: sign_up_image.webp matching reference */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full flex justify-center"
          >
            <img
              src="/marketing/sign_up_image.webp"
              alt="Kreato Creator Business Showcase"
              className="w-full max-w-[480px] h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Supporting Text Below Visual Composition */}
          <div className="mt-8 text-center max-w-md">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Your creator business, connected.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              From brand enquiries and commercial protection to invoices and payments, manage every important business workflow in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
