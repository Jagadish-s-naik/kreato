import { NextRequest, NextResponse } from "next/server";
import { acceptDealMemo } from "@/backend/services/memo.service";

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const body = await req.json();
    const { signatory_name } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Token is required." } },
        { status: 400 }
      );
    }

    if (!signatory_name || typeof signatory_name !== "string" || signatory_name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "BAD_REQUEST", message: "Valid signatory name is required to accept terms." },
        },
        { status: 400 }
      );
    }

    const result = await acceptDealMemo(token, signatory_name);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error("Public memo accept error:", err);
    return NextResponse.json(
      {
        success: false,
        error: { code: "ACCEPT_FAILED", message: err.message || "Failed to accept Deal Memo." },
      },
      { status: 400 }
    );
  }
}

