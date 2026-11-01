"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { BookOpen, Search, ShieldCheck, AlertTriangle, Clock, RefreshCw } from "lucide-react";

export default function BrandLedgerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLedger() {
      try {
        setLoading(true);
        const res = await fetch("/api/brand-ledger");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setLedgers(json.data);
          }
        }
      } catch (err) {
        console.error("Ledger fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLedger();
  }, []);

  const filtered = ledgers.filter((b) =>
    (b.brand_name || "").toLowerCase().includes(searchTerm.toLowerCase())
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
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
            Loading Brand Ledger...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center text-xs text-slate-500">
            No brand history found yet. Ingest your first brand deal to begin building your Personal Brand Ledger.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((brand) => (
              <div
                key={brand.brand_slug || brand.brand_name}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {brand.brand_name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {brand.total_deals || 1} deal(s) completed
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      (brand.avg_days_late || 0) > 15
                        ? "bg-rose-50 text-rose-800 border border-rose-200"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {(brand.avg_days_late || 0) > 15 ? "Late Payer Risk" : "Prompt Settlement"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Avg. Payment Speed
                    </span>
                    <span className="font-bold text-slate-900">
                      Net-{brand.typical_payment_terms || 30} (+{brand.avg_days_late || 0}d delay)
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Total Commercial Value
                    </span>
                    <span className="font-bold text-slate-900">
                      ₹{((brand.total_paid_paise || 0) / 100).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {brand.past_concessions && (
                  <p className="text-[11px] text-slate-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                    <strong>Past Concessions:</strong> {brand.past_concessions}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
