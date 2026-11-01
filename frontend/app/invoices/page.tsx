"use client";

import React, { useState } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { mockInvoices, mockCreatorProfile } from "@/frontend/data/mockKreatoData";
import { calculateGst, generateUpiUri } from "@/frontend/lib/gstEngine";
import {
  Receipt,
  QrCode,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  FastForward,
} from "lucide-react";

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
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Invoices & Payment Follow-Through
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Automated 18% GST (CGST/SGST vs IGST), dynamic UPI collection QR, and escalating late reminders.
            </p>
          </div>
          <button className="px-4 py-2 bg-[#000305] text-white text-xs font-bold rounded-full shadow-soft hover:bg-gray-800 transition-colors">
            + Create New GST Invoice
          </button>
        </div>

        {/* Invoices List */}
        <div className="bg-white rounded-4xl p-6 shadow-soft border border-white/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 px-2">Invoice #</th>
                  <th className="pb-3 px-2">Brand</th>
                  <th className="pb-3 px-2">Due Date</th>
                  <th className="pb-3 px-2">Tax Split</th>
                  <th className="pb-3 px-2">Total Amount</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-2 font-mono font-bold text-gray-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-4 px-2 font-bold text-gray-800">
                      {inv.brandName}
                      <span className="block text-[10px] font-normal text-gray-400">
                        {inv.brandState}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-gray-600">{inv.dueDate}</td>
                    <td className="py-4 px-2 text-gray-500 font-mono text-[11px]">
                      {inv.isInterState ? "IGST 18%" : "CGST 9% + SGST 9%"}
                    </td>
                    <td className="py-4 px-2 font-extrabold text-gray-900 text-sm">
                      ₹{(inv.totalAmountPaise / 100).toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inv.status === "paid"
                            ? "bg-pastel-lime text-emerald-900"
                            : inv.status === "overdue"
                            ? "bg-pastel-coral text-red-900"
                            : "bg-blue-50 text-blue-800"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveUpiModal(inv.id)}
                          className="p-1.5 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
                          title="View UPI QR Code"
                        >
                          <QrCode className="w-4 h-4 text-indigo-600" />
                        </button>

                        {inv.status === "overdue" && (
                          <button
                            onClick={() => handleOpenReminder(inv)}
                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-full text-[10px] transition-colors"
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

        {/* UPI QR Modal Simulation */}
        {activeUpiModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-4xl p-6 max-w-sm w-full text-center shadow-floating border border-white/80 space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                Scan UPI Payment QR
              </h3>
              <p className="text-xs text-gray-500">
                Direct to {mockCreatorProfile.upiVpa} with zero gateway cuts.
              </p>
              <div className="w-48 h-48 bg-gray-100 rounded-3xl mx-auto flex items-center justify-center border border-gray-200">
                <QrCode className="w-32 h-32 text-gray-800" />
              </div>
              <button
                onClick={() => setActiveUpiModal(null)}
                className="w-full py-2.5 bg-[#000305] text-white text-xs font-bold rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Reminder Drafter Modal */}
        {reminderDraft && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-4xl p-6 max-w-md w-full shadow-floating border border-white/80 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">
                Payment Follow-Up Reminder Draft
              </h3>
              <textarea
                rows={4}
                value={reminderDraft}
                onChange={(e) => setReminderDraft(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#F5F9FA] border border-gray-200 text-xs text-gray-800 outline-none leading-relaxed"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setReminderDraft(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(reminderDraft)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center gap-1.5"
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

