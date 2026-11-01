"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { createClient } from "@/backend/supabase/client";

export const SignUpForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialHandle = searchParams.get("handle") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [handle, setHandle] = useState(initialHandle ? `@${initialHandle.replace(/^@/, "")}` : "");
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* LEFT COLUMN: Registration Form */}
      <div className="w-full lg:w-[48%] flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20">
        <div>
          {/* Brand Header */}
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-8">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/kreato-logo.png"
                alt="Kreato logo"
                className="w-9 h-9 object-contain"
              />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              Kreato
            </span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Start managing your creator business, auditing deals, and securing invoices.
          </p>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aanya Sharma"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3D54F5] text-sm text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Creator Username / Handle
              </label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@aanyacreates"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3D54F5] text-sm text-slate-900 font-medium font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aanya@creator.in"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3D54F5] text-sm text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3D54F5] text-sm text-slate-900 font-medium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-full bg-[#2C52F5] hover:bg-[#2042D8] active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? "Creating workspace..." : "Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-xs text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#2C52F5] hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          By signing up, you agree to Kreato's Terms of Service and Privacy Policy.
        </div>
      </div>

      {/* RIGHT COLUMN: Extracted Beacons Split-Screen Graphic */}
      <div className="hidden lg:flex w-full lg:w-[52%] bg-[#F2F4F8] p-10 xl:p-14 items-center justify-center relative overflow-hidden border-l border-slate-200/80">
        <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/marketing/sign_up_image.webp"
            alt="Kreato Creator Business Preview"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};
