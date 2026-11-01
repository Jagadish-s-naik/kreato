"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FloatingShowcase } from "./FloatingShowcase";

const ROTATING_PHRASES = [
  "creator business.",
  "brand partnerships.",
  "deal workflow.",
  "income protection.",
];

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
        setVisible(true);
      }, 350);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.trim().replace(/^@/, "");
    if (clean) {
      router.push(`/signup?handle=${encodeURIComponent(clean)}`);
    } else {
      router.push("/signup");
    }
  };

  return (
    <section className="relative pt-24 sm:pt-32 pb-16 overflow-hidden">
      {/* Radial Multi-Color Light Ray Glow Background */}
      <div className="absolute top-0 inset-x-0 h-[850px] pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
        <img
          src="/marketing/DScI2Z9mTaXmGBrGGYqaKophXqE.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-top opacity-90 scale-105"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Animated Hero Heading */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-950 tracking-tight leading-[1.05] max-w-4xl mx-auto">
          Build your
          <br />
          <span
            style={{
              display: "inline-block",
              transition: "opacity 0.35s ease, transform 0.35s ease",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              background: "linear-gradient(135deg, #3C55F5 0%, #54D2B9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {ROTATING_PHRASES[phraseIndex]}
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-8 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Manage brand deals, identify hidden financial risks, negotiate
          confidently, and track every invoice and payment — all from one
          connected creator-business workspace.
        </p>

        {/* Claim Username Pill Widget */}
        <div className="mt-8 mb-14 flex justify-center">
          <form
            onSubmit={handleClaim}
            className="w-full max-w-md bg-white rounded-2xl sm:rounded-full p-2 pl-4 sm:pl-6 shadow-xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-2.5 backdrop-blur-md hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-2 w-full text-slate-900 font-semibold text-sm sm:text-base">
              <span className="font-bold text-slate-900">kreato.in/</span>
              <input
                type="text"
                placeholder="yourname"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-transparent focus:outline-none placeholder:text-slate-400 text-slate-900 font-bold"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 bg-[#2C52F5] hover:bg-[#2042D8] text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl sm:rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              Claim your username
            </button>
          </form>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12 text-xs sm:text-sm font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Built for Indian Creators
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Connected Deal-to-Payment Workflow
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            Zero Platform Commission
          </span>
        </div>

        {/* Centered Device and 4 Floating Cards Composition */}
        <FloatingShowcase />
      </div>
    </section>
  );
};
