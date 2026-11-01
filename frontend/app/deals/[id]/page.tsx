"use client";

import React, { useState } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { mockDeals, mockBrandLedgers } from "@/frontend/data/mockKreatoData";
import { computeMoneyLeakRadar } from "@/frontend/lib/radarEngine";
import { computeWalkAwayLadder } from "@/frontend/lib/ladderEngine";
import {
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Copy,
  MessageCircle,
  Mail,
  FileCheck,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const deal = mockDeals.find((d) => d.id === params.id) || mockDeals[0];
  const ledger = mockBrandLedgers[deal.brandKey];

  const [feePaise, setFeePaise] = useState(deal.feePaise);
  const [paymentTermsDays, setPaymentTermsDays] = useState(deal.paymentTermsDays);
  const [usageRights, setUsageRights] = useState(deal.usageRights);
  const [selectedLanguage, setSelectedLanguage] = useState<"English" | "Hinglish">("English");
  const [activeTier, setActiveTier] = useState<"Ideal" | "Acceptable" | "Walk-away">("Ideal");
  const [isCounterCopied, setIsCounterCopied] = useState(false);

  // Compute Radar
  const radar = computeMoneyLeakRadar({
    niche: deal.category,
    followerBand: "50k-100k",
    deliverables: deal.deliverables,
    offeredFeePaise: feePaise,
    usageRights: usageRights,
    paymentTermsDays: paymentTermsDays,
    exclusivityDays: deal.exclusivityDays,
    avgBrandDaysLate: ledger?.avgDaysLate || 0,
  });

  // Compute Ladder
  const ladder = computeWalkAwayLadder({
    fairFeePaise: radar.fairFeePaise,
    offeredFeePaise: feePaise,
  });

  const selectedTier =
    activeTier === "Ideal"
      ? ladder.ideal
      : activeTier === "Acceptable"
      ? ladder.acceptable
      : ladder.walkAway;

  const englishCounterDraft = `Hi ${deal.brandName} team, thank you for reaching out! Based on our standard rate card and the deliverables requested (1 Reel & 2 Stories), our commercial quote is ₹${(
    selectedTier.feePaise / 100
  ).toLocaleString("en-IN")} with net-${selectedTier.paymentTermsDays} payment terms. This includes organic social distribution. Let me know if this works so we can reserve your production slot!`;

  const hinglishCounterDraft = `Hi ${deal.brandName} team, collab ke liye reach out karne ke liye thanks! Requested deliverables (1 Reel & 2 Stories) ke liye hamara standard commercial quote ₹${(
    selectedTier.feePaise / 100
  ).toLocaleString("en-IN")} hai with net-${selectedTier.paymentTermsDays} payment terms. Isme organic posting included hai. Agar yeh align karta hai toh bataiye, hum production slot block kar denge!`;

  const currentDraft =
    selectedLanguage === "English" ? englishCounterDraft : hinglishCounterDraft;

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(currentDraft);
    setIsCounterCopied(true);
    setTimeout(() => setIsCounterCopied(false), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {deal.brandName} Offer Analysis
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold capitalize bg-pastel-coral text-red-900">
                {deal.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Deterministic Money Leak Radar & 3-Tier Walk-Away Ladder Engine
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/contracts"
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-full border border-gray-200 shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deal Memo</span>
            </Link>
          </div>
        </div>

        {/* Exclusivity Conflict Alert */}
        {deal.exclusivityDays > 0 && (
          <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                Exclusivity Collision Guard Warning
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Brand demands {deal.exclusivityDays} days category exclusivity. This locks you out of any other {deal.category} sponsorships until mid-January 2027.
              </p>
            </div>
          </div>
        )}

        {/* 2-Column Grid: Deal Terms & Money Leak Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Editable Deal Terms & Brand Ledger */}
          <div className="space-y-6">
            <div className="bg-white rounded-4xl p-6 shadow-soft border border-white/60 space-y-5">
              <h2 className="text-sm font-bold text-gray-900">
                Extracted Commercial Terms (Editable)
              </h2>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-gray-500 font-medium block mb-1">
                    Offered Creator Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={feePaise / 100}
                    onChange={(e) => setFeePaise(Number(e.target.value) * 100)}
                    className="w-full p-3 rounded-2xl bg-[#F5F9FA] border border-gray-200 font-bold text-gray-900 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-500 font-medium block mb-1">
                      Payment Terms
                    </label>
                    <select
                      value={paymentTermsDays}
                      onChange={(e) => setPaymentTermsDays(Number(e.target.value))}
                      className="w-full p-3 rounded-2xl bg-[#F5F9FA] border border-gray-200 font-bold text-gray-900 outline-none"
                    >
                      <option value={15}>Net-15 Days</option>
                      <option value={30}>Net-30 Days</option>
                      <option value={45}>Net-45 Days</option>
                      <option value={60}>Net-60 Days</option>
                      <option value={90}>Net-90 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-500 font-medium block mb-1">
                      Usage Rights
                    </label>
                    <select
                      value={usageRights}
                      onChange={(e) => setUsageRights(e.target.value as any)}
                      className="w-full p-3 rounded-2xl bg-[#F5F9FA] border border-gray-200 font-bold text-gray-900 outline-none"
                    >
                      <option value="none">Organic Social Only</option>
                      <option value="paid_ads_3m">Paid Ads (3 Months)</option>
                      <option value="paid_ads_6m">Paid Ads (6 Months)</option>
                      <option value="perpetual">Perpetual Digital Rights</option>
                    </select>
                  </div>
                </div>

                {/* Risky Quotes Extracted */}
                {deal.riskyQuotes.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-gray-700 block mb-2">
                      Flagged DM Traps in Brand Message:
                    </span>
                    <div className="space-y-1.5">
                      {deal.riskyQuotes.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-2xl bg-rose-50 text-rose-800 text-[11px] font-medium border border-rose-100"
                        >
                          "{q}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Brand Ledger Card */}
            {ledger && (
              <div className="bg-white rounded-4xl p-6 shadow-soft border border-white/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Personal Brand Ledger: {ledger.brandName}
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center mb-4">
                  <div className="p-3 bg-[#F5F9FA] rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-medium">Deals</p>
                    <p className="text-sm font-bold text-gray-900">{ledger.totalDeals}</p>
                  </div>
                  <div className="p-3 bg-[#F5F9FA] rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-medium">Earned</p>
                    <p className="text-sm font-bold text-gray-900">
                      ₹{(ledger.totalEarnedPaise / 100).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-2xl">
                    <p className="text-[10px] text-rose-500 font-medium">Avg Late</p>
                    <p className="text-sm font-bold text-rose-700">+{ledger.avgDaysLate} Days</p>
                  </div>
                </div>
                <div className="text-[11px] text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-800">Past Concessions:</p>
                  {ledger.pastConcessions.map((c, i) => (
                    <li key={i} className="list-disc ml-4 text-gray-500">
                      {c}
                    </li>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Money Leak Radar & Animated Counter */}
          <div className="space-y-6">
            <div className="bg-[#F7B7B7]/30 border border-[#F1B4B9] rounded-4xl p-6 shadow-soft">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1B4B9]/50">
                <div>
                  <span className="text-xs font-bold text-[#702228] uppercase tracking-wider">
                    Money Leak Radar
                  </span>
                  <div className="text-3xl font-extrabold text-[#702228] mt-1">
                    ₹{(radar.totalAtRiskPaise / 100).toLocaleString("en-IN")}{" "}
                    <span className="text-sm font-semibold text-[#702228]/80">at risk</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#F8B6B6] flex items-center justify-center text-[#702228] shadow-card">
                  <TrendingDown className="w-6 h-6" />
                </div>
              </div>

              {/* Radar 5-part Breakdown */}
              <div className="divide-y divide-[#F1B4B9]/40 mt-3 text-xs">
                {radar.breakdown.map((item) => (
                  <div key={item.key} className="py-3">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span className="text-xs">{item.label}</span>
                      <span className="text-rose-700">
                        +₹{(item.amountPaise / 100).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                      {item.reason}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-mono text-gray-500 bg-white/70 px-2 py-0.5 rounded-full">
                        {item.formula}
                      </span>
                      {item.isSimulatedBenchmark && (
                        <span className="text-[9px] font-semibold text-emerald-800 bg-pastel-lime px-2 py-0.5 rounded-full">
                          Based on simulated benchmark data
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Walk-Away Ladder & Counter Drafter */}
            <div className="bg-white rounded-4xl p-6 shadow-soft border border-white/60 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">
                  Walk-Away Ladder & Counter Offer
                </h3>
                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-[#F5F9FA] p-1 rounded-full border border-gray-200">
                  <button
                    onClick={() => setSelectedLanguage("English")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all ${
                      selectedLanguage === "English"
                        ? "bg-[#000305] text-white shadow-xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setSelectedLanguage("Hinglish")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all ${
                      selectedLanguage === "Hinglish"
                        ? "bg-[#000305] text-white shadow-xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Hinglish
                  </button>
                </div>
              </div>

              {/* 3 Tier Selector Cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {(["Ideal", "Acceptable", "Walk-away"] as const).map((tierName) => {
                  const t =
                    tierName === "Ideal"
                      ? ladder.ideal
                      : tierName === "Acceptable"
                      ? ladder.acceptable
                      : ladder.walkAway;
                  const isSelected = activeTier === tierName;
                  return (
                    <button
                      key={tierName}
                      onClick={() => setActiveTier(tierName)}
                      className={`p-3 rounded-2xl text-left transition-all border ${
                        isSelected
                          ? "bg-[#000305] text-white border-[#000305] shadow-card"
                          : "bg-[#F5F9FA] text-gray-700 border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                        {tierName}
                      </span>
                      <p className="text-xs font-bold mt-1">
                        ₹{(t.feePaise / 100).toLocaleString("en-IN")}
                      </p>
                      <span className="text-[9px] block opacity-80 mt-0.5">
                        Net-{t.paymentTermsDays}d
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Generated Negotiation Message Preview */}
              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={currentDraft}
                  readOnly
                  className="w-full text-xs p-3.5 rounded-2xl bg-[#F5F9FA] border border-gray-200 text-gray-800 outline-none resize-none leading-relaxed"
                />

                {/* Action Buttons: WhatsApp / Mail / Copy */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyDraft}
                    className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors"
                  >
                    {isCounterCopied ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{isCounterCopied ? "Copied!" : "Copy Text"}</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(currentDraft)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Open in WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${deal.brandDomain ? `collab@${deal.brandDomain}` : ""}?subject=Commercial Proposal for ${encodeURIComponent(deal.brandName)}&body=${encodeURIComponent(currentDraft)}`}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open in Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

