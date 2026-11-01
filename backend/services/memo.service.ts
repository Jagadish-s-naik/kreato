import "server-only";
import crypto from "crypto";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "../supabase/database.types";
import { createServiceClient } from "../supabase/service";
import { logAuditEvent } from "./audit.service";

export interface CreateMemoOptions {
  supabase: SupabaseClient<any, any, any>;
  userId: string;
  dealId: string;
  memoContent: Record<string, any>;
}

export interface CreateMemoResult {
  memoId: string;
  rawToken: string;
  acceptUrl: string;
  expiresAt: string;
}

/**
 * Creates a tamper-evident Deal Memo and generates a single-use 32-byte acceptance token.
 */
export async function createDealMemo(
  options: CreateMemoOptions
): Promise<CreateMemoResult> {
  const { supabase, userId, dealId, memoContent } = options;

  // 1. Generate 32-byte cryptographically secure token
  const rawToken = crypto.randomBytes(32).toString("hex");

  // 2. Compute SHA-256 hash for database storage (raw token never stored)
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const expiresAt = new Date(Date.now() + 14 * 86400000).toISOString();

  // 3. Insert memo record
  const { data: memo, error } = await supabase
    .from("memos")
    .insert({
      user_id: userId,
      deal_id: dealId,
      content: memoContent as Json,
      accept_token_hash: tokenHash,
      expires_at: expiresAt,
    })
    .select("id")
    .single();

  if (error || !memo) {
    throw new Error(`Failed to create Deal Memo: ${error?.message || "Unknown error"}`);
  }

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const acceptUrl = `${appUrl}/memo/${rawToken}`;

  await logAuditEvent(supabase, {
    userId,
    action: "MEMO_GENERATED",
    entity: "memo",
    entityId: memo.id,
    detail: { dealId, expiresAt },
  });

  return {
    memoId: memo.id,
    rawToken,
    acceptUrl,
    expiresAt,
  };
}

export interface VerifyMemoResult {
  valid: boolean;
  isExpired: boolean;
  isAlreadyAccepted: boolean;
  memo: any | null;
  deal: any | null;
  creatorProfile: any | null;
}

/**
 * Verifies public acceptance token using service-role client (unauthenticated brand manager flow).
 */
export async function verifyMemoToken(rawToken: string): Promise<VerifyMemoResult> {
  if (!rawToken || rawToken.length < 32) {
    return {
      valid: false,
      isExpired: false,
      isAlreadyAccepted: false,
      memo: null,
      deal: null,
      creatorProfile: null,
    };
  }

  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const serviceClient = createServiceClient();

  // Find memo by SHA-256 hash
  const { data: memo, error } = await serviceClient
    .from("memos")
    .select("*, deals(*)")
    .eq("accept_token_hash", tokenHash)
    .single();

  if (error || !memo) {
    return {
      valid: false,
      isExpired: false,
      isAlreadyAccepted: false,
      memo: null,
      deal: null,
      creatorProfile: null,
    };
  }

  const now = new Date();
  const expiresAt = new Date(memo.expires_at);
  const isExpired = now > expiresAt;
  const isAlreadyAccepted = !!memo.accepted_at;

  // Fetch creator display profile
  const { data: creatorProfile } = await serviceClient
    .from("profiles")
    .select("display_name, niche, follower_band, upi_vpa, state")
    .eq("id", memo.user_id)
    .single();

  return {
    valid: !isExpired && !isAlreadyAccepted,
    isExpired,
    isAlreadyAccepted,
    memo,
    deal: memo.deals,
    creatorProfile,
  };
}

/**
 * Executes public brand acceptance of agreed terms.
 */
export async function acceptDealMemo(
  rawToken: string,
  signatoryName: string
): Promise<{ success: boolean; message: string }> {
  if (!signatoryName || signatoryName.trim().length < 2) {
    throw new Error("Signatory name is required to accept terms.");
  }

  const verification = await verifyMemoToken(rawToken);
  if (!verification.valid) {
    if (verification.isExpired) throw new Error("This Deal Memo acceptance link has expired.");
    if (verification.isAlreadyAccepted) throw new Error("This Deal Memo has already been accepted.");
    throw new Error("Invalid or unverified acceptance token.");
  }

  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const serviceClient = createServiceClient();
  const acceptedAt = new Date().toISOString();

  // 1. Update memo record
  const { error: memoError } = await serviceClient
    .from("memos")
    .update({
      accepted_at: acceptedAt,
      accepted_by_name: signatoryName.trim(),
    })
    .eq("accept_token_hash", tokenHash);

  if (memoError) {
    throw new Error(`Failed to record memo acceptance: ${memoError.message}`);
  }

  // 2. Transition deal status to 'agreed'
  await serviceClient
    .from("deals")
    .update({
      status: "agreed",
      updated_at: acceptedAt,
    })
    .eq("id", verification.memo.deal_id);

  // 3. Write to audit log
  await logAuditEvent(serviceClient, {
    userId: verification.memo.user_id,
    action: "MEMO_ACCEPTED",
    entity: "memo",
    entityId: verification.memo.id,
    detail: {
      dealId: verification.memo.deal_id,
      acceptedByName: signatoryName.trim(),
      acceptedAt,
    },
  });

  return {
    success: true,
    message: `Deal terms successfully agreed by ${signatoryName.trim()}. Deal status updated to Agreed.`,
  };
}
