# Kreato Frontend Master Implementation Plan

> **Scope**: Exclusive to `frontend/**` and the root `app/**` Next.js App Router (only page/layout UI components).  
> **Source of Truth**: `docs/PRD.md`, `docs/FEATURES.md`, `docs/RADAR_SPEC.md`, `docs/AI_PROMPTS.md`.  
> **Visual Reference**: Clean 3-column light SaaS dashboard layout with pastel KPI summaries, floating search pill, dark active navigation, and live activity feed.

---

## Architecture & Directory Structure
```
frontend/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx               # Reusable 3-column container shell
│   │   ├── Sidebar.tsx                # Kreato navigation + floating creator dock
│   │   ├── Topbar.tsx                 # Universal search, shortcuts, simulation clock, integrations
│   │   └── ActivityFeed.tsx           # Right column live creator activity feed
│   ├── dashboard/
│   │   ├── CreatorHeroCard.tsx        # Profile, niche, follower band, earnings & rate metrics
│   │   ├── PastelSummaryCards.tsx     # Money at Risk (coral), Active Deals (teal), Recovered/Earnings (green)
│   │   ├── DealPipelinePreview.tsx    # Live pipeline kanban preview
│   │   └── UrgentAlertsCard.tsx       # Overdue invoices & exclusivity warnings
│   ├── inbox/
│   │   ├── DealIngestionModal.tsx     # Text paste / Screenshot OCR ingestion
│   │   ├── MaskingPreview.tsx         # In-browser PII redaction token preview
│   │   └── RedactionCanvas.tsx        # Client fallback redaction tool
│   ├── deals/
│   │   ├── DealCard.tsx               # Kanban deal card with risk chips
│   │   ├── DealPipelineView.tsx       # Multi-stage Kanban (Incoming, Analyzing, Countered, Agreed)
│   │   ├── DealDetailsEditor.tsx      # Interactive terms editor (deliverables, fee, usage, exclusivity)
│   │   ├── BrandLedgerPanel.tsx       # Historical repeat brand analysis & payment reliability
│   │   └── ExclusivityConflictAlert.tsx # Date & category collision banner
│   ├── copilot/
│   │   ├── MoneyLeakRadarCard.tsx     # Animated ₹ at risk counter with 5-part mathematical breakdown
│   │   ├── WalkAwayLadder.tsx         # 3-tier matrix (Ideal, Acceptable, Walk-away)
│   │   ├── CounterOfferEditor.tsx     # Gemini draft review (English / Hinglish) with WhatsApp/Mail/Copy triggers
│   │   └── DealMemoPreview.tsx        # One-page PDF deal memo summary & public accept link
│   ├── finance/
│   │   ├── InvoiceGenerator.tsx       # GST calculation (CGST/SGST vs IGST) & SAC codes
│   │   ├── UpiQrCodeModal.tsx         # Dynamic UPI QR code modal
│   │   ├── PaymentAgingTracker.tsx    # Aging table with time-travel clock offset controls
│   │   └── OverdueReminderModal.tsx   # Escalating payment follow-up drafter (Friendly, Firm, Final)
│   └── ui/                            # Shared accessible primitives (modals, tabs, badges, tooltips)
├── types/
│   └── kreato.ts                      # Full TypeScript interfaces for Deals, Invoices, Radar, Profiles
├── lib/
│   ├── radarEngine.ts                 # Pure code calculation matching RADAR_SPEC.md exactly
│   ├── ladderEngine.ts                # Deterministic 3-tier walk-away ladder calculation
│   ├── gstEngine.ts                   # 18% GST intra/inter-state split calculation in integer paise
│   └── maskUtils.ts                   # Client-side phone, email, and UPI VPA masking
└── data/
    └── mockKreatoData.ts              # Realistic Indian creator dataset (Mamaearth, Nykaa, Boat, etc.)
```

---

## Phase-by-Phase Roadmap

### Phase 1: Core Engine & Data Foundations
- [x] Task 1.1: Create `frontend/types/kreato.ts` capturing all domain entities (CreatorProfile, Deal, Deliverable, RadarBreakdown, Invoice, BrandLedger).
- [x] Task 1.2: Implement `frontend/lib/radarEngine.ts` following `docs/RADAR_SPEC.md` (Benchmark gap, Usage rights surcharge, Payment delay cost, Exclusivity surcharge, Brand history penalty).
- [x] Task 1.3: Implement `frontend/lib/ladderEngine.ts` (Ideal, Acceptable, Walk-away calculations).
- [x] Task 1.4: Implement `frontend/lib/gstEngine.ts` (SAC 998365, intra-state CGST/SGST 9%+9% vs inter-state IGST 18% in integer paise).
- [x] Task 1.5: Populate `frontend/data/mockKreatoData.ts` with comprehensive creator business data for Indian creators (₹ INR, real brands, deliverable types).

### Phase 2: Application Shell & Navigation
- [x] Task 2.1: Update `frontend/components/layout/Sidebar.tsx` to reflect Kreato branding, full navigation routes (Dashboard, Deal Inbox, Pipeline, Radar, Contracts, Invoices, Settings), and floating creator dock.
- [x] Task 2.2: Update `frontend/components/layout/Topbar.tsx` with search, simulation clock badge (Time-Travel controls: +30 Days, Reset), and creator status.
- [x] Task 2.3: Update `frontend/components/layout/ActivityFeed.tsx` for real-time creator updates (deal inquiries, payment alerts, memo acceptances).
- [x] Task 2.4: Build `frontend/components/layout/AppShell.tsx` responsive layout container.

### Phase 3: Dashboard View
- [x] Task 3.1: Build `frontend/components/dashboard/CreatorHeroCard.tsx` (Creator info, niche, follower band, total earnings, active deals, live rates).
- [x] Task 3.2: Build `frontend/components/dashboard/PastelSummaryCards.tsx` (Money at Risk in Coral, Deals Active in Teal, Revenue Recovered in Lime).
- [x] Task 3.3: Build `frontend/components/dashboard/DealPipelinePreview.tsx` showing active deals in flight.
- [x] Task 3.4: Integrate with `app/dashboard/page.tsx` and `app/page.tsx`.

### Phase 4: Deal Intake & Ingestion (`/inbox`)
- [x] Task 4.1: Build `DealIngestionModal.tsx` supporting:
  - Text paste tab with live client PII masking preview (`[PHONE_1]`, `[EMAIL_1]`, `[UPI_1]`).
  - Screenshot upload tab with OCR processing preview & Redaction Canvas fallback.
- [x] Task 4.2: Build `/inbox` route in `app/inbox/page.tsx`.

### Phase 5: Deal Management & Pipeline (`/deals`)
- [x] Task 5.1: Build `DealPipelineView.tsx` with Kanban columns: `Incoming`, `Analyzing`, `Countered`, `Agreed`.
- [x] Task 5.2: Build `DealDetailsEditor.tsx` allowing interactive editing of deliverables, fee in ₹, usage license window, and exclusivity.
- [x] Task 5.3: Build `BrandLedgerPanel.tsx` showing past deals, average days late, and concessions.
- [x] Task 5.4: Build `ExclusivityConflictAlert.tsx` with calendar overlap warning.
- [x] Task 5.5: Connect to route `app/deals/[id]/page.tsx` and `app/deals/page.tsx`.

### Phase 6: Money Leak Radar & AI Deal Copilot
- [x] Task 6.1: Build `MoneyLeakRadarCard.tsx` with animated "₹ at risk" counter and expandable mathematical formula explanations in `/radar`.
- [x] Task 6.2: Build `WalkAwayLadder.tsx` displaying 3-tier cards (Ideal, Acceptable, Walk-away floor).
- [x] Task 6.3: Build `CounterOfferEditor.tsx` with English/Hinglish negotiation drafting, approval gates, and 1-click WhatsApp (`wa.me`) / Email (`mailto`) action buttons.
- [x] Task 6.4: Build `DealMemoPreview.tsx` with one-page PDF summary and public accept link copy (`/contracts`).

### Phase 7: GST Invoices, UPI & Payment Tracking (`/invoices`)
- [x] Task 7.1: Build `InvoiceGenerator.tsx` with sequential FY invoice number, supplier/brand GSTIN, SAC code, and automated tax calculations.
- [x] Task 7.2: Build `UpiQrCodeModal.tsx` generating instant scannable UPI payment QR.
- [x] Task 7.3: Build `PaymentAgingTracker.tsx` with effective date aging and simulated time-travel clock offset controls (+30 days, reset).
- [x] Task 7.4: Build `OverdueReminderModal.tsx` for escalating reminders (Friendly 1-7 days, Firm 8-21 days, Final 22+ days).
- [x] Task 7.5: Connect to route `app/invoices/page.tsx` and `app/ledger/page.tsx`.

### Phase 8: Verification & Polish
- [x] Task 8.1: Run verification check on all frontend components and routes.
- [x] Task 8.2: Verify responsive layouts (desktop 3-column down to mobile single-column drawer).
- [x] Task 8.3: Validate that no backend, database, Supabase, or test files were modified.
