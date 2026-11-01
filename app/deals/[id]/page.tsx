"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { computeRadar } from "@/lib/radar";
import { computeLadder } from "@/lib/ladder";
import { buildGoogleCalendarLink } from "@/lib/calendar/ics";
import {
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Copy,
  MessageCircle,
  Mail,
  FileCheck2,
  Calendar,
  Download,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<"en" | "hinglish">("en");
  const [activeTier, setActiveTier] = useState<"ideal" | "acceptable" | "walkaway">("ideal");

  const [counterDraft, setCounterDraft] = useState<any>(null);
  const [draftingCounter, setDraftingCounter] = useState(false);

  // Memo creation state
  const [memoUrl, setMemoUrl] = useState<string | null>(null);
  const [creatingMemo, setCreatingMemo] = useState(false);

  // Invoicing creation state
  const [invoiceCreated, setInvoiceCreated] = useState<any>(null);
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  useEffect(() => {
    async function loadDeal() {
      try {
        setLoading(true);
        const res = await fetch(`/api/deals/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setDeal(json.data);
          }
        }
      } catch (err) {
        console.error("Deal load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDeal();
  }, [id]);

  if (loading) {
    return (
      <AppShell showFeed={false}>
        <div className="p-20 text-center text-xs text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
          Loading Deal Workspace...
        </div>
      </AppShell>
    );
  }

  if (!deal) {
    return (
      <AppShell showFeed={false}>
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center text-xs text-slate-500">
          Deal not found. Return to <Link href="/deals" className="text-indigo-600 font-bold">Deal Pipeline</Link>.
        </div>
      </AppShell>
    );
  }

  // Pure Calculation Engines
  const deliverables = (deal.deliverables as any[]) || [{ format: "reel", quantity: 1 }];
  const feePaise = deal.fee_paise || 2500000;
  const paymentDays = deal.payment_terms_days || 60;
  const usageRightsType = deal.usage_rights || "perpetual";
  const exclusivityDays = deal.exclusivity_days || 60;

  const radar = computeRadar({
    deliverables: deliverables.map((d: any) => ({
      format: d.format || d.type || "reel",
      quantity: d.quantity || d.count || 1,
    })),
    benchmarkMedians: { reel: 5000000, story: 1250000, post: 3000000, youtube_video: 8000000 },
    offeredFeePaise: feePaise,
    usageRights: { type: usageRightsType },
    paymentDays: paymentDays,
    exclusivityDays: exclusivityDays,
    avgDaysLate: 38,
  });

  const ladder = computeLadder(radar);

  const selectedTier =
    activeTier === "ideal"
      ? ladder.ideal
      : activeTier === "acceptable"
      ? ladder.acceptable
      : ladder.walkaway;

  // Calendar Link
  const gcalLink = buildGoogleCalendarLink({
    title: `${deal.brand_name} Sponsorship Deliverable Due`,
    startDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    endDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
    details: `Deliverables: ${deliverables.map((d: any) => `${d.quantity || d.count || 1}x ${d.format || d.type}`).join(", ")}. Fee: ₹${(feePaise / 100).toLocaleString("en-IN")}`,
  });

  const handleDraftCounter = async () => {
    setDraftingCounter(true);
    try {
      const res = await fetch("/api/ladder/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_id: deal.id,
          tier: activeTier,
          language: language,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setCounterDraft(json.data);
      } else {
        alert(json.error?.message || "Failed to generate counter-offer draft.");
      }
    } catch (err) {
      alert("Error generating counter draft.");
    } finally {
      setDraftingCounter(false);
    }
  };

  const handleGenerateMemo = async () => {
    setCreatingMemo(true);
    try {
      const res = await fetch("/api/memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_id: deal.id,
          expires_in_days: 7,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMemoUrl(json.data.acceptUrl);
      } else {
        alert(json.error?.message || "Failed to generate memo link.");
      }
    } catch (err) {
      alert("Error generating memo.");
    } finally {
      setCreatingMemo(false);
    }
  };

  const handleGenerateInvoice = async () => {
    setCreatingInvoice(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal_id: deal.id }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setInvoiceCreated(json.data);
        alert(`Invoice #${json.data.invoice_number} created successfully!`);
      } else {
        alert(json.error?.message || "Failed to create invoice.");
      }
    } catch (err) {
      alert("Error creating invoice.");
    } finally {
      setCreatingInvoice(false);
    }
  };

  return (
    <AppShell showFeed={false}>
      <div className="space-y-6 max-w-5xl mx-auto pb-16">
        {/* Top Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {deal.brand_name}
              </h1>
              <span className="capitalize px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {deal.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Deliverables: {deliverables.map((d: any) => `${d.quantity || d.count || 1}x ${d.format || d.type}`).join(", ")}
            </p>
          </div>

          {/* Hero Metric: ₹ at risk */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 md:text-right min-w-[200px]">
            <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider block">
              TOTAL INCOME AT RISK
            </span>
            <div className="text-3xl sm:text-4xl font-black text-red-600 tracking-tight mt-0.5">
              ₹{(radar.totalAtRiskPaise / 100).toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-rose-700 block mt-0.5">
              Offered: ₹{(feePaise / 100).toLocaleString("en-IN")} • Fair: ₹{(radar.fairFeePaise / 100).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Section 1: Money Leak Radar 5-Part Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Money Leak Radar (5-Part Breakdown)</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              Simulated benchmark data
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                1. Benchmark Rate Gap
              </span>
              <span className="text-base font-black text-rose-600">
                +₹{(radar.benchmarkGapPaise / 100).toLocaleString("en-IN")}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Market fair median for this tier is ₹{(radar.fairFeePaise / 100).toLocaleString("en-IN")}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                2. Usage Rights Surcharge
              </span>
              <span className="text-base font-black text-rose-600">
                +₹{(radar.usageSurchargePaise / 100).toLocaleString("en-IN")}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                {usageRightsType === "perpetual" ? "Perpetual whitelisting requested at zero license surcharge." : "Organic license scope."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                3. Payment Delay Financing
              </span>
              <span className="text-base font-black text-rose-600">
                +₹{(radar.totalDelayCostPaise / 100).toLocaleString("en-IN")}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Net-{paymentDays} credit term financed at 18% annual capital benchmark.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                4. Exclusivity Lockout
              </span>
              <span className="text-base font-black text-rose-600">
                +₹{(radar.exclusivityCostPaise / 100).toLocaleString("en-IN")}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                {exclusivityDays} days category restriction blocking competitor campaigns.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                5. Brand History Penalty
              </span>
              <span className="text-base font-black text-rose-600">
                +₹{(radar.historyPenaltyPaise / 100).toLocaleString("en-IN")}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Brand averages 38 days late on previous creator settlements.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Walk-Away Ladder & Counter Generator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Walk-Away Negotiation Ladder
              </h2>
              <p className="text-xs text-slate-500">
                Select your counter target tier and generate a mathematically guarded response.
              </p>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-full text-xs font-bold">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded-full transition-all ${
                  language === "en" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("hinglish")}
                className={`px-3 py-1 rounded-full transition-all ${
                  language === "hinglish" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                }`}
              >
                Hinglish
              </button>
            </div>
          </div>

          {/* 3 Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setActiveTier("ideal")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeTier === "ideal"
                  ? "bg-indigo-50/50 border-[#3C55F5] ring-2 ring-[#3C55F5]/20"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                Tier 1: Ideal Anchor
              </span>
              <span className="text-xl font-black text-slate-900">
                ₹{(ladder.ideal.feePaise / 100).toLocaleString("en-IN")}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Full benchmark + paid licensing rights.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTier("acceptable")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeTier === "acceptable"
                  ? "bg-indigo-50/50 border-[#3C55F5] ring-2 ring-[#3C55F5]/20"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                Tier 2: Acceptable Target
              </span>
              <span className="text-xl font-black text-slate-900">
                ₹{(ladder.acceptable.feePaise / 100).toLocaleString("en-IN")}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Standard deliverable scope on Net-30.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTier("walkaway")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeTier === "walkaway"
                  ? "bg-indigo-50/50 border-[#3C55F5] ring-2 ring-[#3C55F5]/20"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                Tier 3: Walk-Away Floor
              </span>
              <span className="text-xl font-black text-slate-900">
                ₹{(ladder.walkaway.feePaise / 100).toLocaleString("en-IN")}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Absolute minimum floor. Below this, decline.
              </p>
            </button>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDraftCounter}
              disabled={draftingCounter}
              className="px-5 py-2.5 rounded-full bg-[#3C55F5] hover:bg-[#2D44E0] text-white font-bold text-xs shadow-soft flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {draftingCounter ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Drafting counter-offer...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Counter Draft ({activeTier.toUpperCase()})</span>
                </>
              )}
            </button>
          </div>

          {/* Rendered Counter Draft */}
          {counterDraft && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{counterDraft.subject || "Collaboration Counter-Offer"}</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                  Ready for Creator Approval
                </span>
              </div>
              <textarea
                readOnly
                rows={5}
                value={counterDraft.body}
                className="w-full text-xs p-3 bg-white rounded-xl border border-slate-200 text-slate-800 focus:outline-none"
              />
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(counterDraft.body);
                    alert("Draft copied to clipboard!");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </button>
                {counterDraft.whatsapp_text && (
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(counterDraft.whatsapp_text)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Open WhatsApp</span>
                  </a>
                )}
                <a
                  href={`mailto:?subject=${encodeURIComponent(counterDraft.subject || "Collaboration Proposal")}&body=${encodeURIComponent(counterDraft.body)}`}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open in Email</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Calendar & Deal Follow-Through (Feature 12) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Calendar Follow-Through (Feature 12)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sync campaign submission deadlines to your personal calendar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/api/calendar/${deal.id}/ics`}
              download
              className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .ics</span>
            </a>
            <a
              href={gcalLink}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Add to Google Calendar</span>
            </a>
          </div>
        </div>

        {/* Section 4 & 5: Deal Memo & Invoicing Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Deal Memo Generator */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Deal Memo Sign-Off</span>
            </h3>
            <p className="text-xs text-slate-500">
              Generate a brand-facing link for authorized sign-off. "Summary of terms agreed in chat. Not a legal contract."
            </p>
            {memoUrl ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono break-all text-indigo-600">
                {memoUrl}
              </div>
            ) : (
              <button
                onClick={handleGenerateMemo}
                disabled={creatingMemo}
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                {creatingMemo ? "Generating..." : "Generate Deal Memo Link"}
              </button>
            )}
          </div>

          {/* GST Invoicing */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>GST Tax Invoicing</span>
            </h3>
            <p className="text-xs text-slate-500">
              Auto-generate SAC 998365 sequential tax invoice with UPI QR collection.
            </p>
            {invoiceCreated ? (
              <div className="text-xs text-emerald-700 font-bold">
                Invoice #{invoiceCreated.invoice_number} created! View in Invoices.
              </div>
            ) : (
              <button
                onClick={handleGenerateInvoice}
                disabled={creatingInvoice}
                className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                {creatingInvoice ? "Creating..." : "Generate GST Invoice"}
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
