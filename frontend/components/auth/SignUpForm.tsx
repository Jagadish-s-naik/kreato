"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/backend/supabase/client";

export const SignUpForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialHandle = searchParams.get("handle") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [handle, setHandle] = useState(
    initialHandle ? `@${initialHandle.replace(/^@/, "")}` : ""
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanHandle = handle.startsWith("@")
        ? handle.trim()
        : `@${handle.trim()}`;

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
        const { data: signInData, error: signInErr } =
          await supabase.auth.signInWithPassword({
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

  return (
    <div className="min-h-screen bg-white text-slate-900 flex justify-center selection:bg-indigo-100">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-16 py-10 lg:py-16 gap-12 lg:gap-16">
        
        {/* LEFT COLUMN: Registration Form (42%) */}
        <div className="w-full lg:w-[42%] max-w-md mx-auto lg:mx-0 flex flex-col justify-between">
          <div>
            {/* Brand Logo & Wordmark */}
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-10">
              <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src="/kreato-logo.png"
                  alt="Kreato logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
                Kreato
              </span>
            </Link>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Create your Kreato account
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
              Start managing your creator business, protecting your income and organizing every brand collaboration.
            </p>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Field 1: Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none focus:border-[#4056F4] focus:ring-1 focus:ring-[#4056F4] transition-all"
                />
              </div>

              {/* Field 2: Creator Username / Handle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Creator Username / Handle
                </label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none focus:border-[#4056F4] focus:ring-1 focus:ring-[#4056F4] transition-all"
                />
              </div>

              {/* Field 3: Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none focus:border-[#4056F4] focus:ring-1 focus:ring-[#4056F4] transition-all"
                />
              </div>

              {/* Field 4: Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full h-12 px-4 pr-11 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none focus:border-[#4056F4] focus:ring-1 focus:ring-[#4056F4] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Primary CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 rounded-xl bg-[#4056F4] hover:bg-[#3046DD] active:scale-[0.99] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <span>{loading ? "Creating workspace..." : "Continue"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Existing Account Link */}
            <div className="mt-6 text-center text-sm text-slate-600 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#4056F4] hover:underline"
              >
                Log in
              </Link>
            </div>
          </div>

          {/* Terms and Privacy Policy */}
          <div className="mt-10 pt-6 border-t border-slate-100 text-xs text-slate-400 text-center">
            By signing up, you agree to Kreato&apos;s Terms of Service and Privacy Policy.
          </div>
        </div>

        {/* RIGHT COLUMN: Exact Beacons Reference Showcase with sign_up_image.webp (58%) */}
        <div className="w-full lg:w-[58%] flex flex-col items-center justify-center">
          {/* Main Visual Device & Elements (Clean, transparent, no grey box) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full max-w-[520px] flex justify-center items-center"
          >
            <img
              src="/marketing/sign_up_image.webp"
              alt="Kreato Creator Business Showcase"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Authentic Creator Value Statement Below Showcase */}
          <div className="mt-10 text-center max-w-lg px-4">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              &ldquo;The Kreato platform has made it seamless for me to monetize and protect my brand deals.&rdquo;
            </h3>
            <p className="mt-3 text-sm text-slate-500 font-semibold tracking-wide">
              Aanya Sharma <span className="font-normal text-slate-400 ml-1">kreato.in/aanyacreates</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
