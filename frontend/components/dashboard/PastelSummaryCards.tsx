"use client";

import React, { useState } from "react";
import { ArrowUpRight, ChevronDown, RotateCw } from "lucide-react";
import Link from "next/link";

export const PastelSummaryCards: React.FC = () => {
  const [timeframe, setTimeframe] = useState("This Month");

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-[#EAF2F4] space-y-4">
      {/* Header Controls (Title + Filter Dropdown + Refresh) */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-gray-900 tracking-tight">
          Commercial Health Summary
        </h2>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-3 py-1 bg-[#F5F9FA] rounded-full text-[11px] font-medium text-gray-700 border border-[#EAF2F4] cursor-pointer hover:bg-gray-100 transition-colors">
            <span>{timeframe}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
          <button
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-[#F5F9FA] rounded-full transition-colors"
            title="Refresh Summary"
          >
            <RotateCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3 Pastel Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Card 1: Money Leak Radar (Soft Coral) */}
        <Link
          href="/radar"
          className="bg-[#F1B4B9] rounded-2xl p-4 relative flex flex-col justify-between min-h-[130px] transition-transform hover:-translate-y-0.5 duration-150 cursor-pointer shadow-xs group"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-[#702228] uppercase tracking-wider block">
                Money Leak Radar
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#702228] mt-0.5">
                ₹1,25,000
              </p>
            </div>
            <div className="p-1 rounded-full bg-white/40 text-[#702228]">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-end justify-between mt-3 pt-2 border-t border-[#702228]/10">
            <div>
              <p className="text-[9px] text-[#702228] opacity-80 uppercase tracking-wide">
                Active Leak:
              </p>
              <p className="text-[11px] font-bold text-[#702228] truncate max-w-[140px]">
                Perpetual Rights & 60d
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#E8A0A6] flex items-center justify-center font-bold text-xs text-[#702228] shadow-xs shrink-0">
              1
            </div>
          </div>
        </Link>

        {/* Card 2: Active Deal Pipeline (Muted Teal) */}
        <Link
          href="/deals"
          className="bg-[#96D7CF] rounded-2xl p-4 relative flex flex-col justify-between min-h-[130px] transition-transform hover:-translate-y-0.5 duration-150 cursor-pointer shadow-xs group"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-[#0E4A42] uppercase tracking-wider block">
                Active Deals
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#0E4A42] mt-0.5">
                ₹2,45,000
              </p>
            </div>
            <div className="p-1 rounded-full bg-white/40 text-[#0E4A42]">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-end justify-between mt-3 pt-2 border-t border-[#0E4A42]/10">
            <div>
              <p className="text-[9px] text-[#0E4A42] opacity-80 uppercase tracking-wide">
                Under Negotiation:
              </p>
              <p className="text-[11px] font-bold text-[#0E4A42] truncate max-w-[140px]">
                3 In Flight
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#82C8C0] flex items-center justify-center font-bold text-xs text-[#0E4A42] shadow-xs shrink-0">
              4
            </div>
          </div>
        </Link>

        {/* Card 3: Income Recovered (Pastel Green) */}
        <Link
          href="/invoices"
          className="bg-[#DAF4AA] rounded-2xl p-4 relative flex flex-col justify-between min-h-[130px] transition-transform hover:-translate-y-0.5 duration-150 cursor-pointer shadow-xs group"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-[#2D4B13] uppercase tracking-wider block">
                Income Recovered
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#2D4B13] mt-0.5">
                ₹1,20,000
              </p>
            </div>
            <div className="p-1 rounded-full bg-white/40 text-[#2D4B13]">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-end justify-between mt-3 pt-2 border-t border-[#2D4B13]/10">
            <div>
              <p className="text-[9px] text-[#2D4B13] opacity-80 uppercase tracking-wide">
                Payment Health:
              </p>
              <p className="text-[11px] font-bold text-[#2D4B13] truncate max-w-[140px]">
                ₹53,100 Pending
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#C7E494] flex items-center justify-center font-bold text-xs text-[#2D4B13] shadow-xs shrink-0">
              98%
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
