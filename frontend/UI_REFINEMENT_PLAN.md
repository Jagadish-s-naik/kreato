# Kreato Comprehensive UI/UX Refinement & Polish Plan

> **Scope**: Complete frontend polish across all pages (`Dashboard`, `Deal Inbox`, `Deal Pipeline`, `Deal Analysis`, `Money Leak Radar`, `Deal Memos`, `Invoices & Payments`, `Brand Ledger`).
> **Core Mandate**: 
> 1. Preserve the exact Kreato color palette (`#F0F4F7`, `#F5F9FA`, `#EAF2F4`, `#484C4D`, `#000305`, `#DAF4AA`, `#96D7CF`, `#F1B4B9`).
> 2. Fix the **critical warning & status badge issue**: Warning and alert strips must shrink to their content (`inline-flex`, `w-fit`, `max-w-full`) instead of awkwardly stretching across the entire width.
> 3. Eliminate excessive serif typography; unify all body, card, form, and navigation text to clean geometric sans-serif.
> 4. Ensure proportional sidebar (`220-240px`), natural component heights, no artificial glows, and responsive balance across 320px–1920px.

---

## 1. Concrete Audit of Issues by Screen

### Issue 1: Coloured Warning Strips & Status Components (Critical Fix)
- **Problem**: In Deal Analysis (`app/deals/[id]/page.tsx`), the Exclusivity Collision Guard alert was stretching full-width (`w-full`) across the entire screen, wasting space and looking disproportionate.
- **Problem**: In Deal Pipeline (`app/deals/page.tsx`) and Deal Preview (`frontend/components/dashboard/DealPipelinePreview.tsx`), the "Perpetual terms detected" alert had an unnecessarily long background.
- **Solution**:
  - Convert alert strips to `inline-flex w-fit max-w-full items-start gap-2 px-3 py-1.5 rounded-xl`.
  - Convert warning chips in Kanban cards to compact pills: `inline-flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-lg text-[10px] font-semibold`.

### Issue 2: Deal Analysis Layout & Overcrowding (`app/deals/[id]/page.tsx`)
- Left and right columns were imbalanced.
- Radar at-risk box had heavy padding and stretched formulas.
- Action buttons for WhatsApp, Email, and Copy were not aligned cleanly.
- Fix: Standardize 2-column grid (`grid-cols-1 lg:grid-cols-12 gap-5`), clean borders (`#EAF2F4`), compact 3-tier ladder selector, and natural height boxes.

### Issue 3: Invoices & Payment Table (`app/invoices/page.tsx`)
- Table headers and row paddings had excessive gaps.
- Overdue badges and actions need clean alignment and compact spacing without horizontal overflow on tablets/mobile.
- Fix: Streamlined table with responsive mobile card fallback, neat status chips, and cohesive buttons.

### Issue 4: Deal Memos & Public Portal Preview (`app/contracts/page.tsx`)
- Document preview looked like a plain form rather than an authentic signed creator collaboration memo.
- Fix: Clean document styling with subtle paper borders (`#EAF2F4`), verified stamp badge, and crisp typography.

### Issue 5: Brand Ledger (`app/ledger/page.tsx`)
- Cards were uneven and concessions list had loose spacing.
- Fix: Structured 2-column card grid, compact metrics tiles, and neat concession tag list.

### Issue 6: Deal Inbox (`app/inbox/page.tsx`)
- Live PII masking box and Copilot preview were slightly mismatched in vertical height.
- Fix: Cohesive 12-column layout with equalized card balance and clear CTA positioning.

---

## 2. Refinement Implementation Sequence
1. **Fix Critical Warning & Alert Components** across `app/deals/[id]/page.tsx`, `app/deals/page.tsx`, `DealPipelinePreview.tsx`, and `app/inbox/page.tsx`.
2. **Refine Deal Analysis Screen** (`app/deals/[id]/page.tsx`).
3. **Refine Deal Pipeline Kanban Screen** (`app/deals/page.tsx`).
4. **Refine Deal Inbox Screen** (`app/inbox/page.tsx`).
5. **Refine Money Leak Radar Screen** (`app/radar/page.tsx`).
6. **Refine Deal Memos Screen** (`app/contracts/page.tsx`).
7. **Refine Invoices & Payments Screen** (`app/invoices/page.tsx`).
8. **Refine Brand Ledger Screen** (`app/ledger/page.tsx`).
9. **Synchronize all pages into `app/**` and verify build & responsive behavior.**
