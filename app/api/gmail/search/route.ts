import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { createServiceClient } from "@/backend/supabase/service";
import {
  isGmailEnabled,
  listGmailMessages,
  refreshAccessToken,
  GmailServiceError,
} from "@/backend/services/gmail.service";
import { decryptToken, decryptFromDb } from "@/lib/gmail/crypto";
import { GmailSearchQuerySchema } from "@/lib/types";

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const parsedQuery = GmailSearchQuerySchema.safeParse({
      q: searchParams.get("q") || undefined,
      max_results: searchParams.get("max_results") || undefined,
    });

    const searchQuery = parsedQuery.success ? parsedQuery.data.q : undefined;
    const maxResults = parsedQuery.success ? parsedQuery.data.max_results : 20;

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

    // Decrypt refresh token and obtain fresh access token
    let rawRefreshToken: string;
    if (connection.iv && connection.auth_tag) {
      rawRefreshToken = decryptFromDb(connection.encrypted_refresh_token, connection.iv, connection.auth_tag);
    } else {
      rawRefreshToken = decryptToken(connection.encrypted_refresh_token);
    }

    const refreshed = await refreshAccessToken(rawRefreshToken);
    const accessToken = refreshed.accessToken;

    const messages = await listGmailMessages(accessToken, searchQuery, maxResults);

    // Check already imported deals for this creator
    const { data: existingDeals } = await supabase
      .from("deals")
      .select("source_ref")
      .eq("user_id", user.id)
      .not("source_ref", "is", null);

    const importedRefs = new Set((existingDeals || []).map((d: any) => d.source_ref));

    const augmentedMessages = messages.map((msg: any) => ({
      ...msg,
      isAlreadyImported: importedRefs.has(`gmail:${msg.id}`),
    }));

    return NextResponse.json({
      success: true,
      data: augmentedMessages,
    });
  } catch (err: any) {
    if (err instanceof GmailServiceError) {
      return NextResponse.json(
        { success: false, error: { code: err.code, message: err.message } },
        { status: err.code === "UNAUTHORIZED_TOKEN" ? 401 : 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to search Gmail messages." } },
      { status: 500 }
    );
  }
}
