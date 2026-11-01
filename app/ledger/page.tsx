"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/frontend/components/layout/AppShell";
import {
  BookOpen,
  Search,
  ShieldCheck,
  AlertTriangle,
  Clock,
  RefreshCw,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  FileText,
  PlusCircle,
  Save,
} from "lucide-react";

// Industry standard demo brand benchmark dataset for creator exploration
const DEMO_INDUSTRY_BRANDS = [
  {
    brandKey: "nykaa_fashion",
    brandName: "Nykaa Beauty & Fashion",
    category: "Beauty & Skincare",
    totalDeals: 3,
    totalEarnedPaise: 18500000,
    totalContractedPaise: 18500000,
    avgPromisedDays: 30,
    avgActualDays: 32,
    avgDaysLate: 2,
    onTimeRate: 92,
    reliabilityTier: "prompt" as const,
    pastConcessions: [
      "Accepted 30-day whitelisting license without additional fee",
      "Standard Net-30 payment honored within 48 hours of invoice",
    ],
    deals: [
      {
        id: "demo-nykaa-1",
        feePaise: 7500000,
        status: "paid",
        category: "Beauty & Skincare",
        deliverables: [{ format: "instagram_reel", quantity: 1 }, { format: "instagram_story", quantity: 2 }],
        usageRights: "paid_ads_3m",
        paymentTermsDays: 30,
        createdAt: "2026-09-15T10:00:00Z",
      },
      {
        id: "demo-nykaa-2",
        feePaise: 11000000,
        status: "paid",
        category: "Beauty & Skincare",
        deliverables: [{ format: "instagram_reel", quantity: 2 }],
        usageRights: "organic",
        paymentTermsDays: 30,
        createdAt: "2026-10-02T14:30:00Z",
      },
    ],
  },
  {
    brandKey: "boat_lifestyle",
    brandName: "boAt Lifestyle",
    category: "Tech & Gadgets",
    totalDeals: 2,
    totalEarnedPaise: 12000000,
    totalContractedPaise: 12000000,
    avgPromisedDays: 45,
    avgActualDays: 58,
    avgDaysLate: 13,
    onTimeRate: 50,
    reliabilityTier: "moderate" as const,
    pastConcessions: [
      "Agreed to Net-45 extended payment terms",
      "Conceded 30-day category exclusivity for audio accessories",
    ],
    deals: [
      {
        id: "demo-boat-1",
        feePaise: 6000000,
        status: "paid",
        category: "Tech & Gadgets",
        deliverables: [{ format: "instagram_reel", quantity: 1 }],
        usageRights: "organic",
        paymentTermsDays: 45,
        createdAt: "2026-08-20T11:00:00Z",
      },
    ],
  },
  {
    brandKey: "mamaearth",
    brandName: "Mamaearth (Honasa)",
    category: "Beauty & Skincare",
    totalDeals: 4,
    totalEarnedPaise: 24000000,
    totalContractedPaise: 24000000,
    avgPromisedDays: 30,
    avgActualDays: 34,
    avgDaysLate: 4,
    onTimeRate: 85,
    reliabilityTier: "prompt" as const,
    pastConcessions: [
      "Granted 90-day meta whitelisting rights",
    ],
    deals: [
      {
        id: "demo-mama-1",
        feePaise: 8000000,
        status: "paid",
        category: "Beauty & Skincare",
        deliverables: [{ format: "instagram_reel", quantity: 1 }, { format: "instagram_story", quantity: 3 }],
        usageRights: "paid_ads_3m",
        paymentTermsDays: 30,
        createdAt: "2026-09-01T09:15:00Z",
      },
    ],
  },
  {
    brandKey: "glowskin_india",
    brandName: "GlowSkin India",
    category: "Beauty & Skincare",
    totalDeals: 2,
    totalEarnedPaise: 5000000,
    totalContractedPaise: 5000000,
    avgPromisedDays: 30,
    avgActualDays: 68,
    avgDaysLate: 38,
    onTimeRate: 20,
    reliabilityTier: "risky" as const,
    pastConcessions: [
      "Perpetual digital commercial rights conceded without licensing surcharge",
      "Accepted 60-day delayed payment in previous deal",
      "Conceded 60-day category exclusivity lockout",
    ],
    deals: [
      {
        id: "demo-glow-1",
        feePaise: 2500000,
        status: "paid",
        category: "Beauty & Skincare",
        deliverables: [{ format: "instagram_reel", quantity: 1 }, { format: "instagram_story", quantity: 2 }],
        usageRights: "perpetual",
        paymentTermsDays: 60,
        createdAt: "2026-07-10T12:00:00Z",
      },
    ],
  },
];

export default function BrandLedgerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<"all" | "prompt" | "moderate" | "risky">("all");
  const [sortBy, setSortBy] = useState<"revenue" | "deals" | "delay" | "name">("revenue");
  const [expandedBrandKey, setExpandedBrandKey] = useState<string | null>(null);
  const [showDemoBrands, setShowDemoBrands] = useState(true);

  // Private creator relationship notes persisted in localStorage
  const [brandNotes, setBrandNotes] = useState<Record<string, string>>({});
  const [editingNoteKey, setEditingNoteKey] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kreato_brand_notes");
      if (saved) setBrandNotes(JSON.parse(saved));
    } catch {}
  }, []);

  const saveNote = (key: string) => {
    const updated = { ...brandNotes, [key]: noteDraft };
    setBrandNotes(updated);
    try {
      localStorage.setItem("kreato_brand_notes", JSON.stringify(updated));
    } catch {}
    setEditingNoteKey(null);
  };

  useEffect(() => {
    async function loadLedger() {
      try {
        setLoading(true);
        const res = await fetch("/api/brand-ledger");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
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

  // Combine live database ledger with demo benchmarks if enabled
  const combinedBrands = useMemo(() => {
    const liveKeys = new Set(ledgers.map((b) => b.brandKey || b.brand_key));
    if (!showDemoBrands) return ledgers;
    const supplementalDemos = DEMO_INDUSTRY_BRANDS.filter((d) => !liveKeys.has(d.brandKey));
    return [...ledgers, ...supplementalDemos];
  }, [ledgers, showDemoBrands]);

  // Filter & Sort
  const filteredBrands = useMemo(() => {
    return combinedBrands
      .filter((b) => {
        const name = (b.brandName || b.brand_name || "").toLowerCase();
        const cat = (b.category || "").toLowerCase();
        const concessions = Array.isArray(b.pastConcessions)
          ? b.pastConcessions.join(" ").toLowerCase()
          : (b.past_concessions || "").toLowerCase();
        const matchesSearch =
          name.includes(searchTerm.toLowerCase()) ||
          cat.includes(searchTerm.toLowerCase()) ||
          concessions.includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (filterTier === "all") return true;
        const tier = b.reliabilityTier || (b.avg_days_late > 20 ? "risky" : b.avg_days_late > 7 ? "moderate" : "prompt");
        return tier === filterTier;
      })
      .sort((a, b) => {
        const aEarned = a.totalEarnedPaise ?? a.total_paid_paise ?? 0;
        const bEarned = b.totalEarnedPaise ?? b.total_paid_paise ?? 0;
        const aDeals = a.totalDeals ?? a.total_deals ?? 0;
        const bDeals = b.totalDeals ?? b.total_deals ?? 0;
        const aDelay = a.avgDaysLate ?? a.avg_days_late ?? 0;
        const bDelay = b.avgDaysLate ?? b.avg_days_late ?? 0;
        const aName = a.brandName || a.brand_name || "";
        const bName = b.brandName || b.brand_name || "";

        if (sortBy === "revenue") return bEarned - aEarned;
        if (sortBy === "deals") return bDeals - aDeals;
        if (sortBy === "delay") return bDelay - aDelay;
        return aName.localeCompare(bName);
      });
  }, [combinedBrands, searchTerm, filterTier, sortBy]);

  // Executive KPI summary calculations
  const kpis = useMemo(() => {
    const totalBrands = combinedBrands.length;
    const totalEarningsPaise = combinedBrands.reduce(
      (sum, b) => sum + (b.totalEarnedPaise ?? b.total_paid_paise ?? 0),
      0
    );
    const avgDelay = totalBrands > 0
      ? Math.round(combinedBrands.reduce((sum, b) => sum + (b.avgDaysLate ?? b.avg_days_late ?? 0), 0) / totalBrands)
      : 0;
    const promptCount = combinedBrands.filter(
      (b) => (b.avgDaysLate ?? b.avg_days_late ?? 0) <= 7
    ).length;
    const onTimePercentage = totalBrands > 0 ? Math.round((promptCount / totalBrands) * 100) : 100;

    return {
      totalBrands,
      totalEarningsFormatted: `₹${(totalEarningsPaise / 100).toLocaleString("en-IN")}`,
      avgDelayFormatted: avgDelay === 0 ? "On-Time" : `+${avgDelay}d late avg`,
      onTimePercentage: `${onTimePercentage}%`,
    };
  }, [combinedBrands]);

  return (
    <AppShell showFeed={false}>
      <div className="space-y-6 max-w-6xl mx-auto pb-16">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Personal Brand Ledger
                </h1>
                <p className="text-xs text-slate-500">
                  Institutional memory for solo creators. Track payment speeds, concession history, and repeat sponsorship leverage.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Evaluate Trigger & Demo Toggle */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setShowDemoBrands(!showDemoBrands)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                showDemoBrands
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              title="Toggle industry benchmark sample brands"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{showDemoBrands ? "Industry Benchmarks Active" : "Show Benchmarks"}</span>
            </button>
            <Link
              href="/inbox"
              className="px-4 py-2 rounded-full bg-[#3C55F5] hover:bg-[#2D44E0] text-white font-bold text-xs shadow-soft flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Evaluate New Pitch</span>
            </Link>
          </div>
        </div>

        {/* 1. Executive Portfolio KPI Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Brand Partners
            </span>
            <div className="text-2xl font-black text-slate-900">
              {kpis.totalBrands} <span className="text-xs font-semibold text-slate-400">Brands</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
              Historical Track Record
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Total Volume Contracted
            </span>
            <div className="text-2xl font-black text-slate-900">
              {kpis.totalEarningsFormatted}
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">
              Across all partnerships
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Payment Turnaround
            </span>
            <div className="text-2xl font-black text-slate-900">
              {kpis.avgDelayFormatted}
            </div>
            <span className="text-[10px] text-indigo-600 font-bold mt-1 inline-block">
              Promised Net-30 Baseline
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Settlement Reliability
            </span>
            <div className="text-2xl font-black text-emerald-700">
              {kpis.onTimePercentage}
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">
              On-time payment rate
            </span>
          </div>
        </div>

        {/* 2. Search, Filter, and Sort Toolbar */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search brand, category, or concession..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#3C55F5]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setFilterTier("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterTier === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({combinedBrands.length})
            </button>
            <button
              onClick={() => setFilterTier("prompt")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                filterTier === "prompt"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              <span>🟢 Prompt</span>
            </button>
            <button
              onClick={() => setFilterTier("moderate")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                filterTier === "moderate"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              <span>🟡 Moderate</span>
            </button>
            <button
              onClick={() => setFilterTier("risky")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                filterTier === "risky"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 text-rose-800 hover:bg-rose-100"
              }`}
            >
              <span>🔴 Late Risk</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none ml-1"
            >
              <option value="revenue">Sort: Highest Volume</option>
              <option value="deals">Sort: Most Deals</option>
              <option value="delay">Sort: Longest Delay</option>
              <option value="name">Sort: Brand Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* 3. Brand Ledger Cards Grid */}
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
            Loading Personal Brand Ledger...
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No matching brand records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm
                ? `No brands match your search for "${searchTerm}". Try resetting filters.`
                : "Ingest your first sponsorship brief to begin building your institutional relationship memory."}
            </p>
            <Link
              href="/inbox"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3C55F5] hover:bg-[#2D44E0] text-white font-bold text-xs shadow-soft transition-colors mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ingest Brand Deal</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredBrands.map((brand) => {
              const brandKey = brand.brandKey || brand.brand_key;
              const brandName = brand.brandName || brand.brand_name || "Sponsor";
              const earnedPaise = brand.totalEarnedPaise ?? brand.total_paid_paise ?? 0;
              const totalDeals = brand.totalDeals ?? brand.total_deals ?? 1;
              const delay = brand.avgDaysLate ?? brand.avg_days_late ?? 0;
              const promised = brand.avgPromisedDays ?? brand.typical_payment_terms ?? 30;
              const isExpanded = expandedBrandKey === brandKey;
              const initials = brandName.slice(0, 2).toUpperCase();

              // Concessions formatting
              let concessionsList: string[] = [];
              if (Array.isArray(brand.pastConcessions) && brand.pastConcessions.length > 0) {
                concessionsList = brand.pastConcessions;
              } else if (brand.past_concessions) {
                concessionsList = brand.past_concessions.split(". ").filter(Boolean);
              }

              // Status badge styling
              const isPrompt = delay <= 7;
              const isRisky = delay > 20;

              const note = brandNotes[brandKey] || "";

              return (
                <div
                  key={brandKey}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    {/* Header: Avatar, Name, Category & Reliability Chip */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {initials}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                            {brandName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {brand.category || "General Sponsorship"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {totalDeals} campaign{totalDeals > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Health Badge */}
                      <span
                        className={`text-[11px] font-extrabold px-3 py-1 rounded-full border shrink-0 ${
                          isPrompt
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : isRisky
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : "bg-amber-50 text-amber-900 border-amber-200"
                        }`}
                      >
                        {isPrompt
                          ? "🟢 Prompt Settlement"
                          : isRisky
                          ? `🔴 High Delay (+${delay}d)`
                          : `🟡 Moderate (+${delay}d)`}
                      </span>
                    </div>

                    {/* 4-Box Metric Matrix */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          Lifetime Value
                        </span>
                        <span className="font-black text-sm text-slate-900">
                          ₹{(earnedPaise / 100).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          Payment Latency
                        </span>
                        <span className="font-black text-sm text-slate-900">
                          Net-{promised} {delay > 0 ? `(+${delay}d late)` : "(On-time)"}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          On-Time Reliability
                        </span>
                        <span className={`font-black text-sm ${isPrompt ? "text-emerald-700" : isRisky ? "text-rose-700" : "text-amber-700"}`}>
                          {brand.onTimeRate ?? (isPrompt ? 100 : isRisky ? 30 : 70)}%
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          Avg Deal Size
                        </span>
                        <span className="font-black text-sm text-slate-900">
                          ₹{(Math.round(earnedPaise / Math.max(1, totalDeals)) / 100).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Past Concessions & Strategic Negotiation Intelligence */}
                    {concessionsList.length > 0 && (
                      <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-950">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>Past Concession History & Traps</span>
                        </div>
                        <ul className="text-[11px] text-amber-900/90 space-y-1 list-disc list-inside">
                          {concessionsList.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                        <p className="text-[10px] font-bold text-amber-800 pt-1 border-t border-amber-200/60">
                          💡 Tactical Recommendation:{" "}
                          {delay > 15
                            ? "Insist on 50% milestone advance before posting reel; decline Net-60 terms."
                            : "Solid repeat partner. Anchor with 20% rate increase for whitelisting or ad usage."}
                        </p>
                      </div>
                    )}

                    {/* Private Creator Note */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          Private Relationship Note
                        </span>
                        {editingNoteKey !== brandKey && (
                          <button
                            onClick={() => {
                              setEditingNoteKey(brandKey);
                              setNoteDraft(note);
                            }}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                          >
                            {note ? "Edit" : "+ Add Note"}
                          </button>
                        )}
                      </div>
                      {editingNoteKey === brandKey ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="e.g. Brand contact is Priya. Always requires 2 rounds of script approval..."
                            className="w-full text-xs p-2 rounded-xl bg-white border border-slate-200 outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                          />
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => saveNote(brandKey)}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-[10px] flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" /> Save Note
                            </button>
                            <button
                              onClick={() => setEditingNoteKey(null)}
                              className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-600 italic">
                          {note || "No private notes yet. Click + Add Note to log contact names or negotiation preferences."}
                        </p>
                      )}
                    </div>

                    {/* Expandable Deal History Accordion */}
                    {brand.deals && brand.deals.length > 0 && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setExpandedBrandKey(isExpanded ? null : brandKey)}
                          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>View All Campaigns ({brand.deals.length})</span>
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-2.5 space-y-2 pl-1 border-l-2 border-indigo-200">
                            {brand.deals.map((d: any, idx: number) => {
                              const fee = `₹${((d.feePaise || d.fee_paise || 0) / 100).toLocaleString("en-IN")}`;
                              const status = d.status || "agreed";
                              const delivs = Array.isArray(d.deliverables)
                                ? d.deliverables.map((item: any) => `${item.quantity || item.count || 1}x ${item.format || item.type || "reel"}`).join(", ")
                                : "1x Reel";

                              return (
                                <div
                                  key={d.id || idx}
                                  className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/70 text-xs flex items-center justify-between gap-3"
                                >
                                  <div>
                                    <div className="font-bold text-slate-900 flex items-center gap-2">
                                      <span>{fee}</span>
                                      <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                                        {status}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">
                                      {delivs} • {d.usageRights || "organic"} • Net-{d.paymentTermsDays || 30}
                                    </div>
                                  </div>
                                  {d.id && !d.id.startsWith("demo-") && (
                                    <Link
                                      href={`/deals/${d.id}`}
                                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0"
                                    >
                                      <span>Open Deal</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </Link>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Evaluate Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Key: {brandKey}
                    </span>
                    <Link
                      href={`/inbox?brand=${encodeURIComponent(brandName)}`}
                      className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>New Collab</span>
                      <ArrowRight className="w-3 h-3" />
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
