"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { FloatingShowcase } from "./FloatingShowcase";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 overflow-hidden">
      {/* Multi-Tint Soft Atmospheric Gradient Background */}
      <div className="absolute top-0 inset-x-0 h-[680px] pointer-events-none -z-10 overflow-hidden">
        {/* Soft Blue / Cyan Glow */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-3xl opacity-70" />
        {/* Lavender / Purple Glow */}
        <div className="absolute -top-24 right-1/4 w-[480px] h-[480px] bg-purple-200/40 rounded-full blur-3xl opacity-70" />
        {/* Soft Peach / Rose Accent */}
        <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-pink-100/50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-800 mb-6 sm:mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#45CDB5] animate-pulse" />
          <span>The Creator Business Platform</span>
          <span className="text-slate-300">|</span>
          <span className="text-[#3C55F5] font-bold">Income Defense Copilot</span>
        </div>

        {/* Hero Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Your creator business. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-slate-950 via-[#3C55F5] to-indigo-900 bg-clip-text text-transparent">
            Under control.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Manage brand deals, protect your income from underpriced offers and perpetual usage rights, 
          generate GST-compliant invoices, and track every payment — all in one connected workspace.
        </p>

        {/* Hero CTA Actions */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-bold text-white bg-[#3C55F5] hover:bg-[#2D44E0] active:scale-[0.98] px-7 py-3.5 rounded-full shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
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

        {/* Micro Trust Strip */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero platform commission</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#3C55F5]" />
            <span>Built for Indian Creators</span>
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

