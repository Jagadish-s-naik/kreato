"use client";

import React, { useState } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { mockDeals } from "@/frontend/data/mockKreatoData";
import { DealStatus } from "@/frontend/types/kreato";
import Link from "next/link";
import { Plus, Clock, AlertTriangle, ArrowRight, Kanban } from "lucide-react";

const COLUMNS: { id: DealStatus; label: string; count: number }[] = [
  { id: "incoming", label: "Incoming Inquiries", count: 1 },
  { id: "analyzing", label: "Under Analysis", count: 1 },
  { id: "countered", label: "Counter Offered", count: 1 },
  { id: "agreed", label: "Agreed / Memos", count: 1 },
];

export default function DealPipelinePage() {
  const [deals, setDeals] = useState(mockDeals);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Deal Pipeline
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Active sponsorships categorized by negotiation stage and legal status.
            </p>
          </div>
          <Link
            href="/inbox"
            className="px-4 py-2 bg-[#000305] text-white text-xs font-bold rounded-full shadow-soft flex items-center gap-1.5 hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4 text-pastel-lime" />
            <span>Ingest New Offer</span>
          </Link>
        </div>

        {/* Kanban Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((col) => {
            const columnDeals = deals.filter((d) => d.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-white/80 rounded-3xl p-4 shadow-card border border-gray-100 flex flex-col min-h-[480px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-900">{col.label}</span>
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold flex items-center justify-center">
                    {columnDeals.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1">
                  {columnDeals.map((deal) => (
                    <Link
                      key={deal.id}
                      href={`/deals/${deal.id}`}
                      className="p-4 rounded-2xl bg-[#F5F9FA] border border-gray-200/60 hover:border-gray-300 transition-all hover:shadow-card block group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {deal.brandName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {deal.category.split(" ")[0]}
                        </span>
                      </div>

                      <div className="text-base font-extrabold text-gray-900 my-1">
                        ₹{(deal.feePaise / 100).toLocaleString("en-IN")}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>Due {deal.deadline}</span>
                      </div>

                      {deal.riskyQuotes.length > 0 && (
                        <div className="mt-2.5 px-2 py-1 bg-rose-50 text-rose-800 rounded-xl text-[10px] font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                          <span className="truncate">Perpetual terms detected</span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
