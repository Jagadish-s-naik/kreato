import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { createServiceClient } from "@/backend/supabase/service";
import { isGmailEnabled } from "@/backend/services/gmail.service";

export const dynamic = "force-dynamic";

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

    // Query gmail_connections with service client
    const serviceClient = createServiceClient();
    const { data: connection, error: queryErr } = await (serviceClient as any)
      .from("gmail_connections")
      .select("google_email, scope, status, connected_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (queryErr) {
      console.error("Gmail status query error:", queryErr);
    }

    const isConnected = Boolean(connection && connection.status === "active" && connection.google_email);

    if (!isConnected) {
      return NextResponse.json({
        success: true,
        data: {
          enabled: true,
          connected: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        enabled: true,
        connected: true,
        email: connection.google_email,
        scopes: connection.scope ? [connection.scope] : ["https://www.googleapis.com/auth/gmail.readonly"],
        connectedAt: connection.connected_at,
      },
    });
  } catch (err: any) {
    console.error("Gmail status error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to check Gmail status." } },
      { status: 500 }
    );
  }
}
