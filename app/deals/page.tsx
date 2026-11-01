"use client";

import React, { useState } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { mockDeals } from "@/frontend/data/mockKreatoData";
import { DealStatus } from "@/frontend/types/kreato";
import Link from "next/link";
import { Plus, Clock, AlertTriangle } from "lucide-react";

const COLUMNS: { id: DealStatus; label: string }[] = [
  { id: "incoming", label: "Incoming Inquiries" },
  { id: "analyzing", label: "Under Analysis" },
  { id: "countered", label: "Counter Offered" },
  { id: "agreed", label: "Agreed / Memos" },
];

export default function DealPipelinePage() {
  const [deals, setDeals] = useState(mockDeals);
  const [activeTab, setActiveTab] = useState<DealStatus>("incoming");

  return (
    <AppShell showFeed={false}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Deal Pipeline
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Active sponsorships categorized by negotiation stage and legal status.
            </p>
          </div>
          <Link
            href="/inbox"
            className="self-start sm:self-auto px-4 py-2 bg-[#000305] text-white text-xs font-bold rounded-full shadow-soft flex items-center gap-1.5 hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-pastel-lime" />
            <span>Ingest Offer</span>
          </Link>
        </div>

        {/* Mobile Tabbed Stage Selector (< md) */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1">
          {COLUMNS.map((col) => {
            const count = deals.filter((d) => d.status === col.id).length;
            const isActive = activeTab === col.id;
            return (
              <button
                key={col.id}
                onClick={() => setActiveTab(col.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#000305] text-white"
                    : "bg-[#F5F9FA] text-gray-600 border border-[#EAF2F4]"
                }`}
              >
                <span>{col.label}</span>
                <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop Kanban Board */}
        <div className="hidden md:grid md:grid-cols-4 gap-3.5 items-start">
          {COLUMNS.map((col) => {
            const columnDeals = deals.filter((d) => d.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-[#F5F9FA] rounded-3xl p-3.5 border border-[#EAF2F4] flex flex-col min-h-[340px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#EAF2F4]">
                  <span className="text-xs font-bold text-gray-800 truncate">
                    {col.label}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-white text-gray-600 text-[10px] font-bold flex items-center justify-center border border-[#EAF2F4] shrink-0">
                    {columnDeals.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-2.5 flex-1">
                  {columnDeals.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-center p-3 text-gray-400">
                      <p className="text-[11px]">No deals in this stage</p>
                    </div>
                  ) : (
                    columnDeals.map((deal) => (
                      <Link
                        key={deal.id}
                        href={`/deals/${deal.id}`}
                        className="p-3.5 rounded-2xl bg-white border border-[#EAF2F4] hover:border-gray-300 transition-all block group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                            {deal.brandName}
                          </span>
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {deal.category.split(" ")[0]}
                          </span>
                        </div>

                        <div className="text-sm font-extrabold text-gray-900 my-1">
                          ₹{(deal.feePaise / 100).toLocaleString("en-IN")}
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-2">
                          <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>Due {deal.deadline}</span>
                        </div>

                        {/* FIXED: Content-sized warning chip instead of stretched banner */}
                        {deal.riskyQuotes.length > 0 && (
                          <div className="mt-2.5">
                            <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 bg-[#F1B4B9]/20 text-[#702228] border border-[#F1B4B9]/40 rounded-lg text-[9px] font-semibold">
                              <AlertTriangle className="w-2.5 h-2.5 text-[#702228] shrink-0" />
                              <span>Perpetual terms detected</span>
                            </span>
                          </div>
                        )}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Tabbed View Content (< md) */}
        <div className="md:hidden space-y-2.5">
          {deals
            .filter((d) => d.status === activeTab)
            .map((deal) => (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="p-4 rounded-3xl bg-white border border-[#EAF2F4] block"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-gray-900">
                    {deal.brandName}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-coral text-red-900 capitalize">
                    {deal.status}
                  </span>
                </div>
                <div className="text-base font-extrabold text-gray-900 my-1">
                  ₹{(deal.feePaise / 100).toLocaleString("en-IN")}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Due {deal.deadline} • Net-{deal.paymentTermsDays}d</span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </AppShell>
  );
}
