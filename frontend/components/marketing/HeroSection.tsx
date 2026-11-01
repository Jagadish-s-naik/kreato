"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FloatingShowcase } from "./FloatingShowcase";

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [handle, setHandle] = useState("");

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
      {/* Radial Multi-Color Light Ray Glow Background matching Beacons reference */}
      <div className="absolute top-0 inset-x-0 h-[850px] pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
        <img
          src="/marketing/DScI2Z9mTaXmGBrGGYqaKophXqE.webp"
          alt="Atmospheric light background"
          className="w-full h-full object-cover object-top opacity-90 scale-105"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Massive Bold Heading: Build your */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-950 tracking-tight leading-[1.05] max-w-4xl mx-auto">
          Build your
        </h1>

        {/* Supporting Copy */}
        <p className="mt-8 text-base sm:text-lg text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed">
          Join creators managing their entire brand deal workflow, stopping money leaks, and automating invoices in one streamlined business hub.
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

        {/* Centered Device and 4 Floating Cards Composition */}
        <FloatingShowcase />
      </div>
    </section>
  );
};
