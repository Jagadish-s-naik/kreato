"use client";

import React, { useState } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { mockBrandLedgers } from "@/frontend/data/mockKreatoData";
import { BookOpen, Search } from "lucide-react";

export default function BrandLedgerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const ledgers = Object.values(mockBrandLedgers).filter((b) =>
    b.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell showFeed={false}>
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Personal Brand Ledger</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Historical memory for solo creators. Track repeat deals, payment speeds, and past concessions.
            </p>
          </div>

          <button className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-full border border-[#EAF2F4] shadow-xs transition-colors">
            Load Demo History
          </button>
        </div>

        {/* Brand Search Bar */}
        <div className="w-full sm:w-64">
          <div className="flex items-center bg-white rounded-full px-3.5 py-1.5 shadow-card border border-[#EAF2F4]">
            <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Filter brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Brand Ledger Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ledgers.map((brand) => (
            <div
              key={brand.brandKey}
              className="bg-white rounded-3xl p-5 shadow-card border border-[#EAF2F4] space-y-3.5"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-[#EAF2F4]">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {brand.brandName}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono">
                    ID: {brand.brandKey}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {brand.totalDeals} Deals Closed
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-[#F5F9FA] rounded-2xl border border-[#EAF2F4]">
                  <p className="text-[9px] text-gray-400 font-medium">Earned</p>
                  <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                    ₹{(brand.totalEarnedPaise / 100).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-2.5 bg-[#F5F9FA] rounded-2xl border border-[#EAF2F4]">
                  <p className="text-[9px] text-gray-400 font-medium">Promised</p>
                  <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                    Net-{brand.avgPromisedDays}d
                  </p>
                </div>
                <div
                  className={`p-2.5 rounded-2xl border ${
                    brand.avgDaysLate > 10
                      ? "bg-[#F1B4B9]/20 border-[#F1B4B9]/40"
                      : "bg-[#DAF4AA]/30 border-[#DAF4AA]/60"
                  }`}
                >
                  <p
                    className={`text-[9px] font-medium ${
                      brand.avgDaysLate > 10 ? "text-[#702228]" : "text-[#2D4B13]"
                    }`}
                  >
                    Avg Late
                  </p>
                  <p
                    className={`text-xs font-extrabold mt-0.5 ${
                      brand.avgDaysLate > 10 ? "text-[#702228]" : "text-[#2D4B13]"
                    }`}
                  >
                    +{brand.avgDaysLate} Days
                  </p>
                </div>
              </div>

              {/* Concessions list */}
              <div className="pt-1 text-xs">
                <p className="font-semibold text-gray-800 mb-1.5 text-[11px]">
                  Concessions Granted in Past Deals:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {brand.pastConcessions.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-xl bg-[#F5F9FA] border border-[#EAF2F4] text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{c}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
