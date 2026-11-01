"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";

export const FaqAndClosingSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Kreato and how does it protect my creator income?",
      a: "Kreato is an all-in-one commercial management platform for independent content creators. It audits incoming brand collaboration offers against market rates, flags dangerous contract terms like perpetual usage rights, calculates your walk-away counter-offer ladder, and automates follow-through until invoices are cleared in your bank account.",
    },
    {
      q: "Does Kreato charge any cut or commission on my deals?",
      a: "No. Never. Kreato charges zero commission on your brand deals. You keep 100% of your earnings. Kreato operates as a clean subscription software platform with a free tier for emerging creators.",
    },
    {
      q: "How does the Money Leak Radar calculate financial exposure?",
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
      {/* FAQ ACCORDION SECTION */}
      <section id="faq" className="py-24 sm:py-32 bg-[#F9FAFC] border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#3D54F5] uppercase tracking-wider bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/60">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4">
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
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-[#3D54F5] transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openIndex === idx ? "rotate-180 text-[#3D54F5]" : ""
                    }`}
                  />
                </button>
                {openIndex === idx && (
                  <div className="px-5 sm:px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL HIGH-IMPACT CTA SECTION */}
      <section className="py-24 sm:py-32 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
            Focus on creating. <br />
            Keep your business in control.
          </h2>
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-xl mx-auto">
            Bring your brand deals, commercial intelligence and payments together with Kreato.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-bold text-white bg-[#3D54F5] hover:bg-[#3047DE] active:scale-[0.98] px-9 py-4 rounded-full shadow-lg transition-all"
            >
              <span>Start for Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center text-base font-semibold text-slate-300 hover:text-white px-7 py-4 transition-colors"
            >
              <span>Sign in to account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

