import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { createDealMemo } from "@/backend/services/memo.service";

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
    const { deal_id, content = {} } = body;

    if (!deal_id) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "deal_id is required." } },
        { status: 400 }
      );
    }

    // Fetch deal
    const { data: dealData, error: dealError } = await supabase
      .from("deals")
      .select("*")
      .eq("id", deal_id)
      .eq("user_id", user.id)
      .single();

    if (dealError || !dealData) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Deal not found." } },
        { status: 404 }
      );
    }

    const deal = dealData as any;

    const memoContent = {
      brandName: deal.brand_name,
      deliverables: deal.deliverables,
      feePaise: deal.fee_paise,
      usageRights: deal.usage_rights,
      paymentTerms: deal.payment_terms,
      exclusivity: deal.exclusivity,
      deadline: deal.deadline,
      disclaimer: "Summary of agreed terms in chat. Not a legal contract.",
      ...content,
    };

    const memoResult = await createDealMemo({
      supabase,
      userId: user.id,
      dealId: deal_id,
      memoContent,
    });

    return NextResponse.json({
      success: true,
      data: memoResult,
    });
  } catch (err: any) {
    console.error("Memo creation error:", err);
    return NextResponse.json(
      { success: false, error: { code: "MEMO_FAILED", message: err.message || "Failed to create Deal Memo." } },
      { status: 500 }
    );
  }
}
