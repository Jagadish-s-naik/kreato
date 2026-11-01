"use client";

import React from "react";
import { ArrowUpRight, ChevronDown, RotateCw, AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

export const PastelSummaryCards: React.FC = () => {
  return (
    <div className="bg-white rounded-4xl p-6 shadow-soft border border-white/60">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          Commercial Health Summary
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-700 cursor-pointer transition-colors border border-gray-100">
            <span>This Quarter</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <button
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
            title="Refresh Summary"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Pastel Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Money at Risk (Soft Coral) */}
        <Link
          href="/radar"
          className="bg-[#F7B7B7] rounded-3xl p-5 relative flex flex-col justify-between min-h-[130px] transition-transform hover:-translate-y-0.5 duration-200 cursor-pointer shadow-sm group"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-extrabold text-[#762626] uppercase tracking-wider block">
                Money Leak Radar
              </span>
              <p className="text-sm font-bold text-[#762626] mt-0.5">
                ₹1,25,000 at risk
              </p>
            </div>
            <div className="p-1 rounded-full bg-white/30 backdrop-blur-xs text-[#762626]">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-end justify-between mt-6">
            <div>
              <p className="text-[10px] text-[#762626] opacity-75">Active Leaks:</p>
              <p className="text-[11px] font-semibold text-[#762626]">
                Perpetual Rights & 60d Terms
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#EFA3A3] flex items-center justify-center font-bold text-xs text-[#762626]">
              1
            </div>
          </div>
        </Link>

        {/* Card 2: Active Deal Pipeline (Muted Teal) */}
        <Link
          href="/deals"
          className="bg-[#A7E4DB] rounded-3xl p-5 relative flex flex-col justify-between min-h-[130px] transition-transform hover:-translate-y-0.5 duration-200 cursor-pointer shadow-sm group"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-extrabold text-[#10564E] uppercase tracking-wider block">
                Active Deals
              </span>
              <p className="text-sm font-bold text-[#10564E] mt-0.5">
                ₹2,45,000 pipeline
              </p>
            </div>
            <div className="p-1 rounded-full bg-white/30 backdrop-blur-xs text-[#10564E]">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-end justify-between mt-6">
            <div>
              <p className="text-[10px] text-[#10564E] opacity-75">Status:</p>
              <p className="text-[11px] font-semibold text-[#10564E]">
                3 In Negotiation / Agreed
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#91D8CD] flex items-center justify-center font-bold text-xs text-[#10564E]">
              4
            </div>
          </div>
        </Link>

        {/* Card 3: Recovered & Invoiced (Pastel Green) */}
        <Link
          href="/invoices"
          className="bg-[#D8EEB6] rounded-3xl p-5 relative flex flex-col justify-between min-h-[130px] transition-transform hover:-translate-y-0.5 duration-200 cursor-pointer shadow-sm group"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-extrabold text-[#3D5B1A] uppercase tracking-wider block">
                Income Recovered
              </span>
              <p className="text-sm font-bold text-[#3D5B1A] mt-0.5">
                ₹1,20,000 negotiated up
              </p>
            </div>
            <div className="p-1 rounded-full bg-white/30 backdrop-blur-xs text-[#3D5B1A]">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-end justify-between mt-6">
            <div>
              <p className="text-[10px] text-[#3D5B1A] opacity-75">Payment Health:</p>
              <p className="text-[11px] font-semibold text-[#3D5B1A]">
                ₹53,100 Pending (0 Overdue)
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#C4E496] flex items-center justify-center font-bold text-xs text-[#3D5B1A]">
              98%
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

