import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { createServiceClient } from "@/backend/supabase/service";
import { logAuditEvent } from "@/backend/services/audit.service";
import { revokeGoogleToken } from "@/backend/services/gmail.service";
import { decryptToken } from "@/lib/gmail/crypto";

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
    const { confirm_text } = body;

    if (confirm_text !== "DELETE MY ACCOUNT") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: 'Please type "DELETE MY ACCOUNT" to confirm complete account deletion.',
          },
        },
        { status: 400 }
      );
    }

    const serviceClient = createServiceClient();

    // 1. Revoke Google OAuth token if Gmail connection exists
    try {
      const { data: conn } = await (serviceClient as any)
        .from("gmail_connections")
        .select("encrypted_refresh_token, encrypted_access_token")
        .eq("user_id", user.id)
        .maybeSingle();

      if (conn?.encrypted_refresh_token) {
        await revokeGoogleToken(decryptToken(conn.encrypted_refresh_token));
      } else if (conn?.encrypted_access_token) {
        await revokeGoogleToken(decryptToken(conn.encrypted_access_token));
      }
    } catch {
      // Best-effort token revocation
    }

    // 2. Delete YouTube and Gmail rows
    await Promise.all([
      (serviceClient as any).from("youtube_links").delete().eq("user_id", user.id),
      (serviceClient as any).from("gmail_connections").delete().eq("user_id", user.id),
    ]);

    // 3. Log audit event
    await logAuditEvent(supabase, {
      userId: user.id,
      action: "ACCOUNT_DELETED",
      entity: "user",
      entityId: user.id,
    });

    // 4. Delete profile (which cascades deals, memos, invoices, payments, drafts)
    await serviceClient.from("profiles").delete().eq("id", user.id);

    // 5. Delete user from auth
    await serviceClient.auth.admin.deleteUser(user.id);

    return NextResponse.json({
      success: true,
      message: "Your account and all associated data have been permanently deleted.",
    });
  } catch (err: any) {
    console.error("User deletion error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to delete account." } },
      { status: 500 }
    );
  }
}

