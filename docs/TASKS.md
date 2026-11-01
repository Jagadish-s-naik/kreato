# Master Task Checklist — DealShield

This checklist tracks the end-to-end development, verification, and deployment tasks for DealShield.

---

## Phase 0: Documentation & Database Specifications
- [x] Create `/docs` directory and verify persistence
- [x] Author `docs/PRD.md` (Product requirements, user persona, scope, non-goals)
- [x] Author `docs/FEATURES.md` (Comprehensive specs for all 11 features)
- [x] Author `docs/ARCHITECTURE.md` (Directory boundaries, data flows, LLM wrapper, reliability)
- [x] Author `supabase/migrations/001_init.sql` (Full Postgres schema, enums, RLS policies, indexes)
- [x] Author `docs/DATABASE.md` (Data dictionary, entity relationships, RLS matrix)
- [x] Author `docs/AI_PROMPTS.md` (Gemini system prompts, JSON schemas, injection delimiters)
- [x] Author `docs/SECURITY.md` (Threat model, PII masking design, token security, audit trail)
- [x] Author `docs/RADAR_SPEC.md` (Formulas, constants, worked golden examples in integer paise)
- [x] Author `docs/TEST_PLAN.md` (Unit test catalog, Playwright e2e golden flow, manual QA)
- [x] Author `docs/DEMO_SCRIPT.md` (90-second demo script with Hinglish sample DM and expected figures)
- [x] Author `docs/TASKS.md` (This master implementation checklist)
- [x] Author `docs/KNOWN_LIMITS.md` (Transparent documentation of boundaries and simulations)

---

## Phase 1: Tooling & Project Scaffolding
- [x] Initialize Next.js 14 App Router with TypeScript strict mode
- [x] Install dependencies (`@google/genai`, `@supabase/ssr`, `@supabase/supabase-js`, `zod`, `@react-pdf/renderer`, `qrcode`, `tesseract.js`, `framer-motion`, `lucide-react`)
- [x] Configure Tailwind CSS, PostCSS, and shadcn styling tokens in `frontend/styles/globals.css`
- [x] Configure path aliases in `tsconfig.json` (`@/frontend/*`, `@/backend/*`, `@/lib/*`)
- [x] Configure Next.js security headers in `next.config.js`
- [x] Configure Vitest test runner in `vitest.config.ts`
- [x] Configure Playwright in `playwright.config.ts`
- [x] Setup `.env.example` and `.eslintrc.json`
- [x] Create modular folder architecture (`frontend/`, `backend/`, `lib/`, `docs/`, `supabase/`, `tests/`)
- [x] Commit and push clean project setup to GitHub repository (`origin/main`)

---

## Phase 2: Core Pure Logic Modules & Unit Tests (`/lib`)
- [ ] Implement `lib/currency.ts` (paise to INR formatting en-IN, Indian number parser: 30k, 30,000, ₹30000/-)
- [ ] Implement `lib/dates.ts` (IST calendar calculations, Indian financial year logic)
- [ ] Implement `lib/clock.ts` (effective clock with `sim_days_offset`)
- [ ] Implement `lib/mask.ts` (regex tokenization for Indian phone numbers, emails, UPI VPAs, PAN, GSTIN)
- [ ] Implement `lib/config/radar.ts` & `lib/radar.ts` (benchmark gap, usage %, delay financing, exclusivity, brand delay)
- [ ] Implement `lib/ladder.ts` (Ideal, Acceptable, Walk-away tier computation & floor checks)
- [ ] Implement `lib/scam.ts` (pay-to-collab, Levenshtein domain lookalikes, injection patterns)
- [ ] Implement `lib/exclusivity.ts` (active date range and category collision engine)
- [ ] Implement `lib/gst.ts` (intra-state CGST/SGST vs inter-state IGST, sequential FY invoice numbering)
- [ ] Implement `lib/upi.ts` (`upi://pay` URI builder and QR code generator)
- [ ] Run Vitest suite verifying 100% of pure logic tests against `RADAR_SPEC.md` golden numbers

---

## Phase 3: Supabase Integration & RLS Security Layer
- [ ] Implement `backend/supabase/server.ts` (authenticated SSR client)
- [ ] Implement `backend/supabase/service.ts` (service-role client for public memo token lookup)
- [ ] Implement `backend/supabase/client.ts` (browser client)
- [ ] Create `supabase/seed.sql` with full matrix of simulated benchmark rates
- [ ] Write and run Vitest RLS isolation test verifying cross-user security boundary

---

## Phase 4: Gemini LLM Integration Layer
- [ ] Implement `backend/services/rate-limit.service.ts` (sliding window 20 req / 10 min)
- [ ] Implement `backend/services/audit.service.ts` (append-only audit logger)
- [ ] Implement `backend/services/llm.service.ts` (`@google/genai`, backoff retry, untrusted `<message>` wrapper)
- [ ] Implement `app/api/copilot/extract/route.ts` (structured deal extraction with Zod validation)
- [ ] Implement `app/api/ladder/draft/route.ts` (counter-offer drafting with strict number verification)
- [ ] Implement `app/api/reminder/draft/route.ts` (escalating payment reminder drafting)

---

## Phase 5: Deal Inbox & Deal Copilot Screens
- [ ] Build `frontend/components/inbox/TextPasteInput.tsx` with live PII masking preview
- [ ] Build `frontend/components/inbox/ScreenshotUploader.tsx` with client-side canvas downscaling
- [ ] Integrate in-browser Tesseract.js (eng+hin) Web Worker
- [ ] Build `frontend/components/inbox/CanvasRedactor.tsx` (manual black-out box drawing tool)
- [ ] Build `/inbox` page with smooth state transitions
- [ ] Build `/deals/[id]` Deal Copilot view with live editable Deal Card
- [ ] Build quote highlighting & interactive warning chips for risky terms
- [ ] Render red Scam Banner when `lib/scam.ts` flags risk

---

## Phase 6: Brand Ledger, Money Leak Radar & Walk-away Ladder
- [ ] Build `frontend/components/copilot/BrandLedgerPanel.tsx` (past deals, average days late, concessions)
- [ ] Add "Load Demo History" button on dashboard/deals view
- [ ] Build `frontend/components/radar/MoneyLeakRadar.tsx` with Framer Motion animated counter
- [ ] Implement tap-to-expand line item breakdown showing exact formulas and inputs
- [ ] Build `frontend/components/ladder/WalkAwayLadder.tsx` with 3 interactive tier cards
- [ ] Implement English / Hinglish toggle and draft generation
- [ ] Implement "Approve" workflow with Copy, Open WhatsApp (`wa.me`), and Open Email (`mailto:`) triggers
- [ ] Render dynamic "₹ Recovered" badge upon counter approval

---

## Phase 7: Deal Memo & Public Brand Acceptance Portal
- [ ] Build `frontend/components/memo/DealMemoPDF.tsx` using `@react-pdf/renderer`
- [ ] Implement secure 32-byte acceptance token generator & SHA-256 storage
- [ ] Build `/memo/[token]` public route handler (service-role lookup, expiry check, IP rate-limiting)
- [ ] Build public brand sign-off portal with "I Agree" signatory form
- [ ] Add fallback "Mark as Accepted" button on creator deal view

---

## Phase 8: GST Invoicing, UPI & Overdue Reminders
- [ ] Build `frontend/components/invoice/InvoicePDF.tsx` with `@react-pdf/renderer`
- [ ] Integrate dynamic QR code generation from `upi://pay` URI
- [ ] Implement sequential FY invoice number generator (`DS/YYYY-YY/NNN`)
- [ ] Implement time-travel demo controls ("Advance 30 Days", "Reset Clock")
- [ ] Build overdue invoice tracking & reminder draft trigger
- [ ] Implement "Mark as Paid" modal writing settlement speed to `payments` table

---

## Phase 9: Settings, Auth & Compliance
- [ ] Build `/login` and `/signup` screens with Supabase Auth
- [ ] Build `/onboarding` wizard for creator profile setup
- [ ] Build `/settings` page: profile editor, clock controls, audit log table
- [ ] Implement "Export All My Data" (JSON download)
- [ ] Implement "Delete All My Data" (typed confirmation purge)

---

## Phase 10: End-to-End Verification, QA & Polish
- [ ] Run full Vitest unit test suite (100% pass)
- [ ] Run Playwright e2e golden-flow test
- [ ] Run TypeScript strict typecheck (`pnpm typecheck`) and linter (`pnpm lint`)
- [ ] Update `docs/DEMO_SCRIPT.md` with live generated numbers
- [ ] Update `docs/KNOWN_LIMITS.md`

