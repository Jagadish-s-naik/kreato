import "server-only";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../supabase/database.types";
import { APP_CONFIG } from "@/lib/config/app";

export interface RateLimitCheckResult {
  allowed: boolean;
  count: number;
  remaining: number;
  resetAt: Date;
}

/**
 * Sliding window rate-limiter: max 20 requests per 10 minutes per creator.
 * Enforced on all LLM generation endpoints to prevent quota exhaustion or abuse.
 */
export async function checkRateLimit(
  supabase: SupabaseClient<any, any, any>,
  userId: string,
  route: string
): Promise<RateLimitCheckResult> {
  const windowMinutes = APP_CONFIG.aiRateLimitWindowMinutes || 10;
  const maxRequests = APP_CONFIG.aiRateLimitMaxRequests || 20;

  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  // Count requests in current sliding window
  const { count, error } = await supabase
    .from("ai_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", windowStart);

  if (error) {
    console.error("Rate limit check error:", error);
    // Fail open or allow with warning to prevent hard blocking on telemetry error
    return {
      allowed: true,
      count: 0,
      remaining: maxRequests,
      resetAt: new Date(Date.now() + windowMinutes * 60 * 1000),
    };
  }

  const currentCount = count || 0;
  const allowed = currentCount < maxRequests;
  const remaining = Math.max(0, maxRequests - currentCount);
  const resetAt = new Date(Date.now() + windowMinutes * 60 * 1000);

  if (!allowed) {
    throw new Error(
      `AI usage limit reached (${maxRequests} requests per ${windowMinutes} minutes). Please wait a few minutes before trying again.`
    );
  }

  return { allowed, count: currentCount, remaining, resetAt };
}

/**
 * Records an AI usage event into the `ai_usage` table.
 */
export async function recordAiUsage(
  supabase: SupabaseClient<any, any, any>,
  userId: string,
  route: string
): Promise<void> {
  const { error } = await supabase.from("ai_usage").insert({
    user_id: userId,
    route,
  });

  if (error) {
    console.error("Failed to record AI usage:", error);
  }
}
