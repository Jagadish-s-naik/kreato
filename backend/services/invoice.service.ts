import "server-only";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "../supabase/database.types";
import { calculateIndianFinancialYear, calculateDueDate } from "@/lib/dates";
import { generateInvoiceNumber, calculateGST } from "@/lib/gst";
import { buildUPIPaymentURI } from "@/lib/upi";
import { logAuditEvent } from "./audit.service";

export interface CreateInvoiceOptions {
  supabase: SupabaseClient<any, any, any>;
  userId: string;
  dealId: string;
  clientState?: string;
  clientSnapshot: {
    brandName: string;
    companyName?: string;
    gstin?: string;
    address?: string;
    contactEmail?: string;
  };
}

export async function createDealInvoice(options: CreateInvoiceOptions) {
  const { supabase, userId, dealId, clientState = "Delhi", clientSnapshot } = options;

  // 1. Fetch deal and creator profile
  const { data: deal, error: dealError } = await supabase
    .from("deals")
    .select("*")
    .eq("id", dealId)
    .eq("user_id", userId)
    .single();

  if (dealError || !deal) {
    throw new Error("Deal not found or access denied.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    throw new Error("Creator profile not found. Please complete profile setup in settings.");
  }

  // 2. Count existing invoices to generate sequential number
  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const lastInvoiceCount = count || 0;
  const issueDate = new Date();
  const fyInfo = calculateIndianFinancialYear(issueDate);
  const invoiceNumber = generateInvoiceNumber(lastInvoiceCount, fyInfo.label);

  // 3. Calculate credit terms and due date
  const paymentDays = (deal.payment_terms as any)?.days || 15;
  const dueDate = calculateDueDate(issueDate, paymentDays);

  // 4. Calculate GST & Grand Total
  const taxablePaise = deal.fee_paise || 0;
  const supplierState = profile.state || "Maharashtra";
  const gst = calculateGST(taxablePaise, supplierState, clientState);

  // 5. Generate dynamic UPI payment URI
  const upiLink = buildUPIPaymentURI({
    vpa: profile.upi_vpa,
    payeeName: profile.display_name,
    amountPaise: gst.grandTotalPaise,
    note: `Invoice ${invoiceNumber}`,
    transactionRef: invoiceNumber.replace(/[^A-Za-z0-9]/g, "-"),
  });

  const supplierSnapshot = {
    displayName: profile.display_name,
    state: profile.state,
    gstin: profile.gstin,
    upiVpa: profile.upi_vpa,
    panName: profile.pan_name,
  };

  const lineItems = [
    {
      description: `Creator Content Deliverables for ${deal.brand_name}`,
      deliverables: deal.deliverables,
      taxablePaise,
    },
  ];

  // 6. Insert invoice record
  const { data: invoice, error: invoiceInsertError } = await supabase
    .from("invoices")
    .insert({
      user_id: userId,
      deal_id: dealId,
      invoice_number: invoiceNumber,
      issue_date: issueDate.toISOString().split("T")[0],
      due_date: dueDate.toISOString().split("T")[0],
      supplier_snapshot: supplierSnapshot as Json,
      client_snapshot: clientSnapshot as Json,
      line_items: lineItems as Json,
      tax: gst as unknown as Json,
      total_paise: gst.grandTotalPaise,
      upi_link: upiLink,
      status: "issued",
    })
    .select("*")
    .single();

  if (invoiceInsertError || !invoice) {
    throw new Error(`Failed to create invoice: ${invoiceInsertError?.message}`);
  }

  // 7. Update deal status to 'invoiced'
  await supabase
    .from("deals")
    .update({ status: "invoiced", updated_at: new Date().toISOString() })
    .eq("id", dealId);

  // 8. Log audit trail
  await logAuditEvent(supabase, {
    userId,
    action: "INVOICE_GENERATED",
    entity: "invoice",
    entityId: invoice.id,
    detail: { dealId, invoiceNumber, totalPaise: gst.grandTotalPaise },
  });

  return invoice;
}

/**
 * Records invoice settlement / payment receipt.
 * Feeds settlement speed into Personal Brand Ledger.
 */
export async function recordDealPayment(options: {
  supabase: SupabaseClient<any, any, any>;
  userId: string;
  dealId: string;
  amountPaise: number;
  promisedDays: number;
  actualDays: number;
}) {
  const { supabase, userId, dealId, amountPaise, promisedDays, actualDays } = options;

  // 1. Insert payment record
  const { data: payment, error } = await supabase
    .from("payments")
    .insert({
      user_id: userId,
      deal_id: dealId,
      amount_paise: amountPaise,
      promised_days: promisedDays,
      actual_days: actualDays,
    })
    .select("*")
    .single();

  if (error || !payment) {
    throw new Error(`Failed to record payment: ${error?.message}`);
  }

  // 2. Update invoice status to 'paid'
  await supabase
    .from("invoices")
    .update({ status: "paid" })
    .eq("deal_id", dealId)
    .eq("user_id", userId);

  // 3. Update deal status to 'paid'
  await supabase
    .from("deals")
    .update({ status: "paid", updated_at: new Date().toISOString() })
    .eq("id", dealId)
    .eq("user_id", userId);

  // 4. Log audit trail
  await logAuditEvent(supabase, {
    userId,
    action: "PAYMENT_RECORDED",
    entity: "payment",
    entityId: payment.id,
    detail: { dealId, amountPaise, promisedDays, actualDays },
  });

  return payment;
}
