"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import {
  QrCode,
  MessageSquare,
  CheckCircle2,
  Clock,
  RefreshCw,
  Copy,
  ExternalLink,
  Plus,
} from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUpiModal, setActiveUpiModal] = useState<any | null>(null);
  const [reminderDraft, setReminderDraft] = useState<any | null>(null);
  const [draftingReminder, setDraftingReminder] = useState(false);

  async function loadInvoices() {
    try {
      setLoading(true);
      const res = await fetch("/api/invoices");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setInvoices(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_id: invoiceId,
          payment_method: "upi",
          reference_number: `SETTLE_${Date.now()}`,
        }),
      });
      if (res.ok) {
        alert("Payment recorded successfully!");
        loadInvoices();
      } else {
        alert("Failed to record payment.");
      }
    } catch (err) {
      alert("Error recording payment.");
    }
  };

  const handleDraftReminder = async (invoiceId: string) => {
    setDraftingReminder(true);
    try {
      const res = await fetch("/api/reminder/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_id: invoiceId }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setReminderDraft(json.data);
      } else {
        alert(json.error?.message || "Failed to generate reminder.");
      }
    } catch (err) {
      alert("Error generating reminder draft.");
    } finally {
      setDraftingReminder(false);
    }
  };

  return (
    <AppShell showFeed={false}>
      <div className="space-y-4 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Invoices & Payment Follow-Through
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Automated SAC 998365 18% GST (CGST/SGST vs IGST), UPI collection QR, and escalating late reminders.
            </p>
          </div>
        </div>

        {/* Invoices Table Card */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-[#EAF2F4]">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
              Loading invoices...
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">
              No invoices generated yet. Generate a GST invoice from any agreed deal in your Deal Workspace.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAF2F4] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 px-2">Invoice #</th>
                    <th className="pb-3 px-2">Brand</th>
                    <th className="pb-3 px-2">Due Date</th>
                    <th className="pb-3 px-2">Tax Split</th>
                    <th className="pb-3 px-2">Total Amount</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAF2F4]">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-gray-900">
                        {inv.invoice_number}
                      </td>
                      <td className="py-3 px-2 font-bold text-gray-800">
                        {inv.deals?.brand_name || "Direct Sponsorship"}
                      </td>
                      <td className="py-3 px-2 text-gray-500">
                        {inv.due_date || "Pending"}
                      </td>
                      <td className="py-3 px-2 text-[11px] font-mono text-gray-600">
                        {inv.is_interstate ? "IGST 18%" : "CGST 9% + SGST 9%"}
                      </td>
                      <td className="py-3 px-2 font-black text-gray-900">
                        ₹{((inv.total_paise || 0) / 100).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === "paid"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : inv.status === "overdue"
                              ? "bg-rose-50 text-rose-800 border border-rose-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {inv.status === "paid" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {inv.status === "overdue" && <Clock className="w-3 h-3 text-rose-600" />}
                          <span className="capitalize">{inv.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {inv.upi_link && (
                            <button
                              onClick={() => setActiveUpiModal(inv)}
                              className="p-1.5 rounded-lg border border-[#EAF2F4] hover:bg-gray-100 text-gray-700 transition-colors"
                              title="View UPI QR Code"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {inv.status !== "paid" && (
                            <>
                              <button
                                onClick={() => handleDraftReminder(inv.id)}
                                disabled={draftingReminder}
                                className="p-1.5 rounded-lg border border-[#EAF2F4] hover:bg-gray-100 text-indigo-600 transition-colors"
                                title="Draft Overdue Reminder"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMarkAsPaid(inv.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors"
                              >
                                Mark Paid
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* UPI QR Modal */}
        {activeUpiModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 text-center">
              <h3 className="font-extrabold text-base text-slate-900">
                UPI Payment Collection
              </h3>
              <p className="text-xs text-slate-500">
                Invoice {activeUpiModal.invoice_number} • ₹{((activeUpiModal.total_paise || 0) / 100).toLocaleString("en-IN")}
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block font-mono text-[11px] text-slate-700 break-all">
                {activeUpiModal.upi_link}
              </div>
              <div>
                <button
                  onClick={() => setActiveUpiModal(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reminder Draft Modal */}
        {reminderDraft && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">
                  Overdue Payment Reminder Draft
                </h3>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Creator Approval Mode
                </span>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Email Subject
                </label>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                  {reminderDraft.subject}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Email Body
                </label>
                <textarea
                  readOnly
                  rows={5}
                  value={reminderDraft.body}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(reminderDraft.body);
                    alert("Reminder copied to clipboard!");
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Reminder</span>
                </button>
                {reminderDraft.whatsapp_text && (
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(reminderDraft.whatsapp_text)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open WhatsApp</span>
                  </a>
                )}
                <button
                  onClick={() => setReminderDraft(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
