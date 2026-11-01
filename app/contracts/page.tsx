"use client";

import React, { useState } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { mockDeals, mockCreatorProfile } from "@/frontend/data/mockKreatoData";
import {
  FileCheck,
  CheckCircle2,
  Copy,
} from "lucide-react";

export default function ContractsPage() {
  const agreedDeal = mockDeals.find((d) => d.status === "agreed") || mockDeals[3];
  const [copiedLink, setCopiedLink] = useState(false);

  const publicAcceptUrl = `https://kreato.in/memo/sec_tok_${agreedDeal.id}_98273`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicAcceptUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <AppShell showFeed={false}>
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>Deal Memos & Public Brand Acceptance</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Convert informal DM agreements into tamper-evident summaries with verified public acceptance links.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="self-start sm:self-auto px-4 py-2 bg-[#000305] text-white text-xs font-bold rounded-full shadow-soft flex items-center gap-1.5 hover:bg-gray-800 transition-colors"
          >
            {copiedLink ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-pastel-lime" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-pastel-lime" />
            )}
            <span>{copiedLink ? "Link Copied!" : "Copy Public Brand Link"}</span>
          </button>
        </div>

        {/* Deal Memo Preview Layout */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-[#EAF2F4] space-y-5">
          <div className="flex justify-between items-start border-b border-[#EAF2F4] pb-4">
            <div>
              <span className="inline-flex w-fit text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-[#DAF4AA] px-2 py-0.5 rounded-full mb-1">
                Signed & Verified
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-gray-900">
                CREATOR COLLABORATION DEAL MEMO
              </h2>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                REF: KM/2026-27/004 • SHA-256 Verified
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Agreed in Chat
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#F5F9FA] rounded-2xl border border-[#EAF2F4]">
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                Creator
              </span>
              <p className="font-extrabold text-gray-900 mt-0.5">{mockCreatorProfile.name}</p>
              <p className="text-gray-500 text-[11px]">{mockCreatorProfile.handle}</p>
            </div>
            <div className="p-3 bg-[#F5F9FA] rounded-2xl border border-[#EAF2F4]">
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                Brand Partner
              </span>
              <p className="font-extrabold text-gray-900 mt-0.5">{agreedDeal.brandName}</p>
              <p className="text-gray-500 text-[11px]">{agreedDeal.brandDomain}</p>
            </div>
          </div>

          <div className="border-t border-[#EAF2F4] pt-4 text-xs space-y-2.5">
            <div className="flex justify-between py-1 border-b border-[#F5F9FA]">
              <span className="text-gray-500">Deliverables:</span>
              <span className="font-bold text-gray-900">
                {agreedDeal.deliverables.map((d) => `${d.quantity} ${d.format.replace("instagram_", "")}`).join(", ")}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F5F9FA]">
              <span className="text-gray-500">Agreed Net Fee:</span>
              <span className="font-extrabold text-gray-900">
                ₹{(agreedDeal.feePaise / 100).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F5F9FA]">
              <span className="text-gray-500">Payment Terms:</span>
              <span className="font-bold text-gray-900">
                Net-{agreedDeal.paymentTermsDays} days post-live post
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F5F9FA]">
              <span className="text-gray-500">Usage Rights:</span>
              <span className="font-bold text-gray-900">
                {agreedDeal.usageRights === "none" ? "Organic Social Only" : agreedDeal.usageRights}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F5F9FA]">
              <span className="text-gray-500">Category Exclusivity:</span>
              <span className="font-bold text-gray-900">
                {agreedDeal.exclusivityDays === 0 ? "None (Zero Exclusivity)" : `${agreedDeal.exclusivityDays} days`}
              </span>
            </div>
          </div>

          {/* Legal Note Disclaimer */}
          <div className="pt-3 border-t border-[#EAF2F4] text-center">
            <p className="text-[10px] text-gray-400 italic">
              "Summary of terms agreed in chat. Not a legal contract."
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
