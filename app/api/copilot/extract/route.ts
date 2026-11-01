import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { tokenizePII, detokenizePII } from "@/lib/mask";
import { evaluateScamRisk } from "@/lib/scam";
import { parseIndianAmountToPaise } from "@/lib/currency";
import { extractDealFromText } from "@/backend/services/llm.service";
import {
  slugifyBrandName,
  getBenchmarkMedians,
  getBrandLedgerStats,
} from "@/backend/services/deal.service";
import { computeRadar } from "@/lib/radar";
import { computeLadder } from "@/lib/ladder";
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
        { success: false, error: { code: "UNAUTHORIZED", message: "Please sign in to extract deals." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { raw_text, channel = "whatsapp" } = body;

    if (!raw_text || typeof raw_text !== "string" || !raw_text.trim()) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "raw_text is required." } },
        { status: 400 }
      );
    }

    // 1. Client & Server PII Masking: protect creator & brand contact details before LLM transmission
    const { maskedText, tokenMap } = tokenizePII(raw_text);

    // 2. Rule-based Scam Detection (pay-to-collab, lookalike domains, prompt injection)
    const scamResult = evaluateScamRisk({ rawText: raw_text });

    // 3. Gemini Structured Extraction
    const extracted = await extractDealFromText(maskedText, user.id, supabase);

    // 4. Detokenize PII for authenticated creator view
    const restoredBrandName = detokenizePII(extracted.brand_name || "Unknown Brand", tokenMap);
    const feePaise = extracted.fee_inr ? parseIndianAmountToPaise(extracted.fee_inr) : null;
    const brandKey = slugifyBrandName(restoredBrandName);

    // 5. Fetch creator profile for personalized benchmark comparisons
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const profile = profileData as any;
    const creatorNiche = profile?.niche || extracted.category || "other";
    const creatorBand = profile?.follower_band || "nano_10k_50k";
    const minFeePaise = profile?.min_fee_paise || 0;

    // 6. Fetch benchmark rates for this creator segment
    const benchmarkMedians = await getBenchmarkMedians(supabase, creatorNiche, creatorBand);

    // 7. Fetch brand track record (Personal Brand Ledger)
    const brandStats = await getBrandLedgerStats(supabase, user.id, brandKey);

    // 8. Compute Money Leak Radar
    const radar = computeRadar({
      deliverables: extracted.deliverables,
      benchmarkMedians,
      offeredFeePaise: feePaise || 0,
      usageRights: extracted.usage_rights,
      paymentDays: extracted.payment_terms?.days,
      exclusivityDays: extracted.exclusivity?.days,
      avgDaysLate: brandStats.avgDaysLate,
    });

    // 9. Compute Walk-away Ladder
    const ladder = computeLadder(radar, minFeePaise);

    // 10. Persist deal in Supabase
    const { data: deal, error: dealInsertError } = await (supabase.from("deals") as any)
      .insert({
        user_id: user.id,
        brand_name: restoredBrandName,
        brand_key: brandKey,
        brand_domain: extracted.brand_domain || null,
        category: extracted.category,
        channel: channel as any,
        deliverables: extracted.deliverables as Json,
        deadline: extracted.deadline || null,
        fee_paise: feePaise,
        usage_rights: extracted.usage_rights as Json,
        exclusivity: extracted.exclusivity as Json,
        payment_terms: extracted.payment_terms as Json,
        risky_quotes: extracted.risky_quotes as Json,
        scam_result: scamResult as unknown as Json,
        status: "new",
      })
      .select("*")
      .single();

    if (dealInsertError || !deal) {
      throw new Error(`Failed to save deal: ${dealInsertError?.message}`);
    }

    // 11. Write audit event
    await logAuditEvent(supabase, {
      userId: user.id,
      action: "DEAL_EXTRACTED",
      entity: "deal",
      entityId: deal.id,
      detail: { brandName: restoredBrandName, channel, feePaise },
    });

    return NextResponse.json({
      success: true,
      data: {
        deal,
        radar,
        ladder,
        brandStats,
      },
    });
  } catch (err: any) {
    console.error("Deal extraction API error:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "EXTRACTION_FAILED",
          message: err.message || "Failed to analyze deal terms.",
        },
      },
      { status: 500 }
    );
  }
}
