"use client";

import React, { useState, useEffect } from "react";
import {
  FileCheck2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";

export default function PublicDealMemoPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;
  const [loading, setLoading] = useState(true);
  const [memoData, setMemoData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [signatoryName, setSignatoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedSuccess, setAcceptedSuccess] = useState(false);

  useEffect(() => {
    async function loadMemo() {
      try {
        setLoading(true);
        const res = await fetch(`/api/memo/${token}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          setError(json.error?.message || "Deal Memo not found or invalid link.");
        } else {
          setMemoData(json.data);
          if (json.data.isAlreadyAccepted) {
            setAcceptedSuccess(true);
          }
        }
      } catch (err: any) {
        setError("Failed to connect to server. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadMemo();
  }, [token]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatoryName.trim() || signatoryName.trim().length < 2) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/memo/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signatory_name: signatoryName }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.error?.message || "Failed to sign memo.");
      } else {
        setAcceptedSuccess(true);
      }
    } catch (err) {
      alert("Error confirming terms. Please check network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F4F7] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-[#3C55F5] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-bold text-slate-500">
          Loading Deal Memo...
        </p>
      </div>
    );
  }

  if (error || !memoData) {
    return (
      <div className="min-h-screen bg-[#F0F4F7] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900 mb-2">
            Invalid or Expired Memo
          </h1>
          <p className="text-xs text-slate-600 mb-6">
            {error || "This deal memo link is invalid or has expired."}
          </p>
          <div className="text-[11px] text-slate-400">
            Please contact the creator directly for an updated link.
          </div>
        </div>
      </div>
    );
  }

  const { deal, creator, content, isAlreadyAccepted, acceptedByName, acceptedAt } =
    memoData;

  const deliverables = (deal?.deliverables as any[]) || [];
  const feePaise = deal?.fee_paise || 0;
  const paymentDays = deal?.payment_terms_days || 30;

  return (
    <div className="min-h-screen bg-[#F0F4F7] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-xs border border-slate-200">
              <img
                src="/kreato-logo.png"
                alt="Kreato"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight block">
                Kreato
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Deal Memo Verification Service
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
            Ref: {deal?.id?.slice(0, 8)}
          </span>
        </div>

        {/* Top Mandatory Legal Notice */}
        <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-3.5 text-xs text-amber-900 text-center font-semibold">
          Summary of terms agreed in chat. Not a legal contract.
        </div>

        {/* Main Deal Memo Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-10 space-y-8">
          <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Commercial Deal Memo
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {deal?.brand_name} Sponsorship
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Creator: <strong className="text-slate-800">{creator?.full_name || "Independent Creator"}</strong> ({creator?.handle || "@creator"})
              </p>
            </div>

            {acceptedSuccess ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold w-fit">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Terms Agreed & Confirmed</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold w-fit">
                <Clock className="w-4 h-4 text-[#3C55F5]" />
                <span>Pending Signatory Sign-off</span>
              </div>
            )}
          </div>

          {/* Key Agreed Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Agreed Fee
              </span>
              <span className="text-2xl font-black text-slate-900">
                ₹{(feePaise / 100).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Excl. 18% GST (SAC 998365)
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Payment Terms
              </span>
              <span className="text-2xl font-black text-slate-900">
                Net-{paymentDays}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                From invoice submission date
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Usage Rights
              </span>
              <span className="text-base font-extrabold text-slate-900 capitalize block">
                {deal?.usage_rights?.replace(/_/g, " ") || "Organic Only"}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Digital social channels
              </span>
            </div>
          </div>

          {/* Deliverables Scope */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              Agreed Deliverables Scope
            </h3>
            <div className="space-y-2">
              {deliverables.length > 0 ? (
                deliverables.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-800"
                  >
                    <span>
                      {item.count || 1}x {item.type} ({item.platform})
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Standard Quality Delivery
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 text-xs text-slate-600">
                  Deliverables agreed per campaign conversation brief.
                </div>
              )}
            </div>
          </div>

          {/* Signatory Action / Confirmation */}
          <div className="pt-6 border-t border-slate-100">
            {acceptedSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-950">
                  Terms Officially Confirmed
                </h4>
                <p className="text-xs text-emerald-800">
                  Confirmed by <strong className="font-bold">{acceptedByName || signatoryName || "Authorized Signatory"}</strong>
                  {acceptedAt && ` on ${new Date(acceptedAt).toLocaleDateString("en-IN")}`}.
                </p>
                <div className="text-[11px] text-emerald-700/80 pt-2">
                  Creator has been notified. Campaign production may proceed.
                </div>
              </div>
            ) : (
              <form onSubmit={handleAccept} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Authorized Brand Signatory Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma (Marketing Lead)"
                    value={signatoryName}
                    onChange={(e) => setSignatoryName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3C55F5] text-sm text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || signatoryName.trim().length < 2}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Recording sign-off..." : "I Agree to Terms"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Mandatory Legal Notice */}
        <div className="text-center text-[11px] text-slate-400">
          Summary of terms agreed in chat. Not a legal contract. • Powered by Kreato Deal Engine
        </div>
      </div>
    </div>
  );
}

