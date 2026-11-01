import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { createDealInvoice } from "@/backend/services/invoice.service";

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

    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*, deals(brand_name, status)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: invoices || [],
    });
  } catch (err: any) {
    console.error("Invoices GET error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to fetch invoices." } },
      { status: 500 }
    );
  }
}

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
    const { deal_id, client_state = "Delhi", client_snapshot = {} } = body;

    if (!deal_id) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "deal_id is required." } },
        { status: 400 }
      );
    }

    const invoice = await createDealInvoice({
      supabase,
      userId: user.id,
      dealId: deal_id,
      clientState: client_state,
      clientSnapshot: {
        brandName: client_snapshot.brandName || "Brand Client",
        ...client_snapshot,
      },
    });

    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (err: any) {
    console.error("Invoice generation POST error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INVOICE_FAILED", message: err.message || "Failed to generate invoice." } },
      { status: 500 }
    );
  }
}

