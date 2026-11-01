# Feature Changelog & Status History

This document tracks all new, updated, and deprecated features in Kreato. It is maintained in reverse chronological order (newest first).

---

## [2026-11-01] — Google Services Integrations & Capture Expansion

### Feature 14: Gmail Import (Beta)
- **Status**: Planned / In progress
- **What Changed**: Added Gmail OAuth 2.0 PKCE flow, AES-256-GCM encrypted token storage in `gmail_connections`, relevance heuristics in `/lib/gmail/relevance.ts`, and batch import route `/api/gmail/import` reusing the Gemini extraction pipeline.
- **Why**: Allows test users to pull brand collaboration pitches directly from inbox without manual copy-paste.
- **Affected Screens**: `/inbox` (new "Import from Gmail (beta)" tab), `/settings` (Connect / Disconnect Gmail).
- **Affected Routes**: `/api/gmail/connect`, `/api/gmail/callback`, `/api/gmail/status`, `/api/gmail/search`, `/api/gmail/import`, `/api/gmail/disconnect`.
- **Affected Tables**: `gmail_connections`, `deals` (`source_ref` column added).
- **Frontend Breaking**: No. Paste remains default inbox method. Fully failure-isolated.

### Feature 13: YouTube Public Channel Stats
- **Status**: Planned / In progress
- **What Changed**: Added public YouTube channel statistics lookup via YouTube Data API v3 (`channels.list`), URL/handle parsing, 24-hour cache in `youtube_links`, and manual follower band suggestion.
- **Why**: Allows creators to verify and set their follower band from objective public data without OAuth.
- **Affected Screens**: `/onboarding`, `/settings`.
- **Affected Routes**: `/api/youtube/lookup`, `/api/youtube/link`, `/api/youtube/unlink`.
- **Affected Tables**: `youtube_links`, `profiles` (`youtube_verified_band` column added).
- **Frontend Breaking**: No. Completely optional with zero creator login required.

### Feature 12: Calendar Export
- **Status**: Planned / In progress
- **What Changed**: Added RFC 5545 compliant `.ics` calendar generator in `/lib/calendar/ics.ts` and downloadable export endpoint `/api/calendar/[dealId]/ics` along with Google Calendar template web links.
- **Why**: Places critical delivery deadlines, exclusivity windows, and invoice due dates directly on creator calendars without OAuth.
- **Affected Screens**: `/deals/[id]` (Deal Memo and Invoice sections).
- **Affected Routes**: `/api/calendar/[dealId]/ics`.
- **Affected Tables**: None (generates on the fly from `deals`, `memos`, and `invoices`).
- **Frontend Breaking**: No.

### Feature 1: Deal Inbox (Three Capture Methods)
- **Status**: In progress
- **What Changed**: Upgraded Deal Inbox to support three distinct capture tabs: Paste text [default], Upload screenshot, and Import from Gmail (beta).
- **Why**: Provides flexible multi-modal deal capture for creators on mobile and desktop.
- **Affected Screens**: `/inbox`.
- **Affected Routes**: `/api/copilot/extract`.
- **Frontend Breaking**: No.

---

## [2026-11-01] — Core Engines & Security Hardening

### Feature 6: Deal Memo & Cryptographic Verification
- **Status**: Done
- **What Changed**: Created single-use 32-byte cryptographic token generator and SHA-256 hash storage in `memos` table. Built public unauthenticated sign-off page and acceptance API.
- **Why**: Solves the problem of brands agreeing in WhatsApp and later denying terms or payment dates.
- **Affected Screens**: `/deals/[id]`, `/memo/[token]`.
- **Affected Routes**: `/api/memo`, `/api/memo/[token]`, `/api/memo/[token]/accept`.
- **Affected Tables**: `memos`, `deals`.
- **Frontend Breaking**: No.

### Feature 5: Counter-Offer Drafter & Walk-Away Ladder
- **Status**: Done
- **What Changed**: Created 3-tier mathematical matrix (Ideal, Acceptable, Walk-away) and Gemini 3.8 Flash drafting service with strict numerical integrity enforcement.
- **Why**: Enables creators to negotiate confidently without underpricing or conceding critical rights.
- **Affected Screens**: `/deals/[id]`.
- **Affected Routes**: `/api/ladder/draft`.
- **Affected Tables**: `drafts`.
- **Frontend Breaking**: No.

### Feature 4: Money Leak Radar
- **Status**: Done
- **What Changed**: Implemented pure deterministic 5-vector leak engine in `/lib/radar.ts` calculating benchmark gap, commercial usage surcharges, payment delay financing (18% p.a.), category exclusivity costs, and brand history penalties in integer paise.
- **Why**: Exposes hidden commercial traps in brand contracts before creators accept.
- **Affected Screens**: `/deals/[id]`.
- **Frontend Breaking**: No.

### Feature 3: Personal Brand Ledger
- **Status**: Done
- **What Changed**: Implemented brand normalization and payment delay aggregator computing average days late and total lifetime earnings per brand.
- **Why**: Empowers creators with historical payment track records when evaluating new pitches from repeat brands.
- **Affected Screens**: `/dashboard`, `/deals/[id]`.
- **Affected Routes**: `/api/brand-ledger`.
- **Affected Tables**: `deals`, `payments`.
- **Frontend Breaking**: No.

### Feature 2: Deal Copilot
- **Status**: Done
- **What Changed**: Built PII masking, Gemini structured deal extraction, and automatic Radar/Ladder calculation pipeline.
- **Why**: Transforms unstructured, vague briefs into clear, quantifiable commercial terms.
- **Affected Screens**: `/inbox`, `/deals/[id]`.
- **Affected Routes**: `/api/copilot/extract`.
- **Affected Tables**: `deals`, `audit_log`, `ai_usage`.
- **Frontend Breaking**: No.

### Feature 7: Exclusivity Guard
- **Status**: Done
- **What Changed**: Built date-range and category overlap detection engine in `/lib/exclusivity.ts`.
- **Why**: Prevents creators from breaching legal exclusivity clauses across overlapping campaigns.
- **Affected Screens**: `/deals/[id]`.
- **Frontend Breaking**: No.

### Feature 8: GST Invoice with UPI Deep Link
- **Status**: Done
- **What Changed**: Built sequential Indian Financial Year invoice generator (`DS/2026-27/001`), CGST/SGST vs IGST calculation, and `upi://pay` URI generator.
- **Why**: Guarantees tax compliance and 1-tap mobile payment for brand managers.
- **Affected Screens**: `/deals/[id]`.
- **Affected Routes**: `/api/invoices`.
- **Affected Tables**: `invoices`.
- **Frontend Breaking**: No.

### Feature 9: Payment Tracker & Overdue Reminders
- **Status**: Done
- **What Changed**: Implemented settlement logging, invoice status transition (`paid`), and 3-stage tone escalation reminder generator (`friendly`, `firm`, `final`).
- **Why**: Eliminates awkward chasing and speeds up collection of delayed influencer payments.
- **Affected Screens**: `/deals/[id]`, `/dashboard`.
- **Affected Routes**: `/api/payments`, `/api/reminder/draft`.
- **Affected Tables**: `payments`, `invoices`, `deals`.
- **Frontend Breaking**: No.

### Feature 10: Scam Flag
- **Status**: Done
- **What Changed**: Implemented pay-to-collab detection, brand domain typosquatting check (Levenshtein distance), and prompt-injection defense.
- **Why**: Protects creators from advance-fee courier scams and domain impersonators.
- **Affected Screens**: `/inbox`, `/deals/[id]`.
- **Frontend Breaking**: No.

### Feature 11: Security & Data Control
- **Status**: Done
- **What Changed**: Implemented strict Row-Level Security, append-only audit logging, sliding-window rate limiting, GDPR/DPDP-compliant data export, and account deletion.
- **Why**: Safeguards creator personal data and ensures total data sovereignty.
- **Affected Screens**: `/settings`.
- **Affected Routes**: `/api/user/profile`, `/api/user/audit-log`, `/api/user/export`, `/api/user/delete`.
- **Affected Tables**: `profiles`, `audit_log`, `ai_usage`, all user tables.
- **Frontend Breaking**: No.

