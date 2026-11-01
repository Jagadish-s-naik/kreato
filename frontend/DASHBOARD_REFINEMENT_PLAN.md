# Kreato Dashboard Refinement Plan

> **Scope**: EXCLUSIVELY Dashboard page (`app/dashboard/page.tsx`, `frontend/components/dashboard/*`).  
> **Reference**: Image 1 (Realty Hub layout structure: spacious 3-column layout, compact hero card with prominent underline metric accents, balanced pastel KPI summary cards, and clean contextual live activity rail).  
> **Preservation**: Exact approved Kreato palette (`#F0F4F7`, `#F5F9FA`, `#EAF2F4`, `#484C4D`, `#000305`, `#DAF4AA`, `#96D7CF`, `#F1B4B9`). Do not touch other pages or shared sidebars.

---

## 1. Audit of Current Dashboard vs. Reference (Realty Hub)

1. **Overall 3-Column Layout & Activity Stream**:
   - In `app/dashboard/page.tsx`, `showFeed` was disabled or constrained to `2xl:`, leaving huge whitespace on standard 1366–1536px laptop displays.
   - **Fix**: Enable `showFeed={true}` on the Dashboard so the Creator Live Feed forms the natural 3rd column on desktop (`xl:` 1280px+), while elegantly stacking below on tablet/mobile.

2. **Creator Profile Summary (Section 2)**:
   - In the reference image, the hero profile card has a clean layout with:
     - Avatar with status badge
     - Name, platform title/handle, and direct contact/metadata items
     - Top right quick actions (share, edit/manage)
     - Distinct lower KPI metrics row with colored underline indicator bars (Coral, Teal, Lime)
   - **Fix**: Refine `CreatorHeroCard.tsx` to match this layout proportion and hierarchy while using Kreato creator data (Aanya Sharma, `@aanyacreates`, Beauty & Skincare, Total Income Protected ₹3,45,000, 12 Deals Closed, 14 Days Average Paid Terms).

3. **Commercial Health Summary (Section 3)**:
   - Needs exact visual parity with the 3 pastel cards from reference:
     - Card 1: Money Leak Radar (`#F1B4B9` soft coral) with ₹1,25,000 at risk, active leak description, and count pill.
     - Card 2: Active Deal Pipeline (`#96D7CF` muted teal) with ₹2,45,000 in pipeline, status, and count pill.
     - Card 3: Income Recovered (`#DAF4AA` pastel green) with ₹1,20,000 negotiated up, collection health, and 98% badge.
   - Header with period dropdown ("This Month" / "This Quarter") and refresh button.
   - **Fix**: Standardize card height (130px), rounded corners (`rounded-3xl`), internal padding, and hover states.

4. **Recent Deal Pipeline (Section 4)**:
   - Reference image features horizontal object cards with image thumbnails and status pills.
   - In Kreato, this represents the creator's active brand collaboration cards (GlowSkin India, Mamaearth) with brand name, deal amount, stage pill, deliverable tags, and compact warning chips.
   - Header: "Recent Deal Pipeline" + counter `(4)` + "Open Full Kanban →" link.
   - **Fix**: Standardize card heights and 2-column grid layout on desktop, stacking cleanly on mobile.

5. **Creator Live Feed (Section 5)**:
   - Right-hand vertical stream:
     - Feed header with refresh icon.
     - Event 1: Money Leak Alert (GlowSkin India, ₹1,25,000 at risk via perpetual rights, Action: "Run Radar").
     - Event 2: Overdue Payment Alert (Invoice KR/2026-27/011, ₹35,400, Action: "Draft Reminder").
     - Event 3: Terms Accepted / Memo Signed (Plum Goodness, ₹45,000, Action: "Generate Invoice").
   - Action buttons properly routed to their respective workflows.

---

## 2. Component Implementation Details

1. **`app/dashboard/page.tsx`**:
   - Wrap with `<AppShell showFeed={true}>` so the 3-column composition is rendered on desktop.
2. **`frontend/components/dashboard/CreatorHeroCard.tsx`**:
   - Structured hero card with avatar, verified shield, quick actions, contact chips, and 3 metric columns with colored accent bars.
3. **`frontend/components/dashboard/PastelSummaryCards.tsx`**:
   - 3 balanced pastel cards with time filter selector and reload trigger.
4. **`frontend/components/dashboard/DealPipelinePreview.tsx`**:
   - 2-column deal preview with clean tags, payment terms, and compact risk flags.
5. **`app/page.tsx`**:
   - Render the refined `DashboardPage`.

---

## 3. Scope Isolation
- No other pages (`/inbox`, `/deals`, `/radar`, `/invoices`, `/contracts`, `/ledger`) or backend files are modified.

