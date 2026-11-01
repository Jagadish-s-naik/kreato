"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/backend/supabase/client";

export const SignUpForm: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [handle, setHandle] = useState("");
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
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            handle: handle.startsWith("@") ? handle.trim() : `@${handle.trim()}`,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.session || data.user) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* LEFT COLUMN: Registration Form (45%) */}
      <div className="w-full lg:w-[48%] flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20">
        <div>
          {/* Logo & Header */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10 group">
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

          <div className="max-w-md">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mb-2">
              Create your Kreato account.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mb-8">
              Start managing your brand deals, auditing contracts, and protecting your income with confidence.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Aanya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3C55F5] focus:border-transparent text-sm text-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Creator Handle / Channel
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="yourhandle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3C55F5] focus:border-transparent text-sm text-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="aanya@creator.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3C55F5] focus:border-transparent text-sm text-slate-900 transition-all placeholder:text-slate-400"
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
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3C55F5] focus:border-transparent text-sm text-slate-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#3C55F5] hover:bg-[#2D44E0] active:scale-[0.99] text-white font-bold text-sm shadow-md hover:shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Free Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-5 text-xs text-slate-500 leading-relaxed text-center">
              By joining Kreato, you agree to our Terms of Service and Privacy Policy. Zero credit card required.
            </p>
          </div>
        </div>

        {/* Form Footer Link */}
        <div className="pt-8 mt-8 border-t border-slate-100 text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#3C55F5] hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* RIGHT COLUMN: Visual Showcase Composition (52%) */}
      <div className="hidden lg:flex w-[52%] bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/60 p-12 xl:p-16 flex-col justify-center items-center relative overflow-hidden border-l border-slate-100">
        {/* Background Aura */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full relative z-10 space-y-6">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-[#3C55F5] uppercase tracking-wider bg-white/80 px-3 py-1 rounded-full shadow-xs border border-indigo-100">
              The Creator Defense Engine
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">
              Never get underpriced again.
            </h2>
          </div>

          {/* Floating Card: Leak Radar */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-slate-200/70">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800">
                GlowSkin India Campaign
              </span>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                ₹1.49L Leak Prevented
              </span>
            </div>
            <div className="text-xs text-slate-500 mb-3">
              Kreato Copilot flagged perpetual whitelisting & 60-day exclusivity on a ₹25,000 offer.
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Counter-Offer Accepted:</span>
              <span className="font-extrabold text-emerald-600">₹75,000 + GST</span>
            </div>
          </div>

          {/* Floating Card: Fast Invoicing */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-slate-200/70">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>SAC 998365 Tax Invoice Generated</span>
            </div>
            <div className="text-lg font-black text-slate-900">
              ₹85,000.00 Settled
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Nykaa Fashion • Cleared on time via UPI
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>No commission</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#3C55F5]" />
              <span>100% Privacy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
