"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export const PricingSection: React.FC = () => {
  const [annualBilling, setAnnualBilling] = useState(true);

  const plans = [
    {
      name: "Starter",
      desc: "For aspiring creators organizing their first brand inquiries and commercial contracts.",
      priceMonthly: "₹0",
      priceAnnual: "₹0",
      period: "forever",
      badge: null,
      highlight: false,
      ctaText: "Start for free",
      ctaHref: "/signup",
      features: [
        "Up to 5 active deal pipelines",
        "Deal Inbox extraction",
        "Basic Money Leak detection",
        "GST Invoice Generator",
        "Community support",
      ],
    },
    {
      name: "Pro Defense",
      desc: "For full-time independent creators seeking complete commercial defense and deal negotiation power.",
      priceMonthly: "₹1,499",
      priceAnnual: "₹1,199",
      period: "per month",
      badge: "Most Popular",
      highlight: true,
      ctaText: "Get Pro Defense",
      ctaHref: "/signup",
      features: [
        "Unlimited brand deal pipelines",
        "Complete 5-part Money Leak Radar",
        "Deal Copilot counter-offer engine",
        "Contract & usage rights auditor",
        "Personal Brand Ledger & risk scoring",
        "Priority payment watchdog reminders",
        "WhatsApp & Email priority support",
      ],
    },
    {
      name: "Studio & Agencies",
      desc: "For creator teams, talent managers, and boutique creator management agencies.",
      priceMonthly: "₹4,999",
      priceAnnual: "₹3,999",
      period: "per month",
      badge: "Multiple Creators",
      highlight: false,
      ctaText: "Contact Studio Sales",
      ctaHref: "/signup",
      features: [
        "Manage up to 10 creator profiles",
        "Multi-roster Deal Pipeline & inbox",
        "Consolidated agency GST reporting",
        "Team role permissions & audit logs",
        "Custom commercial contracts repository",
        "Dedicated account manager",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-[#F9FAFC] border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Plans that grow with your creator business.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Transparent, creator-friendly pricing. No hidden fees. Zero platform cuts on your sponsorship revenue.
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
                  ? "bg-[#3C55F5] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual billing</span>
              <span className="text-[10px] bg-[#45CDB5] text-slate-950 px-1.5 py-0.5 rounded-full font-black">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                plan.highlight
                  ? "bg-white border-2 border-[#3C55F5] shadow-xl lg:-translate-y-2"
                  : "bg-white border border-slate-200/80 shadow-sm hover:shadow-md"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#3C55F5] text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-500 mb-6 min-h-[36px]">
                  {plan.desc}
                </p>

                <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-slate-100">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    {annualBilling ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    /{plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={plan.ctaHref}
                className={`w-full py-3 px-4 rounded-full text-center text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  plan.highlight
                    ? "bg-[#3C55F5] hover:bg-[#2D44E0] text-white shadow-md hover:shadow-indigo-500/25"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                }`}
              >
                <span>{plan.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

