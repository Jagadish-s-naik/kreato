import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { logAuditEvent } from "@/backend/services/audit.service";

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

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: profile || null,
    });
  } catch (err: any) {
    console.error("Profile GET error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to load profile." } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
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

    const updateData: Record<string, any> = {};
    if (body.display_name !== undefined) updateData.display_name = body.display_name;
    if (body.niche !== undefined) updateData.niche = body.niche;
    if (body.follower_band !== undefined) updateData.follower_band = body.follower_band;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.gstin !== undefined) updateData.gstin = body.gstin;
    if (body.pan_name !== undefined) updateData.pan_name = body.pan_name;
    if (body.upi_vpa !== undefined) updateData.upi_vpa = body.upi_vpa;
    if (body.min_fee_paise !== undefined) updateData.min_fee_paise = body.min_fee_paise;
    if (body.sim_days_offset !== undefined) updateData.sim_days_offset = body.sim_days_offset;

    // Upsert profile
    const { data: updatedProfile, error } = await (supabase
      .from("profiles") as any)
      .upsert({
        id: user.id,
        upi_vpa: body.upi_vpa || "creator@upi",
        display_name: body.display_name || "Creator",
        ...updateData,
      })
      .select("*")
      .single();

    if (error || !updatedProfile) {
      throw error || new Error("Failed to update profile.");
    }

    await logAuditEvent(supabase, {
      userId: user.id,
      action: "PROFILE_UPDATED",
      entity: "profile",
      entityId: user.id,
      detail: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedProfile,
    });
  } catch (err: any) {
    console.error("Profile PATCH error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to update profile." } },
      { status: 500 }
    );
  }
}
