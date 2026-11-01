import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { draftCounterOffer } from "@/backend/services/llm.service";
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
      tier = "acceptable",
      language = "en",
      counter_fee_paise,
      deliverables_summary,
      usage_terms,
      payment_terms,
      exclusivity_terms,
    } = body;

    if (!deal_id) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "deal_id is required." } },
        { status: 400 }
      );
    }

    // 1. Fetch deal and creator profile
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

    const { data: profileData } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    const profile = profileData as any;
    const creatorName = profile?.display_name || "Creator";
    const brandName = deal.brand_name;
    const counterFeeINR = Math.round((counter_fee_paise || deal.fee_paise || 0) / 100);

    // 2. Draft message with Gemini
    const draft = await draftCounterOffer({
      creatorName,
      brandName,
      deliverablesSummary: deliverables_summary || "agreed deliverables",
      counterFeeINR,
      usageTerms: usage_terms || "strictly as specified",
      paymentTerms: payment_terms || "within 15 days",
      exclusivityTerms: exclusivity_terms || "no category exclusivity",
      tier: tier as any,
      language: language as any,
      userId: user.id,
      supabase,
    });

    // 3. Save draft record
    const { data: draftRecord, error: draftInsertError } = await (supabase
      .from("drafts") as any)
      .insert({
        user_id: user.id,
        deal_id,
        kind: "counter_offer",
        tier: tier as any,
        language,
        body: draft.body,
        numbers: {
          feeINR: counterFeeINR,
          counterFeePaise: counter_fee_paise || deal.fee_paise,
        } as Json,
        status: "draft",
      })
      .select("*")
      .single();

    if (draftInsertError) {
      console.error("Failed to store draft record:", draftInsertError);
    }

    // 4. Generate direct 1-click links
    const encodedBody = encodeURIComponent(draft.body);
    const waLink = `https://wa.me/?text=${encodedBody}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(draft.subject)}&body=${encodedBody}`;

    await logAuditEvent(supabase, {
      userId: user.id,
      action: "TIER_DRAFTED",
      entity: "draft",
      entityId: draftRecord?.id,
      detail: { dealId: deal_id, tier, language, counterFeeINR },
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
    console.error("Counter draft API error:", err);
    return NextResponse.json(
      { success: false, error: { code: "DRAFT_FAILED", message: err.message || "Drafting failed." } },
      { status: 500 }
    );
  }
}
