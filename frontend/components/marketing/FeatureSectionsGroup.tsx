"use client";

import React from "react";
import { FeatureRow } from "./FeatureRow";
import {
  Inbox,
  AlertOctagon,
  TrendingDown,
  Scale,
  Sparkles,
  FileCheck2,
  Receipt,
  Clock,
  CheckCircle,
} from "lucide-react";

export const FeatureSectionsGroup: React.FC = () => {
  return (
    <div id="features" className="space-y-4 sm:space-y-12">
      {/* FEATURE 1: Deal Ingestion & Pipeline */}
      <FeatureRow
        pill="Core Workflow"
        heading="Every brand opportunity, organized."
        description="Stop losing high-value collaborations in chaotic DMs, WhatsApp chats, and fragmented email threads. Kreato captures inbound inquiries, extracts deliverables, and organizes your commercial pipeline automatically."
        bullets={[
          "Instant parsing of brand emails, PDFs, and agency briefs",
          "Automated deliverable scope and deadline extraction",
          "Visual pipeline tracking from inquiry to confirmed memo",
        ]}
        ctaText="Explore Deal Pipeline"
        ctaHref="/signup"
        imageOnLeft={false}
      >
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                Incoming Brief Captured
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">ID: INB-2026-08</span>
          </div>

          <div className="space-y-3.5">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/70 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-extrabold text-slate-900">
                  Mamaearth Skincare
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  High Intent
                </span>
              </div>
              <div className="text-xs text-slate-500 mb-3">
                Deliverables: 1x YouTube Integrated + 1x Instagram Reel
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
                <span className="text-slate-500">Proposed Budget:</span>
                <span className="font-bold text-slate-900 text-sm">₹90,000</span>
              </div>
            </div>

            <div className="p-4 bg-white/70 rounded-2xl border border-slate-200/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-700">
                  Nykaa Fashion Festive
                </span>
                <span className="text-xs font-medium text-slate-500">Under Review</span>
              </div>
              <div className="text-xs text-slate-500">
                Deliverables: 3x Story Sequences with Affiliate Links
              </div>
            </div>
          </div>
        </div>
      </FeatureRow>

      {/* FEATURE 2: Money Leak Radar */}
      <FeatureRow
        pill="Financial Defense"
        heading="Know what every deal is really worth."
        description="Uncover hidden commercial leaks before you accept brand terms. The Money Leak Radar exposes underpriced benchmark gaps, uncompensated perpetual rights, payment delay financing costs, and category lockouts."
        bullets={[
          "Deterministic 5-part leakage math based on industry standards",
          "Identify uncompensated digital whitelisting and perpetual rights",
          "Calculates net financing cost for Net-60 and Net-90 delayed terms",
        ]}
        ctaText="See Money Leak Radar"
        ctaHref="/signup"
        imageOnLeft={true}
      >
        <div className="bg-[#FFF5F5] rounded-3xl p-6 sm:p-8 border border-rose-200/70 shadow-md">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-rose-200/60">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
              <AlertOctagon className="w-4 h-4" />
              <span>Money Leak Radar Analysis</span>
            </div>
            <span className="text-xs font-bold text-rose-950 bg-rose-100 px-2 py-0.5 rounded-full">
              High Risk
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-rose-950 mb-1">
            ₹1,49,023
          </div>
          <p className="text-xs text-rose-800 mb-6">
            Total potential income leakage detected on ₹25,000 initial offer
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/90 border border-rose-100">
              <span className="font-semibold text-slate-800">
                Underpriced Benchmark Gap
              </span>
              <span className="font-bold text-rose-600">+₹50,000</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/90 border border-rose-100">
              <span className="font-semibold text-slate-800">
                Uncompensated Perpetual Rights
              </span>
              <span className="font-bold text-rose-600">+₹75,000</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/90 border border-rose-100">
              <span className="font-semibold text-slate-800">
                60-Day Category Exclusivity Lockout
              </span>
              <span className="font-bold text-rose-600">+₹22,500</span>
            </div>
          </div>
        </div>
      </FeatureRow>

      {/* FEATURE 3: Deal Copilot & Walk-Away Ladder */}
      <FeatureRow
        pill="Intelligent Negotiation"
        heading="Better terms start with better insights."
        description="Never negotiate in the dark or accept bad terms under pressure. Kreato Copilot generates data-driven counter-offers, defines your non-negotiable walk-away floor, and gives you professional email responses."
        bullets={[
          "3-tier walk-away pricing ladder (Anchor, Target, Floor)",
          "Professional negotiation language tailored to Indian brand agencies",
          "Distinguishes AI suggestions from confirmed commercial obligations",
        ]}
        ctaText="Try Deal Copilot"
        ctaHref="/signup"
        imageOnLeft={false}
      >
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-6 text-xs font-bold text-[#45CDB5]">
            <Sparkles className="w-4 h-4 text-[#45CDB5]" />
            <span>KREATO COPILOT RECOMMENDATION</span>
          </div>

          <div className="space-y-3.5 mb-6">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Tier 1: Premium Anchor
                </div>
                <div className="text-base font-bold text-white">₹85,000</div>
              </div>
              <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
                Includes 60-day digital ads
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#3C55F5]/20 border border-[#3C55F5]/50 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">
                  Tier 2: Target Sweet Spot
                </div>
                <div className="text-base font-bold text-white">₹70,000</div>
              </div>
              <span className="text-[11px] text-indigo-200 bg-indigo-950/60 px-2 py-0.5 rounded-md">
                Standard deliverables
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/40 flex items-center justify-between opacity-80">
              <div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Tier 3: Walk-Away Floor
                </div>
                <div className="text-base font-bold text-white">₹50,000</div>
              </div>
              <span className="text-[11px] text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded-md">
                Organic post only
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400 italic">
            "We love your campaign vision! Our benchmark for this deliverable scope with digital amplification is ₹85,000..."
          </div>
        </div>
      </FeatureRow>

      {/* FEATURE 4: GST Invoices & Brand Ledger */}
      <FeatureRow
        pill="Complete Follow-Through"
        heading="Every agreement. Every invoice. Every payment. Connected."
        description="Once the deal is done, Kreato automatically generates SAC 998365 GST-compliant tax invoices, handles CGST/SGST/IGST paise calculations, and logs the brand's settlement track record into your Brand Ledger."
        bullets={[
          "Auto-generated GST invoices with payment terms & bank UPI QR",
          "Personal Brand Ledger tracks late-paying brands and credit risks",
          "Automated follow-up reminders before invoices become overdue",
        ]}
        ctaText="Explore Invoices & Payments"
        ctaHref="/signup"
        imageOnLeft={true}
      >
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-bold text-slate-900">
                TAX INVOICE #KR-2026-042
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Paid in Full
            </span>
          </div>

          <div className="space-y-3 text-xs mb-6">
            <div className="flex justify-between text-slate-500">
              <span>Client:</span>
              <span className="font-semibold text-slate-900">
                Nykaa Fashion (FSN E-Commerce)
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Service Code:</span>
              <span className="font-mono text-slate-700">SAC 998365 (Advertising)</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Taxable Subtotal:</span>
              <span className="font-semibold text-slate-900">₹72,033.90</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>IGST (18%):</span>
              <span className="font-semibold text-slate-900">₹12,966.10</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
              <span>Total Invoice Amount:</span>
              <span className="text-base text-emerald-600">₹85,000.00</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Settled in 12 days (Net-15 terms)
            </span>
            <span className="font-bold text-emerald-700">A+ Reliability</span>
          </div>
        </div>
      </FeatureRow>
    </div>
  );
};

