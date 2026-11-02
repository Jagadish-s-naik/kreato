import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { recordDealPayment } from "@/backend/services/invoice.service";

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
    let {
      deal_id,
      invoice_id,
      amount_paise,
      promised_days = 15,
      actual_days = 15,
    } = body;

    if ((!deal_id || !amount_paise) && invoice_id) {
      const { data: inv } = await (supabase.from("invoices") as any)
        .select("id, deal_id, total_paise")
        .eq("id", invoice_id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (inv) {
        if (!deal_id) deal_id = inv.deal_id;
        if (!amount_paise) amount_paise = inv.total_paise;
      }
    }

    if (!deal_id || !amount_paise) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "BAD_REQUEST", message: "deal_id and amount_paise are required." },
        },
        { status: 400 }
      );
    }

    const payment = await recordDealPayment({
      supabase,
      userId: user.id,
      dealId: deal_id,
      amountPaise: Number(amount_paise),
      promisedDays: Number(promised_days),
      actualDays: Number(actual_days),
    });

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (err: any) {
    console.error("Payment record error:", err);
    return NextResponse.json(
      { success: false, error: { code: "PAYMENT_FAILED", message: err.message || "Failed to record payment." } },
      { status: 500 }
    );
  }
}

