"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { AppShell } from "@/frontend/components/layout/AppShell";
import {
  QrCode,
  MessageSquare,
  CheckCircle2,
  Clock,
  RefreshCw,
  Copy,
  ExternalLink,
  Eye,
  Printer,
  X,
  ShieldCheck,
  FileText,
  Building,
  UserCheck,
} from "lucide-react";

function numberToIndianWords(num: number): string {
  if (!num || isNaN(num)) return "Rupees Zero Only";
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertTwoDigits(n: number): string {
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let res = "";
    if (hundred > 0) res += a[hundred] + " Hundred";
    if (rest > 0) res += (res ? " and " : "") + convertTwoDigits(rest);
    return res;
  }

  let n = Math.floor(num);
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const remainder = n;

  const parts: string[] = [];
  if (crore > 0) parts.push(convertTwoDigits(crore) + " Crore");
  if (lakh > 0) parts.push(convertTwoDigits(lakh) + " Lakh");
  if (thousand > 0) parts.push(convertTwoDigits(thousand) + " Thousand");
  if (remainder > 0) parts.push(convertThreeDigits(remainder));

  return "Rupees " + parts.join(" ") + " Only";
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUpiModal, setActiveUpiModal] = useState<any | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<any | null>(null);
  const [invoiceQrUrl, setInvoiceQrUrl] = useState<string | null>(null);
  const [reminderDraft, setReminderDraft] = useState<any | null>(null);
  const [draftingReminder, setDraftingReminder] = useState(false);

  useEffect(() => {
    if (activeUpiModal?.upi_link) {
      QRCode.toDataURL(activeUpiModal.upi_link, { width: 220, margin: 1 })
        .then(setQrDataUrl)
        .catch(() => setQrDataUrl(null));
    } else {
      setQrDataUrl(null);
    }
  }, [activeUpiModal]);

  useEffect(() => {
    if (viewingInvoice?.upi_link) {
      QRCode.toDataURL(viewingInvoice.upi_link, { width: 140, margin: 1 })
        .then(setInvoiceQrUrl)
        .catch(() => setInvoiceQrUrl(null));
    } else {
      setInvoiceQrUrl(null);
    }
  }, [viewingInvoice]);

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

  const handleMarkAsPaid = async (inv: any) => {
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_id: inv.id,
          deal_id: inv.deal_id,
          amount_paise: inv.total_paise,
          payment_method: "upi",
          reference_number: `SETTLE_${Date.now()}`,
        }),
      });
      if (res.ok) {
        alert("Payment recorded successfully!");
        loadInvoices();
      } else {
        const json = await res.json().catch(() => ({}));
        alert(json.error?.message || "Failed to record payment.");
      }
    } catch (err) {
      alert("Error recording payment.");
    }
  };

  const handleDraftReminder = async (inv: any) => {
    setDraftingReminder(true);
    try {
      const res = await fetch("/api/reminder/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_id: inv.id,
          deal_id: inv.deal_id,
          days_overdue: 14,
        }),
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
                          {/* View Tax Invoice Button */}
                          <button
                            onClick={() => setViewingInvoice(inv)}
                            className="p-1.5 rounded-lg border border-[#EAF2F4] hover:bg-indigo-50 text-indigo-700 transition-colors"
                            title="View GST Tax Invoice"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

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
                                onClick={() => handleDraftReminder(inv)}
                                disabled={draftingReminder}
                                className="p-1.5 rounded-lg border border-[#EAF2F4] hover:bg-gray-100 text-indigo-600 transition-colors"
                                title="Draft Overdue Reminder"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMarkAsPaid(inv)}
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

        {/* GST TAX INVOICE TEMPLATE MODAL */}
        {viewingInvoice && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
              {/* Modal Top Bar (Hidden on print) */}
              <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                    GST Tax Invoice • {viewingInvoice.invoice_number}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    onClick={() => setViewingInvoice(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Document Body */}
              <div id="printable-tax-invoice" className="p-6 sm:p-10 space-y-6 text-slate-800 bg-white">
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-900">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-serif">
                      TAX INVOICE
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Issued in accordance with Rule 46 of the Central Goods and Services Tax (CGST) Rules, 2017
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SAC 998365: Digital Content & Brand Sponsorships</span>
                    </div>
                  </div>
                  <div className="sm:text-right space-y-1 text-xs">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Invoice Number
                    </p>
                    <p className="font-mono text-base font-black text-slate-900">
                      {viewingInvoice.invoice_number}
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      <span className="text-slate-400">Date of Issue:</span>{" "}
                      <span className="font-semibold text-slate-800">
                        {new Date(viewingInvoice.created_at || Date.now()).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      <span className="text-slate-400">Payment Due:</span>{" "}
                      <span className="font-semibold text-rose-700">
                        {viewingInvoice.due_date || "Net 30 Days"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Bill From & Bill To Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Bill From */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400 tracking-wider">
                      <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                      <span>Supplier (Bill From)</span>
                    </div>
                    <p className="font-extrabold text-sm text-slate-900">
                      {viewingInvoice.supplier_snapshot?.displayName || "Independent Content Creator"}
                    </p>
                    <div className="text-[11px] text-slate-600 space-y-1 font-mono">
                      <p>
                        <span className="text-slate-400">State:</span>{" "}
                        {viewingInvoice.supplier_snapshot?.state || "Maharashtra"}
                      </p>
                      <p>
                        <span className="text-slate-400">GSTIN / Status:</span>{" "}
                        <span className="font-semibold text-slate-800">
                          {viewingInvoice.supplier_snapshot?.gstin || "Unregistered (Sec 22 CGST Threshold Exempt)"}
                        </span>
                      </p>
                      <p>
                        <span className="text-slate-400">Settlement VPA:</span>{" "}
                        <span className="font-bold text-indigo-700">
                          {viewingInvoice.supplier_snapshot?.upiVpa || "Registered Creator VPA"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Bill To */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400 tracking-wider">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>Recipient / Brand (Bill To)</span>
                    </div>
                    <p className="font-extrabold text-sm text-slate-900">
                      {viewingInvoice.deals?.brand_name ||
                        viewingInvoice.client_snapshot?.brandName ||
                        "Brand Partner"}
                    </p>
                    <div className="text-[11px] text-slate-600 space-y-1 font-mono">
                      <p>
                        <span className="text-slate-400">Entity:</span>{" "}
                        {viewingInvoice.client_snapshot?.companyName ||
                          viewingInvoice.client_snapshot?.brandName ||
                          "Brand Client Entity"}
                      </p>
                      <p>
                        <span className="text-slate-400">Place of Supply:</span>{" "}
                        <span className="font-semibold text-slate-800">
                          {viewingInvoice.is_interstate
                            ? "Inter-State (IGST 18%)"
                            : `${viewingInvoice.supplier_snapshot?.state || "Intra-State"} (CGST 9% + SGST 9%)`}
                        </span>
                      </p>
                      <p>
                        <span className="text-slate-400">Client GSTIN:</span>{" "}
                        {viewingInvoice.client_snapshot?.gstin || "Unregistered / Consumer"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-wider">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Description of Deliverables / Service</th>
                        <th className="py-2.5 px-3">SAC</th>
                        <th className="py-2.5 px-3 text-right">Taxable Value</th>
                        <th className="py-2.5 px-3 text-right">GST Rate</th>
                        <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      <tr>
                        <td className="py-3 px-3 font-mono text-slate-400">01</td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-900">
                            Digital Sponsorship & Creator Content Deliverables
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {viewingInvoice.deals?.deliverables &&
                            Array.isArray(viewingInvoice.deals.deliverables) &&
                            viewingInvoice.deals.deliverables.length > 0
                              ? viewingInvoice.deals.deliverables
                                  .map(
                                    (d: any) =>
                                      `${d.quantity || 1}x ${String(d.format || "post").replace("_", " ")}`
                                  )
                                  .join(", ")
                              : "1x Dedicated Campaign Deliverables"}
                          </p>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">998365</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                          ₹{((viewingInvoice.taxable_paise || 0) / 100).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">
                          {viewingInvoice.is_interstate ? "IGST 18%" : "CGST 9% + SGST 9%"}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-slate-900">
                          ₹{((viewingInvoice.total_paise || 0) / 100).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Calculation Summary Box */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Amount Chargeable (in words)
                    </p>
                    <p className="text-xs font-bold text-slate-900 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {numberToIndianWords(Math.round((viewingInvoice.total_paise || 0) / 100))}
                    </p>
                    <div className="text-[10px] text-slate-500 space-y-0.5 pt-1">
                      <p>• Reverse Charge Mechanism (RCM): Direct / Forward Charge basis.</p>
                      <p>• Sequential financial year invoice numbering: Section 31 CGST Act 2017.</p>
                    </div>
                  </div>

                  <div className="w-full sm:w-72 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Taxable Value:</span>
                      <span className="font-mono font-semibold">
                        ₹{((viewingInvoice.taxable_paise || 0) / 100).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {viewingInvoice.is_interstate ? (
                      <div className="flex justify-between text-slate-600">
                        <span>IGST (18%):</span>
                        <span className="font-mono font-semibold">
                          ₹{((viewingInvoice.igst_paise || 0) / 100).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between text-slate-600">
                          <span>CGST (9%):</span>
                          <span className="font-mono font-semibold">
                            ₹{((viewingInvoice.cgst_paise || 0) / 100).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>SGST (9%):</span>
                          <span className="font-mono font-semibold">
                            ₹{((viewingInvoice.sgst_paise || 0) / 100).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                      <span>Total Invoice Amount:</span>
                      <span className="font-mono text-emerald-700">
                        ₹{((viewingInvoice.total_paise || 0) / 100).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment & Signatory Block */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    {invoiceQrUrl ? (
                      <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                        <img
                          src={invoiceQrUrl}
                          alt="UPI Settlement QR Code"
                          className="w-24 h-24 rounded-sm"
                        />
                      </div>
                    ) : null}
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-slate-900">Instant UPI Payment</p>
                      <p className="font-mono text-[11px] text-indigo-700 font-semibold break-all select-all">
                        {viewingInvoice.supplier_snapshot?.upiVpa || "Direct Creator UPI VPA"}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Scan with Google Pay, PhonePe, Paytm, or BHIM.
                      </p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right space-y-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      For & On Behalf of Creator
                    </p>
                    <div className="h-10"></div>
                    <p className="font-bold text-xs text-slate-800 border-t border-slate-300 pt-1 px-4">
                      {viewingInvoice.supplier_snapshot?.displayName || "Authorized Signatory"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer (Hidden on print) */}
              <div className="no-print bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
                <span className="text-[11px] text-slate-500">
                  Click &ldquo;Print / Save PDF&rdquo; to download an official GST tax invoice receipt.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (viewingInvoice.upi_link) {
                        navigator.clipboard.writeText(viewingInvoice.upi_link);
                        alert("UPI Payment link copied!");
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Copy UPI Link
                  </button>
                  <button
                    onClick={() => setViewingInvoice(null)}
                    className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Standalone UPI QR Modal */}
        {activeUpiModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 text-center">
              <h3 className="font-extrabold text-base text-slate-900">
                UPI Payment Collection
              </h3>
              <p className="text-xs text-slate-500">
                Invoice {activeUpiModal.invoice_number} • ₹
                {((activeUpiModal.total_paise || 0) / 100).toLocaleString("en-IN")}
              </p>
              {qrDataUrl ? (
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <img src={qrDataUrl} alt="UPI Payment QR Code" className="w-48 h-48 rounded-xl shadow-xs" />
                  <span className="text-[10px] text-slate-500 font-semibold mt-2">
                    Scan with PhonePe, Google Pay, or Paytm
                  </span>
                </div>
              ) : null}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 inline-block font-mono text-[10px] text-slate-700 break-all w-full select-all">
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
