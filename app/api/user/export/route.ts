import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { createServiceClient } from "@/backend/supabase/service";
import { logAuditEvent } from "@/backend/services/audit.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
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

    // 1. Gather all user records across all tables
    const [
      { data: profile },
      { data: deals },
      { data: drafts },
      { data: memos },
      { data: invoices },
      { data: payments },
      { data: auditLogs },
      { data: youtubeLink },
      { data: gmailConn },
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("deals").select("*").eq("user_id", user.id),
      supabase.from("drafts").select("*").eq("user_id", user.id),
      supabase.from("memos").select("*").eq("user_id", user.id),
      supabase.from("invoices").select("*").eq("user_id", user.id),
      supabase.from("payments").select("*").eq("user_id", user.id),
      supabase.from("audit_log").select("*").eq("user_id", user.id),
      (supabase as any).from("youtube_links").select("*").eq("user_id", user.id).maybeSingle(),
      (serviceClient as any).from("gmail_connections").select("email, scopes, created_at, updated_at").eq("user_id", user.id).maybeSingle(),
    ]);

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
      },
      profile: profile || null,
      deals: deals || [],
      drafts: drafts || [],
      memos: memos || [],
      invoices: invoices || [],
      payments: payments || [],
      auditLogs: auditLogs || [],
      youtubeLink: youtubeLink || null,
      gmailConnection: gmailConn
        ? {
            connected: true,
            email: gmailConn.email,
            scopes: gmailConn.scopes,
            connectedAt: gmailConn.created_at,
          }
        : null,
    };

    await logAuditEvent(supabase, {
      userId: user.id,
      action: "DATA_EXPORTED",
      entity: "user",
      entityId: user.id,
    });

    const jsonString = JSON.stringify(exportPayload, null, 2);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="kreato-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (err: any) {
    console.error("Data export error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to export user data." } },
      { status: 500 }
    );
  }
}

