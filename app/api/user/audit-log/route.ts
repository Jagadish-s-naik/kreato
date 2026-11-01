import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";

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

    const { data: logs, error } = await supabase
      .from("audit_log")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: logs || [],
    });
  } catch (err: any) {
    console.error("Audit log GET error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to fetch audit log." } },
      { status: 500 }
    );
  }
}

