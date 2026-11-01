"use client";

import React, { useState } from "react";
import { ArrowUpRight, ChevronDown, RotateCw } from "lucide-react";
import { mockLeadSummaries } from "@/frontend/data/mockDashboardData";
import { PastelVariant } from "@/frontend/types/dashboard";

const variantStyles: Record<
  PastelVariant,
  { bg: string; text: string; badgeBg: string }
> = {
  lime: {
    bg: "bg-[#D8EEB6]",
    text: "text-[#3D5B1A]",
    badgeBg: "bg-[#C4E496]",
  },
  teal: {
    bg: "bg-[#A7E4DB]",
    text: "text-[#10564E]",
    badgeBg: "bg-[#91D8CD]",
  },
  coral: {
    bg: "bg-[#F7B7B7]",
    text: "text-[#762626]",
    badgeBg: "bg-[#EFA3A3]",
  },
};

export const SummaryCards: React.FC = () => {
  const [timeframe, setTimeframe] = useState("This Month");

  return (
    <div className="bg-white rounded-4xl p-6 shadow-soft border border-white/60">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          My Summary
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-700 cursor-pointer transition-colors border border-gray-100">
            <span>{timeframe}</span>
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

      {/* 3 Pastel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockLeadSummaries.map((card) => {
          const style = variantStyles[card.variant];
          return (
            <div
              key={card.id}
              className={`${style.bg} rounded-3xl p-5 relative flex flex-col justify-between min-h-[120px] transition-transform hover:-translate-y-0.5 duration-200 cursor-pointer shadow-sm`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <span className={`text-xs font-bold ${style.text} max-w-[130px] leading-snug`}>
                  {card.title}
                </span>
                <div className="p-1 rounded-full bg-white/30 backdrop-blur-xs text-gray-800">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex items-end justify-between mt-6">
                <div>
                  <p className={`text-[10px] ${style.text} opacity-75`}>Update:</p>
                  <p className={`text-[11px] font-medium ${style.text}`}>
                    {card.updatedAt}
                  </p>
                </div>
                <div
                  className={`w-9 h-9 rounded-full ${style.badgeBg} flex items-center justify-center font-bold text-xs ${style.text} shadow-xs`}
                >
                  {card.count}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

