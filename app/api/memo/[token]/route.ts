import { NextRequest, NextResponse } from "next/server";
import { verifyMemoToken } from "@/backend/services/memo.service";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Token is required." } },
        { status: 400 }
      );
    }

    const verification = await verifyMemoToken(token);

    if (!verification.memo) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Deal Memo not found or invalid acceptance token.",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        isValid: verification.valid,
        isExpired: verification.isExpired,
        isAlreadyAccepted: verification.isAlreadyAccepted,
        acceptedAt: verification.memo.accepted_at,
        acceptedByName: verification.memo.accepted_by_name,
        expiresAt: verification.memo.expires_at,
        content: verification.memo.content,
        deal: verification.deal,
        creator: verification.creatorProfile,
      },
    });
  } catch (err: any) {
    console.error("Public memo GET error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Failed to load memo." } },
      { status: 500 }
    );
  }
}

