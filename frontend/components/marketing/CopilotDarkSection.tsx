"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  FileSearch,
  Scale,
  Send,
  Zap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export const CopilotDarkSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const capabilities = [
    {
      title: "Rate Benchmarking",
      desc: "Compares inbound commercial offers against Indian creator market medians for your niche and deliverable scope.",
      tag: "Deterministic Math",
    },
    {
      title: "Contract Risk Auditing",
      desc: "Scans brand agreements for perpetuity traps, moral rights waivers, uncompensated digital ad usage, and heavy late penalties.",
      tag: "Legal Defense",
    },
    {
      title: "Counter-Offer Engine",
      desc: "Drafts professional, assertive counter-proposals with anchor tiers so you never settle below your floor value.",
      tag: "Negotiation Power",
    },
    {
      title: "Payment Follow-up Watchdog",
      desc: "Tracks due dates and sends courteous, legally precise payment reminders before debts become stale.",
      tag: "Cashflow Protection",
    },
  ];

  return (
    <section
      id="copilot"
      className="py-24 sm:py-32 bg-[#000305] text-white relative overflow-hidden"
    >
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-r from-teal-500/15 via-[#3C55F5]/20 to-purple-500/15 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Pill & Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-[#45CDB5] mb-5">
            <Sparkles className="w-4 h-4 text-[#45CDB5]" />
            <span>AI Copilot for Independent Creators</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Meet your creator-business copilot.
          </h2>
          <p className="mt-5 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Kreato Copilot works alongside you — auditing contracts, exposing hidden risks, and calculating professional counters so you can earn what your content is actually worth.
          </p>
        </div>

        {/* Interactive Capability Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Capability Selector Tabs */}
          <div className="lg:col-span-5 space-y-3">
            {capabilities.map((cap, idx) => (
              <button
                key={cap.title}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left p-5 rounded-2xl transition-all duration-200 border ${
                  activeTab === idx
                    ? "bg-slate-900/90 border-[#3C55F5] shadow-lg shadow-indigo-500/10"
                    : "bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white text-base">
                    {cap.title}
                  </span>
                  <span className="text-[11px] font-semibold text-[#45CDB5] bg-[#45CDB5]/10 px-2 py-0.5 rounded-full">
                    {cap.tag}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {cap.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Right Column: Live Interactive Preview Terminal */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">
                  copilot-audit-stream // GlowSkin.deal
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800/50">
                Audit Active
              </span>
            </div>

            {/* Simulated Copilot Audit Stream */}
            <div className="space-y-4 font-sans">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
                  <FileSearch className="w-4 h-4 text-sky-400" />
                  <span>CLAUSE AUDIT EXCERPT</span>
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed bg-black/40 p-3 rounded-xl border border-slate-800">
                  "Creator grants Brand perpetual, irrevocable, worldwide rights to edit, adapt, and run paid advertisements across Meta & Google Ads without additional licensing fees."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 mb-1.5">
                  <Shield className="w-4 h-4 text-rose-400" />
                  <span>RISK EXPOSURE IDENTIFIED</span>
                </div>
                <p className="text-xs text-rose-200 leading-relaxed">
                  Perpetual paid usage requested for ₹0 license fee. Standard Indian digital ad licensing is 100% of base fee (₹75,000 value).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#3C55F5]/10 border border-[#3C55F5]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-indigo-300">
                    Recommended Response
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    "Limit ad usage to 60 days on Instagram or add ₹45,000 licensing fee."
                  </div>
                </div>
                <Link
                  href="/signup"
                  className="shrink-0 text-xs font-bold bg-[#3C55F5] hover:bg-[#2D44E0] text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>Use in Counter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

