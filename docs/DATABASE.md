# Kreato — Complete Database Schema & RLS Matrix

Kreato is backed by PostgreSQL on Supabase. Every table enforces Row-Level Security (RLS) to ensure multi-tenant isolation. All monetary values are strictly stored as `BIGINT` integer paise (₹1 = 100 paise).

---

## 📋 Tables & Schema Reference

### 1. `profiles`
Stores creator profile settings, state of business, tax credentials, and default commercial rates.
- `id` (UUID, PK, references `auth.users(id) ON DELETE CASCADE`)
- `display_name` (TEXT, NOT NULL)
- `niche` (ENUM `creator_niche`, NOT NULL DEFAULT `'other'`)
- `follower_band` (ENUM `follower_band`, NOT NULL DEFAULT `'nano_10k_50k'`)
- `state` (TEXT, NOT NULL DEFAULT `'Maharashtra'`)
- `gstin` (TEXT, NULLABLE)
- `pan_name` (TEXT, NULLABLE)
- `upi_vpa` (TEXT, NOT NULL)
- `min_fee_paise` (BIGINT, NULLABLE)
- `sim_days_offset` (INT, NOT NULL DEFAULT 0)
- `youtube_verified_band` (ENUM `follower_band`, NULLABLE)
- `created_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- **RLS Policy**: `auth.uid() = id` (SELECT, INSERT, UPDATE, DELETE).

### 2. `benchmarks`
Read-only simulated benchmark rates for deliverable formats across niches and follower tiers.
- `id` (UUID, PK)
- `niche` (ENUM `creator_niche`, NOT NULL)
- `follower_band` (ENUM `follower_band`, NOT NULL)
- `format` (ENUM `deliverable_format`, NOT NULL)
- `median_paise` (BIGINT, NOT NULL)
- `min_paise` (BIGINT, NOT NULL)
- `max_paise` (BIGINT, NOT NULL)
- `is_simulated` (BOOLEAN, NOT NULL DEFAULT TRUE)
- `created_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- **RLS Policy**: Public / Authenticated read-only (`auth.role() = 'authenticated'`).

### 3. `deals`
Sponsorship collaboration opportunities captured via text paste, screenshot OCR, or Gmail import.
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, references `auth.users(id) ON DELETE CASCADE`)
- `brand_name` (TEXT, NOT NULL)
- `brand_key` (TEXT, NOT NULL)
- `brand_domain` (TEXT, NULLABLE)
- `category` (ENUM `creator_niche`, NOT NULL DEFAULT `'other'`)
- `channel` (ENUM `deal_channel`, NOT NULL DEFAULT `'whatsapp'`)
- `deliverables` (JSONB, NOT NULL DEFAULT `'[]'`)
- `deadline` (DATE, NULLABLE)
- `fee_paise` (BIGINT, NULLABLE)
- `usage_rights` (JSONB, NOT NULL)
- `exclusivity` (JSONB, NOT NULL)
- `payment_terms` (JSONB, NOT NULL)
- `risky_quotes` (JSONB, NOT NULL DEFAULT `'[]'`)
- `scam_result` (JSONB, NOT NULL)
- `status` (ENUM `deal_status`, NOT NULL DEFAULT `'new'`)
- `source_ref` (TEXT, NULLABLE — SHA-256 of Gmail message ID for deduplication)
- `agreed_terms` (JSONB, NULLABLE)
- `created_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- **RLS Policy**: `auth.uid() = user_id` (ALL operations).

### 4. `drafts`
Counter-offer and payment reminder AI message drafts.
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, references `auth.users(id) ON DELETE CASCADE`)
- `deal_id` (UUID, NOT NULL, references `deals(id) ON DELETE CASCADE`)
- `kind` (ENUM `draft_kind`: `'counter_offer'` | `'reminder'`)
- `tier` (ENUM `draft_tier`: `'ideal'` | `'acceptable'` | `'walkaway'`)
- `language` (TEXT, NOT NULL DEFAULT `'en'`)
- `body` (TEXT, NOT NULL)
- `numbers` (JSONB, NOT NULL DEFAULT `'{}'`)
- `status` (ENUM `draft_status`, NOT NULL DEFAULT `'draft'`)
- `created_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- `approved_at` (TIMESTAMPTZ, NULLABLE)
- **RLS Policy**: `auth.uid() = user_id` (ALL operations).

### 5. `memos`
Tamper-evident Deal Memos with single-use cryptographic acceptance tokens.
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, references `auth.users(id) ON DELETE CASCADE`)
- `deal_id` (UUID, NOT NULL, references `deals(id) ON DELETE CASCADE`)
- `content` (JSONB, NOT NULL)
- `accept_token_hash` (TEXT, NOT NULL UNIQUE — SHA-256 of raw token)
- `expires_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW() + INTERVAL '14 days')
- `accepted_at` (TIMESTAMPTZ, NULLABLE)
- `accepted_by_name` (TEXT, NULLABLE)
- `created_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- **RLS Policy**:
  - Creator: `auth.uid() = user_id` (SELECT, INSERT).
  - Public brand acceptance: Handled via secure service-role client matching `accept_token_hash`.

### 6. `invoices`
Sequential Indian Financial Year GST tax invoices.
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, references `auth.users(id) ON DELETE CASCADE`)
- `deal_id` (UUID, NOT NULL, references `deals(id) ON DELETE CASCADE`)
- `invoice_number` (TEXT, NOT NULL — format `DS/2026-27/001`)
- `issue_date` (DATE, NOT NULL)
- `due_date` (DATE, NOT NULL)
- `supplier_snapshot` (JSONB, NOT NULL)
- `client_snapshot` (JSONB, NOT NULL)
- `line_items` (JSONB, NOT NULL)
- `tax` (JSONB, NOT NULL — CGST, SGST, IGST in paise)
- `total_paise` (BIGINT, NOT NULL)
- `upi_link` (TEXT, NOT NULL)
- `status` (ENUM `invoice_status`: `'issued'` | `'paid'`)
- `created_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- **RLS Policy**: `auth.uid() = user_id` (ALL operations).

### 7. `payments`
Settlement receipts feeding the Personal Brand Ledger.
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, references `auth.users(id) ON DELETE CASCADE`)
- `deal_id` (UUID, NOT NULL, references `deals(id) ON DELETE CASCADE`)
- `amount_paise` (BIGINT, NOT NULL)
- `promised_days` (INT, NOT NULL)
- `actual_days` (INT, NOT NULL)
- `paid_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- **RLS Policy**: `auth.uid() = user_id` (ALL operations).

### 8. `audit_log`
Append-only immutable record of all creator operations and system events.
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, references `auth.users(id) ON DELETE CASCADE`)
- `action` (TEXT, NOT NULL)
- `entity` (TEXT, NOT NULL)
- `entity_id` (UUID, NULLABLE)
- `detail` (JSONB, NOT NULL DEFAULT `'{}'`)
- `created_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- **RLS Policy**: `auth.uid() = user_id` (SELECT, INSERT only; NO UPDATE or DELETE).

### 9. `ai_usage`
Tracks sliding-window rate limit counters (20 req / 10 min window).
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, references `auth.users(id) ON DELETE CASCADE`)
- `route` (TEXT, NOT NULL)
- `created_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- **RLS Policy**: `auth.uid() = user_id` (SELECT, INSERT).

### 10. `youtube_links` (Feature 13)
Cached public YouTube channel statistics.
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, references `auth.users(id) ON DELETE CASCADE UNIQUE`)
- `channel_id` (TEXT, NOT NULL)
- `channel_title` (TEXT, NOT NULL)
- `subscriber_count` (BIGINT, NOT NULL)
- `band_suggestion` (ENUM `follower_band`, NOT NULL)
- `fetched_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- `created_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- **RLS Policy**: `auth.uid() = user_id` (ALL operations).

### 11. `gmail_connections` (Feature 14)
Encrypted OAuth refresh token store for Gmail Import.
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, references `auth.users(id) ON DELETE CASCADE UNIQUE`)
- `google_email` (TEXT, NOT NULL)
- `encrypted_refresh_token` (TEXT, NOT NULL — AES-256-GCM ciphertext)
- `iv` (TEXT, NOT NULL — 12-byte initialization vector)
- `auth_tag` (TEXT, NOT NULL — 16-byte authentication tag)
- `scope` (TEXT, NOT NULL DEFAULT `'https://www.googleapis.com/auth/gmail.readonly'`)
- `status` (TEXT, NOT NULL DEFAULT `'connected'`)
- `connected_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- `last_used_at` (TIMESTAMPTZ, NULLABLE)
- `created_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW())
- **RLS Policy**: **NO CLIENT-FACING POLICIES**.
  - All token access is restricted strictly to server route handlers using the service-role client.
  - Regular client queries (`createClient()`) return zero rows, preventing client-side token exposure.
