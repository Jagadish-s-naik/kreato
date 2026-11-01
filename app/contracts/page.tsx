"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import {
  FileCheck2,
  Calendar,
  Copy,
  ExternalLink,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function DealMemosPage() {
  const [dealsWithMemos, setDealsWithMemos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMemos() {
      try {
        setLoading(true);
        const res = await fetch("/api/deals");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            // filter deals that have memos or are in agreed/invoiced/paid status
            setDealsWithMemos(json.data.filter((d: any) => d.memos && d.memos.length > 0));
          }
        }
      } catch (err) {
        console.error("Memos fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMemos();
  }, []);

  return (
    <AppShell showFeed={false}>
      <div className="space-y-4 max-w-5xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-indigo-600" />
              <span>Deal Memos & Agreement Verification</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Token-gated, lightweight commercial agreements with authorized brand sign-off tracking.
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3 text-xs text-amber-900">
          Summary of terms agreed in chat. Not a legal contract.
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
            Loading deal memos...
          </div>
        ) : dealsWithMemos.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center text-xs text-slate-500 space-y-3">
            <p>No Deal Memos generated yet.</p>
            <Link
              href="/deals"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#000305] text-white text-xs font-bold"
            >
              <span>View Deal Pipeline</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dealsWithMemos.map((deal) => {
              const memo = deal.memos?.[0];
              const isAccepted = Boolean(memo?.accepted_at);
              return (
                <div
                  key={deal.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {deal.brand_name} Memo
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Deal ID: {deal.id.slice(0, 8)}
                      </span>
                    </div>
                    {isAccepted ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Signed by Brand</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                        <Clock className="w-3 h-3 text-[#3C55F5]" />
                        <span>Pending Sign-off</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Agreed Commercials
                      </span>
                      <span className="font-bold text-slate-900">
                        ₹{((deal.fee_paise || 0) / 100).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Payment Term
                      </span>
                      <span className="font-bold text-slate-900">
                        Net-{deal.payment_terms_days || 30}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <Link
                      href={`/deals/${deal.id}`}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Open Deal Workspace →
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
