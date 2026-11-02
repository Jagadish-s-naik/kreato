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
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans flex flex-col lg:flex-row">
      {/* ============================================================ */}
      {/* LEFT COLUMN: Registration Form (approx 44% width on desktop) */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[44%] flex flex-col justify-between px-6 py-8 sm:px-12 sm:py-12 lg:px-16 lg:py-14 xl:px-20 xl:py-16">
        <div>
          {/* Official Kreato Brand Header */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10 group">
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
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
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
                  className="w-full h-13 px-4 rounded-xl bg-white border border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4056F4] focus:ring-2 focus:ring-[#8AA4FF]/40 transition-all"
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
                    className="w-full h-13 pl-9 pr-4 rounded-xl bg-white border border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4056F4] focus:ring-2 focus:ring-[#8AA4FF]/40 transition-all font-medium"
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
                  className="w-full h-13 px-4 rounded-xl bg-white border border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4056F4] focus:ring-2 focus:ring-[#8AA4FF]/40 transition-all"
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
                    className="w-full h-13 px-4 pr-11 rounded-xl bg-white border border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4056F4] focus:ring-2 focus:ring-[#8AA4FF]/40 transition-all"
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
      {/* RIGHT COLUMN: Spacious White Showcase Composition (56%)     */}
      {/* ============================================================ */}
      <div className="hidden lg:flex w-[56%] bg-white flex-col justify-center items-center p-8 xl:p-14 relative overflow-hidden">
        {/* Composition Container */}
        <div className="w-full max-w-xl flex flex-col items-center">
          {/* Main Visual: Center Device Frame with Floating Cards */}
          <div className="relative w-full flex items-center justify-center py-6">
            {/* Center Smartphone Mockup with Kreato Creator Business Interface */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-20 w-[290px] xl:w-[320px] rounded-[44px] p-2.5 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18)] border-[3px] border-slate-800"
            >
              {/* Phone Inner Bezel & Screen */}
              <div className="relative rounded-[36px] bg-slate-900 text-white overflow-hidden aspect-[9/18.5] flex flex-col p-4">
                {/* Dynamic Island / Notch */}
                <div className="w-24 h-4 bg-black rounded-full mx-auto mb-3 shrink-0" />

                {/* Creator Header Inside Phone */}
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4056F4] to-[#54D2B9] flex items-center justify-center font-bold text-xs text-white">
                    AS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">Aanya Sharma</div>
                    <div className="text-[10px] text-emerald-400 font-medium">● 450K Reach • Mumbai</div>
                  </div>
                </div>

                {/* KPI Tiles inside phone */}
                <div className="grid grid-cols-2 gap-2 my-3">
                  <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 font-medium">Pipelines</div>
                    <div className="text-sm font-extrabold text-white mt-0.5">₹2,45,000</div>
                  </div>
                  <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
                    <div className="text-[10px] text-emerald-400 font-medium">Settled UPI</div>
                    <div className="text-sm font-extrabold text-white mt-0.5">₹1,85,400</div>
                  </div>
                </div>

                {/* Deal Inbox Preview Item */}
                <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/80 space-y-1.5 mb-2.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-indigo-300">GlowSkin India</span>
                    <span className="text-rose-400 font-semibold bg-rose-950/60 px-1.5 py-0.5 rounded">Risk Flagged</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Perpetual rights removed • Countered at ₹75,000
                  </div>
                </div>

                {/* Invoice Status Item */}
                <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/40 mt-auto">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">SAC 998365 Invoice</span>
                    <span className="text-emerald-400 font-bold">Cleared</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FLOATING CARD 1: TOP RIGHT - Brand Collaboration Invitation Card */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [2, 1, 2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-4 xl:-right-8 z-30 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 max-w-[210px] text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Brand Collaboration
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug">
                Mamaearth Campaign
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">
                ₹90,000 Verified Rate
              </div>
            </motion.div>

            {/* FLOATING CARD 2: LEFT - Money Leak Radar Card */}
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [-2, -1, -2] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -left-6 xl:-left-12 z-30 bg-white rounded-2xl p-3.5 shadow-xl border border-rose-100 max-w-[210px] text-left"
            >
              <div className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider mb-0.5">
                Money Leak Radar
              </div>
              <div className="text-xs font-bold text-slate-800 leading-snug">
                Perpetual whitelisting flagged
              </div>
              <div className="text-[11px] font-black text-rose-600 mt-1">
                +₹50,000 exposure saved
              </div>
            </motion.div>

            {/* FLOATING CARD 3: RIGHT - Payment Received Notification */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [1, 2, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-16 -right-6 xl:-right-10 z-30 bg-white rounded-2xl p-3 shadow-xl border border-emerald-100 max-w-[200px] text-left"
            >
              <div className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider mb-0.5">
                Payment Confirmed
              </div>
              <div className="text-sm font-black text-slate-900">
                ₹85,000 Received
              </div>
              <div className="text-[10px] text-slate-400">
                Nykaa Fashion • Net-15 UPI
              </div>
            </motion.div>

            {/* FLOATING CARD 4: BOTTOM LEFT - Deal Copilot Counter Ladder */}
            <motion.div
              animate={{ y: [0, 7, 0], rotate: [-1, -2, -1] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 -left-4 xl:-left-8 z-30 bg-white rounded-2xl p-3 shadow-xl border border-slate-100 max-w-[190px] text-left"
            >
              <div className="text-[10px] font-bold text-[#4056F4] uppercase tracking-wider mb-0.5">
                Copilot Ladder
              </div>
              <div className="text-xs font-bold text-slate-900">
                Floor: ₹60,000
              </div>
              <div className="text-[10px] text-slate-500">
                Target: ₹75,000
              </div>
            </motion.div>
          </div>

          {/* Supporting Text Below Visual Composition */}
          <div className="mt-8 text-center max-w-md">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
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
