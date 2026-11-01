"use client";

import React, { useState } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { Upload, FileText, Shield, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { maskPii } from "@/frontend/lib/maskUtils";
import { useRouter } from "next/navigation";

export default function DealInboxPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"text" | "screenshot">("text");
  const [rawText, setRawText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const masked = maskPii(rawText);

  const handleIngest = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Route to Deal detail review
      router.push("/deals/deal_01");
    }, 1200);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Deal Inbox
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Ingest brand messages from WhatsApp, Instagram DMs, or emails. All PII is masked client-side before processing.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("text")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "text"
                ? "bg-[#000305] text-white shadow-soft"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-100"
            }`}
          >
            Paste Message Text
          </button>
          <button
            onClick={() => setActiveTab("screenshot")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "screenshot"
                ? "bg-[#000305] text-white shadow-soft"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-100"
            }`}
          >
            Upload Screenshot
          </button>
        </div>

        {/* Ingestion Panel */}
        <div className="bg-white rounded-4xl p-6 shadow-soft border border-white/60 space-y-6">
          {activeTab === "text" ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  Paste Brand Offer Message (WhatsApp / DM / Email)
                </label>
                <textarea
                  rows={6}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="e.g. Hi Aanya, we loved your recent reel! We want 1 Reel and 2 Stories for GlowSkin India. Our budget is ₹25,000 all inclusive of perpetual digital usage rights and 60 days category exclusivity. Payment net-60 days. WhatsApp me on 9876543210."
                  className="w-full text-xs p-4 rounded-3xl bg-[#F5F9FA] border border-gray-200 outline-none focus:border-indigo-500 transition-all text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Client-Side PII Masking Live Preview */}
              {rawText && (
                <div className="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-emerald-900">
                      Client-Side PII Masking Active (Zero PII sent to servers)
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-mono bg-white/70 p-3 rounded-2xl whitespace-pre-wrap">
                    {masked.maskedText}
                  </p>
                  {masked.tokens.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {masked.tokens.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-emerald-200/60 text-[10px] font-bold text-emerald-900"
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
            <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl text-center space-y-3 hover:border-gray-300 transition-colors cursor-pointer bg-[#F5F9FA]">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-card flex items-center justify-center mx-auto text-gray-600">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">
                Upload Screenshot (PNG, JPG, WebP)
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                In-browser OCR via Tesseract.js. High-security canvas redaction fallback available before submission.
              </p>
              <button className="px-4 py-2 bg-white text-gray-800 text-xs font-bold rounded-full shadow-card border border-gray-100">
                Select Screenshot File
              </button>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleIngest}
              disabled={isProcessing || (activeTab === "text" && !rawText.trim())}
              className="px-6 py-3 rounded-full bg-[#000305] text-white text-xs font-bold flex items-center gap-2 shadow-soft hover:bg-gray-800 disabled:opacity-40 transition-all"
            >
              <Sparkles className="w-4 h-4 text-pastel-lime" />
              <span>
                {isProcessing
                  ? "Extracting & Running Radar..."
                  : "Analyze Offer with Deal Copilot"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

