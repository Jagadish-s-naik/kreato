import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { logAuditEvent } from "@/backend/services/audit.service";

async function handleUnlink(req: NextRequest) {
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

    // Delete record from youtube_links
    await (supabase as any).from("youtube_links").delete().eq("user_id", user.id);

    // Clear verified band on profile
    await (supabase as any)
      .from("profiles")
      .update({
        youtube_verified_band: null,
      })
      .eq("id", user.id);

    await logAuditEvent(supabase, {
      userId: user.id,
      action: "PROFILE_UPDATED",
      entity: "profile",
      entityId: user.id,
      detail: { youtubeUnlinked: true },
    });

    return NextResponse.json({
      success: true,
      data: { unlinked: true },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to unlink YouTube channel." } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return handleUnlink(req);
}

export async function DELETE(req: NextRequest) {
  return handleUnlink(req);
}
