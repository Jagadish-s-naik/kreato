# Kreato — Frontend Handoff & Implementation Guide

Welcome! This guide is written specifically for the frontend engineer building the Kreato interface. You do NOT need to read backend code; every route contract, component specification, state matrix, exact copy string, design token, and user flow is defined here.

---

## 🗺️ (a) Screen Map & Navigation

| Route | Purpose | Hosted Features | Access Level |
| :--- | :--- | :--- | :--- |
| `/login` | Authentication & sign-in | Supabase Auth (Magic Link & Password) | Public |
| `/onboarding` | Creator profile setup, niche, follower band, YouTube verification | Profile, YouTube Lookup (Feature 13), Gmail Connect (Feature 14) | Authenticated (New Users) |
| `/dashboard` | High-level pipeline overview, active leaks, overdue tracker | Personal Brand Ledger (Feature 3), Pipeline Stats, Quick Actions | Authenticated |
| `/inbox` | Universal sponsorship ingestion (3 capture tabs) | Deal Inbox (Feature 1), Deal Copilot (Feature 2), Scam Flag (Feature 10) | Authenticated |
| `/deals/[id]` | Deal Workspace, Radar breakdown, negotiation ladder, memo, invoice | Radar (Feature 4), Ladder (Feature 5), Memo (Feature 6), Exclusivity (Feature 7), Invoice & Reminders (Features 8, 9), Calendar Export (Feature 12) | Authenticated (Owner Only) |
| `/settings` | Profile rates, GSTIN, UPI ID, Google connections, audit log, data export | Security & Data Control (Feature 11), YouTube Link (Feature 13), Gmail Connection (Feature 14) | Authenticated |
| `/memo/[token]` | Brand-facing agreement sign-off view | Deal Memo Acceptance (Feature 6) | Public (Token-Gated) |

---

## 🧩 (b) Component Breakdown & Exact Copy Strings

### 1. Mandatory Legal & Trust Disclaimers (Must match verbatim)
- **Simulated Benchmark Data Label**:
  > `"Simulated benchmark data"`
  *(Must appear on every card, tooltip, or table header displaying market rates).*
- **Deal Memo Disclaimer**:
  > `"Summary of terms agreed in chat. Not a legal contract."`
  *(Must appear at the top and bottom of `/memo/[token]` and in the Deal Memo card on `/deals/[id]`).*
- **Gmail Testing Mode Notice**:
  > `"Google may display an 'unverified app' warning during beta testing. Click 'Advanced' -> 'Go to Kreato (unsafe)' to proceed."`
- **Inbox Independent Capture Notice**:
  > `"Paste or screenshot works without connecting Gmail."`
  *(Must remain permanently visible in the Gmail tab on `/inbox`).*

### 2. Screen-by-Screen Component Breakdown

#### A. `/inbox` (Deal Ingestion)
- **Header**: `Deal Inbox`
- **Tabs Component** (3 equal options, query param `?source=paste|screenshot|gmail`):
  1. `Paste text` (Default tab)
     - Textarea placeholder: `"Paste WhatsApp conversation, Instagram DM, or brand email brief here..."`
     - Channel selector: `WhatsApp`, `Instagram DM`, `Email`, `Other`
     - Action button: `"Analyze Deal & Find Leaks"`
  2. `Upload screenshot`
     - Dropzone label: `"Upload screenshot of chat or DM (PNG, JPG)"`
     - Processing badge: `"Extracting text via client OCR..."`
  3. `Import from Gmail (beta)`
     - State A (Not connected): Button `"Connect Gmail (beta)"`, notice text.
     - State B (Connected): Input search box (default `newer_than:30d (collab OR sponsorship OR "paid partnership" OR campaign)`), button `"Search Brand Emails"`.
     - State C (Results): Table with checkbox, sender name, domain, subject, date, badge `"Likely brand offer"`, button `"Import Selected (`n`)"`.

#### B. `/deals/[id]` (Deal Workspace)
- **Primary Hero Banner**:
  - Title: Brand Name (`deals.brand_name`)
  - Status Badge: `New` | `Negotiating` | `Agreed` | `Invoiced` | `Paid`
  - Hero Metric: **`₹ at risk`** (Largest element on screen, styled with `text-red-500 font-extrabold text-4xl`).
- **Section 1: Money Leak Radar**:
  - Radial score or progress bar: `Deal Score (0–100)`
  - 5-row accordion list (Benchmark Gap, Usage Surcharge, Payment Delay Financing, Exclusivity, History Penalty).
- **Section 2: Walk-away Ladder**:
  - 3-column tier selector: `Ideal`, `Acceptable`, `Walk-away Floor`.
  - Action buttons: `"Copy Email Draft"`, `"Copy WhatsApp Draft"`, `"Open in Email Client"`.
- **Section 3: Calendar & Deal Follow-Through**:
  - Button group: `"Download .ics Calendar"`, `"Add to Google Calendar"`.
  - Tooltip when deadline missing: `"Add a deadline to enable calendar sync"`.
- **Section 4: Deal Memo**:
  - Action: `"Generate Deal Memo Link"` -> copies `/memo/[token]`.
- **Section 5: Invoicing & Payment**:
  - Action: `"Generate GST Invoice"`, displays UPI QR Code and `"Add Due Date to Calendar"`.

---

## 🚦 (c) State Matrix for Interactive Features

| Component / Action | Loading State | Empty State | Success State | Error State | Disabled / Offline State | Recovery Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Inbox Extraction** | Spinner with `"Scanning contract terms & calculating leaks..."` | Textarea empty: button disabled | Redirects to `/deals/[id]` | Alert: `"Failed to analyze terms. Please check text and retry."` | Offline banner | Click `"Retry Analysis"` or edit brief |
| **Ladder Draft** | Skeleton loader over draft cards | `"Select a tier to view drafted counter-offer."` | Copy rendered with `"Copy"` button | Alert: `"AI drafter busy. Retrying..."` | Retries 3x automatically | Click `"Regenerate Draft"` |
| **Memo Accept** | Button spinner `"Recording sign-off..."` | Form asks for Signatory Name | Green banner: `"Terms Accepted on [Date]"` | Alert: `"Memo expired or invalid token"` | Sign button disabled if name < 2 chars | Contact creator for fresh link |
| **Calendar Export** | Spinner on download button | N/A | Browser triggers `.ics` file download | Alert: `"Deal has no scheduled dates."` | Button disabled with tooltip | Set deadline in deal card |
| **YouTube Lookup** | Spinner inside handle input | `"Enter your @handle or channel URL"` | Channel card with avatar, sub count & suggested band | Alert: `"Channel not found or quota exceeded"` | Disabled if `YOUTUBE_API_KEY` missing | Check handle spelling or manual band select |
| **Gmail Connect** | Redirecting to Google OAuth | `"Connect your Gmail to pull brand emails"` | Account card: `Connected: creator@gmail.com` | Alert: `"OAuth connection cancelled"` | Shows `"Gmail Not Configured"` if keys missing | Click `"Connect Gmail (beta)"` |
| **Gmail Search** | Skeleton rows (5 lines) | `"No sponsorship emails found in the last 30 days"` | List of up to 20 emails with checkboxes | Alert: `"Session expired. Please reconnect."` | Search button disabled while searching | Click `"Reconnect Gmail"` |
| **Gmail Batch Import** | Modal showing `Importing 3 of 5...` | Checkbox button disabled if 0 selected | Green toast: `"Successfully imported 3 deals"` | Toast: `"1 email failed extraction. 2 imported."` | Checkbox disabled for already imported | Review imported deals on Dashboard |

---

## 🔌 (d) Complete API Contract Table

All request and response contracts use strict TypeScript types exported from [`lib/types/api.ts`](file:///c:/xampp/htdocs/kreato/lib/types/api.ts).

| Method | Endpoint | Auth | Request Body / Query | Success Response Schema | Error Codes | Notes |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `POST` | `/api/copilot/extract` |  Yes | `ExtractDealRequest` | `{ success: true, data: { deal, radar, ladder, brandStats } }` | `400 BAD_REQUEST`, `401 UNAUTHORIZED`, `500 EXTRACTION_FAILED` | Reused by screenshot & Gmail import |
| `POST` | `/api/ladder/draft` |  Yes | `DraftLadderRequest` | `{ success: true, data: { subject, body, whatsapp_text } }` | `400 BAD_REQUEST`, `404 DEAL_NOT_FOUND` | Strict numerical integrity enforced |
| `POST` | `/api/reminder/draft` |  Yes | `DraftReminderRequest` | `{ success: true, data: { subject, body, whatsapp_text } }` | `400 BAD_REQUEST`, `404 INVOICE_NOT_FOUND` | Tone: `friendly` \| `firm` \| `final` |
| `POST` | `/api/memo` |  Yes | `CreateMemoRequest` | `{ success: true, data: { memoId, rawToken, acceptUrl, expiresAt } }` | `400 BAD_REQUEST`, `500 MEMO_FAILED` | Generates 32-byte crypto token |
| `GET` | `/api/memo/[token]` | ❌ No | URL param `token` | `{ success: true, data: { memo, deal, creatorProfile, isExpired, isAlreadyAccepted } }` | `404 NOT_FOUND` | Public brand-facing view |
| `POST` | `/api/memo/[token]/accept`| ❌ No | `AcceptMemoRequest` | `{ success: true, message: string }` | `400 BAD_REQUEST`, `410 EXPIRED` | Records signatory name, IP & timestamp |
| `GET` | `/api/deals` |  Yes | Query `?status=new\|agreed...` | `{ success: true, data: Deal[] }` | `401 UNAUTHORIZED` | Ordered by `created_at DESC` |
| `GET` | `/api/deals/[id]` |  Yes | URL param `id` | `{ success: true, data: Deal }` | `404 DEAL_NOT_FOUND` | Includes joined memos and invoices |
| `PATCH`| `/api/deals/[id]` |  Yes | Partial deal fields | `{ success: true, data: Deal }` | `400 BAD_REQUEST` | Updates status or terms |
| `DELETE`| `/api/deals/[id]` |  Yes | URL param `id` | `{ success: true }` | `404 DEAL_NOT_FOUND` | Cascade deletes memos/invoices |
| `GET` | `/api/brand-ledger` |  Yes | None | `{ success: true, data: BrandLedgerEntry[] }` | `401 UNAUTHORIZED` | Aggregates payment delay history |
| `GET` | `/api/benchmarks` |  Yes | Query `?niche=...&follower_band=...`| `{ success: true, data: Benchmark[] }` | `400 BAD_REQUEST` | Read-only simulated benchmark rates |
| `GET` | `/api/invoices` |  Yes | Query `?deal_id=...` | `{ success: true, data: Invoice[] }` | `401 UNAUTHORIZED` | Lists deal invoices |
| `POST` | `/api/invoices` |  Yes | `CreateInvoiceRequest` | `{ success: true, data: Invoice }` | `400 BAD_REQUEST` | Generates FY-compliant numbering |
| `POST` | `/api/payments` |  Yes | `RecordPaymentRequest` | `{ success: true, data: Payment }` | `400 BAD_REQUEST` | Transitions deal & invoice to `paid` |
| `GET` | `/api/calendar/[dealId]/ics`|  Yes| URL param `dealId` | Returns `text/calendar` file download | `404 DEAL_NOT_FOUND`, `400 NO_DATES` | RFC 5545 compliant `.ics` |
| `GET` | `/api/youtube/stats` |  Yes | Query `?input=@handle` | `{ success: true, data: YouTubeChannelStats }` | `400 BAD_REQUEST`, `404 NOT_FOUND`, `503 QUOTA_EXCEEDED` | Returns 503 if API key missing |
| `POST` | `/api/youtube/link` |  Yes | `YouTubeLinkRequest` | `{ success: true, data: YouTubeLink }` | `400 BAD_REQUEST` | Saves link and updates verified band |
| `DELETE`| `/api/youtube/unlink`|  Yes | None | `{ success: true }` | `401 UNAUTHORIZED` | Removes verified band |
| `GET` | `/api/gmail/status` |  Yes | None | `{ success: true, data: { isConfigured, isConnected, googleEmail, status } }` | `404 NOT_FOUND` (if GMAIL_ENABLED=false) | Safe client view without tokens |
| `GET` | `/api/gmail/connect` |  Yes | None | Redirects to Google OAuth consent | `404 NOT_FOUND` (if disabled) | Initiates PKCE OAuth flow |
| `GET` | `/api/gmail/callback`|  Yes | Query `?code=...&state=...` | Redirects to `/inbox?source=gmail&connected=true` | `400 INVALID_STATE` | Exchanges & encrypts refresh token |
| `GET` | `/api/gmail/search` |  Yes | Query `?q=...&max_results=20` | `{ success: true, data: GmailMessageMetadata[] }` | `401 NEEDS_RECONNECT`, `500 GMAIL_ERROR` | In-memory metadata; no bodies stored |
| `POST` | `/api/gmail/import` |  Yes | `GmailImportRequest` | `{ success: true, data: { importedDeals: Deal[], skippedCount, failedCount } }` | `400 BAD_REQUEST` | Deduplicates via `source_ref` SHA-256 |
| `POST` | `/api/gmail/disconnect`| Yes| None | `{ success: true }` | `401 UNAUTHORIZED` | Revokes Google token & deletes row |
| `GET` | `/api/user/profile` |  Yes | None | `{ success: true, data: Profile }` | `401 UNAUTHORIZED` | Creator settings and base rates |
| `PATCH`| `/api/user/profile` |  Yes | Partial profile fields | `{ success: true, data: Profile }` | `400 BAD_REQUEST` | Updates UPI, GSTIN, follower band |
| `GET` | `/api/user/audit-log`|  Yes | None | `{ success: true, data: AuditLogEntry[] }` | `401 UNAUTHORIZED` | Immutable creator action history |
| `GET` | `/api/user/export` |  Yes | None | Complete JSON export of all creator data | `401 UNAUTHORIZED` | GDPR/DPDP compliant export |
| `POST` | `/api/user/delete` |  Yes | None | `{ success: true }` | `401 UNAUTHORIZED` | Permanent account cascade deletion |

---

## 📊 (e) Exact JSON Data Shapes

### 1. Deal Object
```json
{
  "id": "5c92ccba-2bba-49c4-89fd-154a17658856",
  "brand_name": "Boat Lifestyle",
  "brand_key": "boat_lifestyle",
  "brand_domain": "boat-lifestyle.com",
  "category": "tech_gadgets",
  "channel": "email",
  "fee_paise": 3500000,
  "deliverables": [
    { "format": "reel", "count": 1, "duration_seconds": 60 },
    { "format": "story", "count": 2 }
  ],
  "deadline": "2026-11-20",
  "payment_terms": { "days": 45, "advance_percent": 0 },
  "usage_rights": { "type": "perpetual", "months": null, "paid_ads_allowed": true },
  "exclusivity": { "category": "Audio & Electronics", "days": 30 },
  "status": "new",
  "source_ref": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "created_at": "2026-11-01T15:30:00.000Z"
}
```

### 2. Money Leak Radar Lines
```json
{
  "fairFeePaise": 5500000,
  "totalAtRiskPaise": 2840000,
  "totalDelayCostPaise": 340000,
  "breakdown": [
    {
      "label": "Benchmark Fee Gap",
      "paise": 2000000,
      "formula": "max(0, ₹55,000 Fair Benchmark - ₹35,000 Offer)",
      "description": "Difference between market median deliverable rate and proposed fee."
    },
    {
      "label": "Commercial Usage Surcharge",
      "paise": 2750000,
      "formula": "Fair Fee × 50% Perpetual Usage",
      "description": "Royalty for perpetual commercial digital ad buyout."
    },
    {
      "label": "Payment Delay Financing Cost",
      "paise": 340000,
      "formula": "(₹35,000 × 18% × 30 days / 365) + 2% Risk Premium",
      "description": "Opportunity cost of financing 45-day credit terms."
    }
  ]
}
```

### 3. Walk-Away Ladder Tiers
```json
{
  "ideal": {
    "feePaise": 7250000,
    "paymentDays": 15,
    "advancePercent": 50,
    "usageRightsSummary": "Strictly 90 days; no perpetual rights",
    "termsSummary": "50% advance, balance within 15 days of live link"
  },
  "acceptable": {
    "feePaise": 5500000,
    "paymentDays": 30,
    "advancePercent": 0,
    "usageRightsSummary": "3 months digital ads allowed",
    "termsSummary": "Net 30 days payment cycle"
  },
  "walkaway": {
    "feePaise": 4400000,
    "paymentDays": 30,
    "advancePercent": 0,
    "usageRightsSummary": "Organic reposting only",
    "termsSummary": "Hard floor: below this creator walks away"
  }
}
```

---

## 🎨 (f) Radar & Ladder Display Rules

1. **Animated "₹ at risk" Counter**:
   - Use `framer-motion` to animate from `0` to `totalAtRiskPaise / 100` over `1.2s` with `easeOut`.
   - Formatted in Indian numbering system: `₹28,400` (via `Intl.NumberFormat('en-IN')`).
2. **"₹ Recovered" Badge**:
   - When a creator agrees to a counter-offer above the original fee, display green pill:
   - `"+ ₹15,000 Recovered"` (`(agreedFeePaise - originalFeePaise) / 100`).
3. **Expandable Calculation Drawer**:
   - Clicking any Radar line item expands a drawer revealing the exact formula, math inputs, and plain-English explanation.
4. **Currency Rule**:
   - All backend numbers are **integer paise**. Always divide by 100 before rendering to the user:
   - `function formatINR(paise: number) { return "₹" + (paise / 100).toLocaleString("en-IN"); }`

---

## 🎯 (g) Design Tokens & Component Styling

| Design Role | Tailwind Class | Semantic Usage |
| :--- | :--- | :--- |
| **Primary Accent** | `bg-indigo-600 text-white` | Primary call-to-actions, Analyze button |
| **Risk Red** | `text-rose-600 bg-rose-50 border-rose-200` | "₹ at risk", danger scam flags, perpetual rights warning |
| **Warning Amber** | `text-amber-600 bg-amber-50 border-amber-200` | Exclusivity clashes, credit terms > 30 days, suspicious email domains |
| **Success Green** | `text-emerald-600 bg-emerald-50 border-emerald-200` | "₹ recovered", paid invoice status, verified YouTube channel |
| **Card Background**| `bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800` | Deal cards, Radar summary containers |

### Accessibility (a11y) Requirements
- All text must meet WCAG AA contrast ratio ($\ge 4.5:1$).
- Interactive cards must support full keyboard navigation (`Tab`, `Enter`, `Space`).
- Provide explicit `aria-label` attributes on icon-only buttons (copy buttons, external links).
- Respect `prefers-reduced-motion` for the animated currency counter.

---

## 📱 (h) Responsive Breakpoints & Mobile Optimization

- **Mobile Viewport (`< 768px`)**:
  - Inbox capture tabs scroll horizontally without wrapping.
  - Deal Workspace collapses into a single-column layout:
    1. Hero Banner ("₹ at risk")
    2. Radar Overview
    3. Action Button Group (Sticky bottom bar on mobile: `"Counter"`, `"Memo"`, `"Invoice"`)
  - Touch targets must be at least `44px x 44px`.

---

## 🚫 (i) "Do Not Do" Developer Checklist (Crucial)

1. **NEVER show raw access tokens or refresh tokens** in UI, console logs, or network payloads.
2. **NEVER auto-send emails or WhatsApp messages**. The app only generates drafts and copies to clipboard or launches native clients.
3. **NEVER auto-overwrite the creator's follower band** upon YouTube lookup. Always require explicit button confirmation.
4. **NEVER display benchmark rates without the label**: `"Simulated benchmark data"`.
5. **NEVER store or display raw email bodies or passwords**.

---

## ✅ (j) Definition of Ready Checklist for Frontend Engineer

- [ ] `/inbox` renders Paste (default), Screenshot, and Gmail (beta) tabs with proper query param syncing.
- [ ] `/deals/[id]` renders "₹ at risk" as the primary focal element.
- [ ] Radar 5-line breakdown expands to show formula and description.
- [ ] Walk-away Ladder renders Ideal, Acceptable, and Walk-away cards with copy buttons.
- [ ] Deal Memo generator creates public URL and copies to clipboard.
- [ ] Calendar export button downloads `.ics` and Google Calendar link opens prefilled web event.
- [ ] YouTube channel field in settings fetches stats and renders confirmation button.
- [ ] Gmail connect button initiates OAuth and handles "unverified app" test user flow.

