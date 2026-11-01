import "server-only";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "../supabase/database.types";

export type AuditAction =
  | "DEAL_EXTRACTED"
  | "DEAL_CREATED"
  | "DEAL_UPDATED"
  | "DEAL_DELETED"
  | "TIER_DRAFTED"
  | "COUNTER_APPROVED"
  | "REMINDER_DRAFTED"
  | "MEMO_GENERATED"
  | "MEMO_ACCEPTED"
  | "INVOICE_GENERATED"
  | "PAYMENT_RECORDED"
  | "PROFILE_UPDATED"
  | "SIM_CLOCK_OFFSET_CHANGED"
  | "DATA_EXPORTED"
  | "ACCOUNT_DELETED";

export interface LogAuditOptions {
  userId: string;
  action: AuditAction;
  entity: string; // e.g. "deal", "memo", "invoice", "user"
  entityId?: string | null;
  detail?: Record<string, any>;
}

/**
 * Append-only audit logger.
 * Writes immutable action history to the `audit_log` table.
 */
export async function logAuditEvent(
  supabase: SupabaseClient<any, any, any>,
  options: LogAuditOptions
): Promise<void> {
  const { userId, action, entity, entityId, detail = {} } = options;

  try {
    const { error } = await supabase.from("audit_log").insert({
      user_id: userId,
      action,
      entity,
      entity_id: entityId ?? null,
      detail: detail as Json,
    });

    if (error) {
      console.error("Failed to insert audit log:", error);
    }
  } catch (err) {
    console.error("Audit logging exception:", err);
  }
}
