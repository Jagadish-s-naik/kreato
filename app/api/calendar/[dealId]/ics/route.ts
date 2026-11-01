import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { logAuditEvent } from "@/backend/services/audit.service";
import { generateDealCalendarICS, CalendarDealData } from "@/lib/calendar/ics";

export async function GET(
  req: NextRequest,
  { params }: { params: { dealId: string } }
) {
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

    const { dealId } = params;

    // Fetch deal
    const { data: rawDeal, error: dealError } = await supabase
      .from("deals")
      .select("*")
      .eq("id", dealId)
      .eq("user_id", user.id)
      .single();

    if (dealError || !rawDeal) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Deal not found or access denied." } },
        { status: 404 }
      );
    }

    const deal = rawDeal as any;

    // Optional invoice and profile lookup for invoice number and upi
    const [{ data: rawInvoice }, { data: rawProfile }] = await Promise.all([
      supabase.from("invoices").select("invoice_number, due_date").eq("deal_id", dealId).maybeSingle(),
      supabase.from("profiles").select("upi_id").eq("id", user.id).maybeSingle(),
    ]);

    const invoice = rawInvoice as any;
    const profile = rawProfile as any;

    // Format deliverables summary
    let deliverablesSummary = "Deliverables";
    if (Array.isArray(deal.deliverables) && deal.deliverables.length > 0) {
      deliverablesSummary = deal.deliverables
        .map((d: any) => `${d.count || d.quantity || 1} ${d.type || "Deliverable"}`)
        .join(", ");
    }

    // Determine payment due date: invoice due_date takes precedence, otherwise calculate if payment_terms_days is present
    let paymentDueDate: string | null = null;
    if (invoice?.due_date) {
      paymentDueDate = invoice.due_date;
    } else if (deal.payment_terms_days && deal.delivery_date) {
      const deliveryDt = new Date(deal.delivery_date);
      const dueDt = new Date(deliveryDt.getTime() + deal.payment_terms_days * 86400000);
      paymentDueDate = dueDt.toISOString().slice(0, 10);
    }

    const calendarData: CalendarDealData = {
      id: deal.id,
      brandName: deal.brand_name,
      category: deal.category,
      deliverablesSummary,
      agreedFeePaise: deal.agreed_fee_paise || deal.offered_fee_paise,
      status: deal.status,
      deliveryDate: deal.delivery_date,
      exclusivityDays: deal.exclusivity_days,
      exclusivityStartDate: deal.delivery_date,
      paymentDueDate,
      invoiceNumber: invoice?.invoice_number || null,
      upiId: profile?.upi_id || null,
    };

    const appDomain = process.env.APP_DOMAIN || "kreato.in";
    const icsContent = generateDealCalendarICS(calendarData, appDomain);

    await logAuditEvent(supabase, {
      userId: user.id,
      action: "DEAL_UPDATED",
      entity: "deal",
      entityId: deal.id,
      detail: { calendarExported: true, brandName: deal.brand_name },
    });

    const brandSlug = deal.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "deal";
    const filename = `deal-${brandSlug}-${deal.id.slice(0, 8)}.ics`;

    return new Response(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to generate calendar." } },
      { status: 500 }
    );
  }
}
