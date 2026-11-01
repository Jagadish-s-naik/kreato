import { z } from "zod";
import { Database } from "@/backend/supabase/database.types";

export type CreatorNiche = Database["public"]["Enums"]["creator_niche"];
export type FollowerBand = Database["public"]["Enums"]["follower_band"];
export type DeliverableFormat = Database["public"]["Enums"]["deliverable_format"];
export type DealChannel = Database["public"]["Enums"]["deal_channel"];
export type DealStatus = Database["public"]["Enums"]["deal_status"];
export type DraftKind = Database["public"]["Enums"]["draft_kind"];
export type DraftTier = Database["public"]["Enums"]["draft_tier"];

// ==========================================
// 1. COPILOT & EXTRACTION SCHEMAS
// ==========================================

export const DeliverableItemSchema = z.object({
  format: z.enum(["reel", "story", "post", "youtube_video", "short"]),
  count: z.number().int().positive().default(1),
  duration_seconds: z.number().int().positive().optional(),
});
export type DeliverableItem = z.infer<typeof DeliverableItemSchema>;

export const UsageRightsTermsSchema = z.object({
  type: z.enum(["none", "organic", "paid_ads", "perpetual", "unspecified"]).default("none"),
  months: z.number().int().positive().nullable().optional(),
  paid_ads_allowed: z.boolean().default(false),
});
export type UsageRightsTerms = z.infer<typeof UsageRightsTermsSchema>;

export const ExclusivityTermsSchema = z.object({
  category: z.string().nullable().optional(),
  days: z.number().int().positive().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
});
export type ExclusivityTerms = z.infer<typeof ExclusivityTermsSchema>;

export const PaymentTermsSchema = z.object({
  days: z.number().int().nullable().optional(),
  advance_percent: z.number().int().nullable().optional(),
});
export type PaymentTerms = z.infer<typeof PaymentTermsSchema>;

export const ExtractDealRequestSchema = z.object({
  raw_text: z.string().min(5),
  channel: z.enum(["whatsapp", "instagram_dm", "email", "other"]).default("whatsapp"),
});
export type ExtractDealRequest = z.infer<typeof ExtractDealRequestSchema>;

// ==========================================
// 2. COUNTER-OFFER & LADDER DRAFT SCHEMAS
// ==========================================

export const DraftLadderRequestSchema = z.object({
  deal_id: z.string().uuid(),
  tier: z.enum(["ideal", "acceptable", "walkaway"]),
  language: z.enum(["en", "hinglish"]).default("en"),
});
export type DraftLadderRequest = z.infer<typeof DraftLadderRequestSchema>;

// ==========================================
// 3. PAYMENT REMINDER SCHEMAS
// ==========================================

export const DraftReminderRequestSchema = z.object({
  deal_id: z.string().uuid(),
  tone: z.enum(["friendly", "firm", "final"]).default("firm"),
  language: z.enum(["en", "hinglish"]).default("en"),
});
export type DraftReminderRequest = z.infer<typeof DraftReminderRequestSchema>;

// ==========================================
// 4. MEMO SCHEMAS
// ==========================================

export const CreateMemoRequestSchema = z.object({
  deal_id: z.string().uuid(),
  memo_content: z.record(z.any()),
});
export type CreateMemoRequest = z.infer<typeof CreateMemoRequestSchema>;

export const AcceptMemoRequestSchema = z.object({
  signatory_name: z.string().min(2, "Signatory name is required"),
});
export type AcceptMemoRequest = z.infer<typeof AcceptMemoRequestSchema>;

// ==========================================
// 5. INVOICE & PAYMENT SCHEMAS
// ==========================================

export const CreateInvoiceRequestSchema = z.object({
  deal_id: z.string().uuid(),
  client_state: z.string().default("Maharashtra"),
  client_snapshot: z.object({
    brandName: z.string(),
    companyName: z.string().optional(),
    gstin: z.string().optional(),
    address: z.string().optional(),
    contactEmail: z.string().optional(),
  }),
});
export type CreateInvoiceRequest = z.infer<typeof CreateInvoiceRequestSchema>;

export const RecordPaymentRequestSchema = z.object({
  deal_id: z.string().uuid(),
  amount_paise: z.number().int().positive(),
  promised_days: z.number().int().nonnegative(),
  actual_days: z.number().int().nonnegative(),
});
export type RecordPaymentRequest = z.infer<typeof RecordPaymentRequestSchema>;

// ==========================================
// 6. YOUTUBE CHANNEL LOOKUP & LINK SCHEMAS
// ==========================================

export const YouTubeLookupRequestSchema = z.object({
  input: z.string().min(1, "YouTube handle or URL is required"),
});
export type YouTubeLookupRequest = z.infer<typeof YouTubeLookupRequestSchema>;

export const YouTubeLinkRequestSchema = z
  .object({
    channel_input: z.string().min(1).optional(),
    channelInput: z.string().min(1).optional(),
    update_profile_band: z.boolean().optional(),
    updateProfileBand: z.boolean().optional(),
  })
  .transform((data) => ({
    channelInput: data.channelInput || data.channel_input || "",
    updateProfileBand: data.updateProfileBand ?? data.update_profile_band ?? false,
  }));
export type YouTubeLinkRequest = z.infer<typeof YouTubeLinkRequestSchema>;
export const YouTubeLinkSchema = YouTubeLinkRequestSchema;

// ==========================================
// 7. GMAIL SEARCH & IMPORT SCHEMAS
// ==========================================

export const GmailSearchQuerySchema = z.object({
  q: z.string().optional(),
  max_results: z.coerce.number().int().min(1).max(20).default(20),
});
export type GmailSearchQuery = z.infer<typeof GmailSearchQuerySchema>;

export const GmailImportItemSchema = z.object({
  message_id: z.string().min(1),
});

export const GmailImportRequestSchema = z.object({
  messages: z.array(GmailImportItemSchema).min(1).max(20),
});
export type GmailImportRequest = z.infer<typeof GmailImportRequestSchema>;

export const GmailMessageMetadataSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  senderName: stringOrNull(),
  senderEmail: stringOrNull(),
  senderDomain: stringOrNull(),
  replyToEmail: stringOrNull(),
  subject: stringOrNull(),
  date: stringOrNull(),
  snippet: stringOrNull(),
  isLikelyBrandOffer: z.boolean(),
  reasons: z.array(z.string()),
  isAlreadyImported: z.boolean(),
});
export type GmailMessageMetadata = z.infer<typeof GmailMessageMetadataSchema>;

function stringOrNull() {
  return z.string().nullable().optional();
}
