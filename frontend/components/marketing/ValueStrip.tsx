"use client";

import React from "react";
import { Inbox, ShieldAlert, Sparkles, CheckCircle } from "lucide-react";

export const ValueStrip: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Ingest & Extract",
      desc: "Turn brand DMs, PDFs, and messy email proposals into structured deliverable scopes instantly.",
      icon: Inbox,
      badge: "Deal Inbox",
    },
    {
      step: "02",
      title: "Audit & Defend",
      desc: "Expose hidden money leaks: underpriced rates, perpetual usage rights, and payment delay financing traps.",
      icon: ShieldAlert,
      badge: "Money Leak Radar",
    },
    {
      step: "03",
      title: "Negotiate & Settle",
      desc: "Counter with confidence using your 3-tier walk-away ladder, then auto-generate GST invoices and track bank settlement.",
      icon: CheckCircle,
      badge: "Ledger & Invoices",
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-y border-slate-100 bg-[#F9FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything you need to run the business behind your content.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            From the first brand inquiry to final payment clearance, Kreato brings your entire creator business into one connected, predictable workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-slate-200 group-hover:text-[#3C55F5]/20 transition-colors">
                    {item.step}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50/70 text-[#3C55F5] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
