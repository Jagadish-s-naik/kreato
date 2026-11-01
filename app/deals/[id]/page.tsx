"use client";

import React, { useState } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { mockDeals, mockBrandLedgers } from "@/frontend/data/mockKreatoData";
import { computeMoneyLeakRadar } from "@/frontend/lib/radarEngine";
import { computeWalkAwayLadder } from "@/frontend/lib/ladderEngine";
import {
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Copy,
  MessageCircle,
  Mail,
  FileCheck,
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
    <AppShell showFeed={false}>
      <div className="space-y-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                {deal.brandName} Offer Analysis
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize bg-[#F1B4B9]/30 text-[#702228] border border-[#F1B4B9]/50">
                {deal.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Deterministic Money Leak Radar & 3-Tier Walk-Away Ladder Engine
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/contracts"
              className="px-3.5 py-1.5 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-full border border-[#EAF2F4] shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deal Memo</span>
            </Link>
          </div>
        </div>

        {/* Exclusivity Conflict Alert (FIXED: Content-sized w-fit instead of full-width) */}
        {deal.exclusivityDays > 0 && (
          <div className="inline-flex w-fit max-w-full items-start gap-2.5 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-amber-900 mr-1.5">
                Exclusivity Collision Guard Warning:
              </span>
              <span className="text-amber-800">
                Brand demands {deal.exclusivityDays} days category exclusivity, locking you out of other {deal.category} sponsorships until mid-January 2027.
              </span>
            </div>
          </div>
        )}

        {/* 2-Column Balanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Column 1: Editable Terms & Brand Ledger (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-card border border-[#EAF2F4] space-y-4">
              <h2 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                Extracted Commercial Terms (Editable)
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-500 font-semibold block mb-1">
                    Offered Creator Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={feePaise / 100}
                    onChange={(e) => setFeePaise(Number(e.target.value) * 100)}
                    className="w-full p-2.5 rounded-xl bg-[#F5F9FA] border border-[#EAF2F4] font-bold text-gray-900 outline-none focus:border-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-500 font-semibold block mb-1">
                      Payment Terms
                    </label>
                    <select
                      value={paymentTermsDays}
                      onChange={(e) => setPaymentTermsDays(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#F5F9FA] border border-[#EAF2F4] font-bold text-gray-900 outline-none"
                    >
                      <option value={15}>Net-15 Days</option>
                      <option value={30}>Net-30 Days</option>
                      <option value={45}>Net-45 Days</option>
                      <option value={60}>Net-60 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-500 font-semibold block mb-1">
                      Usage Rights
                    </label>
                    <select
                      value={usageRights}
                      onChange={(e) => setUsageRights(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-[#F5F9FA] border border-[#EAF2F4] font-bold text-gray-900 outline-none"
                    >
                      <option value="none">Organic Social Only</option>
                      <option value="paid_ads_3m">Paid Ads (3m)</option>
                      <option value="paid_ads_6m">Paid Ads (6m)</option>
                      <option value="perpetual">Perpetual Digital Rights</option>
                    </select>
                  </div>
                </div>

                {/* Flagged Traps Chips (FIXED: Content-sized pills) */}
                {deal.riskyQuotes.length > 0 && (
                  <div className="pt-1 space-y-1.5">
                    <span className="text-[11px] font-bold text-gray-700 block">
                      Flagged DM Traps in Brand Message:
                    </span>
                    <div className="flex flex-col gap-1.5 items-start">
                      {deal.riskyQuotes.map((q, idx) => (
                        <div
                          key={idx}
                          className="inline-flex w-fit max-w-full p-2 rounded-xl bg-[#F1B4B9]/15 text-[#702228] text-[11px] font-medium border border-[#F1B4B9]/40"
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
              <div className="bg-white rounded-3xl p-5 shadow-card border border-[#EAF2F4] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Brand Ledger: {ledger.brandName}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {ledger.totalDeals} Deals Closed
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 bg-[#F5F9FA] rounded-xl border border-[#EAF2F4]">
                    <p className="text-[9px] text-gray-400 font-medium">Earned</p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">
                      ₹{(ledger.totalEarnedPaise / 100).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="p-2.5 bg-[#F5F9FA] rounded-xl border border-[#EAF2F4]">
                    <p className="text-[9px] text-gray-400 font-medium">Promised</p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">
                      Net-{ledger.avgPromisedDays}d
                    </p>
                  </div>
                  <div className="p-2.5 bg-[#F1B4B9]/20 rounded-xl border border-[#F1B4B9]/40">
                    <p className="text-[9px] text-[#702228] font-medium">Avg Late</p>
                    <p className="text-xs font-bold text-[#702228] mt-0.5">
                      +{ledger.avgDaysLate} Days
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-gray-600 pt-1 space-y-1">
                  <p className="font-semibold text-gray-800">Past Concessions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ledger.pastConcessions.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex w-fit text-[10px] px-2 py-1 rounded-lg bg-[#F5F9FA] border border-[#EAF2F4] text-gray-600"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Money Leak Radar & Counter Drafter (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Radar Box */}
            <div className="bg-[#F5F9FA] border border-[#EAF2F4] rounded-3xl p-5 shadow-card space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAF2F4]">
                <div>
                  <span className="text-[10px] font-extrabold text-[#702228] uppercase tracking-wider block">
                    Money Leak Radar
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#702228] mt-0.5">
                    ₹{(radar.totalAtRiskPaise / 100).toLocaleString("en-IN")}{" "}
                    <span className="text-xs font-medium opacity-80">at risk</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#EAF2F4] flex items-center justify-center text-[#702228]">
                  <TrendingDown className="w-5 h-5" />
                </div>
              </div>

              {/* Breakdown Rows */}
              <div className="divide-y divide-[#EAF2F4] text-xs">
                {radar.breakdown.map((item) => (
                  <div key={item.key} className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span className="text-xs">{item.label}</span>
                      <span className="text-[#702228] font-extrabold">
                        +₹{(item.amountPaise / 100).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      {item.reason}
                    </p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="inline-flex w-fit text-[9px] font-mono text-gray-500 bg-white px-2 py-0.5 rounded-full border border-[#EAF2F4]">
                        {item.formula}
                      </span>
                      {item.isSimulatedBenchmark && (
                        <span className="inline-flex w-fit text-[9px] font-semibold text-emerald-800 bg-[#DAF4AA] px-2 py-0.5 rounded-full">
                          Simulated Benchmark
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ladder & Counter Drafter */}
            <div className="bg-white rounded-3xl p-5 shadow-card border border-[#EAF2F4] space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Walk-Away Ladder & Counter
                </h3>
                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-[#F5F9FA] p-0.5 rounded-full border border-[#EAF2F4]">
                  <button
                    onClick={() => setSelectedLanguage("English")}
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full transition-all ${
                      selectedLanguage === "English"
                        ? "bg-[#000305] text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setSelectedLanguage("Hinglish")}
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full transition-all ${
                      selectedLanguage === "Hinglish"
                        ? "bg-[#000305] text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Hinglish
                  </button>
                </div>
              </div>

              {/* 3 Tier Selector */}
              <div className="grid grid-cols-3 gap-2">
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
                      className={`p-2.5 rounded-xl text-left transition-all border ${
                        isSelected
                          ? "bg-[#000305] text-white border-[#000305]"
                          : "bg-[#F5F9FA] text-gray-700 border-[#EAF2F4] hover:border-gray-300"
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider block opacity-70">
                        {tierName}
                      </span>
                      <p className="text-xs font-extrabold mt-0.5">
                        ₹{(t.feePaise / 100).toLocaleString("en-IN")}
                      </p>
                      <span className="text-[9px] block opacity-80">
                        Net-{t.paymentTermsDays}d
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Message Draft */}
              <textarea
                rows={4}
                value={currentDraft}
                readOnly
                className="w-full text-xs p-3 rounded-xl bg-[#F5F9FA] border border-[#EAF2F4] text-gray-800 outline-none resize-none leading-relaxed"
              />

              {/* Actions (WhatsApp / Mail / Copy) */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyDraft}
                  className="px-3 py-1.5 bg-[#F5F9FA] hover:bg-gray-100 border border-[#EAF2F4] text-gray-800 text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors"
                >
                  {isCounterCopied ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{isCounterCopied ? "Copied!" : "Copy"}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(currentDraft)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:${deal.brandDomain ? `collab@${deal.brandDomain}` : ""}?subject=Commercial Proposal for ${encodeURIComponent(deal.brandName)}&body=${encodeURIComponent(currentDraft)}`}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
