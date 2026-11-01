"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { FloatingShowcase } from "./FloatingShowcase";
import { LayoutTextFlip } from "@/frontend/components/ui/layout-text-flip";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 overflow-hidden">
      {/* Soft Multi-Tint Blue / Pink Radial Light-Ray Background */}
      <div className="absolute top-0 inset-x-0 h-[720px] pointer-events-none -z-10 overflow-hidden">
        {/* Soft Blue Light Field from Upper Left */}
        <div className="absolute -top-32 left-1/4 w-[520px] h-[520px] bg-sky-200/40 rounded-full blur-3xl opacity-75" />
        {/* Lavender & Pink Light Field from Upper Right */}
        <div className="absolute -top-24 right-1/4 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl opacity-75" />
        {/* Soft Central Warm Glow */}
        <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[650px] h-[360px] bg-pink-100/45 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-sm text-xs font-bold text-slate-800 mb-6 sm:mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#54D2B9] animate-pulse" />
          <span>The Creator Business Platform</span>
          <span className="text-slate-300">|</span>
          <span className="text-[#3D54F5] font-extrabold">Income Defense Copilot</span>
        </div>

        {/* Hero Main Headline with Aceternity Layout Text Flip */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.08] max-w-4xl mx-auto">
          <LayoutTextFlip
            text="Build your"
            words={[
              "creator business.",
              "brand partnerships.",
              "deal workflow.",
              "income protection.",
            ]}
            duration={2800}
          />
        </h1>

        {/* Supporting Copy */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Manage brand deals, identify hidden financial risks, negotiate confidently, and track every invoice and payment — all from one connected creator-business workspace.
        </p>

        {/* Hero CTA Actions */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-bold text-white bg-[#3D54F5] hover:bg-[#3047DE] active:scale-[0.98] px-8 py-3.5 rounded-full shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
          >
            <span>Start for free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#showcase"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-7 py-3.5 rounded-full shadow-xs hover:border-slate-300 transition-all duration-200"
          >
            <span>Explore Kreato</span>
          </a>
        </div>

        {/* Verified Product Trust Markers */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Built for Indian Creators</span>
          </div>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#3D54F5]" />
            <span>Connected Deal-to-Payment Workflow</span>
          </div>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <span>Zero Platform Commission</span>
          </div>
        </div>

        {/* Floating Product Showcase Composition */}
        <div id="showcase">
          <FloatingShowcase />
        </div>
      </div>
    </section>
  );
};
