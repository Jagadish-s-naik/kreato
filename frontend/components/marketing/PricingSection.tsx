"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const PricingSection: React.FC = () => {
  const [annualBilling, setAnnualBilling] = useState(true);

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-[#F9FAFC] border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <span className="text-xs font-bold text-[#3D54F5] uppercase tracking-wider bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/60">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4">
            Plans built for every stage of your creator business.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Clean creator-friendly pricing. Zero commissions taken from your brand sponsorships.
          </p>

          {/* Monthly / Annual Toggle Switch */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-slate-200/80 border border-slate-300/60 text-xs font-bold text-slate-700">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-1.5 rounded-full transition-all ${
                !annualBilling
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                annualBilling
                  ? "bg-[#3D54F5] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual billing</span>
              <span className="text-[10px] bg-[#54D2B9] text-slate-950 px-1.5 py-0.5 rounded-full font-black">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* 2 PREMIUM CARD COMPOSITIONS (Inspired by Beacons white Free & dark Creator Plus reference) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch max-w-4xl mx-auto">
          {/* CARD 1: Free Forever (White Card with Dark Pill Feature Badges) */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-md flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-black text-slate-900">
                  Starter Free
                </h3>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  Free Forever
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                For emerging independent creators organizing their first brand inquiries and commercial contracts.
              </p>

              <div className="flex items-baseline gap-1.5 mb-8 pb-6 border-b border-slate-100">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {"₹"}0
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  /forever
                </span>
              </div>

              {/* Pill-Style Feature Labels */}
              <div className="space-y-3 mb-8">
                {[
                  "Up to 5 active deal pipelines",
                  "Universal Deal Inbox extraction",
                  "Basic Money Leak detection",
                  "SAC 998365 GST tax invoices",
                  "Direct UPI QR payment links",
                  "Personal Brand Ledger memory",
                ].map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/signup"
              className="w-full py-3.5 px-6 rounded-full text-center text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all flex items-center justify-center gap-2"
            >
              <span>Get started for free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* CARD 2: Pro Defense (Contrasting Dark Card with Bright Accent & Popularity Badge) */}
          <div className="bg-[#000305] text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl flex flex-col justify-between relative transition-all hover:-translate-y-1 lg:-rotate-1 hover:rotate-0">
            {/* Most Popular Badge */}
            <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-[#3D54F5] to-[#54D2B9] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-black text-white">
                  Pro Defense
                </h3>
                <span className="text-xs font-bold text-[#54D2B9] bg-[#54D2B9]/10 px-3 py-1 rounded-full border border-[#54D2B9]/20">
                  Full Protection
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                For full-time creators seeking complete commercial defense, contract auditing, and counter-offer negotiation power.
              </p>

              <div className="flex items-baseline gap-1.5 mb-8 pb-6 border-b border-slate-800">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {annualBilling ? "₹1,199" : "₹1,499"}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  /month
                </span>
              </div>

              {/* White & Teal Feature Pills */}
              <div className="space-y-3 mb-8">
                {[
                  "Unlimited sponsorship deal pipelines",
                  "Complete 5-part Money Leak Radar engine",
                  "Deal Copilot 3-tier counter-offer ladder",
                  "Perpetual usage rights & exclusivity scanner",
                  "Priority payment watchdog reminders",
                  "YouTube subscriber band verification",
                  "RFC 5545 Google Calendar sync",
                ].map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#54D2B9] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/signup"
              className="w-full py-3.5 px-6 rounded-full text-center text-sm font-black bg-gradient-to-r from-[#3D54F5] to-indigo-600 hover:from-[#3047DE] hover:to-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Upgrade to Pro Defense</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
