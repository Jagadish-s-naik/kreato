import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/backend/supabase/server";
import {
  isGmailEnabled,
  generatePKCE,
  buildGmailAuthUrl,
  GmailServiceError,
} from "@/backend/services/gmail.service";

export async function GET(req: NextRequest) {
  if (!isGmailEnabled()) {
    return NextResponse.json(
      { success: false, error: { code: "FEATURE_DISABLED", message: "Gmail import is disabled." } },
      { status: 404 }
    );
  }

  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      // If browser navigation or user clicked "Connect Gmail", always redirect to login
      const isApiFetch = req.headers.get("content-type") === "application/json" && !req.headers.get("accept")?.includes("text/html");
      if (!isApiFetch) {
        return NextResponse.redirect(new URL("/login?redirect=/settings", req.url));
      }
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const state = crypto.randomBytes(24).toString("hex");
    const { verifier, challenge } = generatePKCE();
    const authUrl = buildGmailAuthUrl(state, challenge);

    const response = NextResponse.redirect(authUrl);

    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set("gmail_oauth_state", state, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    response.cookies.set("gmail_oauth_verifier", verifier, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    return response;
  } catch (err: any) {
    if (err instanceof GmailServiceError) {
      return NextResponse.json(
        { success: false, error: { code: err.code, message: err.message } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to initiate Gmail connect flow." } },
      { status: 500 }
    );
  }
}
