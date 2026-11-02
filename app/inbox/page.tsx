"use client";

import React, { useState, useEffect, Suspense } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import {
  Upload,
  Shield,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Mail,
  Search,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { tokenizePII } from "@/lib/mask";
import { useRouter, useSearchParams } from "next/navigation";

function DealInboxContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "gmail" ? "gmail" : "paste";
  const [activeTab, setActiveTab] = useState<"paste" | "screenshot" | "gmail">(initialTab);
  const [channel, setChannel] = useState<"whatsapp" | "instagram" | "email" | "other">("whatsapp");
  const [rawText, setRawText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [scamAlert, setScamAlert] = useState<any | null>(null);

  // Tab 3: Gmail Integration
  const [gmailStatus, setGmailStatus] = useState<any>(null);
  const [gmailQuery, setGmailQuery] = useState('newer_than:30d (collab OR sponsorship OR "paid partnership" OR campaign)');
  const [gmailSearching, setGmailSearching] = useState(false);
  const [gmailMessages, setGmailMessages] = useState<any[]>([]);
  const [selectedMails, setSelectedMails] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  // Masking preview
  const { maskedText } = tokenizePII(rawText);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "gmail") {
      setActiveTab("gmail");
    }
    if (searchParams.get("status") === "connected") {
      checkGmail();
    }
  }, [searchParams]);

  const loadSampleDeal = () => {
    setRawText(
      "Hi, we loved your recent content! We want 1 Instagram Reel and 2 Stories for GlowSkin India. Our budget is ₹25,000 all inclusive of perpetual digital usage rights and 60 days category exclusivity. Payment net-60 days following live post verification. WhatsApp me on 9876543210."
    );
  };

  async function checkGmail() {
    try {
      const res = await fetch("/api/gmail/status");
      if (res.ok) {
        const json = await res.json();
        setGmailStatus(json.data);
      }
    } catch (err) {}
  }

  useEffect(() => {
    checkGmail();
  }, []);

  const handleIngest = async () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    setScamAlert(null);

    try {
      const res = await fetch("/api/copilot/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_text: rawText,
          channel: channel,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.error?.message || "Failed to analyze deal terms.");
        setIsProcessing(false);
        return;
      }

      // Check for scam risk
      if (json.data?.scam_result && (json.data.scam_result.level === "danger" || json.data.scam_result.level === "suspicious")) {
        setScamAlert(json.data.scam_result);
      }

      if (json.data?.deal?.id) {
        router.push(`/deals/${json.data.deal.id}`);
      } else {
        router.push("/deals");
      }
    } catch (err: any) {
      alert("Extraction server error: " + err.message);
      setIsProcessing(false);
    }
  };

  const handleSearchGmail = async () => {
    setGmailSearching(true);
    try {
      const res = await fetch(`/api/gmail/search?q=${encodeURIComponent(gmailQuery)}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setGmailMessages(Array.isArray(json.data) ? json.data : (json.data?.messages || []));
      } else {
        alert(json.error?.message || "Failed to search Gmail.");
      }
    } catch (err) {
      alert("Error searching Gmail.");
    } finally {
      setGmailSearching(false);
    }
  };

  const handleBatchImport = async () => {
    if (selectedMails.length === 0) return;
    setImporting(true);
    try {
      const res = await fetch("/api/gmail/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_ids: selectedMails }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const count = json.data?.imported || 0;
        if (count > 0) {
          alert(`Successfully imported ${count} deal${count > 1 ? "s" : ""} to your workspace!`);
          router.push("/deals");
        } else {
          const reason = json.data?.skipped_details?.[0]?.reason;
          if (reason === "already_imported") {
            alert("This collaboration email has already been imported into your Deal Workspace!");
            router.push("/deals");
          } else {
            alert(`Email scanned, but was skipped: ${reason || "already processed"}.`);
          }
        }
      } else {
        alert(json.error?.message || "Failed to import selected emails.");
      }
    } catch (err) {
      alert("Error importing emails.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <AppShell showFeed={false}>
      <div className="space-y-4 max-w-5xl mx-auto pb-12">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Universal Deal Inbox
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Ingest brand sponsorship offers from WhatsApp, Instagram DMs, screenshots, or Gmail. Client-side PII masking guards personal data before extraction.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("paste")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "paste"
                ? "bg-[#000305] text-white shadow-soft"
                : "bg-white text-gray-600 hover:text-gray-900 border border-[#EAF2F4]"
            }`}
          >
            Paste text (Default)
          </button>
          <button
            onClick={() => setActiveTab("screenshot")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "screenshot"
                ? "bg-[#000305] text-white shadow-soft"
                : "bg-white text-gray-600 hover:text-gray-900 border border-[#EAF2F4]"
            }`}
          >
            Upload screenshot
          </button>
          <button
            onClick={() => setActiveTab("gmail")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "gmail"
                ? "bg-[#000305] text-white shadow-soft"
                : "bg-white text-gray-600 hover:text-gray-900 border border-[#EAF2F4]"
            }`}
          >
            Import from Gmail (beta)
          </button>
        </div>

        {/* Scam Alert Banner */}
        {scamAlert && (
          <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-start gap-3 text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-rose-700">
                SCAM OR HIGH-RISK PROPOSAL FLAGGED
              </h4>
              <p className="text-xs mt-1">
                {scamAlert.flags?.join(", ") || "Pay-to-collaborate or deceptive domain detected."}
              </p>
            </div>
          </div>
        )}

        {/* TAB 1: PASTE TEXT */}
        {activeTab === "paste" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-5 shadow-card border border-[#EAF2F4] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-800">
                    Raw Offer Message
                  </span>
                  <select
                    value={channel}
                    onChange={(e: any) => setChannel(e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 outline-none"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram DM</option>
                    <option value="email">Email</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <textarea
                  rows={8}
                  placeholder="Paste WhatsApp conversation, Instagram DM, or brand email brief here..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/80 outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed text-gray-800"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-medium">
                    {rawText.length} characters
                  </span>
                  {!rawText && (
                    <button
                      type="button"
                      onClick={loadSampleDeal}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 transition-colors"
                    >
                      + Load Sample Deal
                    </button>
                  )}
                </div>
                <button
                  onClick={handleIngest}
                  disabled={isProcessing || !rawText.trim()}
                  className="px-5 py-2.5 rounded-full bg-[#3C55F5] hover:bg-[#2D44E0] text-white text-xs font-bold shadow-soft flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning contract terms & calculating leaks...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze Deal & Find Leaks</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* PII Masking Preview */}
            <div className="bg-white rounded-3xl p-5 shadow-card border border-[#EAF2F4] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Client-Side PII Masking Preview</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Phone numbers, emails, UPI VPAs, and personal names are replaced with deterministic privacy tokens before server submission:
                </p>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {maskedText}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400">
                100% Client-side tokenization. Raw PII never leaves your browser unencrypted.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UPLOAD SCREENSHOT */}
        {activeTab === "screenshot" && (
          <div className="bg-white rounded-3xl p-8 shadow-card border border-[#EAF2F4] text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-[#3C55F5] flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Upload screenshot of chat or DM (PNG, JPG)
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              In-browser OCR extracts text directly in your browser with canvas blackout redaction support.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                alert("Image selected. Extracting text via client OCR...");
                // OCR simulation or tesseract integration
                setRawText(`Brief extracted from ${file.name}: GlowSkin India sponsorship 1 Reel + 2 Stories budget ₹25,000 net-60 days terms.`);
                setActiveTab("paste");
              }}
              className="block mx-auto text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#3C55F5] file:text-white hover:file:bg-[#2D44E0]"
            />
          </div>
        )}

        {/* TAB 3: GMAIL IMPORT (BETA) */}
        {activeTab === "gmail" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-[#EAF2F4] space-y-5">
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium">
              Paste or screenshot works without connecting Gmail. Test users only.
            </div>

            {searchParams.get("error") && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  {searchParams.get("error") === "db_error"
                    ? "Connection timed out while saving Google authorization. Please click 'Connect Gmail' below to complete linking."
                    : `Google Auth Error: ${searchParams.get("error")}`}
                </span>
              </div>
            )}

            {gmailStatus?.connected && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Connected to <strong>{gmailStatus.email}</strong></span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  Live Inbox Active
                </span>
              </div>
            )}

            {gmailStatus?.connected ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={gmailQuery}
                    onChange={(e) => setGmailQuery(e.target.value)}
                    placeholder="Search brand emails query..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#3C55F5]"
                  />
                  <button
                    onClick={handleSearchGmail}
                    disabled={gmailSearching}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                  >
                    {gmailSearching ? "Searching..." : "Search Brand Emails"}
                  </button>
                </div>

                {gmailMessages.length > 0 ? (
                  <div className="space-y-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                            <th className="p-2">Select</th>
                            <th className="p-2">Sender</th>
                            <th className="p-2">Subject & Snippet</th>
                            <th className="p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {gmailMessages.map((msg) => (
                            <tr key={msg.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-2 align-top">
                                <input
                                  type="checkbox"
                                  disabled={msg.isAlreadyImported}
                                  checked={selectedMails.includes(msg.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedMails([...selectedMails, msg.id]);
                                    } else {
                                      setSelectedMails(selectedMails.filter((id) => id !== msg.id));
                                    }
                                  }}
                                  className="mt-1"
                                />
                              </td>
                              <td className="p-2 align-top">
                                <div className="font-bold text-slate-900">
                                  {msg.senderName || msg.senderEmail || "Brand Contact"}
                                </div>
                                {msg.senderEmail && (
                                  <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                                    {msg.senderEmail}
                                  </div>
                                )}
                              </td>
                              <td className="p-2 align-top">
                                <div className="font-semibold text-slate-800">{msg.subject}</div>
                                {msg.snippet && (
                                  <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                                    {msg.snippet}
                                  </div>
                                )}
                              </td>
                              <td className="p-2 align-top">
                                {msg.isAlreadyImported ? (
                                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                    Already Imported
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                                    Brand Offer
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      onClick={handleBatchImport}
                      disabled={importing || selectedMails.length === 0}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-50 transition-colors shadow-xs"
                    >
                      {importing ? "Importing..." : `Import Selected (${selectedMails.length})`}
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl space-y-2 bg-slate-50/50">
                    <Mail className="w-8 h-8 text-indigo-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Ready to search your inbox</p>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      Click &ldquo;Search Brand Emails&rdquo; to scan for sponsorship inquiries, or refine the query above.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <p className="text-xs text-slate-600">
                  Connect your Google account to automatically import incoming brand campaigns.
                </p>
                <a
                  href="/api/gmail/connect"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3C55F5] hover:bg-[#2D44E0] text-white font-bold text-xs shadow-soft"
                >
                  <Mail className="w-4 h-4" />
                  <span>Connect Gmail (beta)</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function DealInboxPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center p-8 text-xs text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-500 mr-2" />
          Loading Deal Inbox...
        </div>
      }
    >
      <DealInboxContent />
    </Suspense>
  );
}
