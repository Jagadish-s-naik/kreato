"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, AlertTriangle, ChevronDown } from "lucide-react";
import { mockDeals } from "@/frontend/data/mockKreatoData";

export const DealPipelinePreview: React.FC = () => {
  const [timeframe, setTimeframe] = useState("This Month");

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-[#EAF2F4] space-y-4">
      {/* Header with counter and full view action link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-extrabold text-gray-900 tracking-tight">
            Recent Deal Pipeline
          </h2>
          <span className="text-[11px] font-bold text-gray-400 bg-[#F5F9FA] px-2 py-0.5 rounded-full border border-[#EAF2F4]">
            ({mockDeals.length})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-[#F5F9FA] rounded-full text-[11px] font-medium text-gray-700 border border-[#EAF2F4] cursor-pointer hover:bg-gray-100 transition-colors">
            <span>{timeframe}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
          <Link
            href="/deals"
            className="text-xs font-bold text-gray-900 hover:text-indigo-600 flex items-center gap-1 transition-colors"
          >
            <span>Open Full Kanban</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2-Column Balanced Cards Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {mockDeals.slice(0, 2).map((deal) => {
          const hasRisk = deal.riskyQuotes.length > 0;
          return (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="p-4 rounded-2xl bg-[#F5F9FA] border border-[#EAF2F4] hover:border-gray-300 transition-all block group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {deal.brandName}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    deal.status === "incoming"
                      ? "bg-[#F1B4B9]/30 text-[#702228] border border-[#F1B4B9]/50"
                      : "bg-[#96D7CF]/30 text-[#0E4A42] border border-[#96D7CF]/50"
                  }`}
                >
                  {deal.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-2">
                <span className="text-base sm:text-lg font-extrabold text-gray-900">
                  ₹{(deal.feePaise / 100).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  Net-{deal.paymentTermsDays} days
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#EAF2F4] text-[10px] text-gray-500">
                <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="truncate">
                  {deal.deliverables
                    .map((d) => `${d.quantity} ${d.format.replace("instagram_", "")}`)
                    .join(", ")}
                </span>
              </div>

              {/* FIXED: Content-sized warning chip */}
              {hasRisk && (
                <div className="mt-2.5">
                  <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 bg-[#F1B4B9]/20 text-[#702228] border border-[#F1B4B9]/40 rounded-lg text-[9px] font-semibold">
                    <AlertTriangle className="w-2.5 h-2.5 text-[#702228] shrink-0" />
                    <span>Perpetual terms detected</span>
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
