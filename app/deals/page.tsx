"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import Link from "next/link";
import { Plus, Clock, AlertTriangle, RefreshCw } from "lucide-react";

type DealStage = "new" | "negotiating" | "agreed" | "invoiced" | "paid";

const STAGES: { id: DealStage; label: string }[] = [
  { id: "new", label: "Incoming Inquiries" },
  { id: "negotiating", label: "Under Negotiation" },
  { id: "agreed", label: "Agreed / Memos" },
  { id: "invoiced", label: "Invoiced" },
  { id: "paid", label: "Settled / Paid" },
];

export default function DealPipelinePage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DealStage>("new");

  useEffect(() => {
    async function loadDeals() {
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
        console.error("Deals load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

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

        {/* Mobile Tabbed Stage Selector */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1">
          {STAGES.map((col) => {
            const count = deals.filter((d) => d.status === col.id).length;
            const isActive = activeTab === col.id;
            return (
              <button
                key={col.id}
                onClick={() => setActiveTab(col.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  isActive
                    ? "bg-[#000305] text-white shadow-soft"
                    : "bg-white text-gray-600 hover:text-gray-900 border border-[#EAF2F4]"
                }`}
              >
                {col.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Desktop Kanban / Multi-Column View */}
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
            Loading deal pipeline...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {STAGES.map((col) => {
              const stageDeals = deals.filter((d) => d.status === col.id);
              return (
                <div
                  key={col.id}
                  className={`flex flex-col bg-white rounded-3xl p-3 border border-[#EAF2F4] min-h-[300px] ${
                    activeTab !== col.id ? "hidden md:flex" : "flex"
                  }`}
                >
                  <div className="flex items-center justify-between px-2 py-1.5 mb-2 border-b border-gray-100">
                    <span className="text-xs font-extrabold text-gray-800">
                      {col.label}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {stageDeals.length === 0 ? (
                      <div className="text-center py-8 text-[11px] text-gray-400">
                        No deals in this stage
                      </div>
                    ) : (
                      stageDeals.map((deal) => (
                        <Link
                          key={deal.id}
                          href={`/deals/${deal.id}`}
                          className="block p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 shadow-xs transition-all hover:scale-[1.01]"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-xs text-slate-900 truncate">
                              {deal.brand_name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Net-{deal.payment_terms_days || 30}
                            </span>
                          </div>
                          <div className="text-sm font-black text-slate-900">
                            ₹{((deal.fee_paise || 0) / 100).toLocaleString("en-IN")}
                          </div>
                          {deal.usage_rights === "perpetual" && (
                            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>Perpetual terms</span>
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
        )}
      </div>
    </AppShell>
  );
}
