import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { createServiceClient } from "@/backend/supabase/service";
import {
  isGmailEnabled,
  getSanitizedEmailBody,
  refreshAccessToken,
  GmailServiceError,
} from "@/backend/services/gmail.service";
import { decryptToken, decryptFromDb } from "@/lib/gmail/crypto";
import { tokenizePII, detokenizePII } from "@/lib/mask";
import { evaluateScamRisk } from "@/lib/scam";
import { parseIndianAmountToPaise } from "@/lib/currency";
import { extractDealFromText } from "@/backend/services/llm.service";
import { slugifyBrandName } from "@/backend/services/deal.service";
import { logAuditEvent } from "@/backend/services/audit.service";
import { Json } from "@/backend/supabase/database.types";

export async function POST(req: NextRequest) {
  if (!isGmailEnabled()) {
    return NextResponse.json(
      { success: false, error: { code: "FEATURE_DISABLED", message: "Gmail import is disabled." } },
      { status: 404 }
    );
  }

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

    const body = await req.json().catch(() => ({}));

    // Support both { message_ids: [...] } and { messages: [{ message_id: ... }] }
    let rawIds: string[] = [];
    if (Array.isArray(body.message_ids)) {
      rawIds = body.message_ids;
    } else if (Array.isArray(body.messages)) {
      rawIds = body.messages.map((m: any) => m.message_id || m.id).filter(Boolean);
    }

    if (rawIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "No message IDs provided for import.",
          },
        },
        { status: 400 }
      );
    }

    // Get active Gmail connection
    const serviceClient = createServiceClient();
    const { data: connection } = await (serviceClient as any)
      .from("gmail_connections")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!connection || !connection.encrypted_refresh_token || connection.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "GMAIL_NOT_CONNECTED", message: "No active Gmail connection found for this account." },
        },
        { status: 400 }
      );
    }

    // Decrypt refresh token
    let rawRefreshToken: string;
    if (connection.iv && connection.auth_tag) {
      rawRefreshToken = decryptFromDb(connection.encrypted_refresh_token, connection.iv, connection.auth_tag);
    } else {
      rawRefreshToken = decryptToken(connection.encrypted_refresh_token);
    }

    const refreshed = await refreshAccessToken(rawRefreshToken);
    const accessToken = refreshed.accessToken;

    const importedDeals: any[] = [];
    const skippedMessages: Array<{ messageId: string; reason: string }> = [];

    // Query existing deal source_refs to prevent duplicates
    const { data: existingDeals } = await supabase
      .from("deals")
      .select("source_ref")
      .eq("user_id", user.id)
      .not("source_ref", "is", null);

    const existingRefs = new Set((existingDeals || []).map((d: any) => d.source_ref));

    for (const messageId of rawIds.slice(0, 20)) {
      const sourceRef = `gmail:${messageId}`;

      if (existingRefs.has(sourceRef)) {
        skippedMessages.push({ messageId, reason: "already_imported" });
        continue;
      }

      try {
        const rawBodyText = await getSanitizedEmailBody(accessToken, messageId);
        if (!rawBodyText || rawBodyText.trim().length < 10) {
          skippedMessages.push({ messageId, reason: "empty_or_too_short" });
          continue;
        }

        // PII Masking
        const { maskedText, tokenMap } = tokenizePII(rawBodyText);
        const scamResult = evaluateScamRisk({ rawText: rawBodyText });

        // Deal term extraction (with automatic deterministic fallback if LLM is rate-limited)
        const extracted = await extractDealFromText(maskedText, user.id, supabase);

        const restoredBrandName = detokenizePII(extracted.brand_name || "Brand Partner", tokenMap);
        const feePaise = extracted.fee_inr ? parseIndianAmountToPaise(extracted.fee_inr) : 2500000;
        const brandKey = slugifyBrandName(restoredBrandName);

        const { data: deal, error: dealInsertError } = await (supabase.from("deals") as any)
          .insert({
            user_id: user.id,
            brand_name: restoredBrandName,
            brand_key: brandKey,
            brand_domain: extracted.brand_domain || null,
            category: extracted.category,
            channel: "email",
            source_ref: sourceRef,
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
          skippedMessages.push({ messageId, reason: "insert_failed" });
        } else {
          importedDeals.push(deal);
          existingRefs.add(sourceRef);
        }
      } catch (err: any) {
        skippedMessages.push({ messageId, reason: err.message || "processing_error" });
      }
    }

    if (importedDeals.length > 0) {
      await logAuditEvent(supabase, {
        userId: user.id,
        action: "DEAL_CREATED",
        entity: "deal",
        entityId: importedDeals[0].id,
        detail: { count: importedDeals.length, source: "gmail_batch" },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        imported: importedDeals.length,
        skipped: skippedMessages.length,
        deals: importedDeals,
        skipped_details: skippedMessages,
      },
    });
  } catch (err: any) {
    if (err instanceof GmailServiceError) {
      return NextResponse.json(
        { success: false, error: { code: err.code, message: err.message } },
        { status: err.code === "UNAUTHORIZED_TOKEN" ? 401 : 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to batch import Gmail messages." } },
      { status: 500 }
    );
  }
}
