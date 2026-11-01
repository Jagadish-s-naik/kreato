import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { createServiceClient } from "@/backend/supabase/service";
import { logAuditEvent } from "@/backend/services/audit.service";
import {
  isGmailEnabled,
  exchangeCodeForTokens,
  GmailServiceError,
} from "@/backend/services/gmail.service";
import { encryptToken } from "@/lib/gmail/crypto";

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

    const encryptedAccessToken = encryptToken(tokenData.accessToken);
    const encryptedRefreshToken = tokenData.refreshToken ? encryptToken(tokenData.refreshToken) : null;

    const expiresAt = new Date(Date.now() + tokenData.expiresIn * 1000).toISOString();

    const serviceClient = createServiceClient();

    // Check if user already had a refresh token, preserve if new one wasn't returned
    let finalRefreshToken = encryptedRefreshToken;
    if (!finalRefreshToken) {
      const { data: existingConn } = await (serviceClient as any)
        .from("gmail_connections")
        .select("encrypted_refresh_token")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingConn?.encrypted_refresh_token) {
        finalRefreshToken = existingConn.encrypted_refresh_token;
      }
    }

    const { error: upsertError } = await (serviceClient as any).from("gmail_connections").upsert(
      {
        user_id: user.id,
        email: tokenData.emailAddress,
        encrypted_access_token: encryptedAccessToken,
        encrypted_refresh_token: finalRefreshToken,
        token_expires_at: expiresAt,
        scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (upsertError) {
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
    return NextResponse.redirect(
      `${baseUrl}/inbox?tab=gmail&error=${encodeURIComponent(err.message || "connection_failed")}`
    );
  }
}

