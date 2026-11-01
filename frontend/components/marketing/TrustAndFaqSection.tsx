"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  FileText,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

export const TrustAndFaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const valueProps = [
    {
      title: "Commercial Transparency",
      desc: "Instant visibility into true deal benchmark valuations, avoiding 40–70% below-market sponsor rates.",
      icon: TrendingUp,
      stat: "100%",
      statLabel: "Clear rate benchmarks",
    },
    {
      title: "Zero Rights Traps",
      desc: "Every contract clause is cross-referenced for perpetual rights, AI scraping licenses, and severe delay penalties.",
      icon: ShieldCheck,
      stat: "5-Part",
      statLabel: "Deterministic defense engine",
    },
    {
      title: "Traceable Financial Records",
      desc: "Every signed memo automatically converts into SAC 998365 GST tax invoices with tracked payment dates.",
      icon: FileText,
      stat: "0%",
      statLabel: "Revenue cuts or commission taken",
    },
  ];

  const faqs = [
    {
      q: "What is Kreato and how does it protect creator income?",
      a: "Kreato is an all-in-one commercial management platform for independent content creators. It audits incoming brand collaboration offers against market rates, flags dangerous contract terms like perpetual usage rights, calculates your walk-away counter-offer ladder, and automates follow-through until invoices are cleared in your bank account.",
    },
    {
      q: "Does Kreato take a cut or commission of my sponsorship deals?",
      a: "No. Never. Kreato charges zero commission on your brand deals. You keep 100% of your earnings. Kreato operates as a clean subscription software platform with a free tier for early creators.",
    },
    {
      q: "How does the Money Leak Radar calculate potential exposure?",
      a: "The Money Leak Radar runs a deterministic 5-part calculation: benchmark pricing gap, uncompensated usage rights (e.g. perpetual whitelisting), payment delay financing cost (based on a 18% annual capital rate for Net-60/90 terms), category exclusivity lockout cost, and brand payment track record penalties.",
    },
    {
      q: "Are the invoices GST-compliant for Indian tax laws?",
      a: "Yes. Kreato generates standard SAC 998365 tax invoices with precise integer paise math for CGST (9%), SGST (9%), or IGST (18%), along with your bank UPI QR codes, PAN, and GSTIN details.",
    },
    {
      q: "Does Kreato send messages or negotiate automatically without my approval?",
      a: "No. Kreato Copilot generates data-driven recommendations, counter-offer drafts, and walk-away ladders, but you retain 100% control over all emails, messages, and commercial commitments sent to brands.",
    },
  ];

  return (
    <div>
      {/* TRUST & VALUE PILLARS */}
      <section className="py-20 sm:py-28 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#3C55F5] uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">
              Built for Independent Creators
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              Built for the business behind every collaboration.
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Independent creators are modern business owners. Kreato gives you the institutional leverage of an enterprise agency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-slate-50/70 rounded-3xl p-8 border border-slate-200/60 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-800 mb-6">
                      <Icon className="w-6 h-6 text-[#3C55F5]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-200/60">
                    <div className="text-3xl font-black text-slate-900">
                      {item.stat}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      {item.statLabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-20 sm:py-28 bg-[#F9FAFC] border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Everything you need to know about Kreato's commercial workflow engine.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-[#3C55F5] transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-[#3C55F5]" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 sm:px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRE-FOOTER CTA BANNER */}
      <section className="py-20 sm:py-28 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
            Spend more time creating. <br />
            Stay in control of your business.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
            Join independent creators protecting their brand sponsorship income with Kreato.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-bold text-white bg-[#3C55F5] hover:bg-[#2D44E0] active:scale-[0.98] px-8 py-3.5 rounded-full shadow-lg transition-all"
            >
              <span>Get started with Kreato</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center text-base font-semibold text-slate-300 hover:text-white px-6 py-3.5 transition-colors"
            >
              <span>Sign in to account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

