"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  Receipt,
  Clock,
} from "lucide-react";

export const FloatingShowcase: React.FC = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-14 mb-20 px-2 sm:px-4">
      {/* Multi-layered Soft Atmospheric Backlight Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-200/50 via-indigo-100/60 to-pink-200/50 rounded-3xl blur-3xl transform -rotate-1 scale-95 opacity-80 pointer-events-none" />

      {/* Central Creator Workspace Device Mockup */}
      <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12)] p-4 sm:p-7 lg:p-9 overflow-hidden">
        {/* Mockup Header Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-md">
              <img
                src="/kreato-logo.png"
                alt="Kreato"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Aanya Sharma
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Protected by Copilot
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Lifestyle & Tech Creator • 450K Reach • Mumbai, IN
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Deal Health Score:</span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              98 / 100 Safe
            </span>
          </div>
        </div>

        {/* 3-Column Balanced KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6 text-left">
          <div className="bg-[#DAF4AA]/30 border border-[#DAF4AA]/80 rounded-2xl p-4">
            <div className="text-xs font-bold text-emerald-950/70 mb-1">
              Active Brand Pipelines
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {"₹"}2,45,000
            </div>
            <div className="text-[11px] text-emerald-800 font-medium mt-1">
              4 ongoing brand campaigns
            </div>
          </div>

          <div className="bg-[#96D7CF]/30 border border-[#96D7CF]/80 rounded-2xl p-4">
            <div className="text-xs font-bold text-teal-950/70 mb-1">
              Settled This Month
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {"₹"}1,85,400
            </div>
            <div className="text-[11px] text-teal-800 font-medium mt-1">
              SAC 998365 invoices cleared via UPI
            </div>
          </div>

          <div className="bg-[#F1B4B9]/30 border border-[#F1B4B9]/80 rounded-2xl p-4">
            <div className="text-xs font-bold text-rose-950/70 mb-1">
              Money Leaks Blocked
            </div>
            <div className="text-2xl font-black text-rose-950 tracking-tight">
              {"₹"}1,49,023
            </div>
            <div className="text-[11px] text-rose-900 font-medium mt-1">
              Uncompensated perpetual rights removed
            </div>
          </div>
        </div>

        {/* Live Deal Workspace Preview Strip */}
        <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70 text-left">
          <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>INCOMING BRAND OPPORTUNITY DETECTED</span>
            <span className="text-slate-400">Deterministic Radar Check</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-[#3D54F5] text-xs">
                NYK
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  Nykaa Fashion Campaign
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                    1x Reel + 2x Stories
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Brief extracted from PDF • 30-day payment term
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Offered Fee</div>
                <div className="text-sm font-black text-slate-900">{"₹"}25,000</div>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold rounded-lg flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Underpriced by 66%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 INDEPENDENTLY POSITIONED & ANIMATED FLOATING CARDS */}

      {/* CARD 1 (Top Right): Money Leak Radar Alert */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [2, 1, 2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-7 -right-2 sm:-right-8 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-rose-100 max-w-xs hidden sm:block pointer-events-auto text-left"
      >
        <div className="flex items-center gap-2 text-rose-600 text-xs font-extrabold mb-1">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>Money Leak Radar Alert</span>
        </div>
        <p className="text-xs font-bold text-slate-800 leading-snug">
          Perpetual usage rights requested without licensing fee.
        </p>
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">Leak Exposure:</span>
          <span className="font-black text-rose-600">+{"₹"}50,000</span>
        </div>
      </motion.div>

      {/* CARD 2 (Bottom Left): Copilot Counter-Offer Ladder */}
      <motion.div
        animate={{
          y: [0, 8, 0],
          rotate: [-2, -1, -2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-8 -left-2 sm:-left-8 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-indigo-100 max-w-xs hidden sm:block pointer-events-auto text-left"
      >
        <div className="flex items-center gap-2 text-[#3D54F5] text-xs font-extrabold mb-1">
          <Sparkles className="w-4 h-4 shrink-0 text-[#3D54F5]" />
          <span>Deal Copilot Counter-Offer</span>
        </div>
        <p className="text-xs text-slate-700 leading-snug">
          &ldquo;Counter at <strong className="text-slate-900 font-extrabold">{"₹"}75,000</strong> with 60-day digital exclusivity or remove perpetual whitelisting.&rdquo;
        </p>
        <div className="mt-2 text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block border border-emerald-200/60">
          Walk-Away Floor: {"₹"}60,000
        </div>
      </motion.div>

      {/* CARD 3 (Bottom Right): Payment Received */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [1, 2, 1],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-6 right-2 sm:-right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 shadow-xl border border-emerald-100 max-w-[220px] hidden md:block pointer-events-auto text-left"
      >
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-extrabold mb-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Payment Confirmed</span>
        </div>
        <div className="text-sm font-black text-slate-900">{"₹"}85,000 Received</div>
        <div className="text-[10px] text-slate-500">Nykaa Fashion • Net-15 UPI</div>
      </motion.div>

      {/* CARD 4 (Top Left): Deal Activity Memo */}
      <motion.div
        animate={{
          y: [0, 6, 0],
          rotate: [-1, -2, -1],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-6 -left-2 sm:-left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 shadow-xl border border-slate-200/80 max-w-[210px] hidden lg:block pointer-events-auto text-left"
      >
        <div className="flex items-center gap-2 text-slate-700 text-xs font-extrabold mb-1">
          <FileCheck2 className="w-4 h-4 text-indigo-600" />
          <span>Deal Memo Signed</span>
        </div>
        <div className="text-xs font-bold text-slate-900">Mamaearth Collab</div>
        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Brand Sign-off Confirmed</div>
      </motion.div>
    </div>
  );
};
