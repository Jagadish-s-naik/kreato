import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { createServiceClient } from "@/backend/supabase/service";
import { isGmailEnabled } from "@/backend/services/gmail.service";

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

    // Query gmail_connections with service client (zero client RLS policy)
    const serviceClient = createServiceClient();
    const { data: connection } = await (serviceClient as any)
      .from("gmail_connections")
      .select("email, scopes, created_at, updated_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!connection) {
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
        email: connection.email,
        scopes: connection.scopes,
        connectedAt: connection.created_at,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to check Gmail status." } },
      { status: 500 }
    );
  }
}

