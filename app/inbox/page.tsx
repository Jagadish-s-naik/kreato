"use client";

import React, { useState } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import {
  Upload,
  Shield,
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { maskPii } from "@/frontend/lib/maskUtils";
import { useRouter } from "next/navigation";

export default function DealInboxPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"text" | "screenshot">("text");
  const [rawText, setRawText] = useState(
    "Hi Aanya, we loved your recent reel! We want 1 Reel and 2 Stories for GlowSkin India. Our budget is ₹25,000 all inclusive of perpetual digital usage rights and 60 days category exclusivity. Payment net-60 days. WhatsApp me on 9876543210."
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const masked = maskPii(rawText);

  const handleIngest = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      router.push("/deals/deal_01");
    }, 1000);
  };

  return (
    <AppShell showFeed={false}>
      <div className="space-y-4 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Deal Inbox & Ingestion
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Ingest brand messages from WhatsApp, Instagram DMs, or emails. All PII is masked client-side before server evaluation.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("text")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "text"
                ? "bg-[#000305] text-white shadow-soft"
                : "bg-white text-gray-600 hover:text-gray-900 border border-[#EAF2F4]"
            }`}
          >
            Paste Message Text
          </button>
          <button
            onClick={() => setActiveTab("screenshot")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "screenshot"
                ? "bg-[#000305] text-white shadow-soft"
                : "bg-white text-gray-600 hover:text-gray-900 border border-[#EAF2F4]"
            }`}
          >
            Upload Screenshot
          </button>
        </div>

        {/* 2-Column Balanced Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Form & PII Preview (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 shadow-card border border-[#EAF2F4] space-y-4">
            {activeTab === "text" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">
                    Raw Brand Message
                  </label>
                  <span className="text-[10px] text-gray-400">
                    {rawText.length} characters
                  </span>
                </div>

                <textarea
                  rows={5}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste WhatsApp, Instagram DM or email text..."
                  className="w-full text-xs p-3.5 rounded-2xl bg-[#F5F9FA] border border-[#EAF2F4] outline-none focus:border-gray-400 transition-all text-gray-800 placeholder-gray-400 resize-none leading-relaxed"
                />

                {/* Client-Side PII Masking Preview Badge */}
                {rawText && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-900">
                      <Shield className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-[11px] font-bold">
                        Client-Side PII Masked (Zero unmasked data transmitted)
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-mono bg-white/70 p-2.5 rounded-xl whitespace-pre-wrap leading-relaxed">
                      {masked.maskedText}
                    </p>
                    {masked.tokens.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {masked.tokens.map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-flex w-fit px-2 py-0.5 rounded-full bg-emerald-200/60 text-[9px] font-bold text-emerald-900"
                          >
                            {t.token} ➔ {t.type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-[#EAF2F4] rounded-3xl text-center space-y-2.5 bg-[#F5F9FA]">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-card border border-[#EAF2F4] flex items-center justify-center mx-auto text-gray-600">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-gray-900">
                  Upload Screenshot (PNG, JPG, WebP)
                </h3>
                <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                  In-browser OCR via Tesseract.js with client-side canvas redaction fallback.
                </p>
                <button className="px-3.5 py-1.5 bg-white text-gray-800 text-xs font-bold rounded-full shadow-card border border-[#EAF2F4]">
                  Choose File
                </button>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleIngest}
                disabled={isProcessing || !rawText.trim()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#000305] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-soft hover:bg-gray-800 disabled:opacity-40 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-pastel-lime" />
                <span>
                  {isProcessing ? "Extracting Terms..." : "Analyze Offer with Copilot"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Instant Copilot Intelligence Preview (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 shadow-card border border-[#EAF2F4] space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAF2F4]">
              <span className="text-xs font-bold text-gray-900">
                Copilot Extraction Preview
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1B4B9]/30 text-[#702228] border border-[#F1B4B9]/50">
                Risk Detected
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#EAF2F4]">
                <span className="text-gray-400">Brand Name:</span>
                <span className="font-bold text-gray-900">GlowSkin India</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAF2F4]">
                <span className="text-gray-400">Offered Fee:</span>
                <span className="font-extrabold text-gray-900">₹25,000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAF2F4]">
                <span className="text-gray-400">Deliverables:</span>
                <span className="font-medium text-gray-800">1 Reel, 2 Stories</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAF2F4]">
                <span className="text-gray-400">Payment Terms:</span>
                <span className="font-bold text-rose-600">Net-60 Days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAF2F4]">
                <span className="text-gray-400">Usage Rights:</span>
                <span className="font-bold text-rose-600">Perpetual</span>
              </div>
            </div>

            {/* FIXED: Content-sized warning chip */}
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-[11px] text-rose-900 space-y-1">
              <div className="inline-flex items-center gap-1.5 w-fit font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Radar Alert: ₹1,25,000 at risk</span>
              </div>
              <p className="text-[10px] text-rose-700 leading-snug">
                Perpetual digital rights & 60-day credit term severely underprice this deal against market benchmark.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
