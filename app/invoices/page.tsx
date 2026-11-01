"use client";

import React, { useState } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { mockInvoices, mockCreatorProfile } from "@/frontend/data/mockKreatoData";
import { QrCode, MessageSquare, Download, CheckCircle2, Clock } from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [activeUpiModal, setActiveUpiModal] = useState<string | null>(null);
  const [reminderDraft, setReminderDraft] = useState<string | null>(null);

  const handleOpenReminder = (inv: typeof mockInvoices[0]) => {
    const draft = `Hi ${inv.brandName} team, gentle reminder regarding Invoice ${inv.invoiceNumber} for ₹${(
      inv.totalAmountPaise / 100
    ).toLocaleString("en-IN")}, which was due on ${inv.dueDate}. Please let us know once the transfer is processed via NEFT or UPI (${mockCreatorProfile.upiVpa}). Thank you!`;
    setReminderDraft(draft);
  };

  return (
    <AppShell showFeed={false}>
      <div className="space-y-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Invoices & Payment Follow-Through
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Automated 18% GST (CGST/SGST vs IGST), dynamic UPI collection QR, and escalating late reminders.
            </p>
          </div>
          <button className="self-start sm:self-auto px-4 py-2 bg-[#000305] text-white text-xs font-bold rounded-full shadow-soft hover:bg-gray-800 transition-colors">
            + Create New GST Invoice
          </button>
        </div>

        {/* Invoices Table Card */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-[#EAF2F4]">
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
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-2 font-bold text-gray-800">
                      {inv.brandName}
                      <span className="block text-[10px] font-normal text-gray-400">
                        {inv.brandState}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{inv.dueDate}</td>
                    <td className="py-3 px-2 text-gray-500 font-mono text-[11px]">
                      {inv.isInterState ? "IGST 18%" : "CGST 9% + SGST 9%"}
                    </td>
                    <td className="py-3 px-2 font-extrabold text-gray-900 text-sm">
                      ₹{(inv.totalAmountPaise / 100).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          inv.status === "paid"
                            ? "bg-[#DAF4AA]/40 text-[#2D4B13] border border-[#DAF4AA]/80"
                            : inv.status === "overdue"
                            ? "bg-[#F1B4B9]/30 text-[#702228] border border-[#F1B4B9]/50"
                            : "bg-blue-50 text-blue-800 border border-blue-100"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveUpiModal(inv.id)}
                          className="p-1 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
                          title="View UPI QR Code"
                        >
                          <QrCode className="w-4 h-4 text-indigo-600" />
                        </button>

                        {inv.status === "overdue" && (
                          <button
                            onClick={() => handleOpenReminder(inv)}
                            className="px-2.5 py-0.5 bg-[#F1B4B9]/20 hover:bg-[#F1B4B9]/40 text-[#702228] border border-[#F1B4B9]/40 font-bold rounded-full text-[10px] transition-colors"
                          >
                            Reminder
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* UPI QR Modal */}
        {activeUpiModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full text-center shadow-floating border border-[#EAF2F4] space-y-3">
              <h3 className="text-sm font-bold text-gray-900">
                Scan UPI Payment QR
              </h3>
              <p className="text-xs text-gray-500">
                Direct to {mockCreatorProfile.upiVpa} with zero payment gateway deduction.
              </p>
              <div className="w-44 h-44 bg-gray-50 rounded-2xl mx-auto flex items-center justify-center border border-[#EAF2F4]">
                <QrCode className="w-28 h-28 text-gray-800" />
              </div>
              <button
                onClick={() => setActiveUpiModal(null)}
                className="w-full py-2 bg-[#000305] text-white text-xs font-bold rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Reminder Drafter Modal */}
        {reminderDraft && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-floating border border-[#EAF2F4] space-y-3">
              <h3 className="text-sm font-bold text-gray-900">
                Payment Follow-Up Reminder Draft
              </h3>
              <textarea
                rows={4}
                value={reminderDraft}
                onChange={(e) => setReminderDraft(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#F5F9FA] border border-[#EAF2F4] text-xs text-gray-800 outline-none leading-relaxed"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setReminderDraft(null)}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(reminderDraft)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
