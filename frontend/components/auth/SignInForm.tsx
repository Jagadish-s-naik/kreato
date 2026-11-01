"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { createClient } from "@/backend/supabase/client";

export const SignInForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        window.location.href = "/dashboard";
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in.");
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google") => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
    } catch (err: any) {
      setErrorMessage(err.message || "OAuth sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-12 selection:bg-indigo-100">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Centered Brand Logo */}
        <Link href="/" className="mb-6 flex flex-col items-center group">
          <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
            <img
              src="/kreato-logo.png"
              alt="Kreato logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight mt-2">
            Kreato
          </span>
        </Link>

        {/* Heading & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Welcome back!
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            New to Kreato?{" "}
            <Link
              href="/signup"
              className="text-slate-900 font-semibold underline underline-offset-4 hover:text-indigo-600 transition-colors"
            >
              Sign up.
            </Link>
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Minimal Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="sr-only">Email address</label>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950 transition-all"
            />
          </div>

          <div>
            <label className="sr-only">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 pr-11 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950 transition-all"
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

          {/* Dark Sign-In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-bold text-sm transition-all flex items-center justify-center disabled:opacity-70 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors"
          >
            Forgot password or email?
          </Link>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium lowercase">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Social Authentication */}
        <div className="w-full space-y-2.5">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            className="w-full h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-3"
          >
            <img
              src="/marketing/google_logo.png"
              alt="Google"
              className="w-4 h-4 object-contain"
            />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
