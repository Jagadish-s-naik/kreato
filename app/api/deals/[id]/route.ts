import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import {
  getBenchmarkMedians,
  getBrandLedgerStats,
} from "@/backend/services/deal.service";
import { computeRadar } from "@/lib/radar";
import { computeLadder } from "@/lib/ladder";
import { logAuditEvent } from "@/backend/services/audit.service";
import { Json } from "@/backend/supabase/database.types";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    const { data: dealData, error } = await supabase
      .from("deals")
      .select("*, memos(*), invoices(*), payments(*), drafts(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !dealData) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Deal not found." } },
        { status: 404 }
      );
    }

    const deal = dealData as any;

    // Fetch creator profile & benchmarks for live Radar & Ladder calculation
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const profile = profileData as any;

    const creatorNiche = profile?.niche || deal.category || "other";
    const creatorBand = profile?.follower_band || "nano_10k_50k";
    const minFeePaise = profile?.min_fee_paise || 0;

    const benchmarkMedians = await getBenchmarkMedians(supabase, creatorNiche, creatorBand);
    const brandStats = await getBrandLedgerStats(supabase, user.id, deal.brand_key);

    const radar = computeRadar({
      deliverables: (deal.deliverables as any) || [],
      benchmarkMedians,
      offeredFeePaise: deal.fee_paise || 0,
      usageRights: deal.usage_rights as any,
      paymentDays: (deal.payment_terms as any)?.days,
      exclusivityDays: (deal.exclusivity as any)?.days,
      avgDaysLate: brandStats.avgDaysLate,
    });

    const ladder = computeLadder(radar, minFeePaise);

    return NextResponse.json({
      success: true,
      data: {
        deal,
        radar,
        ladder,
        brandStats,
      },
    });
  } catch (err: any) {
    console.error("Deal GET [id] error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to fetch deal." } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await req.json();

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.brand_name !== undefined) updatePayload.brand_name = body.brand_name;
    if (body.category !== undefined) updatePayload.category = body.category;
    if (body.deliverables !== undefined) updatePayload.deliverables = body.deliverables as Json;
    if (body.fee_paise !== undefined) updatePayload.fee_paise = body.fee_paise;
    if (body.deadline !== undefined) updatePayload.deadline = body.deadline;
    if (body.usage_rights !== undefined) updatePayload.usage_rights = body.usage_rights as Json;
    if (body.exclusivity !== undefined) updatePayload.exclusivity = body.exclusivity as Json;
    if (body.payment_terms !== undefined) updatePayload.payment_terms = body.payment_terms as Json;
    if (body.status !== undefined) updatePayload.status = body.status;

    const { data: updatedDeal, error } = await (supabase
      .from("deals") as any)
      .update(updatePayload)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error || !updatedDeal) {
      throw error || new Error("Failed to update deal.");
    }

    await logAuditEvent(supabase, {
      userId: user.id,
      action: "DEAL_UPDATED",
      entity: "deal",
      entityId: id,
      detail: updatePayload,
    });

    return NextResponse.json({
      success: true,
      data: updatedDeal,
    });
  } catch (err: any) {
    console.error("Deal PATCH [id] error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to update deal." } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    const { error } = await supabase
      .from("deals")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    await logAuditEvent(supabase, {
      userId: user.id,
      action: "DEAL_DELETED",
      entity: "deal",
      entityId: id,
    });

    return NextResponse.json({
      success: true,
      message: "Deal deleted successfully.",
    });
  } catch (err: any) {
    console.error("Deal DELETE [id] error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to delete deal." } },
      { status: 500 }
    );
  }
}
