"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  FileCheck2,
  Lock,
} from "lucide-react";

export const TestimonialsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Truthful, non-fabricated creator value propositions (inspired by Beacons large bordered testimonial panel)
  const items = [
    {
      pillar: "COMMERCIAL CLARITY",
      quote:
        "Creators routinely lose 40% to 70% of fair compensation because brand agencies push uncompensated digital whitelisting and perpetual rights into brief DMs. Kreato calculates the exact financial exposure before you sign.",
      author: "The Kreato Income Defense Philosophy",
      role: "Deterministic 5-Part Leak Radar",
      icon: TrendingUp,
      accent: "#3D54F5",
    },
    {
      pillar: "NEGOTIATION LEVERAGE",
      quote:
        "Never guess your rates or panic under brand agency pressure. With a 3-tier walk-away ladder (Ideal Anchor, Acceptable Target, and Walk-Away Floor), creators hold the leverage to counter with confidence.",
      author: "Deal Copilot Engine",
      role: "Guarded Counter-Offer Drafting",
      icon: ShieldCheck,
      accent: "#54D2B9",
    },
    {
      pillar: "TRACEABLE CASHFLOW",
      quote:
        "A signed deal is only as good as the bank transfer. Moving from chat agreement directly to SAC 998365 GST tax invoices, dynamic UPI QR codes, and late reminder alerts ensures creators get paid on time.",
      author: "Creator Business Follow-Through",
      role: "Automated GST Invoicing & UPI Collection",
      icon: FileCheck2,
      accent: "#8A7AF0",
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const active = items[currentIndex];
  const Icon = active.icon;

  return (
    <section className="py-24 sm:py-32 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#3D54F5] uppercase tracking-wider bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/60">
            Why Creators Choose Kreato
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-4">
            Built for the business behind every creator collaboration.
          </h2>
        </div>

        {/* Large Bordered Panel (Inspired by Beacons video reference) */}
        <div className="relative bg-gradient-to-br from-slate-50/60 to-white rounded-3xl p-8 sm:p-14 border-2 border-indigo-100/80 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3D54F5]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#3D54F5]">
                {active.pillar}
              </span>
            </div>

            {/* Carousel Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                aria-label="Previous quote"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                aria-label="Next quote"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quote Body */}
          <blockquote className="text-lg sm:text-2xl font-bold text-slate-900 leading-relaxed mb-8">
            "{active.quote}"
          </blockquote>

          {/* Author / Component Attribution */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#3D54F5] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900">
                  {active.author}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {active.role}
                </div>
              </div>
            </div>

            {/* Pagination dots */}
            <div className="flex items-center gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === i ? "w-6 bg-[#3D54F5]" : "w-2 bg-slate-200"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

