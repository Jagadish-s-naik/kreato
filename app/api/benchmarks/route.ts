import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(req.url);
    const niche = searchParams.get("niche");
    const followerBand = searchParams.get("follower_band");

    let query = supabase.from("benchmarks").select("*");

    if (niche) {
      query = query.eq("niche", niche as any);
    }
    if (followerBand) {
      query = query.eq("follower_band", followerBand as any);
    }

    const { data: benchmarks, error } = await query.order("niche").order("follower_band");

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: benchmarks || [],
    });
  } catch (err: any) {
    console.error("Benchmarks GET error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to load benchmarks." } },
      { status: 500 }
    );
  }
}

