import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { draftPaymentReminder } from "@/backend/services/llm.service";
import { logAuditEvent } from "@/backend/services/audit.service";
import { Json } from "@/backend/supabase/database.types";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      deal_id,
      invoice_id,
      tone = "firm",
      language = "en",
      days_overdue = 14,
    } = body;

    let targetDealId = deal_id;
    let preloadedInvoice: any = null;

    if (!targetDealId && invoice_id) {
      const { data: inv } = await (supabase.from("invoices") as any)
        .select("*, deals(*)")
        .eq("id", invoice_id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (inv) {
        targetDealId = inv.deal_id;
        preloadedInvoice = inv;
      }
    }

    if (!targetDealId) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "deal_id or invoice_id is required." } },
        { status: 400 }
      );
    }

    // 1. Fetch deal, invoice and profile
    const { data: dealData } = await supabase
      .from("deals")
      .select("*, invoices(*)")
      .eq("id", targetDealId)
      .eq("user_id", user.id)
      .single();

    if (!dealData) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Deal not found." } },
        { status: 404 }
      );
    }

    const deal = dealData as any;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    const profile = profileData as any;
    const invoice = (deal as any).invoices?.[0];
    const invoiceNumber = invoice?.invoice_number || "DS/2026-27/001";
    const totalAmountINR = Math.round((invoice?.total_paise || deal.fee_paise || 0) / 100);
    const dueDate = invoice?.due_date || deal.deadline || "Agreed date";

    // 2. Draft reminder with Gemini
    const draft = await draftPaymentReminder({
      creatorName: profile?.display_name || "Creator",
      brandName: deal.brand_name,
      invoiceNumber,
      totalAmountINR,
      dueDate,
      daysOverdue: Number(days_overdue) || 14,
      tone: tone as any,
      language: language as any,
      userId: user.id,
      supabase,
    });

    // 3. Save draft record
    const { data: draftRecord } = await (supabase
      .from("drafts") as any)
      .insert({
        user_id: user.id,
        deal_id: targetDealId,
        kind: "reminder",
        language,
        body: draft.body,
        numbers: {
          invoiceNumber,
          totalAmountINR,
          daysOverdue: Number(days_overdue),
        } as Json,
        status: "draft",
      })
      .select("*")
      .single();

    const encodedBody = encodeURIComponent(draft.body);
    const waLink = `https://wa.me/?text=${encodedBody}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(draft.subject)}&body=${encodedBody}`;

    await logAuditEvent(supabase, {
      userId: user.id,
      action: "REMINDER_DRAFTED",
      entity: "draft",
      entityId: draftRecord?.id,
      detail: { dealId: targetDealId, tone, daysOverdue: Number(days_overdue) },
    });

    return NextResponse.json({
      success: true,
      data: {
        draft: draftRecord || { body: draft.body, subject: draft.subject },
        subject: draft.subject,
        body: draft.body,
        waLink,
        mailtoLink,
      },
    });
  } catch (err: any) {
    console.error("Reminder draft API error:", err);
    return NextResponse.json(
      { success: false, error: { code: "DRAFT_FAILED", message: err.message || "Drafting failed." } },
      { status: 500 }
    );
  }
}
