import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { logAuditEvent } from "@/backend/services/audit.service";
import { fetchChannelStats, YouTubeServiceError } from "@/backend/services/youtube.service";
import { YouTubeLinkSchema } from "@/lib/types";

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

    const body = await req.json().catch(() => ({}));
    const parseResult = YouTubeLinkSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid YouTube link payload.",
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { channelInput, updateProfileBand } = parseResult.data;
    if (!channelInput) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Channel input is required.",
          },
        },
        { status: 400 }
      );
    }

    const stats = await fetchChannelStats(channelInput);

    // Upsert into youtube_links
    const { error: linkError } = await (supabase as any).from("youtube_links").upsert(
      {
        user_id: user.id,
        channel_id: stats.channelId,
        channel_title: stats.title,
        channel_handle: stats.handle,
        subscriber_count: stats.subscriberCount,
        video_count: stats.videoCount,
        view_count: stats.viewCount,
        verified_band: stats.suggestedBand,
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (linkError) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: linkError.message } },
        { status: 500 }
      );
    }

    // Optionally update user's profile band
    if (updateProfileBand && stats.suggestedBand) {
      await (supabase as any)
        .from("profiles")
        .update({
          youtube_verified_band: stats.suggestedBand,
          follower_band: stats.suggestedBand,
        })
        .eq("id", user.id);
    } else if (stats.suggestedBand) {
      await (supabase as any)
        .from("profiles")
        .update({
          youtube_verified_band: stats.suggestedBand,
        })
        .eq("id", user.id);
    }

    await logAuditEvent(supabase, {
      userId: user.id,
      action: "PROFILE_UPDATED",
      entity: "profile",
      entityId: user.id,
      detail: {
        youtubeLinked: true,
        channelId: stats.channelId,
        verifiedBand: stats.suggestedBand,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        linked: true,
        stats,
        updatedProfileBand: Boolean(updateProfileBand && stats.suggestedBand),
      },
    });
  } catch (err: any) {
    if (err instanceof YouTubeServiceError) {
      return NextResponse.json(
        { success: false, error: { code: err.code, message: err.message } },
        { status: err.code === "MISSING_API_KEY" ? 503 : err.code === "CHANNEL_NOT_FOUND" ? 404 : 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to link YouTube channel." } },
      { status: 500 }
    );
  }
}
