"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import {
  Radar as RadarIcon,
  AlertTriangle,
  TrendingDown,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function MoneyLeakRadarPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="space-y-4 max-w-5xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <RadarIcon className="w-5 h-5 text-rose-600" />
              <span>Money Leak Radar</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Deterministic 5-part mathematical engine exposing hidden leaks in brand offers before you sign.
            </p>
          </div>
        </div>

        {/* Mandatory Label */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs text-slate-500 flex items-center justify-between">
          <span>Formula: Benchmark Gap + Usage Surcharge + Payment Delay Financing + Exclusivity Lockout + Brand Penalty</span>
          <span className="font-bold text-slate-700">Simulated benchmark data</span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
            Scanning brand offers for money leaks...
          </div>
        ) : deals.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center text-xs text-slate-500 space-y-3">
            <p>No active deals in radar. Ingest a brand email or DM to detect money leaks.</p>
            <Link
              href="/inbox"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#000305] text-white text-xs font-bold"
            >
              <span>Go to Deal Inbox</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deals.map((deal) => {
              const hasPerpetual = deal.usage_rights === "perpetual";
              const hasDelayedPayment = (deal.payment_terms_days || 30) > 45;
              const hasExclusivity = (deal.exclusivity_days || 0) > 30;

              return (
                <div
                  key={deal.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {deal.brand_name}
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        Offered: ₹{((deal.fee_paise || 0) / 100).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        hasPerpetual || hasDelayedPayment
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {hasPerpetual || hasDelayedPayment ? "High Leak Risk" : "Moderate Risk"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {hasPerpetual && (
                      <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center justify-between text-rose-900 font-semibold">
                        <span>Perpetual Ad Whitelisting</span>
                        <span className="font-mono text-rose-700">100% Surcharge</span>
                      </div>
                    )}
                    {hasDelayedPayment && (
                      <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between text-amber-900 font-semibold">
                        <span>Delayed Terms (Net-{deal.payment_terms_days}d)</span>
                        <span className="font-mono text-amber-700">18% Capital Cost</span>
                      </div>
                    )}
                    {hasExclusivity && (
                      <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-indigo-900 font-semibold">
                        <span>Category Exclusivity ({deal.exclusivity_days}d)</span>
                        <span className="font-mono text-indigo-700">Lockout Exposure</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/deals/${deal.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3C55F5] hover:underline"
                    >
                      <span>Open 5-Part Radar Breakdown</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
