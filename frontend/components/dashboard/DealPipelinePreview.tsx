"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock, AlertTriangle, ChevronDown, RefreshCw } from "lucide-react";

export const DealPipelinePreview: React.FC = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      try {
        setLoading(true);
        const res = await fetch("/api/deals");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setDeals(json.data);
          }
        }
      } catch (err) {
        console.error("Dashboard deals error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-[#EAF2F4] space-y-4">
      {/* Header with counter and full view action link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-extrabold text-gray-900 tracking-tight">
            Recent Deal Pipeline
          </h2>
          <span className="text-[11px] font-bold text-gray-400 bg-[#F5F9FA] px-2 py-0.5 rounded-full border border-[#EAF2F4]">
            ({deals.length})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/deals"
            className="text-xs font-bold text-gray-900 hover:text-indigo-600 flex items-center gap-1 transition-colors"
          >
            <span>Open Full Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2-Column Balanced Cards Layout */}
      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400">
          <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1 text-indigo-500" />
          Loading pipeline...
        </div>
      ) : deals.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
          No deals in pipeline. Ingest your first brand offer in Universal Inbox.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {deals.slice(0, 2).map((deal) => {
            const hasRisk = deal.usage_rights === "perpetual" || (deal.payment_terms_days || 30) > 45;
            return (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="p-4 rounded-2xl bg-[#F5F9FA] border border-[#EAF2F4] hover:border-gray-300 transition-all block group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {deal.brand_name}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Net-{deal.payment_terms_days || 30}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-base font-extrabold text-gray-900">
                    ₹{((deal.fee_paise || 0) / 100).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium capitalize">
                    {deal.status}
                  </span>
                </div>

                {hasRisk && (
                  <div className="inline-flex w-fit max-w-full items-center gap-1 px-2 py-0.5 rounded-md bg-[#F1B4B9]/40 text-[#702228] text-[10px] font-medium border border-[#F1B4B9]/60">
                    <AlertTriangle className="w-3 h-3 shrink-0 text-[#702228]" />
                    <span className="truncate">Perpetual terms detected</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
