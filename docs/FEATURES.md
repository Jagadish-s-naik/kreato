# Kreato — Master Feature Specifications (1–14)

This document contains the authoritative specifications for all 14 Kreato features. Maintain this exact numbering in all documentation, routes, and UI components.

---

### Feature 1: Deal Inbox [CHANGED]
- **Tag**: CHANGED
- **Purpose**: Provides a unified entry point for capturing brand sponsorship offers across three distinct capture methods.
- **Capture Methods**:
  1. **Paste Text [Default]**: Direct textarea input for WhatsApp messages, Instagram DMs, or emails.
  2. **Upload Screenshot**: Client-side OCR via Tesseract.js extracting text directly in the browser.
  3. **Import from Gmail (beta)**: Direct email import for authorized Google test users.
- **User Flow**: Creator opens `/inbox`. Default tab is "Paste text". Creator pastes brief, clicks "Analyze Deal". System masks PII, analyzes scam risk, extracts terms via Gemini, creates deal, and redirects to `/deals/[id]`.
- **Inputs**: Raw text string or image file. Selected channel (`whatsapp` | `instagram_dm` | `email` | `other`).
- **Outputs**: Structured Deal object, Money Leak Radar result, Walk-away Ladder result, Personal Brand Ledger track record.
- **Edge Cases**: Vague deliverables ("some stories"), missing fee (barter/gifting), multi-deliverable mixes.
- **Error States**: Blank input returns 400; unauthenticated returns 401; extraction timeout shows retry button with fallback suggestion.
- **Acceptance Criteria**:
  - Paste text is selected by default on load.
  - Selecting another tab updates URL query parameter (`?source=gmail` or `?source=screenshot`).
  - Analyzing text completes and navigates to the new deal card without page reload.

---

### Feature 2: Deal Copilot
- **Tag**: STABLE
- **Purpose**: Parses unstructured communication into structured legal and commercial metadata with zero client-side token exposure.
- **User Flow**: Runs automatically upon deal submission from Inbox.
- **Inputs**: PII-tokenized text.
- **Outputs**: Brand name, domain, category, deliverables list, payment terms, usage rights, exclusivity parameters, and risky clauses.
- **Edge Cases**: Adversarial prompt injection attacks embedded in message text.
- **Error States**: Gemini API failure triggers automatic retry; displays manual fallback review form.
- **Acceptance Criteria**:
  - Delimits user text inside `<message>` tags in system prompt.
  - Returns strictly typed Zod schema.

---

### Feature 3: Personal Brand Ledger
- **Tag**: STABLE
- **Purpose**: Provides creators with a private track record of every past collaboration with a given brand.
- **User Flow**: Rendered in Deal Workspace (`/deals/[id]`) and Dashboard (`/dashboard`). Shows total deals, total revenue in paise, average days late, and payment track record.
- **Inputs**: `brand_key` (slugified brand name) and authenticated creator `user_id`.
- **Outputs**: Total deals count, on-time vs late deals, average days late, lifetime earnings.
- **Edge Cases**: First-time brand has 0 past deals; brand name variations (e.g., "boAt" vs "Boat Lifestyle") map to standardized `boat_audio` / `boat_lifestyle` key.
- **Acceptance Criteria**:
  - Shows "First deal with this brand" badge when no history exists.
  - Automatically updates when a new invoice payment is recorded.

---

### Feature 4: Money Leak Radar
- **Tag**: STABLE
- **Purpose**: Mathematically quantifies hidden financial traps in brand briefs across 5 distinct leakage vectors.
- **Vectors**:
  1. **Benchmark Gap**: Gap between offered fee and 25th/50th percentile market rate.
  2. **Commercial Usage Rights Surcharge**: 30%–100% surcharge for paid ads, whitelisting, or perpetual rights.
  3. **Payment Delay Financing Cost**: 18% annual financing cost for credit terms beyond 15 days + 2% risk premium per 30-day block past 30 days.
  4. **Category Exclusivity Compensation**: 15% per 30 days of fair fee.
  5. **Brand History Penalty**: Historical delay interest based on past performance.
- **Inputs**: Deliverables list, benchmark medians in paise, offered fee in paise, usage duration, payment days, exclusivity days, brand average days late.
- **Outputs**: `fairFeePaise`, `totalAtRiskPaise`, `totalDelayCostPaise`, itemized breakdown with formulas and human explanations.
- **Acceptance Criteria**:
  - All arithmetic strictly in integer paise; zero floating-point drift.
  - "₹ at risk" is the most prominent element on the deal screen.
  - Simulated benchmark data is explicitly labeled with "(Simulated benchmark data)".

---

### Feature 5: Counter-Offer Drafter with Walk-Away Ladder
- **Tag**: STABLE
- **Purpose**: Generates a 3-tier negotiation matrix and professional response copy for email and WhatsApp.
- **Tiers**:
  1. **Ideal Tier**: Full Fair Market Value + 100% Usage Rights + 100% Exclusivity compensation + 50% advance.
  2. **Acceptable Tier**: Fair Fee + 50% Surcharges + Net 30 days + strictly capped 3 months usage.
  3. **Walk-away Floor**: 80% of Fair Fee or creator's profile floor (`min_fee_paise`).
- **User Flow**: Creator selects a tier in `/deals/[id]`. Gemini drafts negotiation copy. Creator copies or opens mailto/WhatsApp.
- **Inputs**: Deal terms, selected tier, language (`en` or `hinglish`).
- **Outputs**: Subject line, email body, WhatsApp text.
- **Acceptance Criteria**:
  - Strict numerical integrity: AI copy uses only the exact computed numbers.
  - App NEVER auto-sends any message; creator explicitly copies or clicks external link.

---

### Feature 6: Deal Memo
- **Tag**: STABLE
- **Purpose**: Bridges informal chat agreements with formal protection via a public, unauthenticated single-use verification link.
- **User Flow**: Creator clicks "Generate Deal Memo". System generates 32-byte cryptographic token, stores SHA-256 hash in `memos`, and provides public link `/memo/[token]`. Brand lead opens link, reviews terms, enters name, and signs off.
- **Inputs**: Deal ID, agreed deliverables, fee, payment terms, and deadline.
- **Outputs**: Signed memo record with signer name, IP address, timestamp; deal status transitions to `agreed`.
- **Edge Cases**: Token expired (> 14 days), already accepted.
- **Acceptance Criteria**:
  - Raw 32-byte token is never stored in database (only SHA-256 hash).
  - Unauthenticated brand representative can sign without creating an account.
  - Prominently displays: "Summary of terms agreed in chat. Not a legal contract."

---

### Feature 7: Exclusivity Guard
- **Tag**: STABLE
- **Purpose**: Detects overlapping exclusivity dates and category clashes against creator's active deals.
- **Inputs**: Category, proposed campaign start/end dates.
- **Outputs**: Conflicting deal titles, overlapping date range, warning severity (`warning` | `blocking`).
- **Acceptance Criteria**:
  - Warns creator before agreeing to competing brands within the same niche.

---

### Feature 8: GST Invoice with UPI Link
- **Tag**: STABLE
- **Purpose**: Generates Indian Financial Year sequential invoices with automated CGST/SGST vs IGST tax splitting and 1-tap UPI deep links.
- **Numbering**: Sequential per FY (e.g. `DS/2026-27/001`).
- **Tax Rules**: Same state = 9% CGST + 9% SGST. Different state = 18% IGST.
- **UPI Deep Link**: Standard `upi://pay?pa=...&pn=...&am=...&cu=INR`.
- **Outputs**: Compliant PDF/HTML invoice snapshot and QR code deep link.
- **Acceptance Criteria**:
  - Generates verifiable sequential numbers without gaps per financial year.
  - Validates creator GSTIN format (15 characters) and UPI VPA.

---

### Feature 9: Payment Tracker & Overdue Reminders
- **Tag**: STABLE
- **Purpose**: Monitors credit terms, tracks settlement days, and drafts tone-escalated payment follow-ups.
- **Tone Escalation**:
  - **Friendly**: 1–7 days overdue.
  - **Firm**: 8–21 days overdue.
  - **Final**: 22+ days overdue (warning of rights revocation).
- **Outputs**: Payment record, updated deal status (`paid`), and overdue reminder copy.
- **Acceptance Criteria**:
  - Feeds actual settlement days back into Personal Brand Ledger.

---

### Feature 10: Scam Flag
- **Tag**: STABLE
- **Purpose**: Flags advance-fee collaboration scams, domain typosquatters, and malicious prompt injections.
- **Rules**:
  - Advance fee scan ("registration fee", "shipping charges", "courier fee").
  - Typosquat domain check using Levenshtein distance $\le 2$ against top Indian brands.
  - Prompt injection detection.
- **Outputs**: Scam score (0–100), level (`safe`, `suspicious`, `danger`), itemized reasons.
- **Acceptance Criteria**:
  - Scores $\ge 60$ show a persistent red warning banner blocking quick acceptance.

---

### Feature 11: Security & Data Control
- **Tag**: STABLE
- **Purpose**: Enforces strict Row-Level Security, append-only audit logging, sliding-window rate limiting, and full GDPR/DPDP-compliant data sovereignty.
- **Capabilities**:
  - Audit log viewer for all deal operations and AI requests.
  - Complete JSON data export (`/api/user/export`).
  - Total account deletion cascade (`/api/user/delete`).
- **Acceptance Criteria**:
  - RLS prevents cross-tenant data access.
  - Account deletion purges all creator profiles, deals, invoices, audit trails, and connected integrations.

---

### Feature 12: Calendar Export (.ics & Web Links) [NEW]
- **Tag**: NEW
- **Purpose**: Puts sponsorship delivery deadlines, exclusivity windows, and invoice due dates directly on the creator's calendar without requiring OAuth permissions or Google verification.
- **Capabilities**:
  1. **Downloadable `.ics` File**: RFC 5545 compliant iCalendar file.
  2. **1-Click Google Calendar Link**: Web template URL opening Google Calendar with pre-populated event details.
- **Key Events Generated**:
  1. Content Deadline (deal or agreed memo).
  2. Exclusivity End Date & Start Date (agreed memo).
  3. Commercial Usage Rights Expiry.
  4. Invoice Due Date.
  5. Overdue Follow-up Reminder Date (Due date + 1 day).
- **Technical Standards**:
  - UTF-8 safe line folding at 75 octets (supports Hindi text and `₹` symbol without truncation).
  - All-day events using exclusive end dates (`DTEND;VALUE=DATE`).
  - Stable UID format: `<entity>-<id>-<type>@<APP_DOMAIN>`.
  - Incremental `SEQUENCE` number on edits.
  - Standard `VALARM` reminders (1 day prior and day of event).
- **Privacy Rule**: Never includes creator phone numbers, emails, UPI IDs, or memo accept-link tokens in event descriptions.
- **Acceptance Criteria**:
  - Route `/api/calendar/[dealId]/ics` serves `Content-Type: text/calendar` with `Content-Disposition: attachment`.
  - Generated `.ics` file imports without warnings into Google Calendar, Apple Calendar, and Microsoft Outlook.
  - Google Calendar web links encode all parameters safely.

---

### Feature 13: YouTube Public Channel Stats [NEW]
- **Tag**: NEW
- **Purpose**: Optionally sets the creator's follower band from public YouTube channel metrics using an API key only (no OAuth, no creator login).
- **User Flow**: Creator pastes their YouTube handle (e.g. `@techcreator`) or channel URL in Onboarding or Settings. System queries YouTube Data API v3 (`channels.list`), fetches subscriber count, maps it to a recommended follower band, and displays a "Use this band" confirmation button.
- **Inputs**: Channel handle, URL, or channel ID.
- **Outputs**: Channel title, thumbnail, subscriber count, recommended follower band.
- **Follower Band Mapping**:
  - 10k – 50k: `nano_10k_50k`
  - 50k – 100k: `micro_50k_100k`
  - 100k – 250k: `mid_100k_250k`
  - 250k – 500k: `macro_250k_500k`
- **Cache & Storage**: Cached for 24 hours in `youtube_links`.
- **Integrity Rule**: System NEVER auto-overwrites the follower band. Creator must explicitly click "Use this band".
- **Acceptance Criteria**:
  - Works with `@handle`, `youtube.com/@handle`, `youtube.com/channel/UC...`, and custom URLs.
  - If `YOUTUBE_API_KEY` is not configured, UI renders a clear "Not configured" state.
  - Hidden subscriber counts (`hiddenSubscriberCount = true`) are handled gracefully with a friendly notice.

---

### Feature 14: Gmail Import (Beta, Test Users Only) [NEW]
- **Tag**: NEW
- **Purpose**: Enables authorized Google test users to import brand pitch emails directly into the Deal Inbox without copy-pasting. Built as a non-breaking beta.
- **Scope Boundary**: Built LAST. Uses restricted scope `https://www.googleapis.com/auth/gmail.readonly` only. Never requests send or modify scopes.
- **User Flow**:
  1. Creator opens `/inbox`, clicks "Import from Gmail (beta)".
  2. If not connected, clicks "Connect Gmail (beta)". Undergoes Google OAuth consent (with testing mode notice).
  3. Once connected, system queries messages with prefilled brand query (`newer_than:30d (collab OR sponsorship OR "paid partnership" OR campaign)`).
  4. Shows up to 20 messages with deterministic "Likely brand offer" badges.
  5. Creator checks desired messages and clicks "Import selected".
  6. Server fetches full text, sanitizes HTML, tokenizes PII, runs Gemini extraction, saves deal with `channel: 'email'`, and redirects to deal workspace.
- **Security & Storage**:
  - Refresh tokens encrypted with AES-256-GCM using `TOKEN_ENCRYPTION_KEY` in `gmail_connections`.
  - Zero client-facing RLS policies on token columns (server service-role only).
  - Raw email bodies and subjects are NEVER persisted in database or logged in audit trails.
  - Duplicate protection via `source_ref = SHA-256(message_id)`.
- **Failure Isolation**:
  - If `GMAIL_ENABLED=false`, hides UI and returns 404 from `/api/gmail/*`.
  - If Google credentials missing, displays "Not configured" state.
  - Paste text and screenshot capture remain 100% functional regardless of Gmail status.
- **Acceptance Criteria**:
  - Tokens are never present in client responses, logs, or error reports.
  - Unlinking/disconnecting revokes token with Google and purges record from `gmail_connections`.
  - Testing mode token expiration (7-day lifecycle) gracefully sets `status: 'needs_reconnect'`.
