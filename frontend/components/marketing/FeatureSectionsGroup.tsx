"use client";

import React from "react";

export const FeatureSectionsGroup: React.FC = () => {
  return (
    <div id="features" className="space-y-24 sm:space-y-36 pb-24">
      {/* SECTION 1: Build your presence */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 text-left">
            <h3 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Build your <span className="text-[#3C55F5]">presence.</span>
            </h3>
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
              Create a commercial workspace so distinctly yours that every brand sponsor, collaborator, and agency finds your rate card, deliverables, and past campaigns in seconds.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-lg">
              <img
                src="/marketing/254953b1-bb1a-4675-af43-39c3bbdb222c.png"
                alt="Build your presence showcase"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Monetize your work */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 text-left">
            <h3 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Monetize <span className="text-[#2042D8]">your work.</span>
            </h3>
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
              Audit brand deals, quote premium anchors, and eliminate hidden exclusivity locks. No platform commissions on your sponsorship revenue. Cash out with SAC 998365 GST tax invoices.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-lg">
              <img
                src="/marketing/550639b8-b736-4a52-be08-077f9ac3482b.png"
                alt="Monetize your work showcase"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Stop Money Leaks & Manage Outreach */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 text-left">
            <h3 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Stop <span className="text-rose-600">money leaks.</span>
            </h3>
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
              Never sign away uncompensated perpetual rights or accept Net-90 payment traps without finance charges. Kreato automatically detects deal risks and prepares confident counter-offers.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-lg">
              <img
                src="/marketing/cd3bc16d-1129-4c58-b82b-9a7db311c1d1.png"
                alt="Stop money leaks showcase"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Inbound Opportunities & Analytics */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 text-left">
            <h3 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Every inquiry, <span className="text-[#50CFB5]">tracked.</span>
            </h3>
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
              From WhatsApp DMs and email briefs to signed memos and settled UPI payments, keep your entire commercial pipeline in one connected ledger.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-lg">
              <img
                src="/marketing/fefb5cf3-84cf-4516-997a-bc33bd15028c.png"
                alt="Analytics and deal pipeline showcase"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
