# Kreato — Backend & Database Master Implementation Plan

> **Role & Boundary**: This plan governs the **Backend Services**, **API Routes**, **Database Layer (Supabase)**, and **Pure Deterministic Calculation Engines (`/lib`)**.  
> The Frontend UI components, layouts, styling, and client-side OCR workers are being developed in parallel by the frontend collaborator. This document establishes the exact architectural contract, database schemas, API specs, and setup steps so both sides integrate seamlessly without ambiguity.

---

## 1. System Architecture & Directory Boundaries

```
kreato/
├── backend/                       # SERVER-ONLY DOMAIN & BUSINESS SERVICES
│   ├── plan.md                    # THIS SPECIFICATION & BUILD ROADMAP
│   ├── api/                       # Shared API handler utilities & helpers
│   ├── services/                  # Core server-side services (Server-only)
│   │   ├── llm.service.ts         # Gemini SDK orchestrator, prompt injection isolation, backoff
│   │   ├── rate-limit.service.ts  # Per-user sliding window limiter (20 req / 10 min)
│   │   ├── audit.service.ts       # Append-only audit logging helper
│   │   ├── deal.service.ts        # Deal lifecycle manager & brand ledger analytics
│   │   ├── memo.service.ts        # Token generation, SHA-256 hashing & public verification
│   │   └── invoice.service.ts     # Sequential FY invoice generation & payment tracking
│   └── supabase/                  # Supabase database clients
│       ├── server.ts              # Authenticated SSR client (@supabase/ssr)
│       ├── service.ts             # Service-role admin client (public memo sign-off)
│       ├── client.ts              # Browser client for frontend export
│       └── database.types.ts      # Strongly-typed database entity definitions
│
├── lib/                           # PURE DETERMINISTIC ENGINES (0 React, 0 DB, 0 LLM)
│   ├── config/
│   │   ├── app.ts                 # App-wide metadata constants
│   │   └── radar.ts               # Radar mathematical rates & baseline constants
│   ├── currency.ts                # Integer paise to INR (en-IN) & Indian number parser
│   ├── dates.ts                   # IST calendar math & Indian Financial Year calculations
│   ├── clock.ts                   # Virtual time-travel offset calculator (sim_days_offset)
│   ├── mask.ts                    # PII regex tokenizer (Phone, Email, UPI, PAN, GSTIN)
│   ├── radar.ts                   # Money Leak Radar (Benchmark gap, Usage, Delay, Exclusivity)
│   ├── ladder.ts                  # Walk-away Ladder tier engine (Ideal, Acceptable, Walk-away)
│   ├── scam.ts                    # Scam detection rule engine (Levenshtein, advance fee, injection)
│   ├── exclusivity.ts             # Overlapping campaign dates & category clash detector
│   ├── gst.ts                     # Sequential FY invoice numbering & CGST/SGST vs IGST calculation
│   └── upi.ts                     # upi://pay URI generator and QR string validator
│
├── app/api/                       # NEXT.JS APP ROUTER ENDPOINTS
│   ├── copilot/extract/route.ts   # POST /api/copilot/extract (Gemini Deal Ingestion)
│   ├── ladder/draft/route.ts      # POST /api/ladder/draft (Counter-offer drafting)
│   ├── reminder/draft/route.ts    # POST /api/reminder/draft (Overdue payment reminder drafter)
│   ├── memo/[token]/route.ts      # GET /api/memo/[token] (Public brand deal viewer)
│   ├── memo/[token]/accept/route.ts # POST /api/memo/[token]/accept (Public brand sign-off)
│   ├── deals/route.ts             # GET & POST /api/deals (Creator deals ledger)
│   ├── deals/[id]/route.ts        # GET, PATCH, DELETE /api/deals/[id]
│   ├── brand-ledger/route.ts      # GET /api/brand-ledger (Brand history & payment speeds)
│   ├── benchmarks/route.ts        # GET /api/benchmarks (Niche & follower band rate cards)
│   ├── invoices/route.ts          # GET & POST /api/invoices (Creator invoice records)
│   ├── payments/route.ts          # POST /api/payments (Record payment & update brand ledger)
│   ├── user/profile/route.ts      # GET & PATCH /api/user/profile (Creator settings & sim clock)
│   ├── user/audit-log/route.ts    # GET /api/user/audit-log (Append-only audit trail)
│   ├── user/export/route.ts       # GET /api/user/export (Full JSON data export)
│   └── user/delete/route.ts       # POST /api/user/delete (GDPR creator account purge)
│
├── supabase/
│   ├── migrations/
│   │   └── 001_init.sql           # Complete schema, enums, tables, indexes & RLS policies
│   └── seed.sql                   # 240 benchmark rows (12 niches × 4 bands × 5 formats)
│
└── tests/                         # AUTOMATED TESTING SUITES
    ├── unit/                      # 100% test coverage on pure /lib modules
    ├── integration/               # Rate limit, audit log, and Gemini schemas
    └── security/                  # RLS multi-tenant boundary verification
```

---

## 2. Setup Guide for the User (Actionable Steps)

Follow these steps to configure your local environment and cloud services:

### Step 2.1: Supabase Setup (Database & Auth)
1. Go to [supabase.com](https://supabase.com) and create a free project named `kreato` (or use local Supabase CLI via `npx supabase start`).
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Run `supabase/migrations/001_init.sql` to generate all tables, enums, indexes, and RLS policies.
4. Run `supabase/seed.sql` to populate the 240 benchmark combinations and demo brand history.
5. In your Supabase Dashboard, navigate to **Project Settings -> API**:
   - Copy **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - Copy **anon public** API key
   - Copy **service_role** secret key (keep strictly secret, never commit)

### Step 2.2: Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Create a free API key.
3. Model used: `gemini-2.5-flash` (or `gemini-1.5-flash`).

### Step 2.3: Environment Configuration (`.env.local`)
Create a `.env.local` file in the project root:
```env
# Supabase (Public & SSR)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Supabase Server-Only (Strictly for public memo token verification)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Google Gemini API
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.5-flash

# Base URL for memo acceptance links and callbacks
APP_URL=http://localhost:3000
```

---

## 3. Database Layer Specification

### 3.1. Entity Relationship & Schemas
All amounts are stored as **64-bit integer paise** (`BIGINT` where 1 INR = 100 paise) to prevent any floating-point rounding issues.

| Table | Primary Key | Key Columns | RLS Security Rule |
| :--- | :--- | :--- | :--- |
| `profiles` | `id` (UUID -> auth.users) | `display_name`, `niche`, `follower_band`, `state`, `gstin`, `upi_vpa`, `min_fee_paise`, `sim_days_offset` | `id = auth.uid()` |
| `benchmarks` | `id` (UUID) | `niche`, `follower_band`, `format`, `median_paise`, `min_paise`, `max_paise`, `is_simulated` | Read-only for authenticated users |
| `deals` | `id` (UUID) | `user_id`, `brand_name`, `brand_key`, `brand_domain`, `category`, `channel`, `deliverables` (JSONB), `fee_paise`, `usage_rights` (JSONB), `exclusivity` (JSONB), `payment_terms` (JSONB), `risky_quotes` (JSONB), `scam_result` (JSONB), `status` | `user_id = auth.uid()` |
| `drafts` | `id` (UUID) | `user_id`, `deal_id`, `kind`, `tier`, `language`, `body`, `numbers` (JSONB), `status` | `user_id = auth.uid()` |
| `memos` | `id` (UUID) | `user_id`, `deal_id`, `content` (JSONB), `accept_token_hash` (TEXT UNIQUE), `expires_at`, `accepted_at`, `accepted_by_name` | Creator view: `user_id = auth.uid()`. Public sign-off: via `service.ts` matching hash. |
| `invoices` | `id` (UUID) | `user_id`, `deal_id`, `invoice_number`, `issue_date`, `due_date`, `supplier_snapshot` (JSONB), `client_snapshot` (JSONB), `line_items` (JSONB), `tax` (JSONB), `total_paise`, `upi_link`, `status` | `user_id = auth.uid()` |
| `payments` | `id` (UUID) | `user_id`, `deal_id`, `paid_at`, `amount_paise`, `promised_days`, `actual_days` | `user_id = auth.uid()` |
| `audit_log` | `id` (UUID) | `user_id`, `action`, `entity`, `entity_id`, `detail` (JSONB), `created_at` | Append-only: SELECT & INSERT only. NO UPDATE or DELETE. |
| `ai_usage` | `id` (UUID) | `user_id`, `route`, `created_at` | `user_id = auth.uid()`. Used for sliding window rate limiting. |

### 3.2. Database Seed (`supabase/seed.sql`)
Populate the complete matrix of benchmark rates across:
- **12 Niches**: `skincare`, `haircare`, `makeup`, `fashion`, `food_beverage`, `fitness`, `tech_gadgets`, `finance`, `travel`, `gaming`, `education`, `other`
- **4 Follower Bands**:
  - `nano_10k_50k` (Reel: ~₹8,000–₹15,000)
  - `micro_50k_100k` (Reel: ~₹20,000–₹35,000)
  - `mid_100k_250k` (Reel: ~₹40,000–₹75,000)
  - `macro_250k_500k` (Reel: ~₹80,000–₹1,50,000)
- **5 Formats**: `reel`, `story`, `post`, `youtube_video`, `short`
- Total records: $12 \times 4 \times 5 = 240$ rows.

---

## 4. Pure Deterministic Business Logic Modules (`/lib`)

These engines have **zero dependencies** on React, Next.js, Supabase, or external APIs. They can be tested 100% in isolation with Vitest.

### 4.1. `lib/currency.ts`
- `formatPaiseToINR(paise: number, options?: { showPaise?: boolean }): string`:
  - Formats paise to Indian Rupee notation using `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.
  - Example: `2500000` paise -> `"₹25,000"`.
- `parseIndianAmountToPaise(input: string | number): number | null`:
  - Parses Indian shorthand formats:
    - `"30k"` -> `3,000,000` paise (₹30,000)
    - `"1.5L"` / `"1.5 Lakh"` -> `15,000,000` paise (₹1,50,000)
    - `"₹25,000/-"` -> `2,500,000` paise (₹25,000)
    - `"15000"` -> `1,500,000` paise (₹15,000)

### 4.2. `lib/dates.ts` & `lib/clock.ts`
- `getEffectiveDate(simDaysOffset: number = 0): Date`:
  - Calculates virtual current time: `new Date(Date.now() + simDaysOffset * 86400000)`.
- `calculateIndianFinancialYear(date: Date): { startYear: number; endYear: number; label: string }`:
  - Financial year runs April 1 to March 31.
  - If date is `2026-11-01` -> FY `2026-27`.
  - If date is `2027-02-15` -> FY `2026-27`.
- `calculateDueDate(issueDate: Date, paymentDays: number): Date`
- `calculateDaysOverdue(dueDate: Date, effectiveDate: Date): number`

### 4.3. `lib/mask.ts` (PII Tokenizer)
Ensures raw personal contact details never reach the LLM or third-party logging:
- Indian 10-digit mobile phones (`+91 9876543210`, `09876543210`, `98765 43210`) -> `[PHONE_1]`, `[PHONE_2]`
- Email addresses -> `[EMAIL_1]`, `[EMAIL_2]`
- UPI Virtual Payment Addresses (`creator@okaxis`, `name@ybl`) -> `[UPI_1]`
- PAN card numbers (`[A-Z]{5}[0-9]{4}[A-Z]{1}`) -> `[PAN_1]`
- GSTIN numbers (`27AAAAA0000A1Z5`) -> `[GSTIN_1]`
- `detokenize(text: string, map: Map<string, string>): string`

### 4.4. `lib/radar.ts` (Money Leak Radar Engine)
Computes exact financial risk in paise following `docs/RADAR_SPEC.md`:
1. **Benchmark Gap**: $\max(0, \text{Fair Fee} - \text{Offered Fee})$
2. **Usage Rights Leak**:
   - `none` / `organic`: $0\%$
   - `paid_ads` $\le 3$ months: $10\%$ of Fair Fee
   - `paid_ads` $4$–$6$ months: $20\%$ of Fair Fee
   - `paid_ads` $7$–$12$ months: $40\%$ of Fair Fee
   - `perpetual` / `unspecified`: $100\%$ of Fair Fee
3. **Payment Delay Financing Cost**:
   - Baseline credit: $15$ days.
   - Financing Cost: $\text{round}(\text{Offered Fee} \times 0.18 \times \frac{\max(0, \text{days} - 15)}{365})$
   - Risk Premium: If $\text{days} > 30$, $\text{round}(\text{Offered Fee} \times 0.02 \times \lfloor \frac{\text{days} - 30}{30} \rfloor)$
4. **Exclusivity Leak Surcharge**:
   - Rate: $15\%$ of Fair Fee per $30$ days (prorated). Cap at $100\%$.
5. **Brand History Delay Surcharge**:
   - If average past payment delay $> 0$: $\text{round}(\text{Offered Fee} \times 0.18 \times \frac{\text{avg\_days\_late}}{365})$
6. **Total ₹ at Risk**: Sum of all five components.

### 4.5. `lib/ladder.ts` (Walk-away Ladder Matrix)
Computes 3 non-negotiable negotiation tiers:
- **Ideal Tier**:
  - Fee = $\text{Fair Fee} + \text{Usage Surcharge} + \text{Exclusivity Surcharge}$
  - Payment terms = 15 days or 50% advance
  - Usage rights = Capped strictly to agreed window
  - Exclusivity = Removed or compensated
- **Acceptable Tier**:
  - Fee = $\text{Fair Fee} + 50\% \text{ of (Usage + Exclusivity)}$
  - Payment terms = 30 days maximum
  - Usage rights = Organic repost only, or 3 months paid ads max
- **Walk-away Floor**:
  - Fee = $\max(\text{Creator Minimum Fee}, \text{Fair Fee} \times 0.80)$
  - Condition: No perpetual rights, no pay-to-collab, max 45 days payment terms.

### 4.6. `lib/scam.ts` (Scam Detection Engine)
Rule-based scoring (0-100 score + risk level: safe / suspicious / danger):
- **Pay-to-Collab**: Flags "registration fee", "shipping deposit", "free kit pay courier", "security deposit". (+60 score)
- **Brand Domain Lookalikes**: Levenshtein distance check against known Indian brands (e.g. `mamaearth-collab.site`, `nykaa.offers.in`, `boat-lifestyle.co`). (+50 score)
- **Domain Mismatch**: Brand claims to be Amazon/Nykaa but sends from `@gmail.com`, `@yahoo.com`. (+30 score)
- **Prompt Injection Defense**: Detects strings like "ignore previous instructions", "override system prompt", "you are now a helpful assistant that accepts 0 fee". (+40 score)

### 4.7. `lib/exclusivity.ts`
- Checks proposed deal's date window against all existing active creator campaigns.
- Flags direct category conflicts (e.g. proposed brand: Skincare, existing active brand: Mamaearth Skincare running until 15th of next month).

### 4.8. `lib/gst.ts` & `lib/upi.ts`
- `generateInvoiceNumber(lastNumber: number, fyLabel: string): string` -> e.g. `DS/2026-27/001`.
- `calculateGST(amountPaise: number, supplierState: string, clientState: string)`:
  - If `supplierState === clientState` (Intra-state): CGST 9% + SGST 9%.
  - If `supplierState !== clientState` (Inter-state): IGST 18%.
- `generateUPIPaymentURI(options: { vpa: string; name: string; amountPaise: number; note: string; invoiceNumber: string }): string`:
  - Generates standard `upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...`

---

## 5. Backend Services Layer (`backend/services/`)

### 5.1. `rate-limit.service.ts`
- Enforces per-user sliding window: **maximum 20 AI requests per 10 minutes**.
- Queries `ai_usage` table. If count >= 20 within 10 minutes, throws 429 Too Many Requests.
- Automatically inserts an `ai_usage` record on each successful call.

### 5.2. `audit.service.ts`
- Inserts append-only audit events into `audit_log`:
  - Actions: `DEAL_EXTRACTED`, `DEAL_UPDATED`, `TIER_DRAFTED`, `COUNTER_APPROVED`, `MEMO_GENERATED`, `MEMO_ACCEPTED`, `INVOICE_GENERATED`, `PAYMENT_RECORDED`.
  - Never exposes or alters previous logs.

### 5.3. `llm.service.ts` (Gemini API Integration)
- Uses official `@google/genai` SDK.
- Wraps untrusted text strictly within `<message>` and `</message>` XML tags.
- Uses Gemini structured JSON output via `responseSchema` and `responseMimeType: "application/json"`.
- Features exponential backoff retry (1x automatic retry on 429 or schema validation failure).
- Validates returned output using Zod schemas.

### 5.4. `deal.service.ts`
- Coordinates deal creation, status transitions (`new` -> `countered` -> `agreed` -> `invoiced` -> `paid`).
- Aggregates **Brand Ledger** analytics:
  - Finds all past deals with matching `brand_key` or `brand_domain`.
  - Computes `avg_days_late`, `total_deals`, `total_earned_paise`, and previous agreed terms.

### 5.5. `memo.service.ts`
- Generates 32-byte cryptographically secure acceptance tokens (`crypto.randomBytes(32).toString('hex')`).
- Stores SHA-256 hash of token in `memos.accept_token_hash`.
- Validates token against database using `backend/supabase/service.ts` (service-role client).
- Checks 14-day expiry window.

### 5.6. `invoice.service.ts`
- Formats line items, calculates tax, generates sequential invoice number.
- Records payment confirmation in `payments` table and updates deal status to `paid`.

---

## 6. API Route Handlers Specification (Contract with Frontend)

### 6.1. `POST /api/copilot/extract`
Extracts structured terms from masked deal text or OCR content.
- **Request Body**:
  ```json
  {
    "raw_text": "Hey Diya! We loved your reels. Want to collab with Plum Goodness for 1 Reel and 2 Stories. Deliverables by 25 Nov. Commercial: 25k. 60 days payment cycle. Whitelisting for 6 months. 60 days category exclusivity.",
    "channel": "instagram_dm"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "deal": {
      "id": "uuid-v4",
      "brand_name": "Plum Goodness",
      "brand_domain": "plumgoodness.com",
      "category": "skincare",
      "channel": "instagram_dm",
      "deliverables": [
        { "format": "reel", "quantity": 1 },
        { "format": "story", "quantity": 2 }
      ],
      "fee_paise": 2500000,
      "deadline": "2026-11-25",
      "usage_rights": { "type": "paid_ads", "months": 6, "paid_ads_allowed": true },
      "exclusivity": { "category": "skincare", "days": 60 },
      "payment_terms": { "days": 60, "advance_percent": 0 },
      "risky_quotes": [
        "60 days payment cycle",
        "Whitelisting for 6 months",
        "60 days category exclusivity"
      ],
      "scam_result": { "score": 0, "level": "safe", "reasons": [] },
      "radar": {
        "fair_fee_paise": 4500000,
        "benchmark_gap_paise": 2000000,
        "usage_surcharge_paise": 900000,
        "delay_cost_paise": 105479,
        "exclusivity_cost_paise": 1350000,
        "history_penalty_paise": 57945,
        "total_at_risk_paise": 4413424
      },
      "ladder": {
        "ideal": { "fee_paise": 6750000, "terms": "15 days, 50% advance, 3 months usage" },
        "acceptable": { "fee_paise": 5625000, "terms": "30 days, 3 months usage" },
        "walkaway": { "fee_paise": 3600000, "terms": "30 days, no whitelisting" }
      }
    }
  }
  ```

### 6.2. `POST /api/ladder/draft`
Drafts an assertive, polite counter-offer message in English or Hinglish strictly anchored to the computed ladder tier numbers.
- **Request Body**:
  ```json
  {
    "deal_id": "uuid-v4",
    "tier": "acceptable",
    "language": "hinglish"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "draft_id": "uuid-v4",
    "body": "Hi team Plum Goodness, thanks for reaching out! Delighted to collaborate. Given our engagement rates and deliverables (1 Reel + 2 Stories), our standard rate is ₹56,250 with 30 days payment terms and 3 months digital usage. Let me know if this works so we can lock in the slot!",
    "tier": "acceptable",
    "language": "hinglish",
    "wa_link": "https://wa.me/?text=...",
    "mailto_link": "mailto:?subject=...&body=..."
  }
  ```

### 6.3. `POST /api/reminder/draft`
Drafts an escalating payment reminder for overdue invoices.
- **Request Body**:
  ```json
  {
    "deal_id": "uuid-v4",
    "tone": "firm", // "friendly" | "firm" | "final"
    "language": "en"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "draft_id": "uuid-v4",
    "body": "Dear Plum Goodness Finance Team, This is a reminder regarding Invoice #DS/2026-27/001 for ₹56,250, which was due on 2026-10-15 and is now 17 days overdue. Please share the UTR / payment confirmation at your earliest convenience. UPI Payment QR is attached on the invoice.",
    "wa_link": "https://wa.me/?text=...",
    "mailto_link": "mailto:?subject=..."
  }
  ```

### 6.4. `GET /api/memo/[token]` & `POST /api/memo/[token]/accept` (Public)
Public endpoints used by brand managers to review and accept the Deal Memo without requiring an account.
- **GET Response (200 OK)**:
  Returns deal terms snapshot, creator display name, deliverables, fee, usage rights, and token validity status.
- **POST Request**:
  ```json
  {
    "signatory_name": "Rohan Sharma, Marketing Lead"
  }
  ```
- **POST Response (200 OK)**:
  Updates `deals.status = 'agreed'`, records `memos.accepted_at`, and writes to `audit_log`.

### 6.5. Additional Management Routes
- `GET /api/deals`: List all deals for authenticated creator with filter by status (`new`, `countered`, `agreed`, `invoiced`, `paid`).
- `PATCH /api/deals/[id]`: Update deal deliverables, fee, or custom terms. Triggers instant recalculation of Radar and Ladder in response.
- `GET /api/brand-ledger`: Fetch all unique brands, past deal counts, average delay in days, and total earnings.
- `POST /api/payments`: Mark deal as paid, capturing `promised_days` vs `actual_days` to feed into future brand delay calculations.
- `GET /api/user/profile` & `PATCH /api/user/profile`: View/edit creator profile, UPI VPA, GSTIN, and `sim_days_offset`.
- `GET /api/user/export`: Download all creator data in JSON format for complete data ownership.
- `POST /api/user/delete`: Typed confirmation deletion purging all user rows across all tables (GDPR compliance).

---

## 7. Frontend Integration Contract & Shared Types

To ensure full compatibility with the frontend team:
1. All API endpoints return standard JSON response formats:
   ```typescript
   type ApiResponse<T> = 
     | { success: true; data: T }
     | { success: false; error: { code: string; message: string; details?: any } };
   ```
2. Export all core types in `lib/types/` and `backend/supabase/database.types.ts`:
   - `CreatorProfile`, `Deal`, `DeliverableItem`, `UsageRights`, `ExclusivityTerms`, `PaymentTerms`
   - `RadarResult`, `RadarBreakdownItem`, `LadderTiers`, `ScamResult`
   - `DealMemoContent`, `InvoiceRecord`, `PaymentRecord`
3. Frontend can import pure calculation functions directly from `@/lib/*` for instantaneous zero-latency UI recomputations when creator edits sliders or deal inputs in the browser.

---

## 8. Step-by-Step Backend Implementation Roadmap

Follow this exact build order:

```mermaid
flowchart TD
    P1[Phase 1: Deterministic Core Engines in /lib] --> P2[Phase 2: Database Setup & Seed]
    P2 --> P3[Phase 3: Supabase Clients & Database Types]
    P3 --> P4[Phase 4: Backend Services Layer]
    P4 --> P5[Phase 5: API Route Handlers]
    P5 --> P6[Phase 6: Vitest Test Suite Execution]
    P6 --> P7[Phase 7: Frontend Handoff Verification]
```

### Phase 1: Core Deterministic Modules (`/lib`)
- [ ] Implement `lib/currency.ts` (Paise conversion, Indian formatting, parsing)
- [ ] Implement `lib/dates.ts` & `lib/clock.ts` (IST calendar, financial year, simulated clock)
- [ ] Implement `lib/mask.ts` (PII regex masking & detokenization)
- [ ] Implement `lib/config/radar.ts` & `lib/radar.ts` (Radar mathematical engine)
- [ ] Implement `lib/ladder.ts` (Ideal, Acceptable, Walk-away calculation)
- [ ] Implement `lib/scam.ts` (Scam scoring, Levenshtein brand matching, prompt injection check)
- [ ] Implement `lib/exclusivity.ts` (Overlapping campaign clash detection)
- [ ] Implement `lib/gst.ts` (Intra/inter-state GST calculation, sequential numbering)
- [ ] Implement `lib/upi.ts` (`upi://pay` URI string generation)

### Phase 2: Database Setup & Seed (`supabase/`)
- [ ] Review `supabase/migrations/001_init.sql`
- [ ] Create `supabase/seed.sql` containing full matrix of 240 benchmark entries
- [ ] Provide user with migration execution instructions in Supabase SQL editor

### Phase 3: Supabase Clients & Typed Definitions
- [ ] Generate/create `backend/supabase/database.types.ts`
- [ ] Implement `backend/supabase/server.ts` (SSR server client)
- [ ] Implement `backend/supabase/service.ts` (Service role client)
- [ ] Implement `backend/supabase/client.ts` (Browser client export)

### Phase 4: Backend Services Layer (`backend/services/`)
- [ ] Implement `backend/services/rate-limit.service.ts` (20 req / 10 min window)
- [ ] Implement `backend/services/audit.service.ts` (append-only audit trail)
- [ ] Implement `backend/services/llm.service.ts` (Gemini SDK client with `<message>` isolation)
- [ ] Implement `backend/services/deal.service.ts` (Deal lifecycle & brand ledger)
- [ ] Implement `backend/services/memo.service.ts` (Secure token hash & verification)
- [ ] Implement `backend/services/invoice.service.ts` (Invoicing & payment tracking)

### Phase 5: API Route Handlers (`app/api/`)
- [ ] Build `POST /api/copilot/extract`
- [ ] Build `POST /api/ladder/draft`
- [ ] Build `POST /api/reminder/draft`
- [ ] Build `GET /api/memo/[token]` & `POST /api/memo/[token]/accept`
- [ ] Build `GET /api/deals` & `POST /api/deals`
- [ ] Build `GET`, `PATCH`, `DELETE /api/deals/[id]`
- [ ] Build `GET /api/brand-ledger`
- [ ] Build `GET /api/benchmarks`
- [ ] Build `POST /api/payments`
- [ ] Build `GET /api/user/profile`, `PATCH /api/user/profile`, `GET /api/user/audit-log`
- [ ] Build `GET /api/user/export` & `POST /api/user/delete`

### Phase 6: Automated Verification & Testing
- [ ] Author Vitest unit tests in `tests/unit/` testing all `lib/` modules against `docs/RADAR_SPEC.md` golden numbers
- [ ] Run `pnpm test` and ensure 100% test pass rate
- [ ] Run `pnpm typecheck` to verify zero TypeScript compilation errors

---

## 9. Verification & Golden Checkpoints

Every calculation must strictly match the following reference numbers:

1. **Golden Deal 1 (Skincare, Micro 50k-100k, 1 Reel + 2 Stories, ₹25,000 offer, 60d payment, 6m paid ads, 60d exclusivity, 47d brand delay)**:
   - Fair Fee: **₹45,000** (`4,500,000` paise)
   - Benchmark Gap: **₹20,000** (`2,000,000` paise)
   - Usage Surcharge: **₹9,000** (`900,000` paise)
   - Payment Delay Cost: **₹1,054.79** (`105,479` paise)
   - Exclusivity Cost: **₹13,500** (`1,350,000` paise)
   - Brand Delay Penalty: **₹579.45** (`57,945` paise)
   - **Total ₹ at Risk**: **₹44,134.24** (`4,413,424` paise)

2. **Golden Deal 2 (Tech, Nano 10k-50k, 1 YouTube Video, ₹15,000 offer, 90d payment, perpetual usage)**:
   - Fair Fee: **₹20,000** (`2,000,000` paise)
   - Benchmark Gap: **₹5,000** (`500,000` paise)
   - Usage Surcharge: **₹20,000** (`2,000,000` paise)
   - Payment Delay Cost: **₹1,154.79** (`115,479` paise)
   - **Total ₹ at Risk**: **₹26,154.79** (`2,615,479` paise)

