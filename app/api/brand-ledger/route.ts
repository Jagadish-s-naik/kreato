import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { getPersonalBrandLedger } from "@/backend/services/deal.service";

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

    const ledger = await getPersonalBrandLedger(supabase, user.id);

    return NextResponse.json({
      success: true,
      data: ledger,
    });
  } catch (err: any) {
    console.error("Brand Ledger GET error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to fetch brand ledger." } },
      { status: 500 }
    );
  }
}
