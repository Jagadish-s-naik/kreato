import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { slugifyBrandName } from "@/backend/services/deal.service";
import { logAuditEvent } from "@/backend/services/audit.service";
import { Json } from "@/backend/supabase/database.types";

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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("deals")
      .select("*, memos(id, accepted_at), invoices(id, invoice_number, status, total_paise)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status as any);
    }

    const { data: deals, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: deals || [],
    });
  } catch (err: any) {
    console.error("Deals GET error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to fetch deals." } },
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
    const {
      brand_name,
      category = "other",
      channel = "whatsapp",
      deliverables = [],
      fee_paise = null,
      deadline = null,
      usage_rights = { type: "none", paid_ads_allowed: false },
      exclusivity = {},
      payment_terms = {},
    } = body;

    if (!brand_name) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "brand_name is required." } },
        { status: 400 }
      );
    }

    const brandKey = slugifyBrandName(brand_name);

    const { data: deal, error } = await (supabase
      .from("deals") as any)
      .insert({
        user_id: user.id,
        brand_name,
        brand_key: brandKey,
        category: category as any,
        channel: channel as any,
        deliverables: deliverables as Json,
        fee_paise,
        deadline,
        usage_rights: usage_rights as Json,
        exclusivity: exclusivity as Json,
        payment_terms: payment_terms as Json,
        status: "new",
      })
      .select("*")
      .single();

    if (error || !deal) {
      throw error || new Error("Failed to insert deal.");
    }

    await logAuditEvent(supabase, {
      userId: user.id,
      action: "DEAL_CREATED",
      entity: "deal",
      entityId: deal.id,
      detail: { brandName: brand_name, feePaise: fee_paise },
    });

    return NextResponse.json({
      success: true,
      data: deal,
    });
  } catch (err: any) {
    console.error("Deals POST error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to create deal." } },
      { status: 500 }
    );
  }
}
