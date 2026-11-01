import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { fetchChannelStats, YouTubeServiceError } from "@/backend/services/youtube.service";

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
    const channelInput = searchParams.get("channel");

    if (!channelInput) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Query parameter 'channel' is required." } },
        { status: 400 }
      );
    }

    const stats = await fetchChannelStats(channelInput);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (err: any) {
    if (err instanceof YouTubeServiceError) {
      return NextResponse.json(
        { success: false, error: { code: err.code, message: err.message } },
        { status: err.code === "MISSING_API_KEY" ? 503 : err.code === "CHANNEL_NOT_FOUND" ? 404 : 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to fetch YouTube stats." } },
      { status: 500 }
    );
  }
}

