"use client";

import React from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export const FloatingShowcase: React.FC = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-12 mb-20 px-2 sm:px-4">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-200/40 via-indigo-100/50 to-pink-200/40 rounded-3xl blur-2xl transform -rotate-1 scale-95 opacity-80 pointer-events-none" />

      {/* Central High-Fidelity Creator Dashboard Mockup */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.1)] p-4 sm:p-6 lg:p-8 overflow-hidden">
        {/* Mockup Header Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-md">
              <img
                src="/kreato-logo.png"
                alt="Kreato"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  Aanya Sharma
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <ShieldCheck className="w-3 h-3" />
                  Protected
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Lifestyle & Tech Creator • 450K Reach
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Current Health:</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              98% Safe Terms
            </span>
          </div>
        </div>

        {/* Dashboard 3-Column Preview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
          <div className="bg-[#DAF4AA]/30 border border-[#DAF4AA]/70 rounded-2xl p-4">
            <div className="text-xs font-semibold text-emerald-950/70 mb-1">
              Active Sponsorships
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹2,45,000
            </div>
            <div className="text-[11px] text-emerald-800 font-medium mt-1">
              4 ongoing brand campaigns
            </div>
          </div>

          <div className="bg-[#96D7CF]/30 border border-[#96D7CF]/70 rounded-2xl p-4">
            <div className="text-xs font-semibold text-teal-950/70 mb-1">
              Settled This Month
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹1,85,400
            </div>
            <div className="text-[11px] text-teal-800 font-medium mt-1">
              GST invoices cleared via UPI/NEFT
            </div>
          </div>

          <div className="bg-[#F1B4B9]/30 border border-[#F1B4B9]/70 rounded-2xl p-4">
            <div className="text-xs font-semibold text-rose-950/70 mb-1">
              Leaks Blocked by Copilot
            </div>
            <div className="text-2xl font-black text-rose-950 tracking-tight">
              ₹1,47,500
            </div>
            <div className="text-[11px] text-rose-900 font-medium mt-1">
              Uncompensated rights removed
            </div>
          </div>
        </div>

        {/* Mock Deal Pipeline Flow Strip */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500">
            <span>INCOMING BRAND OPPORTUNITY</span>
            <span className="text-slate-400">Deterministic Radar Check</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-xl p-3.5 border border-slate-200/70 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">
                GS
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  GlowSkin India Campaign
                </div>
                <div className="text-xs text-slate-500">
                  1x Dedicated Reel + 2x Stories
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <div className="text-xs text-slate-400">Offered Fee</div>
                <div className="text-sm font-bold text-slate-900">₹25,000</div>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-lg flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Underpriced 66%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING CARD 1: Money Leak Alert (Top Right) */}
      <div className="absolute -top-6 -right-2 sm:-right-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-rose-100 max-w-xs animate-bounce [animation-duration:5s] hover:scale-105 transition-transform hidden sm:block pointer-events-auto">
        <div className="flex items-center gap-2 text-rose-600 text-xs font-bold mb-1.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Money Leak Radar Alert</span>
        </div>
        <p className="text-xs font-semibold text-slate-800 leading-snug">
          Perpetual usage rights requested without licensing fee.
        </p>
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Leak Exposure:</span>
          <span className="text-xs font-black text-rose-600">+₹50,000</span>
        </div>
      </div>

      {/* FLOATING CARD 2: Copilot Recommendation (Bottom Left) */}
      <div className="absolute -bottom-6 -left-2 sm:-left-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-indigo-100 max-w-xs animate-bounce [animation-duration:6s] hover:scale-105 transition-transform hidden sm:block pointer-events-auto">
        <div className="flex items-center gap-2 text-[#3C55F5] text-xs font-bold mb-1.5">
          <Sparkles className="w-4 h-4 shrink-0 text-[#3C55F5]" />
          <span>Deal Copilot Counter-Offer</span>
        </div>
        <p className="text-xs text-slate-700 leading-snug">
          "Counter at <strong className="text-slate-900">₹75,000</strong> with 60-day digital exclusivity or remove perpetual whitelisting."
        </p>
        <div className="mt-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
          Walk-Away Floor: ₹60,000
        </div>
      </div>

      {/* FLOATING CARD 3: Payment Settled (Bottom Right) */}
      <div className="absolute bottom-10 right-4 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-emerald-100 max-w-[210px] hidden md:block hover:scale-105 transition-transform pointer-events-auto">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Payment Settled</span>
        </div>
        <div className="text-sm font-black text-slate-900">₹85,000 received</div>
        <div className="text-[10px] text-slate-500">Nykaa Fashion • Net-15 UPI</div>
      </div>
    </div>
  );
};

