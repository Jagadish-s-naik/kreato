import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { createServiceClient } from "@/backend/supabase/service";
import {
  isGmailEnabled,
  getSanitizedEmailBody,
  refreshAccessToken,
  GmailServiceError,
} from "@/backend/services/gmail.service";
import { decryptToken, encryptToken } from "@/lib/gmail/crypto";
import { tokenizePII, detokenizePII } from "@/lib/mask";
import { evaluateScamRisk } from "@/lib/scam";
import { parseIndianAmountToPaise } from "@/lib/currency";
import { extractDealFromText } from "@/backend/services/llm.service";
import { slugifyBrandName } from "@/backend/services/deal.service";
import { logAuditEvent } from "@/backend/services/audit.service";
import { GmailImportRequestSchema } from "@/lib/types";
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
    const parseResult = GmailImportRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid Gmail import request.",
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { messages } = parseResult.data;

    // Get active Gmail connection
    const serviceClient = createServiceClient();
    const { data: connection } = await (serviceClient as any)
      .from("gmail_connections")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!connection) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "GMAIL_NOT_CONNECTED", message: "No active Gmail connection found for this account." },
        },
        { status: 400 }
      );
    }

    // Refresh token if needed
    let accessToken: string;
    const isExpired = new Date(connection.token_expires_at).getTime() <= Date.now() + 60000;

    if (isExpired && connection.encrypted_refresh_token) {
      const refreshed = await refreshAccessToken(connection.encrypted_refresh_token);
      accessToken = refreshed.accessToken;

      await (serviceClient as any)
        .from("gmail_connections")
        .update({
          encrypted_access_token: encryptToken(refreshed.accessToken),
          token_expires_at: new Date(Date.now() + refreshed.expiresIn * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    } else {
      accessToken = decryptToken(connection.encrypted_access_token);
    }

    const importedDeals: any[] = [];
    const skippedMessages: Array<{ messageId: string; reason: string }> = [];

    // Query existing deal source_refs to prevent duplicates
    const { data: existingDeals } = await supabase
      .from("deals")
      .select("source_ref")
      .eq("user_id", user.id)
      .not("source_ref", "is", null);

    const existingRefs = new Set((existingDeals || []).map((d: any) => d.source_ref));

    for (const item of messages) {
      const messageId = item.message_id;
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

        // Gemini extraction
        const extracted = await extractDealFromText(maskedText, user.id, supabase);

        const restoredBrandName = detokenizePII(extracted.brand_name || "Unknown Brand", tokenMap);
        const feePaise = extracted.fee_inr ? parseIndianAmountToPaise(extracted.fee_inr) : null;
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
          skippedMessages.push({ messageId, reason: dealInsertError?.message || "insert_failed" });
          continue;
        }

        existingRefs.add(sourceRef);

        await logAuditEvent(supabase, {
          userId: user.id,
          action: "DEAL_EXTRACTED",
          entity: "deal",
          entityId: deal.id,
          detail: { brandName: restoredBrandName, channel: "email", sourceRef },
        });

        importedDeals.push({
          dealId: deal.id,
          brandName: deal.brand_name,
          feePaise: deal.fee_paise,
          deliverables: deal.deliverables,
        });
      } catch (itemErr: any) {
        skippedMessages.push({ messageId, reason: itemErr.message || "extraction_error" });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        importedCount: importedDeals.length,
        skippedCount: skippedMessages.length,
        importedDeals,
        skippedMessages,
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
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to import Gmail messages." } },
      { status: 500 }
    );
  }
}

