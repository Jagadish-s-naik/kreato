"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, AlertCircle, Clock, ShieldCheck } from "lucide-react";
import { mockDeals } from "@/frontend/data/mockKreatoData";

export const DealPipelinePreview: React.FC = () => {
  return (
    <div className="bg-white rounded-4xl p-6 shadow-soft border border-white/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">
            Recent Deal Pipeline
          </h2>
          <span className="text-xs font-semibold text-gray-400">
            ({mockDeals.length})
          </span>
        </div>
        <Link
          href="/deals"
          className="text-xs font-bold text-gray-900 hover:text-indigo-600 flex items-center gap-1 transition-colors"
        >
          <span>Open Full Kanban</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockDeals.slice(0, 2).map((deal) => {
          const hasRisk = deal.riskyQuotes.length > 0;
          return (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="p-4 rounded-3xl bg-[#F5F9FA] border border-gray-100 hover:border-gray-200 transition-all hover:shadow-card block"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-900">{deal.brandName}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    deal.status === "incoming"
                      ? "bg-pastel-coral text-red-900"
                      : "bg-pastel-teal text-emerald-900"
                  }`}
                >
                  {deal.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-3">
                <span className="text-lg font-extrabold text-gray-900">
                  ₹{(deal.feePaise / 100).toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-gray-400">
                  Net-{deal.paymentTermsDays} days
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200/60 text-[11px] text-gray-500">
                <Clock className="w-3 h-3 text-gray-400" />
                <span>
                  {deal.deliverables.map((d) => `${d.quantity} ${d.format.replace("instagram_", "")}`).join(", ")}
                </span>
              </div>

              {hasRisk && (
                <div className="mt-2.5 px-2.5 py-1.5 bg-rose-50 text-rose-800 rounded-xl text-[10px] font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                  <span className="truncate">{deal.riskyQuotes[0]}</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

