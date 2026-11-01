# Database Architecture & Schema Specification — DealShield

This document details the PostgreSQL schema, indexes, Row-Level Security (RLS) policies, and data dictionary for DealShield.
The full runnable migration is located at [`supabase/migrations/001_init.sql`](file:///c:/xampp/htdocs/kreato/supabase/migrations/001_init.sql).

---

## 1. Entity-Relationship Overview

```
auth.users (Supabase Auth)
  │
  ├── 1:1 ── profiles (creator profile, UPI VPA, sim_days_offset)
  │
  ├── 1:N ── deals (brand offer details, deliverables, terms)
  │           ├── 1:N ── drafts (negotiation counters & overdue reminders)
  │           ├── 1:1 ── memos (agreed terms snapshot & public SHA-256 accept token)
  │           ├── 1:1 ── invoices (FY-sequential tax invoice & UPI QR payload)
  │           └── 1:N ── payments (settled transactions & speed tracking)
  │
  ├── 1:N ── audit_log (append-only compliance trail, no PII)
  └── 1:N ── ai_usage (sliding window rate limit tracking)

benchmarks (Read-only catalog of simulated Indian market rates across niches, bands, formats)
```

---

## 2. Table Specifications & Data Dictionary

### 2.1. `profiles`
Stores the creator's identity, default tax status, payment destination, and simulation clock.
- `id` (UUID, PK): References `auth.users(id)` ON DELETE CASCADE.
- `display_name` (TEXT, NOT NULL): Public creator name.
- `niche` (creator_niche ENUM, NOT NULL): e.g. `skincare`, `tech_gadgets`, `fashion`.
- `follower_band` (follower_band ENUM, NOT NULL): `nano_10k_50k`, `micro_50k_100k`, `mid_100k_250k`, `macro_250k_500k`.
- `state` (TEXT, NOT NULL): Indian state (used for GST intra vs inter-state tax logic).
- `gstin` (TEXT, NULLABLE): Optional 15-character GSTIN.
- `pan_name` (TEXT, NULLABLE): Name as registered on PAN.
- `upi_vpa` (TEXT, NOT NULL): UPI Virtual Payment Address (e.g., `creator@oksbi`).
- `min_fee_paise` (BIGINT, NULLABLE): Creator's absolute floor fee per deal.
- `sim_days_offset` (INT, NOT NULL, DEFAULT 0): Virtual days offset for testing overdue workflows.
- `created_at` (TIMESTAMPTZ, DEFAULT NOW()).

### 2.2. `benchmarks`
Static simulated reference rates for fair market rate calculations.
- `id` (UUID, PK).
- `niche` (creator_niche ENUM).
- `follower_band` (follower_band ENUM).
- `format` (deliverable_format ENUM): `reel`, `story`, `post`, `youtube_video`, `short`.
- `median_paise` (BIGINT): Fair market median.
- `min_paise` (BIGINT): Bottom quartile rate.
- `max_paise` (BIGINT): Top quartile rate.
- `is_simulated` (BOOLEAN, DEFAULT TRUE): Flagged to ensure UI renders "Simulated benchmark data".

### 2.3. `deals`
Represents an ingested brand deal and its negotiated state.
- `id` (UUID, PK).
- `user_id` (UUID, FK -> auth.users).
- `brand_name` (TEXT): Display name of brand.
- `brand_key` (TEXT): Normalized lowercase alphanumeric string (e.g., `glowskin`).
- `brand_domain` (TEXT, NULLABLE): e.g., `glowskin.in`.
- `category` (creator_niche ENUM).
- `channel` (deal_channel ENUM): `whatsapp`, `instagram_dm`, `email`, `other`.
- `deliverables` (JSONB): Array of `{ format: string, quantity: number }`.
- `deadline` (DATE, NULLABLE).
- `fee_paise` (BIGINT, NULLABLE): Offered fee in integer paise.
- `usage_rights` (JSONB): `{ type: 'none'|'organic'|'paid_ads'|'perpetual'|'unspecified', months: number|null, paid_ads_allowed: boolean }`.
- `exclusivity` (JSONB): `{ category: string|null, days: number|null, start_date: string|null, end_date: string|null }`.
- `payment_terms` (JSONB): `{ days: number|null, advance_percent: number|null }`.
- `risky_quotes` (JSONB): Array of short verbatim strings (max 120 chars) extracted from message.
- `scam_result` (JSONB): `{ score: number, level: 'safe'|'suspicious'|'danger', reasons: string[] }`.
- `status` (deal_status ENUM): `new`, `countered`, `agreed`, `invoiced`, `paid`.
- `agreed_terms` (JSONB, NULLABLE): Snapshot of terms locked upon agreement.
- `created_at`, `updated_at` (TIMESTAMPTZ).

### 2.4. `drafts`
Counter-offers and payment follow-ups drafted by Gemini around deterministic numbers.
- `id` (UUID, PK).
- `user_id` (UUID, FK -> auth.users).
- `deal_id` (UUID, FK -> deals).
- `kind` (draft_kind ENUM): `counter_offer` or `reminder`.
- `tier` (draft_tier ENUM, NULLABLE): `ideal`, `acceptable`, `walkaway`.
- `language` (TEXT): `en` or `hinglish`.
- `body` (TEXT): Draft text with prefilled figures.
- `numbers` (JSONB): Target numbers enforced during validation.
- `status` (draft_status ENUM): `draft`, `approved`, `discarded`.
- `created_at`, `approved_at` (TIMESTAMPTZ).

### 2.5. `memos`
Deal Memos generated for public brand sign-off.
- `id` (UUID, PK).
- `user_id` (UUID, FK -> auth.users).
- `deal_id` (UUID, FK -> deals).
- `content` (JSONB): Immutable snapshot of agreed terms.
- `accept_token_hash` (TEXT, UNIQUE): SHA-256 hash of 32-byte secret acceptance token.
- `expires_at` (TIMESTAMPTZ): Default NOW() + 14 days.
- `accepted_at` (TIMESTAMPTZ, NULLABLE).
- `accepted_by_name` (TEXT, NULLABLE): Signatory name typed by brand representative.
- `created_at` (TIMESTAMPTZ).

### 2.6. `invoices`
Compliant GST invoices with embedded UPI parameters.
- `id` (UUID, PK).
- `user_id` (UUID, FK -> auth.users).
- `deal_id` (UUID, FK -> deals).
- `invoice_number` (TEXT): Sequential FY format (e.g. `DS/2026-27/001`).
- `issue_date`, `due_date` (DATE).
- `supplier_snapshot`, `client_snapshot` (JSONB).
- `line_items` (JSONB).
- `tax` (JSONB): Breakdown of CGST, SGST, IGST in integer paise.
- `total_paise` (BIGINT).
- `upi_link` (TEXT): `upi://pay?...` URL.
- `status` (invoice_status ENUM): `issued`, `paid`.
- `created_at` (TIMESTAMPTZ).
- UNIQUE CONSTRAINT (`user_id`, `invoice_number`).

### 2.7. `payments`
Tracks actual cash realization against promised payment milestones.
- `id` (UUID, PK).
- `user_id` (UUID, FK -> auth.users).
- `deal_id` (UUID, FK -> deals).
- `paid_at` (TIMESTAMPTZ).
- `amount_paise` (BIGINT).
- `promised_days` (INT).
- `actual_days` (INT).

### 2.8. `audit_log`
Append-only log of every state transition, AI action, and user consent.
- `id` (UUID, PK).
- `user_id` (UUID, FK -> auth.users).
- `action` (TEXT): e.g., `deal_extracted`, `counter_approved`, `memo_signed`.
- `entity` (TEXT): e.g., `deal`, `memo`, `invoice`.
- `entity_id` (UUID, NULLABLE).
- `detail` (JSONB): Sanitized event parameters (strict exclusion of raw text and PII).
- `created_at` (TIMESTAMPTZ).

### 2.9. `ai_usage`
Tracks API calls for per-user rate limiting (20 requests per 10 minutes).
- `id` (UUID, PK).
- `user_id` (UUID, FK -> auth.users).
- `route` (TEXT).
- `created_at` (TIMESTAMPTZ).

---

## 3. Row-Level Security (RLS) Matrix

| Table | SELECT | INSERT | UPDATE | DELETE | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `profiles` | Own UID | Own UID | Own UID | Own UID | Complete user isolation |
| `benchmarks` | Authenticated | None | None | None | Static read-only catalog |
| `deals` | Own UID | Own UID | Own UID | Own UID | User deals only |
| `drafts` | Own UID | Own UID | Own UID | Own UID | User drafts only |
| `memos` | Own UID | Own UID | Own UID | Own UID | Creator view. Public memo uses service-role |
| `invoices` | Own UID | Own UID | Own UID | Own UID | User invoices only |
| `payments` | Own UID | Own UID | Own UID | Own UID | User payments only |
| `audit_log` | Own UID | Own UID | **DENIED** | **DENIED** | Append-only security audit trail |
| `ai_usage` | Own UID | Own UID | **DENIED** | **DENIED** | Append-only rate tracking |
