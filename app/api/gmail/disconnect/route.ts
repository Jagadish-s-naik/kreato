import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { createServiceClient } from "@/backend/supabase/service";
import { logAuditEvent } from "@/backend/services/audit.service";
import { isGmailEnabled, revokeGoogleToken } from "@/backend/services/gmail.service";
import { decryptToken } from "@/lib/gmail/crypto";

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

    const serviceClient = createServiceClient();
    const { data: connection } = await (serviceClient as any)
      .from("gmail_connections")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (connection) {
      // Best-effort token revocation
      try {
        if (connection.encrypted_refresh_token) {
          const refreshToken = decryptToken(connection.encrypted_refresh_token);
          await revokeGoogleToken(refreshToken);
        } else if (connection.encrypted_access_token) {
          const accessToken = decryptToken(connection.encrypted_access_token);
          await revokeGoogleToken(accessToken);
        }
      } catch (revokeErr) {
        console.warn("Failed to revoke Google token during disconnect:", revokeErr);
      }

      await (serviceClient as any).from("gmail_connections").delete().eq("user_id", user.id);
    }

    await logAuditEvent(supabase, {
      userId: user.id,
      action: "PROFILE_UPDATED",
      entity: "profile",
      entityId: user.id,
      detail: { gmailDisconnected: true },
    });

    return NextResponse.json({
      success: true,
      data: { disconnected: true },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to disconnect Gmail." } },
      { status: 500 }
    );
  }
}

