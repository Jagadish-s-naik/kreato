"use client";

import React, { useState } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { mockDeals } from "@/frontend/data/mockKreatoData";
import { computeMoneyLeakRadar } from "@/frontend/lib/radarEngine";
import {
  Radar as RadarIcon,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Info,
} from "lucide-react";
import Link from "next/link";

export default function RadarPage() {
  const [selectedDealId, setSelectedDealId] = useState(mockDeals[0].id);

  const activeDeal =
    mockDeals.find((d) => d.id === selectedDealId) || mockDeals[0];

  const radar = computeMoneyLeakRadar({
    niche: activeDeal.category,
    followerBand: "50k-100k",
    deliverables: activeDeal.deliverables,
    offeredFeePaise: activeDeal.feePaise,
    usageRights: activeDeal.usageRights,
    paymentTermsDays: activeDeal.paymentTermsDays,
    exclusivityDays: activeDeal.exclusivityDays,
    avgBrandDaysLate: 38,
  });

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <RadarIcon className="w-5 h-5 text-rose-600" />
              <span>Money Leak Radar</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Deterministic 5-part mathematical engine exposing hidden leaks in brand offers before you say yes.
            </p>
          </div>
        </div>

        {/* Deal Selector Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {mockDeals.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDealId(d.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedDealId === d.id
                  ? "bg-[#000305] text-white shadow-soft"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-[#EAF2F4]"
              }`}
            >
              {d.brandName} (₹{(d.feePaise / 100).toLocaleString("en-IN")})
            </button>
          ))}
        </div>

        {/* Naturalized Main Container */}
        <div className="bg-[#F5F9FA] border border-[#EAF2F4] rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#EAF2F4]">
            <div>
              <span className="text-[10px] font-extrabold text-[#702228] uppercase tracking-wider block">
                Total Income at Risk
              </span>
              <div className="text-3xl font-extrabold text-[#702228] mt-1">
                ₹{(radar.totalAtRiskPaise / 100).toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Offered fee ₹{(activeDeal.feePaise / 100).toLocaleString("en-IN")} vs fair benchmark value ₹{(radar.fairFeePaise / 100).toLocaleString("en-IN")}
              </p>
            </div>
            <Link
              href={`/deals/${activeDeal.id}`}
              className="px-4 py-2 rounded-full bg-[#000305] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-gray-800 transition-all shadow-soft"
            >
              <span>Negotiate Counter-Offer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Breakdown cards: Clean white on #F5F9FA without bright glow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
            {radar.breakdown.map((item) => (
              <div
                key={item.key}
                className="bg-white rounded-2xl p-4 border border-[#EAF2F4] space-y-2"
              >
                <div className="flex items-center justify-between font-bold text-gray-900">
                  <span className="text-xs">{item.label}</span>
                  <span className="text-rose-700 font-extrabold">
                    +₹{(item.amountPaise / 100).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-snug">
                  {item.reason}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[9px] font-mono text-gray-500 bg-[#F5F9FA] px-2 py-0.5 rounded-full border border-[#EAF2F4]">
                    {item.formula}
                  </span>
                  {item.isSimulatedBenchmark && (
                    <span className="text-[9px] font-semibold text-emerald-800 bg-[#DAF4AA] px-2 py-0.5 rounded-full">
                      Simulated Benchmark
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

