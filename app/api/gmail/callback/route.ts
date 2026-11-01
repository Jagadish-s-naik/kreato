import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { createServiceClient } from "@/backend/supabase/service";
import { logAuditEvent } from "@/backend/services/audit.service";
import {
  isGmailEnabled,
  exchangeCodeForTokens,
  GmailServiceError,
} from "@/backend/services/gmail.service";
import { encryptForDb } from "@/lib/gmail/crypto";

export async function GET(req: NextRequest) {
  if (!isGmailEnabled()) {
    return NextResponse.json(
      { success: false, error: { code: "FEATURE_DISABLED", message: "Gmail import is disabled." } },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = req.nextUrl.origin;

  if (error) {
    return NextResponse.redirect(`${baseUrl}/inbox?tab=gmail&error=${encodeURIComponent(error)}`);
  }

  const stateCookie = req.cookies.get("gmail_oauth_state")?.value;
  const verifierCookie = req.cookies.get("gmail_oauth_verifier")?.value;

  if (!state || !stateCookie || state !== stateCookie || !verifierCookie || !code) {
    return NextResponse.redirect(`${baseUrl}/inbox?tab=gmail&error=invalid_oauth_state`);
  }

  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(`${baseUrl}/login?redirect=/inbox`);
    }

    const tokenData = await exchangeCodeForTokens(code, verifierCookie);
    const serviceClient = createServiceClient();

    // Encrypt refresh token if present
    let cipherText = "";
    let iv = "";
    let authTag = "";

    if (tokenData.refreshToken) {
      const storage = encryptForDb(tokenData.refreshToken);
      cipherText = storage.cipherText;
      iv = storage.iv;
      authTag = storage.authTag;
    } else {
      // Preserve existing refresh token if Google didn't re-issue
      const { data: existingConn } = await (serviceClient as any)
        .from("gmail_connections")
        .select("encrypted_refresh_token, iv, auth_tag")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingConn?.encrypted_refresh_token) {
        cipherText = existingConn.encrypted_refresh_token;
        iv = existingConn.iv;
        authTag = existingConn.auth_tag;
      }
    }

    let upsertError: any = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await (serviceClient as any).from("gmail_connections").upsert(
          {
            user_id: user.id,
            google_email: tokenData.emailAddress,
            encrypted_refresh_token: cipherText,
            iv,
            auth_tag: authTag,
            scope: "https://www.googleapis.com/auth/gmail.readonly",
            status: "active",
            connected_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
        upsertError = res.error;
        if (!upsertError) break;
      } catch (e: any) {
        upsertError = e;
      }
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 600 * attempt));
      }
    }

    if (upsertError) {
      console.error("Gmail connection upsert error after 3 attempts:", upsertError);
      return NextResponse.redirect(`${baseUrl}/inbox?tab=gmail&error=db_error`);
    }

    await logAuditEvent(supabase, {
      userId: user.id,
      action: "PROFILE_UPDATED",
      entity: "profile",
      entityId: user.id,
      detail: { gmailConnected: true, email: tokenData.emailAddress },
    });

    const response = NextResponse.redirect(`${baseUrl}/inbox?tab=gmail&status=connected`);
    response.cookies.delete("gmail_oauth_state");
    response.cookies.delete("gmail_oauth_verifier");

    return response;
  } catch (err: any) {
    console.error("Gmail OAuth callback error:", err);
    return NextResponse.redirect(
      `${baseUrl}/inbox?tab=gmail&error=${encodeURIComponent(err.message || "connection_failed")}`
    );
  }
}
